// «Кто из них?» — связь с сервером комнат. Сам по себе ничего не решает, только передаёт сообщения.
(function () {
  "use strict";
  const available = location.protocol === "http:" || location.protocol === "https:";

  function connect({ create, room, auto, name, look, onMessage, onClose, onError }) {
    const ws = new WebSocket(`${location.protocol === "https:" ? "wss:" : "ws:"}//${location.host}/ws`);
    const net = { ws, myId: 0, hostId: 0, room: "", open: false, closed: false };
    let opened = false;
    const timeout = setTimeout(() => {
      if (!opened) { try { ws.close(); } catch (error) { /* уже закрыт */ } onError("timeout"); }
    }, 70000); // бесплатный Render просыпается до минуты
    ws.onopen = () => {
      opened = true;
      ws.send(JSON.stringify({ t: "join", game: "hide", create: !!create, room: room || "", auto: !!auto, name, look }));
    };
    ws.onmessage = (e) => {
      let m;
      try { m = JSON.parse(e.data); } catch (error) { return; }
      if (m.t === "joined") {
        clearTimeout(timeout);
        net.myId = m.id;
        net.hostId = m.host;
        net.room = m.room;
        net.open = true;
      } else if (m.t === "host") net.hostId = m.id;
      else if (m.t === "error") { clearTimeout(timeout); onError(m.code); return; }
      onMessage(m);
    };
    ws.onclose = () => {
      clearTimeout(timeout);
      const wasOpen = net.open;
      net.open = false;
      net.closed = true;
      if (wasOpen) onClose();
      else if (!opened) onError("noserver");
    };
    net.isHost = () => net.myId === net.hostId;
    net.send = (d) => { if (net.open && ws.readyState === 1) ws.send(JSON.stringify({ t: "s", d })); };
    net.sendTo = (to, d) => { if (net.open && ws.readyState === 1) ws.send(JSON.stringify({ t: "to", to, d })); };
    return net;
  }

  window.HideNet = { available, connect };
})();
