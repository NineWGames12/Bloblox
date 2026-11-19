// Сервер Bloblox: отдаёт всю платформу (Block City, паркур, «Кто из них?») и пересылает сообщения
// между игроками одной комнаты. Работает и на Render.com, и дома («Играть вместе.bat»).
// Сам он игру не считает: в «Кто из них?» первый вошедший — ведущий, его браузер ведёт оленей и таймеры.
// Запуск: node server.js   (порт берётся из переменной PORT, Render задаёт её сам)
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const os = require("os");

const PORT = Number(process.env.PORT) || 8765;
const GAMES = { city: 10, hide: 10 }; // игра → сколько человек в комнате (паркур живёт в комнате города)
const MAX_ROOMS = 80;
const MAX_MESSAGE = 32 * 1024;
const MAX_PER_SECOND = 60; // защита от зависшего клиента, который засыпает сообщениями
const ROOM_KEEP_MS = 120000; // пустая комната ждёт, пока планшет переподключится или друг вернётся из другой игры

// Наружу видны только эти файлы — никакие папки с бэкапами
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "application/javascript; charset=utf-8", ".css": "text/css; charset=utf-8" };
const PUBLIC_FILES = {
  "/": "index.html",
  "/index.html": "index.html",
  "/game.js": "game.js",
  "/styles.css": "styles.css",
  "/vendor/three.min.js": "vendor/three.min.js",
  "/vendor/GLTFLoader.js": "vendor/GLTFLoader.js",
  "/vendor/SkeletonUtils.js": "vendor/SkeletonUtils.js",
  "/shared/avatar.js": "shared/avatar.js",
  "/hidegame.html": "hidegame.html",
  "/hide/hide.css": "hide/hide.css",
  "/hide/world.js": "hide/world.js",
  "/hide/deer.js": "hide/deer.js",
  "/hide/people.js": "hide/people.js",
  "/hide/lobby.js": "hide/lobby.js",
  "/hide/net.js": "hide/net.js",
  "/hide/game.js": "hide/game.js"
};

const rooms = new Map(); // "игра:код" → { game, code, clients: Map(id → client), host, emptySince }
let nextId = 1;

const server = http.createServer((req, res) => {
  const url = req.url.split("?")[0];
  if (url === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("ok");
    return;
  }
  const file = PUBLIC_FILES[url];
  if (!file || req.method !== "GET") {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  fs.readFile(path.join(__dirname, file), (error, data) => {
    if (error) {
      res.writeHead(500);
      res.end("Error");
      return;
    }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-cache" });
    res.end(data);
  });
});

server.on("upgrade", (req, socket) => {
  const key = req.headers["sec-websocket-key"];
  if (req.url.split("?")[0] !== "/ws" || !key) {
    socket.destroy();
    return;
  }
  const accept = crypto.createHash("sha1").update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`).digest("base64");
  socket.write(`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${accept}\r\n\r\n`);
  socket.setNoDelay(true);
  const client = { id: nextId++, socket, buffer: Buffer.alloc(0), room: null, seat: null, name: "", look: null, alive: true, count: 0, second: 0 };
  socket.on("data", (chunk) => readFrames(client, chunk));
  socket.on("close", () => leaveRoom(client));
  socket.on("error", () => socket.destroy());
});

function sendFrame(socket, opcode, payload) {
  if (socket.destroyed) return;
  const n = payload.length;
  let header;
  if (n < 126) header = Buffer.from([0x80 | opcode, n]);
  else if (n < 65536) {
    header = Buffer.alloc(4);
    header[0] = 0x80 | opcode;
    header[1] = 126;
    header.writeUInt16BE(n, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x80 | opcode;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(n), 2);
  }
  socket.write(Buffer.concat([header, payload]));
}
const sendText = (client, text) => sendFrame(client.socket, 1, Buffer.from(text));
const send = (client, message) => sendText(client, JSON.stringify(message));

function readFrames(client, chunk) {
  client.buffer = Buffer.concat([client.buffer, chunk]);
  while (client.buffer.length >= 2) {
    const data = client.buffer;
    const opcode = data[0] & 15;
    let length = data[1] & 127;
    let offset = 2;
    if (!(data[1] & 128) || length === 127) {
      client.socket.destroy(); // кадр без маски или слишком большой
      return;
    }
    if (length === 126) {
      if (data.length < 4) return;
      length = data.readUInt16BE(2);
      offset = 4;
    }
    if (length > MAX_MESSAGE) {
      client.socket.destroy();
      return;
    }
    if (data.length < offset + 4 + length) return;
    const mask = data.subarray(offset, offset + 4);
    const payload = Buffer.from(data.subarray(offset + 4, offset + 4 + length));
    for (let i = 0; i < payload.length; i += 1) payload[i] ^= mask[i & 3];
    client.buffer = data.subarray(offset + 4 + length);
    client.alive = true;
    if (opcode === 8) {
      client.socket.end();
      return;
    }
    if (opcode === 9) sendFrame(client.socket, 10, payload);
    if (opcode === 1) handleMessage(client, payload.toString("utf8"));
  }
}

function handleMessage(client, text) {
  const now = Math.floor(Date.now() / 1000);
  if (now !== client.second) {
    client.second = now;
    client.count = 0;
  }
  client.count += 1;
  if (client.count > MAX_PER_SECOND) return;
  let msg;
  try {
    msg = JSON.parse(text);
  } catch (error) {
    return;
  }
  if (!msg || typeof msg !== "object") return;
  const room = client.room && rooms.get(client.room);
  if (msg.t === "s" && room) {
    // всем остальным в комнате
    const packet = JSON.stringify({ t: "s", id: client.id, d: msg.d });
    room.clients.forEach((other) => { if (other !== client) sendText(other, packet); });
  } else if (msg.t === "to" && room) {
    // одному игроку
    const other = room.clients.get(msg.to);
    if (other) send(other, { t: "s", id: client.id, d: msg.d });
  } else if (msg.t === "join" && !client.room) {
    joinRoom(client, msg);
  }
}

function makeCode(game) {
  for (let i = 0; i < 300; i += 1) {
    const code = String(1000 + crypto.randomInt(9000));
    if (!rooms.has(`${game}:${code}`)) return code;
  }
  return null;
}

function cleanRooms() {
  const now = Date.now();
  rooms.forEach((room, key) => {
    if (!room.clients.size && now - room.emptySince > ROOM_KEEP_MS) rooms.delete(key);
  });
}

function joinRoom(client, msg) {
  const game = Object.prototype.hasOwnProperty.call(GAMES, msg.game) ? msg.game : "city";
  const max = GAMES[game];
  let code = typeof msg.room === "string" ? msg.room.trim() : "";
  if (rooms.size >= MAX_ROOMS) cleanRooms();
  if (msg.create) {
    code = makeCode(game);
    if (!code || rooms.size >= MAX_ROOMS) return send(client, { t: "error", code: "busy" });
  }
  const key = `${game}:${code}`;
  let room = rooms.get(key);
  // auto: комната с этим кодом появится сама (друзья пришли из другой игры платформы или сервер перезапустился)
  if (!room && (msg.create || (msg.auto && /^\d{4}$/.test(code)))) {
    if (rooms.size >= MAX_ROOMS) return send(client, { t: "error", code: "busy" });
    room = { game, code, clients: new Map(), host: client.id, emptySince: 0 };
    rooms.set(key, room);
  }
  if (!room) return send(client, { t: "error", code: "noroom" });
  if (room.clients.size >= max) return send(client, { t: "error", code: "full" });

  // место в комнате (в городе первые три места — со своей летающей машиной)
  const taken = new Set(Array.from(room.clients.values(), (o) => o.seat));
  let seat = Number.isInteger(msg.seat) && msg.seat >= 0 && msg.seat < max && !taken.has(msg.seat) ? msg.seat : -1;
  for (let i = 0; seat < 0 && i < max; i += 1) if (!taken.has(i)) seat = i;

  client.room = key;
  client.seat = seat;
  client.name = String(msg.name || "Игрок").replace(/[<>&"]/g, "").slice(0, 18) || "Игрок";
  client.look = msg.look && typeof msg.look === "object" && JSON.stringify(msg.look).length < 1500 ? msg.look : null;
  if (!room.clients.size) room.host = client.id;
  const peers = Array.from(room.clients.values(), (o) => ({ id: o.id, seat: o.seat, name: o.name, look: o.look }));
  room.clients.set(client.id, client);
  room.emptySince = 0;
  send(client, { t: "joined", game, room: code, id: client.id, seat, host: room.host, max, peers });
  room.clients.forEach((o) => { if (o !== client) send(o, { t: "peer", id: client.id, seat, name: client.name, look: client.look }); });
  console.log(`${key}: вошёл ${client.name} (${room.clients.size}/${max})`);
}

function leaveRoom(client) {
  const room = client.room && rooms.get(client.room);
  if (!room) return;
  room.clients.delete(client.id);
  console.log(`${client.room}: вышел ${client.name} (${room.clients.size})`);
  if (!room.clients.size) room.emptySince = Date.now();
  else {
    room.clients.forEach((o) => send(o, { t: "left", id: client.id }));
    if (room.host === client.id) {
      // ведущий ушёл — ведущим становится тот, кто дольше всех в комнате
      room.host = Math.min(...room.clients.keys());
      room.clients.forEach((o) => send(o, { t: "host", id: room.host }));
    }
  }
  client.room = null;
}

// раз в 20 секунд проверяем связь: зависшие соединения закрываем, старые пустые комнаты убираем
setInterval(() => {
  cleanRooms();
  rooms.forEach((room) => {
    room.clients.forEach((c) => {
      if (!c.alive) {
        c.socket.destroy();
        return;
      }
      c.alive = false;
      sendFrame(c.socket, 9, Buffer.alloc(0));
    });
  });
}, 20000);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Bloblox запущен: http://localhost:${PORT}`);
  if (process.env.RENDER) return;
  Object.values(os.networkInterfaces()).flat().forEach((a) => {
    if (a && a.family === "IPv4" && !a.internal) console.log(`Для планшета и второго компьютера (тот же Wi-Fi): http://${a.address}:${PORT}`);
  });
});
