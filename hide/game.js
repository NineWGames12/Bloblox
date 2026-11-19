// «Кто из них?» — лобби с голосованием, раунды, боты, магазин, управление, камера, звуки и интерфейс.
(function () {
  "use strict";
  const P = window.HidePeople;
  const $ = (id) => document.getElementById(id);
  const isTouch = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
  document.body.classList.toggle("touch", isTouch);

  // ---------- Отрисовка ----------
  const canvas = $("view");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isTouch, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isTouch ? 1.25 : 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1400);
  scene.add(camera);
  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  // ---------- Карты, лобби и правила ----------
  const MAPS = [
    { id: "summer", name: "Лесная поляна", season: "summer", rot: 0, mirror: false, seed: 1 },
    { id: "autumn", name: "Осенний лес", season: "autumn", rot: 2.1, mirror: true, seed: 2 },
    { id: "winter", name: "Зимний лес", season: "winter", rot: -1.9, mirror: false, seed: 3 },
    { id: "sunset", name: "Закат у озера", season: "sunset", rot: 3.6, mirror: true, seed: 4 }
  ];
  const LOBBY_TIME = 15;
  const PREP = 15;
  const HUNT = 180;
  const RESULTS = 7;
  const MAX_MISSES = 5;
  const DIFF = { tell: 14, threshold: 3.4 };

  const lobby = window.HideLobby.build(scene, MAPS);
  let world = null;
  let herdSys = null;

  const game = {
    phase: "lobby", timer: LOBBY_TIME, roleNow: "lobby", misses: 0, hiders: [], player: null, hunter: null, bot: null,
    spectate: false, people: [], knownInnocent: new Set(), map: null, started: false
  };
  window.HideGame = game;
  game.scene = scene;

  // ---------- Сеть ----------
  // Без сервера игра идёт с ботами. В комнате первый вошедший — «хозяин»: его браузер ведёт таймеры,
  // оленей, ботов и решает, попал ли выстрел. Остальные присылают своё положение и показывают присланное.
  let net = null;
  const online = () => !!(net && net.open);
  const isHost = () => !online() || net.isHost();
  const r2 = (v) => Math.round(v * 100);
  let sendTimer = 0;

  // ---------- Монеты и магазин ----------
  const SHOP = [
    { id: "gun-gold", cat: "gun", icon: "🔫", name: "Золотой пистолет", desc: "блестит в руках у охотника", price: 150, color: 0xffd23f },
    { id: "gun-neon", cat: "gun", icon: "🔫", name: "Неоновый пистолет", desc: "светло-голубой, как лёд", price: 200, color: 0x5ae0ff },
    { id: "gun-wood", cat: "gun", icon: "🔫", name: "Деревянный пистолет", desc: "как настоящий у лесника", price: 100, color: 0xb07a4a },
    { id: "fx-confetti", cat: "fx", icon: "🎉", name: "Конфетти при поимке", desc: "разноцветный взрыв вместо облачка", price: 120, colors: [0xff5a4a, 0xffd23f, 0x5aa0ff, 0x7ae582, 0xb784f0] },
    { id: "fx-hearts", cat: "fx", icon: "💖", name: "Сердечки при поимке", desc: "розовое облачко", price: 120, colors: [0xff7ab8, 0xff4a7a, 0xffc0d8] },
    { id: "hat-cap", cat: "hat", icon: "🧢", name: "Кепка охотника", desc: "оранжевая, видно издалека", price: 0 },
    { id: "hat-cowboy", cat: "hat", icon: "🤠", name: "Ковбойская шляпа", desc: "для настоящих следопытов", price: 80 },
    { id: "hat-crown", cat: "hat", icon: "👑", name: "Корона", desc: "для короля леса", price: 300 }
  ];
  const store = (() => {
    let data = { owned: ["hat-cap"], equip: { gun: null, fx: null, hat: "hat-cap" } };
    try { data = Object.assign(data, JSON.parse(window.localStorage.getItem("blobloxHideShop") || "{}")); } catch (error) { /* по умолчанию */ }
    return data;
  })();
  const saveStore = () => { try { window.localStorage.setItem("blobloxHideShop", JSON.stringify(store)); } catch (error) { /* нет места */ } };
  function coins(delta = 0) {
    try {
      const s = JSON.parse(window.localStorage.getItem("blobloxAvatarSettings") || "{}");
      s.coins = (typeof s.coins === "number" ? s.coins : 0) + delta;
      if (delta) window.localStorage.setItem("blobloxAvatarSettings", JSON.stringify(s));
      $("coinsChip").textContent = `🪙 ${s.coins}`;
      return s.coins;
    } catch (error) {
      return 0;
    }
  }
  coins(0);
  const equipped = (cat) => SHOP.find((it) => it.id === store.equip[cat]) || null;

  // ---------- Звук: всё синтезируется, файлов не нужно ----------
  const audio = (() => {
    let ctx = null;
    let master = null;
    let noise = null;
    let streamGain = null;
    let birdTimer = 0;
    const start = () => {
      if (ctx) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.8;
      master.connect(ctx.destination);
      const len = ctx.sampleRate * 2;
      noise = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = noise.getChannelData(0);
      for (let i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1;
      const loop = (freq, type, gainValue) => {
        const src = ctx.createBufferSource();
        src.buffer = noise;
        src.loop = true;
        const f = ctx.createBiquadFilter();
        f.type = type;
        f.frequency.value = freq;
        const g = ctx.createGain();
        g.gain.value = gainValue;
        src.connect(f).connect(g).connect(master);
        src.start();
        return g;
      };
      loop(420, "lowpass", 0.05);
      streamGain = loop(1400, "bandpass", 0);
    };
    const tone = (freq, dur, type = "sine", vol = 0.2, slide = 0, delay = 0) => {
      if (!ctx) return;
      const t = ctx.currentTime + delay;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, t);
      if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur);
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g).connect(master);
      o.start(t);
      o.stop(t + dur + 0.02);
    };
    const burst = (dur, freq, vol, type = "lowpass") => {
      if (!ctx) return;
      const t = ctx.currentTime;
      const src = ctx.createBufferSource();
      src.buffer = noise;
      const f = ctx.createBiquadFilter();
      f.type = type;
      f.frequency.setValueAtTime(freq, t);
      f.frequency.exponentialRampToValueAtTime(Math.max(60, freq * 0.2), t + dur);
      const g = ctx.createGain();
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      src.connect(f).connect(g).connect(master);
      src.start(t, Math.random());
      src.stop(t + dur + 0.05);
    };
    return {
      start,
      update(dt, listener) {
        if (!ctx) return;
        if (streamGain) {
          let d = 99;
          if (world && game.phase !== "lobby") {
            d = Math.min(world.distToStream(listener.x, listener.z), Math.max(0, Math.hypot(listener.x - world.LAKE.x, listener.z - world.LAKE.z) - world.LAKE.r) + 8);
            if (world.season.ice) d = 99;
          }
          streamGain.gain.value = 0.09 * Math.max(0, 1 - d / 30);
        }
        birdTimer -= dt;
        if (birdTimer <= 0) {
          birdTimer = 0.8 + Math.random() * 3;
          if (world && world.season.snow && game.phase !== "lobby") return;
          const base = 2200 + Math.random() * 1800;
          const n = 1 + Math.floor(Math.random() * 4);
          for (let i = 0; i < n; i += 1) tone(base + Math.random() * 400, 0.09, "sine", 0.03, (Math.random() - 0.3) * 900, i * 0.12);
        }
      },
      step(soft) { burst(0.07, soft ? 2600 : 900, soft ? 0.05 : 0.035, soft ? "bandpass" : "lowpass"); },
      shot() { burst(0.35, 5000, 0.5); tone(90, 0.3, "sine", 0.5, -50); setTimeout(() => burst(0.4, 1800, 0.12), 230); },
      caught() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, "triangle", 0.2, 0, i * 0.11)); },
      miss() { tone(320, 0.25, "square", 0.08, -160); burst(0.18, 700, 0.12); },
      tick() { tone(880, 0.06, "square", 0.05); },
      go() { tone(660, 0.12, "square", 0.08); tone(990, 0.25, "square", 0.08, 0, 0.12); },
      click() { tone(660, 0.05, "triangle", 0.08); },
      coin() { tone(988, 0.08, "square", 0.06); tone(1319, 0.2, "square", 0.06, 0, 0.08); },
      win() { [392, 523, 659, 784, 1047].forEach((f, i) => tone(f, 0.3, "triangle", 0.18, 0, i * 0.13)); },
      lose() { [392, 330, 262].forEach((f, i) => tone(f, 0.35, "triangle", 0.16, 0, i * 0.2)); }
    };
  })();

  // ---------- Ввод ----------
  const keys = {};
  const input = { yaw: Math.PI, pitch: -0.22, joyX: 0, joyY: 0, run: false, zoom: false, fire: false, dragging: false };
  game.input = input;
  let paused = false;
  let lockFailed = false;
  function lockMouse() {
    if (isTouch || !canvas.requestPointerLock) return;
    try {
      const p = canvas.requestPointerLock();
      if (p && p.catch) p.catch(() => { lockFailed = true; });
    } catch (error) {
      lockFailed = true;
    }
  }
  const playing = () => game.started && !paused && !$("shopPanel").classList.contains("show");
  window.addEventListener("keydown", (e) => {
    keys[e.code] = true;
    if (!game.started) return;
    if (e.code === "Space") { doAction("jump"); e.preventDefault(); }
    if (e.code === "KeyE") doAction("graze");
    if (e.code === "KeyQ") doAction("look");
    if (e.code === "KeyC") doAction("lie");
    if (e.code === "KeyR") doAction("shake");
    if (e.code === "KeyF" && game.phase === "lobby" && nearVendor()) toggleShop();
    if (e.code === "Escape") {
      if ($("shopPanel").classList.contains("show")) toggleShop(false);
      else if (!document.pointerLockElement) togglePause();
    }
  });
  window.addEventListener("keyup", (e) => { keys[e.code] = false; });
  const look = (dx, dy, k = 0.0024) => {
    const zoomK = game.roleNow === "hunter" && input.zoom ? 0.35 : 1;
    input.yaw -= dx * k * zoomK;
    input.pitch = Math.max(-1.35, Math.min(game.roleNow === "hunter" ? 1.35 : 0.45, input.pitch - dy * k * zoomK));
  };
  canvas.addEventListener("mousedown", (e) => {
    if (isTouch || !playing()) return;
    if (!document.pointerLockElement) lockMouse();
    input.dragging = true;
    if (e.button === 0 && (document.pointerLockElement || lockFailed) && game.roleNow === "hunter") input.fire = true;
    if (e.button === 2 && game.roleNow === "hunter") input.zoom = true;
  });
  window.addEventListener("mouseup", (e) => {
    input.dragging = false;
    if (e.button === 2) input.zoom = false;
  });
  canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  window.addEventListener("mousemove", (e) => {
    if (isTouch || !playing()) return;
    if (document.pointerLockElement || input.dragging) look(e.movementX, e.movementY);
  });
  document.addEventListener("pointerlockchange", () => {
    if (!document.pointerLockElement && game.started && !$("shopPanel").classList.contains("show") && game.phase !== "results") togglePause(true);
  });

  // сенсорное управление: джойстик слева, обзор справа, несколько кнопок
  const joy = { id: null, x: 0, y: 0 };
  const lookTouch = { id: null, x: 0, y: 0 };
  const joyEl = $("joy");
  const knob = $("knob");
  window.addEventListener("touchstart", (e) => {
    if (!playing()) return;
    for (const t of e.changedTouches) {
      if (t.target.closest && t.target.closest("button, a")) continue;
      if (t.clientX < window.innerWidth * 0.42 && joy.id === null) {
        joy.id = t.identifier;
        joy.x = t.clientX;
        joy.y = t.clientY;
        joyEl.style.left = `${t.clientX - 60}px`;
        joyEl.style.top = `${t.clientY - 60}px`;
        joyEl.classList.add("on");
      } else if (lookTouch.id === null) {
        lookTouch.id = t.identifier;
        lookTouch.x = t.clientX;
        lookTouch.y = t.clientY;
      }
    }
  }, { passive: true });
  window.addEventListener("touchmove", (e) => {
    for (const t of e.changedTouches) {
      if (t.identifier === joy.id) {
        let dx = t.clientX - joy.x;
        let dy = t.clientY - joy.y;
        const len = Math.hypot(dx, dy);
        if (len > 50) { dx *= 50 / len; dy *= 50 / len; }
        knob.style.transform = `translate(${dx}px, ${dy}px)`;
        input.joyX = dx / 50;
        input.joyY = dy / 50;
      } else if (t.identifier === lookTouch.id) {
        look(t.clientX - lookTouch.x, t.clientY - lookTouch.y, 0.005);
        lookTouch.x = t.clientX;
        lookTouch.y = t.clientY;
      }
    }
  }, { passive: true });
  window.addEventListener("touchend", (e) => {
    for (const t of e.changedTouches) {
      if (t.identifier === joy.id) {
        joy.id = null;
        input.joyX = 0;
        input.joyY = 0;
        knob.style.transform = "";
        joyEl.classList.remove("on");
      }
      if (t.identifier === lookTouch.id) lookTouch.id = null;
    }
  });
  function bindTap(id, fn) {
    const b = $(id);
    b.addEventListener("touchstart", (e) => { e.preventDefault(); fn(); }, { passive: false });
    b.addEventListener("click", () => { if (!isTouch) fn(); });
  }
  bindTap("btnFire", () => { input.fire = true; });
  bindTap("btnZoom", () => { input.zoom = !input.zoom; $("btnZoom").classList.toggle("active", input.zoom); });
  bindTap("btnRun", () => { input.run = !input.run; $("btnRun").classList.toggle("active", input.run); });
  bindTap("btnGraze", () => doAction("graze"));
  bindTap("btnLook", () => doAction("look"));
  bindTap("btnLie", () => doAction("lie"));
  bindTap("btnJump", () => doAction("jump"));
  bindTap("btnJumpLobby", () => doAction("jump"));
  bindTap("btnShop", () => toggleShop(true));

  // ---------- Интерфейс ----------
  let toastTimer = 0;
  let hintTimer = 0;
  let roleTimer = 0;
  function toast(text, kind = "") {
    const el = $("toast");
    el.textContent = text;
    el.className = `toast show ${kind}`;
    toastTimer = 2.2;
  }
  function banner(text) {
    $("banner").textContent = text;
    $("banner").classList.toggle("show", !!text);
  }
  function setRoleClass(role) {
    ["lobby", "deer", "hunter"].forEach((r) => document.body.classList.toggle(`role-${r}`, r === role));
  }
  function setHud() {
    const t = Math.max(0, Math.ceil(game.timer));
    const el = $("bigTimer");
    // в лобби и на подготовке — просто цифры, во время охоты — минуты:секунды
    el.textContent = game.phase === "hunt" ? `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}` : String(t);
    el.classList.toggle("low", (game.phase === "hunt" && t <= 20) || (game.phase !== "hunt" && t <= 5));
    el.classList.toggle("show", game.phase !== "loading" && game.phase !== "results" && !game.waiting);
    const inRound = game.phase === "prep" || game.phase === "hunt";
    $("roundInfo").classList.toggle("show", inRound);
    if (inRound) {
      $("misses").innerHTML = Array.from({ length: MAX_MISSES }, (_, i) => `<i class="${i < game.misses ? "x" : ""}"></i>`).join("");
      $("hidersLeft").textContent = `🦌 ${game.hiders.filter((d) => !d.caught).length}`;
    }
  }
  function togglePause(force) {
    if (!game.started) return;
    paused = force === undefined ? !paused : force;
    $("pauseMenu").classList.toggle("show", paused);
    if (!paused) lockMouse();
  }
  $("resumeBtn").addEventListener("click", () => togglePause(false));
  $("pauseBtn").addEventListener("click", () => togglePause(true));
  function startGame() {
    audio.start();
    audio.click();
    game.started = true;
    $("startOverlay").classList.add("hide");
    setTimeout(() => { $("startOverlay").style.display = "none"; }, 450);
    lockMouse();
    $("hint").classList.add("show");
    hintTimer = 9;
  }
  // имя: из настроек аватара Bloblox или введённое здесь
  const savedName = (() => { try { return window.localStorage.getItem("blobloxHideName") || ""; } catch (error) { return ""; } })();
  $("nameInput").value = savedName || (P.readPlayerLook().name !== "Ты" ? P.readPlayerLook().name : "");
  function takeName() {
    const name = $("nameInput").value.replace(/[<>&"]/g, "").trim().slice(0, 14) || "Игрок";
    try { window.localStorage.setItem("blobloxHideName", name); } catch (error) { /* не важно */ }
    setMyName(name);
  }
  $("startBtn").addEventListener("click", () => {
    takeName();
    startGame();
  });
  // игра по сети: создать комнату или войти по коду (или по ссылке ?room=1234)
  const urlRoom = (location.search.match(/room=(\d{4})/) || [])[1] || "";
  if (!window.HideNet.available) $("onlineBox").style.display = "none";
  if (urlRoom) {
    $("codeInput").value = urlRoom;
    $("startOverlay").classList.add("invited");
  }
  const NET_ERRORS = {
    noroom: "Нет такой комнаты — проверь код",
    full: "Комната заполнена (там уже 10 игроков)",
    busy: "Сервер занят, попробуй через минуту",
    noserver: "Сервер не отвечает. Если игра открыта с компьютера без сервера — можно играть одному",
    timeout: "Сервер долго не отвечает, попробуй ещё раз"
  };
  function netStatus(text, bad) {
    $("netStatus").textContent = text;
    $("netStatus").classList.toggle("bad", !!bad);
  }
  function goOnline(opts) {
    if (net) return;
    takeName();
    audio.start();
    document.querySelectorAll("#startOverlay button").forEach((b) => { b.disabled = true; });
    netStatus("Подключаемся… бесплатный сервер иногда просыпается до минуты");
    net = window.HideNet.connect(Object.assign({
      name: me.name,
      look: Object.assign({}, myLook, { name: undefined }),
      onMessage: onNet,
      onClose: () => {
        toast("Связь с сервером потеряна — переподключаемся…", "bad");
        setTimeout(() => location.reload(), 2500);
      },
      onError: (code) => {
        net = null;
        netStatus(NET_ERRORS[code] || "Не получилось подключиться", true);
        document.querySelectorAll("#startOverlay button").forEach((b) => { b.disabled = false; });
      }
    }, opts));
  }
  $("createBtn").addEventListener("click", () => goOnline({ create: true }));
  $("joinBtn").addEventListener("click", () => {
    const code = $("codeInput").value.trim();
    if (!/^\d{4}$/.test(code)) { netStatus("Код комнаты — 4 цифры", true); return; }
    // по ссылке из платформы комната может ещё не существовать — тогда она создастся с этим же кодом
    goOnline({ room: code, auto: code === urlRoom });
  });
  $("codeInput").addEventListener("keydown", (e) => { if (e.key === "Enter") $("joinBtn").click(); });
  $("roomChip").addEventListener("click", () => {
    const link = `${location.origin}${location.pathname}?room=${net ? net.room : ""}`;
    const done = () => toast("Ссылка скопирована — отправь её друзьям", "good");
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(link).then(done, () => toast(link, ""));
    else toast(link, "");
  });
  function updateRoomChip() {
    const chip = $("roomChip");
    chip.classList.toggle("show", online());
    if (online()) chip.textContent = `🔗 Комната ${net.room} · 👥 ${people.filter((p) => !p.isBot).length}`;
  }

  // магазин у продавца
  function nearVendor() {
    return game.phase === "lobby" && Math.hypot(me.x - lobby.vendor.x, me.z - lobby.vendor.z) < 4.2;
  }
  function renderShop() {
    const money = coins(0);
    $("shopCoins").textContent = `🪙 ${money}`;
    $("shopList").innerHTML = SHOP.map((it) => {
      const owned = store.owned.includes(it.id);
      const on = store.equip[it.cat] === it.id;
      const label = on ? "Надето ✓" : owned ? "Надеть" : `${it.price} 🪙`;
      return `<button class="shop-item${on ? " on" : ""}" data-id="${it.id}" type="button"${!owned && money < it.price ? " disabled" : ""}>
        <span class="shop-item__icon">${it.icon}</span><span class="shop-item__text"><b>${it.name}</b><small>${it.desc}</small></span><span class="shop-item__price">${label}</span></button>`;
    }).join("");
    $("shopList").querySelectorAll("[data-id]").forEach((b) => b.addEventListener("click", () => {
      const it = SHOP.find((x) => x.id === b.dataset.id);
      if (!store.owned.includes(it.id)) {
        if (coins(0) < it.price) return;
        coins(-it.price);
        store.owned.push(it.id);
        audio.coin();
      } else audio.click();
      store.equip[it.cat] = store.equip[it.cat] === it.id && it.cat !== "hat" ? null : it.id;
      saveStore();
      applyLooks();
      renderShop();
    }));
  }
  function toggleShop(force) {
    const panel = $("shopPanel");
    const open = force === undefined ? !panel.classList.contains("show") : force;
    if (open && !nearVendor()) return;
    panel.classList.toggle("show", open);
    if (open) {
      renderShop();
      if (document.pointerLockElement) document.exitPointerLock();
    } else lockMouse();
  }
  $("shopClose").addEventListener("click", () => toggleShop(false));

  // ---------- Участники: ты, друзья по сети и боты (чтобы всегда было хотя бы 5 человек) ----------
  const myLook = P.readPlayerLook();
  const myHat = () => { const h = equipped("hat"); return h ? h.id.replace("hat-", "") : null; };
  const BOT_HATS = ["cap", null, "cowboy", null];
  const MIN_PEOPLE = 5;
  const people = [];
  function addPerson(o) {
    const p = Object.assign({ x: 0, z: 0, y: 0, vy: 0, yaw: 0, speed: 0, votePad: -1, hat: null, net: null }, o);
    p.human = P.buildHuman(p.look);
    P.addHat(p.human, p.hat);
    p.tag = P.nameTag(p.name, p.isMe ? "#ffd23f" : p.isBot ? "#ffffff" : "#9fe0ff");
    p.tag.position.y = 2.75;
    p.human.group.add(p.tag);
    lobby.root.add(p.human.group);
    people.push(p);
    return p;
  }
  function removePerson(p) {
    if (!p || p.isMe) return;
    lobby.root.remove(p.human.group);
    people.splice(people.indexOf(p), 1);
  }
  const personById = (id) => people.find((p) => p.id === id) || null;
  // участник, которого уже нет в лобби (вышел), но он нужен для имени в раунде
  const stubPerson = (id) => {
    const i = /^b\d$/.test(id) ? Number(id[1]) : 0;
    return { id, name: /^b\d$/.test(id) ? P.BOT_LOOKS[i].name : "Игрок", look: P.BOT_LOOKS[i], isBot: /^b\d$/.test(id), hat: null };
  };
  function setBots(ids) {
    people.filter((p) => p.isBot && !ids.includes(p.id)).forEach(removePerson);
    ids.forEach((id) => {
      if (personById(id)) return;
      const i = Number(id[1]);
      const p = addPerson({ id, name: P.BOT_LOOKS[i].name, look: P.BOT_LOOKS[i], isBot: true, hat: BOT_HATS[i] });
      p.x = lobby.spawn.x + (i - 1.5) * 3;
      p.z = lobby.spawn.z + 3;
      p.wait = 1 + Math.random() * 2;
    });
  }
  // хозяин добавляет ботов, пока людей меньше пяти
  function refreshBots() {
    if (!isHost()) return;
    const humans = people.filter((p) => !p.isBot).length;
    setBots(["b0", "b1", "b2", "b3"].slice(0, Math.max(0, MIN_PEOPLE - humans)));
  }
  const me = addPerson({ id: "me", name: "Ты", look: myLook, isMe: true, hat: myHat() });
  function setMyName(name) {
    me.name = name;
    me.human.group.remove(me.tag);
    me.tag = P.nameTag(name, "#ffd23f");
    me.tag.position.y = 2.75;
    me.human.group.add(me.tag);
  }
  setBots(["b0", "b1", "b2", "b3"]);
  game.lobbyPeople = people;
  // продавец за прилавком: машет рукой, когда подходишь
  const vendor = P.buildHuman({ body: "#2f6a3a", accent: "#f2d38a", hair: "#6b4a34", eyes: "#5a3b24", skin: "tan", outfit: "shirt", pants: "trousers", shoes: "boots", hairStyle: "short", accessory: "none", face: "happy", bodyType: "man", shirt: "#2f6a3a" }, { vest: false });
  P.addHat(vendor, "cowboy");
  const vendorTag = P.nameTag("🛒 Продавец", "#ffd23f");
  vendorTag.position.y = 2.95;
  vendor.group.add(vendorTag);
  vendor.group.position.set(lobby.vendor.x, 0, lobby.vendor.z - 3.1);
  lobby.root.add(vendor.group);
  function applyLooks() {
    me.hat = myHat();
    P.addHat(me.human, me.hat);
    const gunSkin = equipped("gun");
    gunMesh.material.color.set(gunSkin ? gunSkin.color : 0xffffff);
  }

  function placeInLobby() {
    people.forEach((p, i) => {
      if (p.remote) return; // друзья сами пришлют, где стоят
      const a = Math.PI * 1.2 + i * 0.35;
      p.x = lobby.spawn.x + Math.cos(a) * (i ? 4 + i : 0);
      p.z = lobby.spawn.z + Math.sin(a) * (i ? 3 : 0);
      p.y = lobby.groundAt(p.x, p.z);
      p.vy = 0;
      p.yaw = lobby.spawn.yaw;
      p.goal = null;
      p.wait = 1 + Math.random() * 3;
      p.votePad = -1;
      p.human.group.visible = true;
    });
    input.yaw = Math.PI;
    input.pitch = -0.25;
  }

  // ---------- Движение с препятствиями (круги и прямоугольники) ----------
  function moveBody(body, speed, dirX, dirZ, dt, radius, env, bound) {
    let nx = body.x + dirX * speed * dt;
    let nz = body.z + dirZ * speed * dt;
    if (env.isDeepWater && env.isDeepWater(nx, nz, 0.55)) { nx = body.x; nz = body.z; }
    for (const c of env.colliders) {
      if (c.top !== undefined && body.y > c.top - 0.3) continue;
      if (c.minX !== undefined) {
        if (nx > c.minX - radius && nx < c.maxX + radius && nz > c.minZ - radius && nz < c.maxZ + radius) {
          const pushes = [[c.minX - radius - nx, 0], [c.maxX + radius - nx, 0], [0, c.minZ - radius - nz], [0, c.maxZ + radius - nz]];
          pushes.sort((a, b) => Math.abs(a[0] + a[1]) - Math.abs(b[0] + b[1]));
          nx += pushes[0][0];
          nz += pushes[0][1];
        }
        continue;
      }
      const dx = nx - c.x;
      const dz = nz - c.z;
      const rr = c.r + radius;
      const d2 = dx * dx + dz * dz;
      if (d2 < rr * rr && d2 > 1e-6) {
        const d = Math.sqrt(d2);
        nx = c.x + (dx / d) * rr;
        nz = c.z + (dz / d) * rr;
      }
    }
    const r = Math.hypot(nx, nz);
    if (r > bound) { nx *= bound / r; nz *= bound / r; }
    body.x = nx;
    body.z = nz;
  }
  function readMove() {
    let fx = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0) - input.joyY;
    let sx = (keys.KeyD || keys.ArrowRight ? 1 : 0) - (keys.KeyA || keys.ArrowLeft ? 1 : 0) + input.joyX;
    const len = Math.hypot(fx, sx);
    if (len > 1) { fx /= len; sx /= len; }
    return {
      len: Math.min(1, len),
      x: -Math.sin(input.yaw) * fx + Math.cos(input.yaw) * sx,
      z: -Math.cos(input.yaw) * fx - Math.sin(input.yaw) * sx,
      run: keys.ShiftLeft || keys.ShiftRight || input.run
    };
  }

  // ---------- Лобби: ходим, голосуем, покупаем ----------
  let stepTimer = 0;
  function updateLobby(dt) {
    const mv = paused ? { len: 0 } : readMove();
    // ты
    if (mv.len > 0.1) {
      const m = Math.hypot(mv.x, mv.z) || 1;
      me.speed = (mv.run ? 8 : 5) * mv.len;
      moveBody(me, me.speed, mv.x / m, mv.z / m, dt, 0.45, lobby, lobby.R);
      const want = Math.atan2(mv.x, mv.z);
      let d = want - me.yaw;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      me.yaw += d * Math.min(1, dt * 10);
      stepTimer -= dt * me.speed;
      if (stepTimer <= 0 && me.y - lobby.groundAt(me.x, me.z) < 0.05) { stepTimer = 2.6; audio.step(false); }
    } else me.speed = 0;
    // боты бродят по площадке, потом встают в круг понравившейся карты (их ведёт хозяин комнаты)
    people.forEach((p) => {
      if (p.isMe) return;
      if (p.remote || !isHost()) { followNet(p, dt); return; }
      p.net = null;
      p.wait -= dt;
      if (!p.goal && p.wait <= 0) {
        if (game.timer < LOBBY_TIME - 3 && Math.random() < 0.7) {
          const counts = voteCounts();
          const best = counts.indexOf(Math.max(...counts));
          const pick = Math.random() < 0.45 && Math.max(...counts) > 0 ? best : Math.floor(Math.random() * lobby.pads.length);
          const pad = lobby.pads[pick];
          const a = Math.random() * Math.PI * 2;
          p.goal = [pad.x + Math.cos(a) * 1.1, pad.z + Math.sin(a) * 1.1];
          p.wait = 99;
        } else {
          const a = Math.random() * Math.PI * 2;
          const r = 6 + Math.random() * 8;
          p.goal = [Math.cos(a) * r, Math.sin(a) * r];
          p.wait = 1 + Math.random() * 2;
        }
      }
      if (p.goal) {
        const dx = p.goal[0] - p.x;
        const dz = p.goal[1] - p.z;
        const dist = Math.hypot(dx, dz);
        if (dist < 0.4) { p.goal = null; p.speed = 0; }
        else {
          p.speed = 4.4;
          p.yaw = Math.atan2(dx, dz);
          moveBody(p, Math.min(p.speed, dist * 3), dx / dist, dz / dist, dt, 0.45, lobby, lobby.R);
        }
      }
    });
    people.forEach((p) => {
      const ground = lobby.groundAt(p.x, p.z);
      if (!p.net) {
        p.vy -= 22 * dt;
        p.y += p.vy * dt;
        if (p.y <= ground) { p.y = ground; p.vy = 0; }
      }
      p.human.group.position.set(p.x, p.y, p.z);
      p.human.group.rotation.y = p.yaw;
      p.human.animate(dt, p.speed > 0.3 ? "walk" : "idle", p.speed);
      // голос — тот круг, на котором стоишь
      p.votePad = lobby.pads.findIndex((pad) => Math.hypot(p.x - pad.x, p.z - pad.z) < pad.r);
    });
    lobby.drawPads(voteCounts(), me.votePad);
    const near = nearVendor();
    vendor.animate(dt, near ? "wave" : "idle", 0);
    if (near) {
      vendor.group.rotation.y = Math.atan2(me.x - vendor.group.position.x, me.z - vendor.group.position.z);
    } else vendor.group.rotation.y = 0;
    $("prompt").textContent = near ? (isTouch ? "🛒 Магазин" : "F — магазин") : me.votePad >= 0 ? `Ты голосуешь: ${MAPS[me.votePad].name}` : "";
    $("prompt").classList.toggle("show", !!$("prompt").textContent);
    document.body.classList.toggle("near-shop", near);
    followCamera(me.x, me.y, me.z, dt, 6.5, 1.9, lobby.groundAt, []);
  }
  // человечек, которым управляют по сети: плавно догоняет присланное положение
  function followNet(p, dt) {
    const n = p.net;
    if (!n) return;
    if (n.snap) { p.x = n.x; p.z = n.z; p.y = n.y; p.yaw = n.yaw; n.snap = false; }
    const k = Math.min(1, dt * 10);
    p.x += (n.x - p.x) * k;
    p.z += (n.z - p.z) * k;
    p.y += (n.y - p.y) * k;
    let d = n.yaw - p.yaw;
    d = Math.atan2(Math.sin(d), Math.cos(d));
    p.yaw += d * k;
    p.speed = n.speed;
  }
  function setNet(p, a) {
    const n = p.net || (p.net = { snap: true });
    n.x = a[0] / 100;
    n.z = a[1] / 100;
    n.y = a[2] / 100;
    n.yaw = a[3] / 100;
    n.speed = a[4] / 100;
  }
  function voteCounts() {
    const counts = lobby.pads.map(() => 0);
    people.forEach((p) => { if (p.votePad >= 0) counts[p.votePad] += 1; });
    return counts;
  }

  // ---------- Раунд ----------
  function chooseMap() {
    const counts = voteCounts();
    const top = Math.max(...counts);
    const options = counts.map((c, i) => [c, i]).filter(([c]) => c === top).map(([, i]) => i);
    return MAPS[options[Math.floor(Math.random() * options.length)]];
  }

  // map передаёт хозяин; у хозяина карта выбирается голосованием
  function startLoading(map) {
    game.phase = "loading";
    game.map = map || chooseMap();
    $("prompt").classList.remove("show");
    toggleShop(false);
    const pic = $("mapIntroPic");
    window.HideLobby.drawPreview(pic.getContext("2d"), game.map, pic.width, pic.height);
    $("mapIntroName").textContent = game.map.name;
    $("mapIntro").classList.add("show");
    audio.go();
    if (!isHost()) return; // остальные ждут от хозяина сообщения «round»
    if (online()) net.send({ k: "load", map: MAPS.indexOf(game.map) });
    // дать картинке показаться, потом строить карту (это занимает секунду)
    setTimeout(() => {
      if (game.phase !== "loading") return;
      buildRound();
      setTimeout(() => $("mapIntro").classList.remove("show"), 600);
    }, 900);
  }

  function buildWorld() {
    lobby.show(false);
    world = window.HideWorld.build(scene, { season: game.map.season, rot: game.map.rot, mirror: game.map.mirror, seed: game.map.seed });
    herdSys = window.HideDeer.create(scene, world, 64);
    game.herds = herdSys;
    game.misses = 0;
    game.spectate = false;
    game.knownInnocent = new Set();
    game.people.forEach((h) => scene.remove(h.group));
    game.people = [];
    game.hiders = [];
    game.player = null;
    game.hunter = null;
    game.bot = null;
    game.remoteHunter = null;
  }
  const hunterSpawn = () => ({ x: world.TOWER.x + 1.5, z: world.TOWER.z - 15 });
  function placeHunter(hunterP) {
    const spawn = hunterSpawn();
    game.hunterName = hunterP.isMe ? `${me.name} (ты)` : hunterP.name;
    if (hunterP.isMe) {
      game.hunter = { x: spawn.x, z: spawn.z, y: world.groundAt(spawn.x, spawn.z), vy: 0, bob: 0, recoil: 0, cooldown: 0 };
      input.yaw = Math.atan2(world.MEADOW.x - spawn.x, world.MEADOW.z - spawn.z) + Math.PI;
      input.pitch = -0.05;
    } else if (hunterP.isBot) {
      game.bot = makeHunterBot(spawn, hunterP);
      game.bot.human.group.visible = false;
    } else {
      game.remoteHunter = makeHunterBot(spawn, hunterP);
      game.remoteHunter.human.group.visible = false;
    }
  }

  // раунд у остальных игроков: та же карта, олени — как прислал хозяин
  function followerRound(d) {
    const meIn = d.hunter === me.id || d.hiders.some(([pid]) => pid === me.id);
    if (!meIn) { game.waiting = true; $("mapIntro").classList.remove("show"); game.phase = "lobby"; return; }
    game.map = MAPS[d.map] || MAPS[0];
    game.phase = "loading";
    buildWorld();
    herdSys.initFrom(d.deer);
    herdSys.applySnapshot(d.s, true);
    d.hiders.forEach(([pid, idx]) => {
      const deer = herdSys.deer[idx];
      if (!deer) return;
      const p = personById(pid) || stubPerson(pid);
      deer.person = p;
      deer.name = p.name;
      deer.look = p.look;
      if (p === me) {
        // своим оленем управляешь сам
        deer.x = deer.net.x;
        deer.z = deer.net.z;
        deer.yaw = deer.net.yaw;
        deer.net = null;
        deer.netCtl = false;
        deer.isPlayer = true;
        game.player = deer;
        input.yaw = deer.yaw + Math.PI;
        input.pitch = -0.28;
      }
      game.hiders.push(deer);
    });
    const hunterP = d.hunter === me.id ? me : personById(d.hunter) || stubPerson(d.hunter);
    placeHunter(hunterP);
    startRoundUi(hunterP.isMe);
    setTimeout(() => $("mapIntro").classList.remove("show"), 600);
  }

  function buildRound() {
    buildWorld();
    herdSys.spawnHerds(6);
    // роли: охотник — случайный участник; если играют несколько человек — охотник всегда человек
    const humans = people.filter((p) => !p.isBot);
    const pool = online() && humans.length > 1 ? humans : people;
    const hunterP = pool[Math.floor(Math.random() * pool.length)];
    const hunterIndex = people.indexOf(hunterP);
    const meHunter = hunterP.isMe;
    const adults = herdSys.deer.filter((d) => d.kind !== "fawn");
    const used = new Set();
    const pickHider = () => {
      let pool = adults.filter((d) => !d.isHider && !d.isPlayer && !used.has(d.herd));
      if (!pool.length) pool = adults.filter((d) => !d.isHider && !d.isPlayer);
      const d = pool[Math.floor(Math.random() * pool.length)];
      used.add(d.herd);
      return d;
    };
    people.forEach((p, i) => {
      if (i === hunterIndex) return;
      const d = pickHider();
      d.name = p.name;
      d.look = p.look;
      d.person = p;
      if (p.isMe) {
        d.isPlayer = true;
        game.player = d;
        input.yaw = d.yaw + Math.PI;
        input.pitch = -0.28;
      } else if (p.isBot) {
        d.isHider = true;
        d.tellTimer = DIFF.tell * (0.5 + Math.random());
      } else d.netCtl = true; // друг: его оленем управляет он сам
      game.hiders.push(d);
    });
    placeHunter(hunterP);
    if (online()) {
      net.send({
        k: "round", map: MAPS.indexOf(game.map), deer: herdSys.exportInit(), s: herdSys.snapshot(), hunter: hunterP.id,
        hiders: game.hiders.map((d) => [d.person.id, herdSys.deer.indexOf(d)])
      });
    }
    startRoundUi(meHunter);
  }

  function startRoundUi(meHunter) {
    game.roleNow = meHunter ? "hunter" : "deer";
    gun.visible = meHunter;
    setRoleClass(game.roleNow);
    $("suspicion").classList.toggle("show", !meHunter);
    $("prepOverlay").classList.toggle("show", meHunter);
    showRole(meHunter);
    game.phase = "prep";
    game.timer = PREP;
    $("hint").innerHTML = meHunter
      ? "<b>WASD</b> идти · <b>Shift</b> бег · <b>мышь</b> смотреть · <b>ЛКМ</b> выстрел · <b>ПКМ</b> бинокль"
      : "<b>WASD</b> идти · <b>Shift</b> бег · <b>E</b> щипать траву · <b>Q</b> оглядеться · <b>C</b> лечь · <b>R</b> встряхнуться";
    $("hint").classList.add("show");
    hintTimer = 9;
    camDist = 1;
  }

  function showRole(meHunter) {
    $("roleIcon").textContent = meHunter ? "🎯" : "🦌";
    $("roleTitle").textContent = meHunter ? "Ты — охотник!" : `Ты — ${game.player.kind === "stag" ? "олень" : "олениха"}!`;
    $("roleSub").textContent = meHunter ? "Найди, кто из оленей — игроки. 5 промахов — и ты проиграл." : `Охотник — ${game.hunterName}. Веди себя как всё стадо!`;
    $("roleCard").classList.add("show");
    roleTimer = 4;
  }

  function endRound(hunterWins, reason) {
    if (game.phase === "results") return;
    game.phase = "results";
    game.timer = RESULTS;
    gun.visible = false;
    $("scope").classList.remove("show");
    $("watch").classList.remove("show", "aim");
    $("prepOverlay").classList.remove("show");
    const playerWon = game.roleNow === "hunter" ? hunterWins : !hunterWins;
    let earned = playerWon ? 40 : 10;
    if (game.roleNow === "deer" && game.player && !game.player.caught) earned += 10;
    const total = coins(earned);
    $("endTitle").textContent = playerWon ? "Победа! 🎉" : "Не повезло 😅";
    $("endReason").textContent = reason;
    $("endList").innerHTML = `<li class="hunter"><span>🎯 ${game.hunterName}</span><b>охотник</b></li>` + game.hiders.map((d) => `<li class="${d.caught ? "caught" : "free"}"><span>${d.isPlayer ? "⭐ " : ""}${d.name}${d.person && d.person.isBot ? " 🤖" : ""}</span><b>${d.caught ? "пойман" : "не найден 🦌"}</b></li>`).join("");
    $("endCoins").textContent = `+${earned} 🪙  (всего ${total})`;
    if (playerWon) audio.win(); else audio.lose();
    game.hiders.forEach((d) => { if (!d.caught) reveal(d, false); });
    setTimeout(() => { if (game.phase === "results") $("endScreen").classList.add("show"); }, 1400);
  }

  function backToLobby() {
    $("endScreen").classList.remove("show");
    game.people.forEach((h) => scene.remove(h.group));
    game.people = [];
    P.clearEffects(scene);
    if (game.bot) scene.remove(game.bot.human.group);
    game.bot = null;
    if (game.remoteHunter) scene.remove(game.remoteHunter.human.group);
    game.remoteHunter = null;
    game.waiting = false;
    banner("");
    $("mapIntro").classList.remove("show");
    $("prepOverlay").classList.remove("show");
    $("watch").classList.remove("show", "aim");
    gun.visible = false;
    if (herdSys) herdSys.dispose();
    herdSys = null;
    if (world) world.dispose();
    world = null;
    game.player = null;
    game.hunter = null;
    game.hiders = [];
    lobby.show(true);
    placeInLobby();
    game.roleNow = "lobby";
    setRoleClass("lobby");
    $("suspicion").classList.remove("show");
    game.phase = "lobby";
    game.timer = LOBBY_TIME;
    camera.fov = 60;
    camera.updateProjectionMatrix();
  }

  // пойман: облачко (или эффект из магазина), олень превращается в человечка, тот шатается со звёздочками
  function reveal(d, dizzy = true) {
    d.caught = dizzy;
    d.hidden = true;
    const fx = game.roleNow === "hunter" ? equipped("fx") : null;
    P.puff(scene, d.x, d.y + 1, d.z, fx ? fx.colors : 0xffffff, fx ? 30 : 18);
    const human = P.buildHuman(d.look || P.BOT_LOOKS[0], { face: dizzy ? "dizzy" : "smile" });
    P.addHat(human, d.isPlayer ? myHat() : d.person ? d.person.hat : null);
    human.group.position.set(d.x, d.y, d.z);
    human.group.rotation.y = d.yaw;
    human.mode = dizzy ? "dizzy" : "cheer";
    scene.add(human.group);
    const tag = P.nameTag(d.isPlayer ? `${d.name} (ты)` : d.name, dizzy ? "#ffd23f" : "#7ae582");
    tag.position.y = 2.75;
    human.group.add(tag);
    if (dizzy) P.stars(human.group);
    game.people.push(human);
  }

  // выстрел решает только хозяин; остальным он рассылает, кого поймали или в кого промахнулись
  function resolveShot(hunterPos, target) {
    if (!herdSys || game.phase !== "hunt") return;
    herdSys.alarm(hunterPos.x, hunterPos.z, 75);
    if (!target || target.caught || target.hidden) return;
    const i = herdSys.deer.indexOf(target);
    if (target.person) {
      const ev = { k: "ev", e: "caught", i };
      if (online()) net.send(ev);
      applyEvent(ev);
      if (game.hiders.every((d) => d.caught)) finishRound(true, "Охотник нашёл всех спрятавшихся.");
    } else {
      game.misses += 1;
      target.jumpY = 0.01;
      target.vy = 5;
      const ev = { k: "ev", e: "miss", i, m: game.misses };
      if (online()) net.send(ev);
      applyEvent(ev);
      if (game.misses >= MAX_MISSES) finishRound(false, "Охотник 5 раз выстрелил в обычных оленей.");
    }
  }
  function finishRound(hunterWins, reason) {
    if (online()) net.send({ k: "end", w: hunterWins, r: reason });
    endRound(hunterWins, reason);
  }
  function applyEvent(ev) {
    const target = herdSys && herdSys.deer[ev.i];
    if (!target) return;
    if (ev.e === "caught") {
      if (target.caught) return;
      reveal(target, true);
      audio.caught();
      if (game.roleNow === "hunter") toast(`Поймал! 🎯 Это был ${target.name}`, "good");
      else if (target.isPlayer) {
        toast("Тебя поймали! 😵 Смотри, что будет дальше", "bad");
        game.spectate = true;
        $("suspicion").classList.remove("show");
        $("watch").classList.remove("show", "aim");
      } else toast(`Охотник поймал: ${target.name} 😵`, "bad");
    } else {
      game.misses = ev.m;
      game.knownInnocent.add(target);
      audio.miss();
      const left = MAX_MISSES - game.misses;
      if (game.roleNow === "hunter") toast(left > 0 ? `Мимо! Это обычный олень. Осталось попыток: ${left}` : "Мимо! Попытки кончились", "bad");
      else toast(left > 0 ? `Охотник промахнулся! Осталось попыток: ${left}` : "Охотник промахнулся 5 раз!", "good");
    }
  }
  // звук и след выстрела (у всех игроков)
  function shotFx(o, e) {
    audio.shot();
    tracer.geometry.setFromPoints([new THREE.Vector3(o[0], o[1], o[2]), new THREE.Vector3(e[0], e[1], e[2])]);
    tracer.visible = true;
    tracerT = 0.08;
  }

  // ---------- Охотник — игрок ----------
  const gun = P.buildPistol(1.1);
  const gunMesh = gun.children[0];
  gunMesh.material = gunMesh.material.clone();
  gun.position.set(0.24, -0.24, -0.5);
  gun.rotation.y = Math.PI;
  camera.add(gun);
  const hand = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.12, 0.14), new THREE.MeshStandardMaterial({ color: ({ porcelain: 0xffe0c8, fair: 0xf6d0a8, light: 0xf6d0a8, tan: 0xd9a273, brown: 0xa8714a, deep: 0x6e4630 })[myLook.skin] || 0xf0c8a0, roughness: 0.8 }));
  hand.position.set(0, -0.12, 0.06);
  gun.add(hand);
  const flash = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xffe08a, transparent: true, opacity: 0, depthTest: false }));
  flash.scale.set(0.22, 0.22, 1);
  flash.position.set(0, 0.06, -0.24);
  gun.add(flash);
  gun.visible = false;
  const tracer = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), new THREE.LineBasicMaterial({ color: 0xfff2b0, transparent: true }));
  tracer.visible = false;
  tracer.frustumCulled = false;
  scene.add(tracer);
  let tracerT = 0;
  const ray = { origin: new THREE.Vector3(), dir: new THREE.Vector3() };
  applyLooks();

  function updateHunterPlayer(dt) {
    const h = game.hunter;
    const canMove = game.phase === "hunt" && !paused;
    const mv = readMove();
    const running = mv.run && !input.zoom;
    const speed = canMove ? (running ? 6.2 : 3.3) * mv.len : 0;
    h.speed = speed;
    if (speed > 0) {
      const m = Math.hypot(mv.x, mv.z) || 1;
      moveBody(h, speed, mv.x / m, mv.z / m, dt, 0.35, world, world.PLAY_R + 6);
    }
    const ground = world.groundAt(h.x, h.z, h.y);
    h.vy -= 20 * dt;
    h.y += h.vy * dt;
    if (h.y <= ground) { h.y = ground; h.vy = 0; h.onGround = true; } else h.onGround = h.y - ground < 0.05;
    h.bob += dt * speed * 2.2;
    if (speed > 0 && h.onGround) {
      stepTimer -= dt * speed;
      if (stepTimer <= 0) { stepTimer = 2.2; audio.step(world.isWater(h.x, h.z) || world.season.snow); }
    }
    const eye = 1.62 + (speed > 0 ? Math.sin(h.bob) * 0.04 : 0);
    camera.position.set(h.x, h.y + eye, h.z);
    camera.rotation.set(input.pitch, input.yaw, 0, "YXZ");
    const wantFov = input.zoom ? 20 : 62;
    camera.fov += (wantFov - camera.fov) * Math.min(1, dt * 10);
    camera.updateProjectionMatrix();
    $("scope").classList.toggle("show", input.zoom && camera.fov < 40);
    gun.visible = !input.zoom || camera.fov > 40;
    h.recoil = Math.max(0, h.recoil - dt * 6);
    gun.position.set(0.24 + Math.sin(h.bob * 0.5) * 0.01, -0.24 + h.recoil * 0.04 + Math.abs(Math.sin(h.bob)) * 0.01, -0.5 + h.recoil * 0.08);
    gun.rotation.x = h.recoil * 0.35;
    flash.material.opacity = Math.max(0, flash.material.opacity - dt * 14);
    h.cooldown = Math.max(0, h.cooldown - dt);
    if (input.fire && canMove && h.cooldown <= 0) {
      h.cooldown = 0.7;
      h.recoil = 1;
      flash.material.opacity = 1;
      camera.getWorldPosition(ray.origin);
      camera.getWorldDirection(ray.dir);
      let hit = herdSys.hitTest(ray.origin, ray.dir, 90);
      if (!hit && isTouch) {
        // на телефоне помогаем прицелиться: ближайший олень у перекрестья
        let best = null;
        let bestA = 0.05;
        herdSys.deer.forEach((d) => {
          if (d.hidden || d.caught) return;
          const v = new THREE.Vector3(d.x - ray.origin.x, d.y + d.scale - ray.origin.y, d.z - ray.origin.z);
          const dist = v.length();
          if (dist > 70) return;
          const a = v.normalize().angleTo(ray.dir);
          if (a < bestA) { bestA = a; best = { deer: d, t: dist }; }
        });
        hit = best;
      }
      const end = ray.origin.clone().addScaledVector(ray.dir, hit ? hit.t : 60);
      const start = new THREE.Vector3(0, 0.06, -0.3);
      gun.localToWorld(start);
      const o = [start.x, start.y, start.z].map((v) => Math.round(v * 100) / 100);
      const e = [end.x, end.y, end.z].map((v) => Math.round(v * 100) / 100);
      shotFx(o, e);
      // попадание считаешь ты (как видишь, так и попал), а хозяин решает, кто это был
      if (online()) net.send({ k: "shot", o, e, i: hit ? herdSys.deer.indexOf(hit.deer) : -1, x: r2(h.x), z: r2(h.z) });
      if (isHost()) resolveShot(h, hit ? hit.deer : null);
      if (!hit) toast("Мимо — никого не задел", "");
    }
    input.fire = false;
  }

  // ---------- Охотник — бот: наблюдает за стадами и замечает странных оленей ----------
  function makeHunterBot(spawn, person) {
    const human = P.buildHuman(person.look, { vest: true, gun: true });
    P.addHat(human, "cap");
    const tag = P.nameTag(`🎯 ${person.name}`, "#ff9a5a");
    tag.position.y = 2.75;
    human.group.add(tag);
    scene.add(human.group);
    return { human, person, x: spawn.x, z: spawn.z, y: world.groundAt(spawn.x, spawn.z), yaw: 0, state: "patrol", timer: 0, herd: null, goal: null, suspicion: new Map(), target: null, recent: [], speed: 0, sinceShot: 0, scan: 0, focus: null };
  }
  function updateHunterBot(dt) {
    const b = game.bot;
    if (!b) return;
    b.timer -= dt;
    b.sinceShot += dt;
    const herds = herdSys.herds;
    let wantSpeed = 0;
    const faceTo = (x, z, rate = 4) => {
      const want = Math.atan2(x - b.x, z - b.z);
      let d = want - b.yaw;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      b.yaw += d * Math.min(1, dt * rate);
      return Math.abs(d);
    };
    const usable = (d) => !d.caught && !d.hidden && !game.knownInnocent.has(d);
    // охотник всё время краем глаза следит за оленями вокруг
    b.scan -= dt;
    if (b.scan <= 0) {
      b.scan = 0.5;
      const wide = b.state === "observe" ? 1.25 : 1.5;
      herdSys.deer.forEach((d) => {
        if (!usable(d)) return;
        const dx = d.x - b.x;
        const dz = d.z - b.z;
        const dist = Math.hypot(dx, dz);
        if (dist > 75) return;
        let a = Math.atan2(dx, dz) - b.yaw;
        a = Math.atan2(Math.sin(a), Math.cos(a));
        if (Math.abs(a) > wide) return;
        const close = b.state === "observe" ? 1.15 : 0.45;
        b.suspicion.set(d, (b.suspicion.get(d) || 0) + (d.oddness * close + (Math.random() - 0.5) * 0.08) * 0.5 * (1 - dist / 95));
      });
    }
    let best = null;
    let bestS = -1;
    b.suspicion.forEach((s, d) => { if (usable(d) && s > bestS) { bestS = s; best = d; } });
    const hurry = Math.max(0.45, Math.min(1, 0.45 + 0.55 * (game.timer / HUNT)));
    function aimAt(d) {
      if (Math.hypot(d.x - b.x, d.z - b.z) > 42) {
        const ax = b.x - d.x;
        const az = b.z - d.z;
        const len = Math.hypot(ax, az) || 1;
        b.goal = [d.x + (ax / len) * 18, d.z + (az / len) * 18];
        b.focus = d;
        b.state = "patrol";
        b.timer = 0;
        return;
      }
      b.state = "aim";
      b.target = d;
      b.timer = 1.1;
      if (d === game.player) {
        toast("🎯 Охотник целится в тебя!", "bad");
        $("watch").classList.add("aim");
      }
    }
    if (b.state === "patrol") {
      if (!b.goal) {
        let lure = null;
        if (Math.random() < 0.5) {
          let top = 0.55;
          herdSys.deer.forEach((d) => {
            if (!usable(d) || Math.hypot(d.x - b.x, d.z - b.z) > 115) return;
            if (d.oddness > top) { top = d.oddness; lure = d; }
          });
        }
        const chase = best && bestS > DIFF.threshold * 0.35 ? best : lure;
        if (chase) {
          const ax = b.x - chase.x;
          const az = b.z - chase.z;
          const len = Math.hypot(ax, az) || 1;
          const dist = 14 + Math.random() * 6;
          b.goal = [chase.x + (ax / len) * dist, chase.z + (az / len) * dist];
          b.focus = chase;
        } else {
          const options = herds.filter((h) => h.members.some((m) => !m.caught) && !b.recent.includes(h));
          const list = options.length ? options : herds;
          list.sort((h1, h2) => {
            const [x1, z1] = herdSys.herdCenter(h1);
            const [x2, z2] = herdSys.herdCenter(h2);
            return Math.hypot(x1 - b.x, z1 - b.z) - Math.hypot(x2 - b.x, z2 - b.z);
          });
          const herd = list[Math.floor(Math.random() * Math.min(2, list.length))];
          const [cx, cz] = herdSys.herdCenter(herd);
          const ax = b.x - cx;
          const az = b.z - cz;
          const len = Math.hypot(ax, az) || 1;
          const dist = 16 + Math.random() * 8;
          b.goal = [cx + (ax / len) * dist, cz + (az / len) * dist];
          b.herd = herd;
          b.focus = null;
          b.recent.push(herd);
          if (b.recent.length > 3) b.recent.shift();
        }
        b.timer = 0;
      }
      const dist = Math.hypot(b.goal[0] - b.x, b.goal[1] - b.z);
      faceTo(b.goal[0], b.goal[1]);
      wantSpeed = dist > 1 ? 3.1 : 0;
      if (dist < 1.5 || b.timer < -22) {
        b.state = "observe";
        b.timer = 6 + Math.random() * 5;
        b.goal = null;
      }
    } else if (b.state === "observe") {
      const center = b.focus && usable(b.focus) ? [b.focus.x, b.focus.z] : herdSys.herdCenter(b.herd || herds[0]);
      faceTo(center[0], center[1], 2);
      if (best && bestS > DIFF.threshold * hurry) aimAt(best);
      else if (b.timer <= 0) {
        if (best && bestS > DIFF.threshold * 0.55 * hurry && Math.random() < 0.45) aimAt(best);
        else { b.state = "patrol"; b.goal = null; }
      }
      if (b.state === "observe" && b.sinceShot > 40 && best && bestS > 0.2) aimAt(best);
    } else if (b.state === "aim") {
      const t = b.target;
      const err = faceTo(t.x, t.z, 6);
      if (!usable(t)) { b.state = "patrol"; b.goal = null; }
      else if (b.timer <= 0 && err < 0.12) {
        if (Math.hypot(t.x - b.x, t.z - b.z) < 60) {
          const o = [b.x + Math.sin(b.yaw) * 0.6, b.y + 1.45, b.z + Math.cos(b.yaw) * 0.6].map((v) => Math.round(v * 100) / 100);
          const e = [t.x, t.y + 1.1 * t.scale, t.z].map((v) => Math.round(v * 100) / 100);
          shotFx(o, e);
          if (online()) net.send({ k: "shot", o, e, i: -1 });
          resolveShot({ x: b.x, z: b.z }, t);
        }
        b.suspicion.set(t, -99);
        b.sinceShot = 0;
        b.state = "cooldown";
        b.timer = 2.2;
        $("watch").classList.remove("aim");
      }
    } else if (b.state === "cooldown" && b.timer <= 0) {
      b.state = "patrol";
      b.goal = null;
    }
    b.speed += (wantSpeed - b.speed) * Math.min(1, dt * 4);
    if (b.speed > 0.05) moveBody(b, b.speed, Math.sin(b.yaw), Math.cos(b.yaw), dt, 0.4, world, world.PLAY_R + 6);
    b.y = world.groundAt(b.x, b.z, b.y + 0.5);
    b.human.group.position.set(b.x, b.y, b.z);
    b.human.group.rotation.y = b.yaw;
    b.human.animate(dt, b.state === "aim" ? "aim" : b.speed > 0.2 ? "walk" : "idle", b.speed);
    if (game.player && !game.player.caught) {
      const p = game.player;
      const dist = Math.hypot(p.x - b.x, p.z - b.z);
      let a = Math.atan2(p.x - b.x, p.z - b.z) - b.yaw;
      a = Math.atan2(Math.sin(a), Math.cos(a));
      $("watch").classList.toggle("show", (dist < 60 && Math.abs(a) < 1.25) || (b.state === "aim" && b.target === p));
      const s = Math.max(0, b.suspicion.get(p) || 0) / (DIFF.threshold * hurry);
      $("suspicionFill").style.width = `${Math.min(100, s * 100)}%`;
      $("suspicion").classList.toggle("hot", s > 0.65);
    }
  }

  // ---------- Охотник другого игрока или бот у остальных: показываем присланное ----------
  function setHunterNet(b, o) {
    const n = b.net || (b.net = { snap: true });
    Object.assign(n, o);
  }
  function followHunter(b, dt) {
    const n = b.net;
    const k = Math.min(1, dt * 10);
    if (n) {
      if (n.snap) { b.x = n.x; b.z = n.z; b.yaw = n.yaw; if (n.y !== undefined) b.y = n.y; n.snap = false; }
      b.x += (n.x - b.x) * k;
      b.z += (n.z - b.z) * k;
      let d = n.yaw - b.yaw;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      b.yaw += d * k;
      b.speed = n.speed || 0;
      b.aiming = !!n.aim;
    }
    if (n && n.y !== undefined) b.y += (n.y - b.y) * k;
    else b.y = world.groundAt(b.x, b.z, b.y + 0.5);
    b.human.group.position.set(b.x, b.y, b.z);
    b.human.group.rotation.y = b.yaw;
    b.human.animate(dt, b.aiming ? "aim" : b.speed > 0.2 ? "walk" : "idle", b.speed);
  }
  function enterHunt() {
    game.phase = "hunt";
    game.timer = HUNT;
    $("prepOverlay").classList.remove("show");
    if (game.bot) game.bot.human.group.visible = true;
    if (game.remoteHunter) game.remoteHunter.human.group.visible = true;
    audio.go();
    toast(game.roleNow === "hunter" ? "Охота началась! Найди, кто из оленей — игрок" : "Охотник вышел на поляну! Не выдай себя", "");
  }
  // когда охотник — человек: полоска показывает, насколько твой олень выделяется из стада
  function hiderUi() {
    const p = game.player;
    const h = game.remoteHunter || game.bot;
    if (!p || p.caught || !h || game.phase !== "hunt") return;
    const dist = Math.hypot(p.x - h.x, p.z - h.z);
    let a = Math.atan2(p.x - h.x, p.z - h.z) - h.yaw;
    a = Math.atan2(Math.sin(a), Math.cos(a));
    const looking = dist < 60 && Math.abs(a) < (game.remoteHunter ? 0.55 : 1.25);
    $("watch").classList.toggle("show", looking);
    $("watch").classList.toggle("aim", looking && !!h.aiming && Math.abs(a) < 0.25);
    const s = Math.min(1, Math.max(0, p.oddness) / 1.6);
    $("suspicionFill").style.width = `${s * 100}%`;
    $("suspicion").classList.toggle("hot", s > 0.65);
  }

  // ---------- Сообщения по сети ----------
  function addRemote(peer) {
    const id = `p${peer.id}`;
    if (personById(id)) return;
    const look = Object.assign({}, P.BOT_LOOKS[peer.id % 5], peer.look && typeof peer.look === "object" ? peer.look : {});
    const p = addPerson({ id, name: String(peer.name || "Игрок").slice(0, 16), look, remote: true });
    p.x = lobby.spawn.x;
    p.z = lobby.spawn.z;
  }
  function onPersonLeft(p) {
    if (!world) return;
    if (game.remoteHunter && game.remoteHunter.person === p) {
      if (isHost() && game.phase !== "results") finishRound(false, `Охотник ${p.name} вышел из игры.`);
      return;
    }
    const d = game.hiders.find((h) => h.person === p);
    if (d && !d.caught && isHost()) {
      // дальше за него прячется бот
      d.netCtl = false;
      d.net = null;
      d.isHider = true;
      d.tellTimer = DIFF.tell;
    }
  }
  function netTick() {
    if (!online()) return;
    if (game.phase === "lobby") net.send({ k: "me", p: [r2(me.x), r2(me.z), r2(me.y), r2(me.yaw), r2(me.speed)], h: me.hat });
    if (!isHost()) {
      if (world && game.player && !game.player.caught && (game.phase === "prep" || game.phase === "hunt")) net.sendTo(net.hostId, { k: "pd", a: herdSys.playerState(game.player) });
    } else if (game.phase === "lobby") {
      net.send({ k: "lob", tm: r2(game.timer), b: people.filter((p) => p.isBot).map((p) => [p.id, r2(p.x), r2(p.z), r2(p.y), r2(p.yaw), r2(p.speed)]) });
    } else if (world && herdSys && game.phase !== "loading") {
      const b = game.bot;
      net.send({ k: "snap", tm: r2(game.timer), ph: game.phase, m: game.misses, d: herdSys.snapshot(), bot: b ? [r2(b.x), r2(b.z), r2(b.yaw), r2(b.speed), b.state === "aim" ? 1 : 0] : null });
    }
    const h = game.hunter;
    if (world && h && game.phase === "hunt") net.send({ k: "hun", p: [r2(h.x), r2(h.y), r2(h.z), r2(input.yaw + Math.PI), r2(input.pitch), r2(h.speed || 0)], z: input.zoom ? 1 : 0 });
  }
  function onNet(m) {
    if (m.t === "joined") {
      me.id = `p${m.id}`;
      setBots([]);
      m.peers.forEach(addRemote);
      refreshBots();
      try { history.replaceState(null, "", `${location.pathname}?room=${m.room}`); } catch (error) { /* не важно */ }
      // назад в платформу — в ту же комнату, к друзьям
      document.querySelectorAll('a[href="./index.html"]').forEach((a) => { a.href = `./index.html?room=${m.room}`; });
      if (!net.isHost()) { game.waiting = true; banner("Подключаемся к комнате…"); }
      game.timer = LOBBY_TIME;
      startGame();
      updateRoomChip();
      toast(net.isHost() ? `Комната ${m.room} создана! Нажми на номер комнаты вверху — ссылка скопируется` : `Ты в комнате ${m.room} 👋`, "good");
      return;
    }
    if (m.t === "peer") {
      addRemote(m);
      toast(`${String(m.name || "Игрок").slice(0, 16)} зашёл в игру 👋`, "");
      if (net.isHost()) {
        if (game.phase === "lobby") refreshBots();
        else net.sendTo(m.id, { k: "busy" });
      }
      updateRoomChip();
      return;
    }
    if (m.t === "left") {
      const p = personById(`p${m.id}`);
      if (p) {
        toast(`${p.name} вышел`, "");
        onPersonLeft(p);
        removePerson(p);
      }
      if (game.phase === "lobby") refreshBots();
      updateRoomChip();
      return;
    }
    if (m.t === "host") {
      if (game.phase !== "lobby" || world) backToLobby();
      if (net.isHost()) {
        toast("Ведущий вышел — теперь игру ведёшь ты", "");
        game.waiting = false;
        banner("");
        game.timer = LOBBY_TIME;
        refreshBots();
      } else {
        game.waiting = true;
        banner("Ведущий вышел — ждём нового…");
      }
      return;
    }
    if (m.t !== "s" || !m.d || typeof m.d !== "object") return;
    const d = m.d;
    const from = `p${m.id}`;
    const sender = personById(from);
    const fromHost = m.id === net.hostId && !net.isHost();
    if (d.k === "me") {
      if (sender && Array.isArray(d.p) && d.p.length === 5) {
        setNet(sender, d.p);
        const hat = ["cap", "cowboy", "crown"].includes(d.h) ? d.h : null;
        if (hat !== sender.hat) { sender.hat = hat; P.addHat(sender.human, hat); }
      }
    } else if (d.k === "lob" && fromHost) {
      if (game.phase === "loading") return;
      if (world || game.phase !== "lobby") backToLobby();
      if (game.waiting) { game.waiting = false; banner(""); }
      game.timer = d.tm / 100;
      if (Array.isArray(d.b)) {
        setBots(d.b.map((b) => b[0]).filter((id) => /^b\d$/.test(id)));
        d.b.forEach((b) => { const p = personById(b[0]); if (p) setNet(p, b.slice(1)); });
      }
    } else if (d.k === "busy" && fromHost) {
      game.waiting = true;
      banner("Сейчас идёт раунд — ты сыграешь в следующем");
    } else if (d.k === "load" && fromHost) {
      if (game.phase === "lobby") startLoading(MAPS[d.map] || MAPS[0]);
    } else if (d.k === "round" && fromHost) {
      if (world) backToLobby();
      followerRound(d);
    } else if (d.k === "snap" && fromHost) {
      if (!world || !herdSys || !Array.isArray(d.d)) return;
      herdSys.applySnapshot(d.d, false);
      game.timer = d.tm / 100;
      game.misses = d.m || 0;
      if (d.ph === "hunt" && game.phase === "prep") enterHunt();
      if (d.bot && game.bot) setHunterNet(game.bot, { x: d.bot[0] / 100, z: d.bot[1] / 100, yaw: d.bot[2] / 100, speed: d.bot[3] / 100, aim: d.bot[4] });
    } else if (d.k === "pd" && net.isHost()) {
      const deer = herdSys && Array.isArray(d.a) ? herdSys.deer[d.a[0]] : null;
      if (deer && sender && deer.person === sender) herdSys.applyPlayerState(d.a);
    } else if (d.k === "hun") {
      const h = game.remoteHunter;
      if (h && h.person.id === from && Array.isArray(d.p)) setHunterNet(h, { x: d.p[0] / 100, y: d.p[1] / 100, z: d.p[2] / 100, yaw: d.p[3] / 100, speed: d.p[5] / 100, aim: !!d.z });
    } else if (d.k === "shot") {
      if (!world || !Array.isArray(d.o) || !Array.isArray(d.e)) return;
      shotFx(d.o, d.e);
      const h = game.remoteHunter;
      if (net.isHost() && h && h.person.id === from) resolveShot({ x: d.x / 100, z: d.z / 100 }, d.i >= 0 ? herdSys.deer[d.i] : null);
    } else if (d.k === "ev" && fromHost) {
      if (world) applyEvent(d);
    } else if (d.k === "end" && fromHost) {
      if (world) endRound(!!d.w, String(d.r || ""));
    } else if (d.k === "back" && fromHost) {
      if (world) backToLobby();
    }
  }

  // ---------- Олень — игрок ----------
  let lookTimer = 0;
  function doAction(kind) {
    if (!playing()) return;
    if (game.phase === "lobby") {
      if (kind === "jump" && me.y - lobby.groundAt(me.x, me.z) < 0.05) me.vy = 8;
      return;
    }
    if (game.roleNow === "hunter") {
      if (kind === "jump" && game.hunter && game.hunter.onGround && game.phase === "hunt") game.hunter.vy = 6;
      return;
    }
    const d = game.player;
    if (!d || d.caught) return;
    if (kind === "graze") { d.grazing = !d.grazing; d.wantLie = 0; }
    if (kind === "look") { lookTimer = 2.4; d.grazing = false; }
    if (kind === "lie") { d.wantLie = d.wantLie > 0.5 ? 0 : 1; d.grazing = false; }
    if (kind === "shake") d.shake = 1;
    if (kind === "jump" && d.jumpY === 0 && d.wantLie < 0.5) { d.vy = 5.5; d.jumpY = 0.001; }
  }
  function updateDeerPlayer(dt) {
    const d = game.player;
    const mv = paused ? { len: 0 } : readMove();
    if (mv.len > 0.15) d.wantLie = 0;
    if (mv.len > 0.15 && d.lie < 0.3) {
      const m = Math.hypot(mv.x, mv.z) || 1;
      d.moveX = mv.x / m;
      d.moveZ = mv.z / m;
      d.wantSpeed = (mv.run ? 6.6 : 1.4) * mv.len;
      d.grazing = false;
    } else d.wantSpeed = 0;
    lookTimer = Math.max(0, lookTimer - dt);
    if (lookTimer > 0) {
      d.wantPitch = -0.3;
      d.wantYaw = Math.sin(lookTimer * 2.6) * 0.75;
    } else if (d.grazing && d.speed < 0.3) {
      d.wantPitch = 1.8;
      d.wantYaw = 0;
    } else {
      d.wantPitch = d.speed > 0.2 ? 0.1 : 0.25;
      d.wantYaw = 0;
    }
    if (d.speed > 0.4 && d.jumpY === 0) {
      stepTimer -= dt * d.speed;
      if (stepTimer <= 0) { stepTimer = 1.6; audio.step(world.isWater(d.x, d.z) || world.season.snow); }
    }
    $("btnGraze").classList.toggle("active", !!d.grazing);
    $("btnLie").classList.toggle("active", d.wantLie > 0.5);
  }

  // камера сзади: подъезжает ближе, если за спиной ветки
  const camTarget = new THREE.Vector3();
  let camDist = 1;
  function followCamera(x, y, z, dt, dist, height, groundAt, canopies) {
    if (camera.aspect < 1) dist *= 1.55;
    camTarget.lerp(new THREE.Vector3(x, y + height, z), Math.min(1, dt * 8));
    const cp = Math.cos(input.pitch);
    const inCanopy = (px, py, pz) => canopies.some((c) => Math.abs(c.x - px) < c.r && Math.abs(c.z - pz) < c.r && py > c.bottom && py < c.top && Math.hypot(c.x - px, c.z - pz) < c.r * (1 - (py - c.bottom) / (c.top - c.bottom) * 0.6));
    let k = 1;
    for (let i = 0; i < 6 && canopies.length; i += 1) {
      if (!inCanopy(camTarget.x + Math.sin(input.yaw) * cp * dist * k, camTarget.y - Math.sin(input.pitch) * dist * k + 0.4, camTarget.z + Math.cos(input.yaw) * cp * dist * k)) break;
      k -= 0.15;
    }
    camDist += (Math.max(0.3, k) - camDist) * Math.min(1, dt * (k < camDist ? 12 : 3));
    const cx = camTarget.x + Math.sin(input.yaw) * cp * dist * camDist;
    let cy = camTarget.y - Math.sin(input.pitch) * dist * camDist + 0.4;
    const cz = camTarget.z + Math.cos(input.yaw) * cp * dist * camDist;
    cy = Math.max(cy, groundAt(cx, cz) + 0.5);
    camera.position.set(cx, cy, cz);
    camera.lookAt(camTarget);
    camera.fov += (62 - camera.fov) * Math.min(1, dt * 6);
    camera.updateProjectionMatrix();
  }

  // ---------- Главный цикл ----------
  const clock = new THREE.Clock();
  let simTime = 0;
  let lastTick = -1;
  let lastFrameAt = 0;
  function frame() {
    requestAnimationFrame(frame);
    lastFrameAt = performance.now();
    simulate(Math.min(0.05, clock.getDelta()));
  }
  game.simulate = simulate;
  function simulate(dt) {
    simTime += dt;
    const t = simTime;
    // по сети пауза не останавливает время — остальные же играют
    const counting = game.started && (online() || !paused);
    sendTimer -= dt;
    if (sendTimer <= 0) {
      sendTimer = 0.1;
      netTick();
    }
    if (counting && (game.phase === "lobby" || game.phase === "prep" || game.phase === "hunt" || game.phase === "results")) {
      game.timer -= dt;
      const sec = Math.ceil(game.timer);
      if (sec !== lastTick && sec <= 5 && sec > 0 && game.phase !== "results") audio.tick();
      lastTick = sec;
    }
    if (game.phase === "lobby") {
      updateLobby(dt);
      lobby.update(dt, t, me);
      if (counting && game.timer <= 0) {
        if (isHost()) startLoading();
        else game.timer = 0;
      }
      audio.update(dt, camera.position);
    } else if (game.phase === "loading") {
      lobby.update(dt, t, me);
    } else if (world) {
      if (game.phase === "prep") {
        $("prepCount").textContent = Math.max(1, Math.ceil(game.timer));
        if (game.timer <= 0) {
          if (isHost()) enterHunt();
          else game.timer = 0;
        }
      } else if (game.phase === "hunt" && game.timer <= 0) {
        if (isHost()) finishRound(false, "Время вышло — спрятавшиеся продержались до конца.");
        else game.timer = 0;
      }
      if (game.phase === "results") {
        $("endBack").textContent = `В лобби через ${Math.max(1, Math.ceil(game.timer))}`;
        if (game.timer <= 0) {
          if (isHost()) {
            if (online()) net.send({ k: "back" });
            backToLobby();
            return;
          }
          game.timer = 0;
        }
      }
      const hunterPos = game.phase === "hunt" ? (game.hunter || game.bot || game.remoteHunter) : null;
      herdSys.update(dt, hunterPos, DIFF.tell, !isHost());
      if (game.phase !== "results") {
        if (game.roleNow === "hunter") updateHunterPlayer(dt);
        else {
          if (!game.player.caught) updateDeerPlayer(dt);
          if (game.phase === "hunt" && game.bot && isHost()) updateHunterBot(dt);
          else hiderUi();
          const watch = game.bot || game.remoteHunter;
          if (game.spectate && watch) followCamera(watch.x, watch.y, watch.z, dt, 7, 1.8, world.groundAt, world.canopies);
          else followCamera(game.player.x, game.player.y, game.player.z, dt, 5.2 * game.player.scale, 1.4 * game.player.scale, world.groundAt, world.canopies);
        }
        if (game.bot && !isHost()) followHunter(game.bot, dt);
        if (game.remoteHunter) followHunter(game.remoteHunter, dt);
      } else {
        if (game.bot) game.bot.human.animate(dt, "idle", 0);
        const focus = game.hiders[0];
        const a = t * 0.12;
        camera.position.set(focus.x + Math.sin(a) * 14, focus.y + 6, focus.z + Math.cos(a) * 14);
        camera.lookAt(focus.x, focus.y + 1, focus.z);
      }
      const f = game.roleNow === "hunter" ? game.hunter : game.player;
      world.update(dt, t, new THREE.Vector3(f.x, f.y || 0, f.z));
      audio.update(dt, camera.position);
    }
    game.people.forEach((h) => h.animate(dt, h.mode, 0));
    P.updateEffects(dt, scene);
    if (tracerT > 0) { tracerT -= dt; tracer.material.opacity = Math.max(0, tracerT / 0.08); if (tracerT <= 0) tracer.visible = false; }
    if (toastTimer > 0) { toastTimer -= dt; if (toastTimer <= 0) $("toast").classList.remove("show"); }
    if (hintTimer > 0) { hintTimer -= dt; if (hintTimer <= 0) $("hint").classList.remove("show"); }
    if (roleTimer > 0) { roleTimer -= dt; if (roleTimer <= 0) $("roleCard").classList.remove("show"); }
    setHud();
    if (!game.noRender) renderer.render(scene, camera);
  }

  // старт: сразу в лобби, на фоне уже всё живёт
  placeInLobby();
  lobby.show(true);
  setRoleClass("lobby");
  $("hint").innerHTML = "<b>WASD</b> идти · <b>Shift</b> бег · <b>Пробел</b> прыжок · встань в круг, чтобы проголосовать за карту · <b>F</b> магазин у продавца";
  $("loading").classList.add("hide");
  setTimeout(() => { $("loading").style.display = "none"; }, 700);
  frame();
  // если вкладку свернули (кадры не рисуются), а ты в комнате — игра всё равно идёт, иначе у друзей всё замрёт
  setInterval(() => {
    if (!online() || performance.now() - lastFrameAt < 300) return;
    const was = game.noRender;
    game.noRender = true;
    simulate(0.1);
    game.noRender = was;
    clock.getDelta();
  }, 100);
})();
