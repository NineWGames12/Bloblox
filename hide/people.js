// «Кто из них?» — человечки в стиле Roblox: твой аватар, охотник-бот, пистолет и эффекты поимки.
(function () {
  "use strict";
  const U = window.HideUtil;
  const SKIN = { porcelain: 0xffe0c8, light: 0xf6d0a8, tan: 0xd9a273, brown: 0xa8714a, deep: 0x6e4630 };
  const PANTS = { jeans: 0x3a5a8a, shorts: 0x3a5a8a, trousers: 0x3a3d43, cargo: 0x6b6a4a };

  function readPlayerLook() {
    try {
      const s = JSON.parse(window.localStorage.getItem("blobloxAvatarSettings") || "{}");
      return {
        name: s.name || "Ты",
        shirt: s.bodyColor || "#3fa9f5", accent: s.accentColor || "#ffffff", hair: s.hairColor || "#352f36",
        skin: SKIN[s.skinTone] || SKIN.light, pants: PANTS[s.pantsType] || PANTS.jeans, face: s.faceMood || "smile"
      };
    } catch (error) {
      return { name: "Ты", shirt: "#3fa9f5", accent: "#ffffff", hair: "#352f36", skin: SKIN.light, pants: PANTS.jeans, face: "smile" };
    }
  }

  const BOT_LOOKS = [
    { name: "Миша", shirt: "#ff9f68", hair: "#352f36", skin: SKIN.light, pants: PANTS.jeans },
    { name: "Катя", shirt: "#ff70a6", hair: "#c9a46a", skin: SKIN.porcelain, pants: PANTS.trousers },
    { name: "Тёма", shirt: "#7ae582", hair: "#8a3b1e", skin: SKIN.tan, pants: PANTS.cargo },
    { name: "Лиза", shirt: "#b784f0", hair: "#1d1f24", skin: SKIN.brown, pants: PANTS.jeans },
    { name: "Даня", shirt: "#ffd23f", hair: "#42312b", skin: SKIN.deep, pants: PANTS.trousers }
  ];

  function faceTexture(mood) {
    return U.canvasTexture(128, (ctx) => {
      ctx.clearRect(0, 0, 128, 128);
      ctx.fillStyle = "#1d1a18";
      if (mood === "dizzy") {
        ctx.lineWidth = 6;
        ctx.strokeStyle = "#1d1a18";
        [[40, 50], [88, 50]].forEach(([x, y]) => {
          ctx.beginPath();
          for (let a = 0; a < 12; a += 0.3) ctx.lineTo(x + Math.cos(a) * a * 1.2, y + Math.sin(a) * a * 1.2);
          ctx.stroke();
        });
        ctx.beginPath();
        ctx.ellipse(64, 92, 12, 9, 0, 0, Math.PI * 2);
        ctx.fill();
        return;
      }
      ctx.beginPath();
      ctx.ellipse(42, 52, 7, 10, 0, 0, Math.PI * 2);
      ctx.ellipse(86, 52, 7, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#1d1a18";
      ctx.beginPath();
      ctx.arc(64, 74, 22, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
    });
  }

  // человечок: голова-цилиндр с лицом, туловище, руки и ноги на шарнирах
  // человечки — тот же аватар, что в Block City (shared/avatar.js): твой скин из настроек, у ботов — образы прохожих
  const A = window.BlobloxAvatar;
  const HUMAN_HEIGHT = 2.1;
  function buildHuman(look, options = {}) {
    if (!A) return buildSimpleHuman(look, options);
    const av = A.create(look && look.body ? look : A.NPC_LOOKS[0], { height: HUMAN_HEIGHT });
    if (options.face) av.setFace(options.face);
    if (options.vest) {
      // оранжевый жилет охотника поверх одежды
      const vest = new THREE.Mesh(new THREE.BoxGeometry(2.1, 2.1, 1.16), new THREE.MeshStandardMaterial({ color: 0xff7a1a, roughness: 0.7 }));
      vest.position.y = 1.55;
      vest.castShadow = true;
      av.parts.spine.add(vest);
    }
    let gun = null;
    if (options.gun) {
      gun = buildPistol(0.8);
      av.handR.add(gun);
    }
    let mode = "idle";
    return {
      group: av.group, parts: Object.assign({}, av.parts, { neck: av.head, avatar: av }), gun, avatar: av, headTop: true,
      get mode() { return mode; },
      set mode(m) { mode = m; },
      setFace(id) { av.setFace(id); },
      animate(dt, m, speed = 0) { av.animate(dt, m || "idle", speed); }
    };
  }

  function buildSimpleHuman(look, options = {}) {
    const group = new THREE.Group();
    const mat = (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.75 });
    const skin = mat(look.skin);
    const shirt = mat(look.shirt);
    const pants = mat(look.pants);
    const add = (parent, geo, material, x, y, z) => {
      const m = new THREE.Mesh(geo, material);
      m.position.set(x, y, z);
      m.castShadow = true;
      parent.add(m);
      return m;
    };
    const pivot = (x, y, z) => {
      const p = new THREE.Group();
      p.position.set(x, y, z);
      group.add(p);
      return p;
    };
    const hipL = pivot(-0.2, 0.82, 0);
    const hipR = pivot(0.2, 0.82, 0);
    add(hipL, new THREE.BoxGeometry(0.38, 0.82, 0.38), pants, 0, -0.41, 0);
    add(hipR, new THREE.BoxGeometry(0.38, 0.82, 0.38), pants, 0, -0.41, 0);
    const torso = add(group, new THREE.BoxGeometry(0.8, 0.74, 0.42), shirt, 0, 1.19, 0);
    if (options.vest) {
      add(group, new THREE.BoxGeometry(0.84, 0.6, 0.46), mat(0xff7a1a), 0, 1.2, 0);
    }
    const shL = pivot(-0.55, 1.5, 0);
    const shR = pivot(0.55, 1.5, 0);
    add(shL, new THREE.BoxGeometry(0.3, 0.72, 0.36), shirt, 0, -0.32, 0);
    add(shR, new THREE.BoxGeometry(0.3, 0.72, 0.36), shirt, 0, -0.32, 0);
    add(shL, new THREE.BoxGeometry(0.28, 0.16, 0.32), skin, 0, -0.74, 0);
    add(shR, new THREE.BoxGeometry(0.28, 0.16, 0.32), skin, 0, -0.74, 0);
    const neck = pivot(0, 1.56, 0);
    add(neck, new THREE.CylinderGeometry(0.27, 0.27, 0.46, 18), skin, 0, 0.25, 0);
    const face = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.42), new THREE.MeshBasicMaterial({ map: faceTexture(options.face || "smile"), transparent: true }));
    face.position.set(0, 0.25, 0.272);
    neck.add(face);
    add(neck, new THREE.BoxGeometry(0.58, 0.16, 0.58), mat(look.hair), 0, 0.54, -0.02);
    add(neck, new THREE.BoxGeometry(0.58, 0.3, 0.16), mat(look.hair), 0, 0.4, -0.22);
    if (options.cap) {
      add(neck, new THREE.CylinderGeometry(0.29, 0.29, 0.16, 18), mat(0xff7a1a), 0, 0.56, 0);
      add(neck, new THREE.BoxGeometry(0.4, 0.04, 0.26), mat(0xff7a1a), 0, 0.5, 0.32);
    }
    let gun = null;
    if (options.gun) {
      gun = buildPistol(0.75);
      gun.position.set(0, -0.82, 0.12);
      gun.rotation.x = -Math.PI / 2;
      shR.add(gun);
    }
    const parts = { hipL, hipR, shL, shR, neck, torso, face };
    let phase = 0;
    const human = {
      group, parts, gun,
      setFace(mood) { face.material.map = faceTexture(mood); face.material.needsUpdate = true; },
      animate(dt, mode, speed = 0) {
        phase += dt * (2 + speed * 3);
        const swing = mode === "walk" ? Math.sin(phase) * Math.min(1, speed / 2.5) * 0.7 : 0;
        hipL.rotation.x = swing;
        hipR.rotation.x = -swing;
        shL.rotation.x = -swing * 0.8;
        shR.rotation.x = mode === "aim" ? -1.5 : swing * 0.8;
        shR.rotation.z = 0;
        group.position.y = 0;
        group.rotation.x = 0;
        group.rotation.z = 0;
        hipL.rotation.z = 0;
        hipR.rotation.z = 0;
        shL.rotation.z = 0;
        neck.rotation.set(0, 0, 0);
        if (mode === "sit") {
          hipL.rotation.x = -1.45;
          hipR.rotation.x = -1.45;
          shL.rotation.z = -0.5 - Math.sin(phase * 2) * 0.1;
          shR.rotation.z = 0.5 + Math.sin(phase * 2) * 0.1;
          shL.rotation.x = 0;
          shR.rotation.x = 0;
          neck.rotation.z = Math.sin(phase * 1.4) * 0.25;
          group.position.y = -0.72;
        } else if (mode === "dizzy") {
          // стоит и шатается, руки в стороны, голова кружится
          group.rotation.z = Math.sin(phase * 1.6) * 0.12;
          group.rotation.x = Math.cos(phase * 1.3) * 0.06;
          shL.rotation.z = -0.7 + Math.sin(phase * 2.2) * 0.25;
          shR.rotation.z = 0.7 - Math.sin(phase * 2.2) * 0.25;
          neck.rotation.z = Math.sin(phase * 1.8) * 0.3;
          neck.rotation.y = Math.sin(phase * 0.9) * 0.4;
          hipL.rotation.z = Math.sin(phase * 1.6) * 0.08;
          hipR.rotation.z = -Math.sin(phase * 1.6) * 0.08;
        } else if (mode === "cheer") {
          shL.rotation.z = -2.6 + Math.sin(phase * 4) * 0.2;
          shR.rotation.z = 2.6 - Math.sin(phase * 4) * 0.2;
          group.position.y = Math.abs(Math.sin(phase * 3)) * 0.25;
        }
      }
    };
    return human;
  }

  // мультяшный пистолет
  function buildPistol(scale = 1) {
    const parts = [
      { geo: new THREE.BoxGeometry(0.07, 0.1, 0.3), matrix: U.m4(0, 0.03, 0), color: 0x3a3f47 },
      { geo: new THREE.BoxGeometry(0.075, 0.05, 0.31), matrix: U.m4(0, 0.1, 0), color: 0x5a6068 },
      { geo: new THREE.CylinderGeometry(0.022, 0.022, 0.08, 8), matrix: U.m4(0, 0.06, 0.18, Math.PI / 2), color: 0x2a2d31 },
      { geo: new THREE.BoxGeometry(0.065, 0.18, 0.09), matrix: U.m4(0, -0.09, -0.08, -0.25), color: 0x6b4a34 },
      { geo: new THREE.BoxGeometry(0.015, 0.03, 0.02), matrix: U.m4(0, 0.135, 0.13), color: 0xff7a1a },
      { geo: new THREE.BoxGeometry(0.03, 0.04, 0.06), matrix: U.m4(0, -0.03, 0.03), color: 0x2a2d31 }
    ];
    const mesh = new THREE.Mesh(U.merge(parts), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5, metalness: 0.3 }));
    mesh.scale.setScalar(scale);
    const g = new THREE.Group();
    g.add(mesh);
    return g;
  }

  function nameTag(text, color = "#ffffff") {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 64;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "rgba(20,24,30,0.72)";
    const w = Math.min(240, 40 + text.length * 22);
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect((256 - w) / 2, 8, w, 48, 18) : ctx.rect((256 - w) / 2, 8, w, 48);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.font = "bold 30px Segoe UI, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 128, 33);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), depthTest: false, transparent: true }));
    sprite.scale.set(1.8, 0.45, 1);
    sprite.renderOrder = 20;
    return sprite;
  }

  // облачко «пуф!» и звёздочки над головой у пойманного
  const effects = [];
  const puffTex = U.canvasTexture(64, (ctx) => {
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,0.95)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
  });
  puffTex.wrapS = puffTex.wrapT = THREE.ClampToEdgeWrapping;
  function puff(scene, x, y, z, color = 0xffffff, count = 18) {
    for (let i = 0; i < count; i += 1) {
      const tint = Array.isArray(color) ? color[Math.floor(Math.random() * color.length)] : color;
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: puffTex, color: tint, transparent: true, depthWrite: false }));
      s.position.set(x, y, z);
      scene.add(s);
      const a = Math.random() * Math.PI * 2;
      const up = Math.random();
      effects.push({ sprite: s, vx: Math.cos(a) * (1 + Math.random() * 2), vy: 0.8 + up * 2.2, vz: Math.sin(a) * (1 + Math.random() * 2), t: 0, life: 0.7 + Math.random() * 0.5, size: 0.5 + Math.random() * 0.6 });
    }
  }
  function stars(parent) {
    const g = new THREE.Group();
    const m = new THREE.MeshBasicMaterial({ color: 0xffd23f });
    for (let i = 0; i < 4; i += 1) {
      const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.09, 0), m);
      star.position.set(Math.cos(i * 1.57) * 0.45, 0, Math.sin(i * 1.57) * 0.45);
      g.add(star);
    }
    g.position.y = 2.15;
    parent.add(g);
    effects.push({ spin: g, t: 0, life: 1e9 });
    return g;
  }
  function updateEffects(dt, scene) {
    for (let i = effects.length - 1; i >= 0; i -= 1) {
      const e = effects[i];
      e.t += dt;
      if (e.spin) {
        e.spin.rotation.y += dt * 3;
        continue;
      }
      const k = e.t / e.life;
      e.sprite.position.x += e.vx * dt;
      e.sprite.position.y += e.vy * dt;
      e.sprite.position.z += e.vz * dt;
      e.vx *= 0.92;
      e.vz *= 0.92;
      const s = e.size * (1 + k * 1.6);
      e.sprite.scale.set(s, s, s);
      e.sprite.material.opacity = 1 - k;
      if (k >= 1) {
        scene.remove(e.sprite);
        e.sprite.material.dispose();
        effects.splice(i, 1);
      }
    }
  }
  function clearEffects(scene) {
    effects.forEach((e) => { if (e.sprite) scene.remove(e.sprite); });
    effects.length = 0;
  }

  // шляпа из магазина: кепка охотника, ковбойская шляпа или корона
  function addHat(human, kind) {
    const neck = human.parts.neck;
    if (human.hat) {
      neck.remove(human.hat);
      human.hat = null;
      if (human.headTop) (human.avatar.parts.hatHiddenHair || []).forEach((m) => { m.visible = true; });
    }
    if (!kind) return;
    const g = new THREE.Group();
    const m = (c, metal = 0) => new THREE.MeshStandardMaterial({ color: c, roughness: metal ? 0.3 : 0.7, metalness: metal });
    const add = (geo, mat, x, y, z) => {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      g.add(mesh);
    };
    if (kind === "cap") {
      add(new THREE.CylinderGeometry(0.29, 0.29, 0.16, 18), m(0xff7a1a), 0, 0.56, 0);
      add(new THREE.BoxGeometry(0.4, 0.04, 0.26), m(0xff7a1a), 0, 0.5, 0.32);
    } else if (kind === "cowboy") {
      add(new THREE.CylinderGeometry(0.55, 0.55, 0.04, 22), m(0x8a5a36), 0, 0.53, 0);
      add(new THREE.CylinderGeometry(0.25, 0.29, 0.34, 18), m(0x8a5a36), 0, 0.72, 0);
      add(new THREE.CylinderGeometry(0.295, 0.295, 0.07, 18), m(0x3a2a1e), 0, 0.6, 0);
    } else if (kind === "crown") {
      add(new THREE.CylinderGeometry(0.27, 0.27, 0.2, 18, 1, true), m(0xffd23f, 0.7), 0, 0.66, 0);
      for (let i = 0; i < 6; i += 1) {
        const a = (i / 6) * Math.PI * 2;
        add(new THREE.ConeGeometry(0.06, 0.18, 6), m(0xffd23f, 0.7), Math.cos(a) * 0.26, 0.85, Math.sin(a) * 0.26);
        add(new THREE.SphereGeometry(0.035, 8, 6), m([0xd94f4f, 0x35a0ff, 0x7ae582][i % 3], 0.2), Math.cos(a) * 0.275, 0.66, Math.sin(a) * 0.275);
      }
    }
    neck.add(g);
    human.hat = g;
    if (human.headTop) {
      // у аватара из города точка — макушка; шляпы рассчитаны на голову-кубик: подгоняем размер и высоту в мировых единицах
      const s = human.avatar.headRadius / 0.27;
      human.group.updateMatrixWorld(true);
      const ws = new THREE.Vector3();
      neck.getWorldScale(ws);
      const gs = new THREE.Vector3();
      human.group.getWorldScale(gs);
      g.scale.set((s * gs.x) / ws.x, (s * gs.y) / ws.y, (s * gs.z) / ws.z);
      const top = new THREE.Vector3();
      neck.getWorldPosition(top);
      top.y -= 0.5 * s * gs.y;
      g.position.copy(neck.worldToLocal(top));
      (human.avatar.parts.hatHiddenHair || []).forEach((m) => { m.visible = false; });
    }
  }

  // с общим аватаром: твой образ из Block City и прохожие из города с русскими именами
  const NAMES = ["Миша", "Катя", "Тёма", "Лиза", "Даня"];
  const lookApi = A ? {
    readPlayerLook: () => A.readPlayerLook(),
    BOT_LOOKS: A.NPC_LOOKS.slice(0, 5).map((l, i) => Object.assign({}, l, { name: NAMES[i] }))
  } : { readPlayerLook, BOT_LOOKS };
  window.HidePeople = { readPlayerLook: lookApi.readPlayerLook, BOT_LOOKS: lookApi.BOT_LOOKS, buildHuman, buildPistol, nameTag, puff, stars, updateEffects, clearEffects, addHat };
})();
