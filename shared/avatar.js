// Общий аватар платформы Bloblox: тот же блочный человечек, что и в Block City (game.js),
// но в отдельном файле без зависимостей от DOM города. Нужен глобальный THREE (r128).
// Наружу отдаётся только window.BlobloxAvatar.
(function () {
  "use strict";
  if (typeof THREE === "undefined") {
    console.warn("BlobloxAvatar: THREE не загружен");
    return;
  }

  // ---------- Константы (как в game.js) ----------
  const AVATAR_STORAGE_KEY = "blobloxAvatarSettings";
  const SKIN_TONES = {
    porcelain: "#f6dcc6",
    light: "#f0c8a4",
    fair: "#e0aa82",
    tan: "#c68b5e",
    brown: "#97613d",
    deep: "#5c3a25"
  };
  const PANTS_COLORS = {
    jeans: "#3d5f8f",
    joggers: "#6b7280",
    shorts: "#c2a878",
    trousers: "#262a33",
    cargo: "#5b6b45"
  };
  const TOP_STYLES = {
    tshirt: { torso: "body", upper: "body", fore: "skin", cuff: false },
    hoodie: { torso: "body", upper: "body", fore: "body", cuff: true },
    jacket: { torso: "accent", upper: "accent", fore: "accent", cuff: true },
    sweater: { torso: "body", upper: "body", fore: "body", cuff: true },
    shirt: { torso: "body", upper: "body", fore: "body", cuff: false },
    tank: { torso: "body", upper: "skin", fore: "skin", cuff: false, bareShoulders: true },
    suit: { torso: "body", upper: "body", fore: "body", cuff: false }
  };
  const SHOE_STYLES = {
    sneakers: { color: "#f3f4f6", sole: "#ffffff", stripe: true, boot: false, slim: false },
    hightops: { color: "#e04848", sole: "#ffffff", stripe: true, boot: true, slim: false },
    boots: { color: "#6b4426", sole: "#2a1e16", stripe: false, boot: true, slim: false },
    light: { color: "#1f2228", sole: "#3a3d44", stripe: false, boot: false, slim: true }
  };
  const HAT_ACCESSORIES = ["cap", "beanie", "crown"];
  const AVATAR_BODY_TYPES = {
    man: { width: 1, height: 1, depth: 1, shoulder: 1.48, hip: 0.5, arm: 1, leg: 1, size: 1, head: 1 },
    girl: { width: 0.86, height: 0.97, depth: 0.92, shoulder: 1.31, hip: 0.47, arm: 0.84, leg: 0.92, size: 0.95, head: 1.03 },
    boy: { width: 0.94, height: 0.84, depth: 0.94, shoulder: 1.4, hip: 0.48, arm: 0.92, leg: 0.95, size: 0.8, head: 1.16 }
  };
  const AVATAR_HIP_HEIGHT = 5.78;
  const LEG_THIGH = 2.5;
  const LEG_SHIN = 2.35;
  const AVATAR_ANKLE_HEIGHT = 0.68;
  const HEAD_TOP = 2.57; // верх головы в координатах группы head
  const HEAD_RADIUS = 1.22;
  // рост «парня» в единицах аватара: бёдра + позвоночник + шея/голова
  const bodyTopUnits = (body) => AVATAR_HIP_HEIGHT + 0.55 + 2.92 * body.height + HEAD_TOP * 0.78 * body.head;
  const MAN_TOP = bodyTopUnits(AVATAR_BODY_TYPES.man);

  const OPTIONS = {
    bodyType: ["man", "girl", "boy"],
    skinTone: ["fair", "porcelain", "light", "tan", "brown", "deep"],
    outfitType: ["hoodie", "tshirt", "jacket", "sweater", "shirt", "tank", "suit"],
    pantsType: ["jeans", "joggers", "shorts", "trousers", "cargo"],
    shoesType: ["sneakers", "hightops", "boots", "light"],
    hairStyle: ["short", "long", "bob", "ponytail", "bun", "curly", "spiky", "mohawk", "buzz", "bald"],
    headAccessory: ["none", "cap", "beanie", "headphones", "glasses", "sunglasses", "crown", "backpack"],
    faceMood: ["smile", "happy", "wink", "cool", "freckles", "neutral", "surprised", "angry", "sleepy"]
  };
  const DEFAULT_COLORS = { bodyColor: "#5dd9ff", hairColor: "#2f3542", accentColor: "#ffd166", eyeColor: "#2b2d42" };

  // Прохожие: первые 5 — те же, что в городе; остальные добавлены для толпы
  const NPC_LOOKS = [
    { body: "#ff9f68", accent: "#2b2d42", hair: "#352f36", eyes: "#3d6b3a", skin: "light", outfit: "hoodie", pants: "jeans", shoes: "sneakers", hairStyle: "short", accessory: "headphones", face: "smile", bodyType: "man" },
    { body: "#72ddf7", accent: "#f5f5f5", hair: "#c9a46a", eyes: "#3a6ea5", skin: "porcelain", outfit: "tshirt", pants: "shorts", shoes: "hightops", hairStyle: "ponytail", accessory: "none", face: "happy", bodyType: "girl" },
    { body: "#ff70a6", accent: "#ffd6a5", hair: "#42312b", eyes: "#5a3b24", skin: "brown", outfit: "sweater", pants: "trousers", shoes: "boots", hairStyle: "curly", accessory: "none", face: "freckles", bodyType: "girl" },
    { body: "#3a4a63", accent: "#d1233c", hair: "#1d1f24", eyes: "#2b2d42", skin: "tan", outfit: "suit", pants: "trousers", shoes: "light", hairStyle: "buzz", accessory: "sunglasses", face: "cool", bodyType: "man" },
    { body: "#7ae582", accent: "#2f6b45", hair: "#8a3b1e", eyes: "#4b7f52", skin: "deep", outfit: "jacket", pants: "cargo", shoes: "sneakers", hairStyle: "bun", accessory: "backpack", face: "neutral", bodyType: "boy" },
    { body: "#ffd166", accent: "#ef476f", hair: "#e3c16f", eyes: "#3a6ea5", skin: "fair", outfit: "tank", pants: "joggers", shoes: "sneakers", hairStyle: "bob", accessory: "glasses", face: "wink", bodyType: "girl" },
    { body: "#9b5de5", accent: "#00f5d4", hair: "#2b2d42", eyes: "#2b2d42", skin: "tan", outfit: "shirt", pants: "jeans", shoes: "hightops", hairStyle: "spiky", accessory: "cap", face: "happy", bodyType: "boy" },
    { body: "#06d6a0", accent: "#073b4c", hair: "#e07a5f", eyes: "#4b7f52", skin: "porcelain", outfit: "hoodie", pants: "cargo", shoes: "boots", hairStyle: "mohawk", accessory: "none", face: "surprised", bodyType: "man" },
    { body: "#ef476f", accent: "#ffffff", hair: "#1d1f24", eyes: "#5a3b24", skin: "brown", outfit: "sweater", pants: "trousers", shoes: "light", hairStyle: "long", accessory: "beanie", face: "smile", bodyType: "girl" }
  ];

  // ---------- Общие геометрии, текстуры и материалы ----------
  const avatarGeo = {};
  const geoCache = {};
  // Одинаковые детали у всех человечков берутся из кэша, а не создаются заново
  function G(type, ...args) {
    const key = `${type}:${args.join(",")}`;
    if (!geoCache[key]) geoCache[key] = new THREE[`${type}Geometry`](...args);
    return geoCache[key];
  }
  const EMPTY_GEOMETRY = new THREE.BufferGeometry();

  // Кубик со скруглёнными краями: из таких деталей собраны человечки, как в Roblox
  function rbBoxGeometry(width, height, depth, radius = 0.12) {
    const key = `box:${width}:${height}:${depth}:${radius}`;
    if (avatarGeo[key]) {
      return avatarGeo[key];
    }
    const r = Math.min(radius, width / 2 - 0.01, height / 2 - 0.01, depth / 2 - 0.01);
    const shape = new THREE.Shape();
    const w = width / 2 - r;
    shape.moveTo(-w, -height / 2 + r * 0.2);
    shape.lineTo(w, -height / 2 + r * 0.2);
    shape.lineTo(w, height / 2 - r * 0.2);
    shape.lineTo(-w, height / 2 - r * 0.2);
    shape.lineTo(-w, -height / 2 + r * 0.2);
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: Math.max(0.01, depth - r * 2), bevelEnabled: true, bevelThickness: r, bevelSize: r * 0.8, bevelSegments: 3, curveSegments: 4
    });
    geometry.translate(0, 0, -(depth - r * 2) / 2);
    geometry.computeVertexNormals();
    avatarGeo[key] = geometry;
    return geometry;
  }

  // Голова — скруглённый цилиндр, как у человечков Roblox
  function rbHeadGeometry() {
    if (avatarGeo.rbHead) {
      return avatarGeo.rbHead;
    }
    const points = [new THREE.Vector2(0.001, 0.33)];
    for (let i = 0; i <= 6; i += 1) {
      const angle = -Math.PI / 2 + (i / 6) * (Math.PI / 2);
      points.push(new THREE.Vector2(0.9 + Math.cos(angle) * 0.32, 0.65 + Math.sin(angle) * 0.32));
    }
    for (let i = 0; i <= 6; i += 1) {
      const angle = (i / 6) * (Math.PI / 2);
      points.push(new THREE.Vector2(0.9 + Math.cos(angle) * 0.32, 2.25 + Math.sin(angle) * 0.32));
    }
    points.push(new THREE.Vector2(0.001, 2.57));
    avatarGeo.rbHead = new THREE.LatheGeometry(points, 36);
    return avatarGeo.rbHead;
  }

  function faceSurfaceZ(x) {
    return Math.sqrt(Math.max(0, 1.22 * 1.22 - x * x));
  }

  // Лицо-наклейка, как в Roblox: глаза-точки и рот рисуются на картинке
  function getFaceTexture(faceId, blink) {
    const key = `${faceId}:${blink ? 1 : 0}`;
    avatarGeo.faces = avatarGeo.faces || {};
    if (avatarGeo.faces[key]) {
      return avatarGeo.faces[key];
    }
    const image = document.createElement("canvas");
    image.width = 256;
    image.height = 184;
    const g = image.getContext("2d");
    g.lineCap = "round";
    g.lineJoin = "round";
    g.fillStyle = "#16161a";
    g.strokeStyle = "#16161a";
    const eye = (x, y, scale = 1) => {
      if (blink) {
        g.lineWidth = 6;
        g.beginPath();
        g.moveTo(x - 11, y + 2);
        g.lineTo(x + 11, y + 2);
        g.stroke();
        return;
      }
      g.fillStyle = "#16161a";
      g.beginPath();
      g.ellipse(x, y, 10 * scale, 16 * scale, 0, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "#ffffff";
      g.beginPath();
      g.arc(x + 3 * scale, y - 6 * scale, 3.6 * scale, 0, Math.PI * 2);
      g.fill();
    };
    const closedEye = (x, y) => {
      g.lineWidth = 6;
      g.beginPath();
      g.arc(x, y - 4, 11, 0.15 * Math.PI, 0.85 * Math.PI);
      g.stroke();
    };
    const mouthArc = (y, radius, from, to, width = 7) => {
      g.lineWidth = width;
      g.beginPath();
      g.arc(128, y, radius, from, to);
      g.stroke();
    };
    const blush = () => {
      g.fillStyle = "rgba(255,120,140,0.35)";
      [72, 184].forEach((x) => {
        g.beginPath();
        g.ellipse(x, 104, 17, 9, 0, 0, Math.PI * 2);
        g.fill();
      });
    };
    // глаз-спираль для оглушённого лица
    const spiralEye = (x, y, turn) => {
      g.lineWidth = 4.5;
      g.beginPath();
      for (let i = 0; i <= 60; i += 1) {
        const a = (i / 60) * Math.PI * 5 * turn;
        const r = 1 + (i / 60) * 19;
        const px = x + Math.cos(a) * r;
        const py = y + Math.sin(a) * r * 1.15;
        if (i === 0) g.moveTo(px, py);
        else g.lineTo(px, py);
      }
      g.stroke();
    };
    const left = 98;
    const right = 158;
    const eyeY = 70;
    if (faceId === "happy") {
      eye(left, eyeY);
      eye(right, eyeY);
      blush();
      g.fillStyle = "#16161a";
      g.beginPath();
      g.moveTo(98, 108);
      g.quadraticCurveTo(128, 104, 158, 108);
      g.quadraticCurveTo(156, 150, 128, 150);
      g.quadraticCurveTo(100, 150, 98, 108);
      g.fill();
      g.fillStyle = "#ffffff";
      g.fillRect(106, 109, 44, 8);
    } else if (faceId === "wink") {
      eye(left, eyeY);
      closedEye(right, eyeY + 4);
      mouthArc(96, 30, 0.2 * Math.PI, 0.75 * Math.PI);
    } else if (faceId === "cool") {
      [left, right].forEach((x) => {
        eye(x, eyeY + 3, 0.9);
        g.fillStyle = "#f6d7b8";
        g.fillRect(x - 13, eyeY - 18, 26, 13);
        g.lineWidth = 5;
        g.beginPath();
        g.moveTo(x - 13, eyeY - 5);
        g.lineTo(x + 13, eyeY - 5);
        g.stroke();
      });
      g.lineWidth = 7;
      g.beginPath();
      g.moveTo(108, 126);
      g.quadraticCurveTo(136, 132, 154, 114);
      g.stroke();
    } else if (faceId === "freckles") {
      eye(left, eyeY);
      eye(right, eyeY);
      blush();
      g.fillStyle = "#9a5a3a";
      [[66, 96], [76, 104], [86, 96], [170, 96], [180, 104], [190, 96]].forEach(([x, y]) => {
        g.beginPath();
        g.arc(x, y, 2.6, 0, Math.PI * 2);
        g.fill();
      });
      g.strokeStyle = "#16161a";
      mouthArc(98, 30, 0.18 * Math.PI, 0.82 * Math.PI);
    } else if (faceId === "neutral") {
      eye(left, eyeY);
      eye(right, eyeY);
      g.lineWidth = 7;
      g.beginPath();
      g.moveTo(110, 124);
      g.lineTo(146, 124);
      g.stroke();
    } else if (faceId === "surprised") {
      eye(left, eyeY - 2, 1.18);
      eye(right, eyeY - 2, 1.18);
      g.fillStyle = "#16161a";
      g.beginPath();
      g.ellipse(128, 128, 13, 17, 0, 0, Math.PI * 2);
      g.fill();
    } else if (faceId === "angry") {
      eye(left, eyeY + 4);
      eye(right, eyeY + 4);
      g.lineWidth = 7;
      g.beginPath();
      g.moveTo(80, 42);
      g.lineTo(112, 56);
      g.moveTo(176, 42);
      g.lineTo(144, 56);
      g.stroke();
      mouthArc(150, 26, 1.2 * Math.PI, 1.8 * Math.PI);
    } else if (faceId === "sleepy") {
      closedEye(left, eyeY + 4);
      closedEye(right, eyeY + 4);
      g.beginPath();
      g.ellipse(128, 128, 9, 7, 0, 0, Math.PI * 2);
      g.fill();
    } else if (faceId === "dizzy") {
      // новое лицо: глаза-спирали и волнистый рот
      spiralEye(left, eyeY, 1);
      spiralEye(right, eyeY, -1);
      g.lineWidth = 6;
      g.beginPath();
      for (let i = 0; i <= 24; i += 1) {
        const x = 104 + i * 2;
        const y = 128 + Math.sin(i * 0.8) * 5;
        if (i === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.stroke();
    } else {
      eye(left, eyeY);
      eye(right, eyeY);
      mouthArc(96, 32, 0.18 * Math.PI, 0.82 * Math.PI);
    }
    const texture = new THREE.CanvasTexture(image);
    texture.anisotropy = 4;
    avatarGeo.faces[key] = texture;
    return texture;
  }

  // Материал лица общий для всех, у кого сейчас та же картинка (моргание = смена материала)
  const faceMaterials = {};
  function getFaceMaterial(faceId, blink) {
    const key = `${faceId}:${blink ? 1 : 0}`;
    if (!faceMaterials[key]) {
      faceMaterials[key] = new THREE.MeshStandardMaterial({
        map: getFaceTexture(faceId, blink), transparent: true, depthWrite: false, roughness: 0.8,
        polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2
      });
    }
    return faceMaterials[key];
  }

  const NO_BLINK_FACES = { sleepy: true, dizzy: true };
  function setAvatarFace(P, blink) {
    const id = P.faceId || "smile";
    const material = getFaceMaterial(id, blink && !NO_BLINK_FACES[id]);
    if (P.faceDecal.material !== material) {
      P.faceDecal.material = material;
      P.faceMaterial = material;
    }
  }

  // Ткань и волосы: мелкий рельеф вместо гладкого пластика (как в городе)
  let bumpMaps = null;
  function getBumpMaps() {
    if (bumpMaps) return bumpMaps;
    const makeBump = (draw) => {
      const image = document.createElement("canvas");
      image.width = 256;
      image.height = 256;
      const context = image.getContext("2d");
      context.fillStyle = "#808080";
      context.fillRect(0, 0, 256, 256);
      draw(context);
      const texture = new THREE.CanvasTexture(image);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      return texture;
    };
    const cloth = makeBump((context) => {
      for (let i = 0; i < 2600; i += 1) {
        const value = 96 + Math.floor(Math.random() * 64);
        context.fillStyle = `rgb(${value},${value},${value})`;
        context.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
      }
      context.lineCap = "round";
      for (let i = 0; i < 26; i += 1) {
        const dark = Math.random() < 0.5;
        context.strokeStyle = dark ? "rgba(40,40,40,0.2)" : "rgba(210,210,210,0.2)";
        context.lineWidth = 5 + Math.random() * 12;
        const x = Math.random() * 256;
        const y = Math.random() * 256;
        context.beginPath();
        context.moveTo(x, y);
        context.quadraticCurveTo(x + 40 - Math.random() * 80, y + 40, x + 60 - Math.random() * 120, y + 90);
        context.stroke();
      }
    });
    const strands = makeBump((context) => {
      for (let i = 0; i < 900; i += 1) {
        const value = 50 + Math.floor(Math.random() * 150);
        context.strokeStyle = `rgba(${value},${value},${value},0.5)`;
        context.lineWidth = 1 + Math.random() * 1.5;
        const x = Math.random() * 256;
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x + 18 - Math.random() * 36, 256);
        context.stroke();
      }
    });
    bumpMaps = { cloth, strands };
    return bumpMaps;
  }

  // Материалы с одинаковым цветом делятся между человечками; считаем, кто ими пользуется
  const materialCache = {};
  const MATERIAL_RECIPES = {
    body: (c) => ({ color: c, roughness: 0.88, bumpMap: getBumpMaps().cloth, bumpScale: 0.012 }),
    accent: (c) => ({ color: c, roughness: 0.88, bumpMap: getBumpMaps().cloth, bumpScale: 0.012 }),
    pants: (c) => ({ color: c, roughness: 0.88, bumpMap: getBumpMaps().cloth, bumpScale: 0.012 }),
    skin: (c) => ({ color: c, roughness: 0.5 }),
    hair: (c) => ({ color: c, roughness: 0.42, side: THREE.DoubleSide, bumpMap: getBumpMaps().strands, bumpScale: 0.08 }),
    shoes: (c) => ({ color: c, roughness: 0.6 }),
    sole: (c) => ({ color: c, roughness: 0.8 }),
    belt: () => ({ color: "#23262d", roughness: 0.6 }),
    gold: () => ({ color: "#f5c542", roughness: 0.3, metalness: 0.6 }),
    ruby: () => ({ color: "#d1233c", roughness: 0.2, metalness: 0.3 }),
    white: () => ({ color: "#fbfbf8", roughness: 0.18 }),
    dark: () => ({ color: "#14161a", roughness: 0.3 }),
    lens: () => ({ color: "#101318", roughness: 0.05, metalness: 0.7 })
  };
  function acquireMaterial(role, color) {
    const key = `${role}|${color ? new THREE.Color(color).getHexString() : ""}`;
    let entry = materialCache[key];
    if (!entry) {
      entry = { material: new THREE.MeshStandardMaterial(MATERIAL_RECIPES[role](color)), refs: 0 };
      materialCache[key] = entry;
    }
    entry.refs += 1;
    return { key, material: entry.material };
  }
  function releaseMaterial(key) {
    const entry = materialCache[key];
    if (!entry) return;
    entry.refs -= 1;
    if (entry.refs <= 0) {
      entry.material.dispose();
      delete materialCache[key];
    }
  }

  function createLookMaterials(look) {
    const shoeStyle = SHOE_STYLES[look.shoes] || SHOE_STYLES.sneakers;
    const colors = {
      body: look.body,
      accent: look.accent,
      hair: look.hair,
      skin: SKIN_TONES[look.skin] || SKIN_TONES.fair,
      pants: PANTS_COLORS[look.pants] || PANTS_COLORS.jeans,
      shoes: shoeStyle.color,
      sole: shoeStyle.sole
    };
    const materials = {};
    const keys = [];
    Object.keys(MATERIAL_RECIPES).forEach((role) => {
      const { key, material } = acquireMaterial(role, colors[role]);
      materials[role] = material;
      keys.push(key);
    });
    materials.brow = materials.hair;
    return { materials, keys };
  }

  // ---------- Сборка (копия buildPlayerAvatar из game.js) ----------
  function makeAvatarPart(geometry, material, parent, x = 0, y = 0, z = 0, castShadow = true) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = castShadow;
    parent.add(mesh);
    return mesh;
  }

  function buildPlayerAvatar(targetGroup, targetParts, scale, materials) {
    const m = materials;
    const P = targetParts;
    P.materials = m;
    P.root = targetGroup;
    P.baseScale = scale;
    P.tops = {};
    P.hairStyles = {};
    P.accessories = {};
    P.hatHiddenHair = [];

    // ---- Бёдра (корень скелета) ----
    const hips = new THREE.Group();
    hips.position.y = AVATAR_HIP_HEIGHT;
    targetGroup.add(hips);
    P.hips = hips;
    P.pelvis = makeAvatarPart(rbBoxGeometry(2.0, 1.05, 1.05, 0.16), m.pants, hips, 0, 0.02, 0);
    const belt = makeAvatarPart(rbBoxGeometry(2.04, 0.18, 1.09, 0.05), m.belt, hips, 0, 0.47, 0, false);
    const buckle = makeAvatarPart(G("Box", 0.28, 0.16, 0.05), m.gold, hips, 0, 0.47, 0.56, false);
    P.belt = belt;
    P.buckle = buckle;

    // ---- Ноги: бедро -> колено -> голеностоп ----
    function createLeg(side) {
      const thigh = new THREE.Group();
      thigh.position.set(side * 0.5, -0.25, 0);
      hips.add(thigh);
      const upper = makeAvatarPart(rbBoxGeometry(0.96, 1.3, 1.0, 0.14), m.pants, thigh, 0, -0.55, 0);
      const lower = makeAvatarPart(rbBoxGeometry(0.94, 1.3, 0.98, 0.14), m.pants, thigh, 0, -1.78, 0);
      const pocket = makeAvatarPart(G("Box", 0.08, 0.6, 0.5), m.pants, thigh, side * 0.5, -1.1, 0.02, false);
      const knee = new THREE.Group();
      knee.position.y = -LEG_THIGH;
      thigh.add(knee);
      const kneeCap = makeAvatarPart(G("Sphere", 0.46, 14, 10), m.pants, knee, 0, 0, 0);
      const shin = makeAvatarPart(rbBoxGeometry(0.92, LEG_SHIN - 0.15, 0.96, 0.14), m.pants, knee, 0, -(LEG_SHIN - 0.15) / 2, 0);
      const legCuff = makeAvatarPart(rbBoxGeometry(0.98, 0.22, 1.02, 0.06), m.belt, knee, 0, -LEG_SHIN + 0.28, 0, false);
      const ankle = new THREE.Group();
      ankle.position.y = -LEG_SHIN;
      knee.add(ankle);
      const shoe = makeAvatarPart(rbBoxGeometry(1.0, 0.55, 1.42, 0.16), m.shoes, ankle, 0, -0.38, 0.2);
      const toe = new THREE.Object3D();
      const sole = makeAvatarPart(rbBoxGeometry(1.04, 0.14, 1.48, 0.05), m.sole, ankle, 0, -0.66, 0.2);
      const stripe = makeAvatarPart(G("Box", 0.04, 0.12, 0.7), m.accent, ankle, side * 0.51, -0.4, 0.2, false);
      const bootTop = makeAvatarPart(rbBoxGeometry(1.0, 0.72, 1.04, 0.12), m.shoes, ankle, 0, 0.12, 0);
      return { thigh, knee, ankle, upper, lower, pocket, kneeCap, shin, legCuff, shoe, toe, sole, stripe, bootTop };
    }
    P.legL = createLeg(-1);
    P.legR = createLeg(1);

    // ---- Туловище ----
    const spine = new THREE.Group();
    spine.position.y = 0.55;
    hips.add(spine);
    P.spine = spine;
    const torso = makeAvatarPart(rbBoxGeometry(2.0, 2.95, 1.05, 0.2), m.body, spine, 0, 1.42, 0);
    const chestTop = new THREE.Mesh(EMPTY_GEOMETRY, m.body);
    chestTop.visible = false;
    spine.add(chestTop);
    P.torso = torso;
    P.chestTop = chestTop;

    // ---- Одежда: детали поверх туловища ----
    const tops = {
      tshirt: new THREE.Group(), hoodie: new THREE.Group(), jacket: new THREE.Group(), sweater: new THREE.Group(),
      shirt: new THREE.Group(), tank: new THREE.Group(), suit: new THREE.Group()
    };
    Object.values(tops).forEach((group) => spine.add(group));
    P.tops = tops;
    const front = 0.54;
    const collar = (material, group) => makeAvatarPart(rbBoxGeometry(0.9, 0.16, 0.7, 0.05), material, group, 0, 2.86, 0, false);
    collar(m.accent, tops.tshirt);
    makeAvatarPart(G("Circle", 0.34, 24), m.accent, tops.tshirt, 0, 1.75, front + 0.01, false);
    makeAvatarPart(rbBoxGeometry(1.5, 0.46, 0.6, 0.15), m.body, tops.hoodie, 0, 2.86, -0.25);
    makeAvatarPart(rbBoxGeometry(1.2, 0.55, 0.06, 0.04), m.accent, tops.hoodie, 0, 0.62, front, false);
    [-0.2, 0.2].forEach((x) => makeAvatarPart(G("Cylinder", 0.03, 0.03, 0.7, 6), m.white, tops.hoodie, x, 2.35, front + 0.02, false));
    makeAvatarPart(G("Box", 0.6, 2.6, 0.04), m.white, tops.jacket, 0, 1.45, front + 0.005, false);
    makeAvatarPart(G("Box", 0.05, 2.7, 0.05), m.gold, tops.jacket, 0.33, 1.42, front + 0.02, false);
    [-1, 1].forEach((side) => {
      const lapel = makeAvatarPart(G("Box", 0.42, 0.55, 0.06), m.accent, tops.jacket, side * 0.42, 2.6, front + 0.02, false);
      lapel.rotation.z = side * 0.4;
    });
    [0.7, 1.6].forEach((y) => makeAvatarPart(rbBoxGeometry(2.04, 0.26, 1.09, 0.06), m.accent, tops.sweater, 0, y, 0, false));
    collar(m.accent, tops.sweater);
    [-1, 1].forEach((side) => {
      const shirtCollar = makeAvatarPart(G("Box", 0.42, 0.3, 0.06), m.white, tops.shirt, side * 0.26, 2.78, front + 0.02, false);
      shirtCollar.rotation.z = side * 0.55;
    });
    [0.5, 1.1, 1.7, 2.3].forEach((y) => makeAvatarPart(G("Sphere", 0.05, 8, 6), m.white, tops.shirt, 0, y, front + 0.02, false));
    makeAvatarPart(G("Box", 0.22, 1.5, 0.04), m.accent, tops.shirt, 0, 2.05, front + 0.03, false);
    [-0.62, 0.62].forEach((x) => makeAvatarPart(G("Box", 0.32, 0.34, 1.07), m.body, tops.tank, x, 2.78, 0, false));
    makeAvatarPart(G("Box", 0.66, 1.9, 0.04), m.white, tops.suit, 0, 1.95, front + 0.005, false);
    makeAvatarPart(G("Box", 0.2, 1.6, 0.04), m.accent, tops.suit, 0, 2.0, front + 0.025, false);
    [-1, 1].forEach((side) => {
      const lapel = makeAvatarPart(G("Box", 0.3, 1.5, 0.05), m.belt, tops.suit, side * 0.42, 2.1, front + 0.02, false);
      lapel.rotation.z = side * -0.22;
    });

    // ---- Руки: плечо -> локоть -> кисть ----
    function createArm(side) {
      const shoulder = new THREE.Group();
      shoulder.position.set(side * 1.48, 2.62, 0);
      spine.add(shoulder);
      const joint = makeAvatarPart(rbBoxGeometry(0.92, 0.5, 0.96, 0.18), m.body, shoulder, 0, -0.05, 0);
      const upper = makeAvatarPart(rbBoxGeometry(0.88, 1.35, 0.92, 0.14), m.body, shoulder, 0, -0.72, 0);
      const elbow = new THREE.Group();
      elbow.position.y = -1.45;
      shoulder.add(elbow);
      const elbowJoint = makeAvatarPart(G("Sphere", 0.43, 12, 10), m.body, elbow);
      const fore = makeAvatarPart(rbBoxGeometry(0.86, 1.2, 0.9, 0.14), m.body, elbow, 0, -0.62, 0);
      const cuff = makeAvatarPart(rbBoxGeometry(0.9, 0.18, 0.94, 0.05), m.accent, elbow, 0, -1.16, 0, false);
      const hand = new THREE.Group();
      hand.position.y = -1.3;
      elbow.add(hand);
      makeAvatarPart(rbBoxGeometry(0.82, 0.6, 0.86, 0.2), m.skin, hand, 0, -0.26, 0);
      return { shoulder, elbow, hand, joint, upper, elbowJoint, fore, cuff };
    }
    P.armL = createArm(-1);
    P.armR = createArm(1);
    P.leftArm = P.armL.shoulder;
    P.rightArm = P.armR.shoulder;

    // ---- Шея и голова ----
    P.neck = makeAvatarPart(G("Cylinder", 0.42, 0.46, 0.45, 16), m.skin, spine, 0, 3.02, 0);
    const head = new THREE.Group();
    head.position.y = 2.92;
    head.scale.setScalar(0.78);
    spine.add(head);
    P.head = head;
    P.faceMesh = makeAvatarPart(rbHeadGeometry(), m.skin, head, 0, 0, 0);
    P.faceMaterial = getFaceMaterial("smile", false);
    const decal = new THREE.Mesh(G("Cylinder", 1.226, 1.226, 1.5, 24, 1, true, -0.8, 1.6), P.faceMaterial);
    decal.position.y = 1.45;
    head.add(decal);
    P.faceDecal = decal;

    // ---- Причёски ----
    const hairStyles = {};
    const addHairStyle = (id) => {
      const group = new THREE.Group();
      head.add(group);
      hairStyles[id] = group;
      return group;
    };
    const hairCap = (group, radius = 1.34, theta = Math.PI * 0.5) => {
      const cap = makeAvatarPart(G("Sphere", radius, 28, 16, 0, Math.PI * 2, 0, theta), m.hair, group, 0, 1.62, -0.06);
      cap.scale.set(1, 0.86, 1.02);
      cap.rotation.x = -0.3;
      return cap;
    };
    const lock = (group, x, y, z, sx, sy, sz, rx = 0, rz = 0) => {
      const piece = makeAvatarPart(G("Sphere", 1, 14, 10), m.hair, group, x, y, z);
      piece.scale.set(sx, sy, sz);
      piece.rotation.set(rx, 0, rz);
      return piece;
    };
    const hideUnderHat = (mesh) => {
      P.hatHiddenHair.push(mesh);
      return mesh;
    };
    const short = addHairStyle("short");
    hairCap(short);
    lock(short, 0.3, 2.32, 0.92, 0.85, 0.24, 0.4, 0.5, -0.2);
    const long = addHairStyle("long");
    hairCap(long);
    lock(long, 0, 1.0, -0.8, 1.22, 1.35, 0.5, 0.05);
    [-1, 1].forEach((side) => lock(long, side * 1.08, 1.05, 0.05, 0.3, 1.2, 0.8));
    addHairStyle("buzz");
    hairCap(hairStyles.buzz, 1.28, Math.PI * 0.48);
    const ponytail = addHairStyle("ponytail");
    hairCap(ponytail);
    makeAvatarPart(G("Torus", 0.16, 0.06, 8, 14), m.accent, ponytail, 0, 1.85, -1.3, false);
    const tail = makeAvatarPart(G("Cylinder", 0.26, 0.08, 1.8, 12), m.hair, ponytail, 0, 1.0, -1.5);
    tail.rotation.x = -0.25;
    const curly = addHairStyle("curly");
    hairCap(curly);
    [[0, 2.7, 0.1], [-0.7, 2.55, 0.45], [0.7, 2.55, 0.45], [-1.05, 2.1, -0.1], [1.05, 2.1, -0.1], [-0.55, 2.6, -0.6], [0.55, 2.6, -0.6], [0, 2.3, -1.05], [-0.4, 2.5, 0.85], [0.4, 2.5, 0.85]]
      .forEach(([x, y, z]) => hideUnderHat(makeAvatarPart(G("Icosahedron", 0.48, 1), m.hair, curly, x, y, z)));
    const spiky = addHairStyle("spiky");
    hairCap(spiky);
    [[0, 2.8, 0.2, 0], [-0.6, 2.62, 0.3, 0.4], [0.6, 2.62, 0.3, -0.4], [-0.35, 2.7, -0.5, 0.25], [0.35, 2.7, -0.5, -0.25], [0, 2.45, -1.0, 0]].forEach(([x, y, z, rz]) => {
      const spike = hideUnderHat(makeAvatarPart(G("Cone", 0.28, 0.85, 6), m.hair, spiky, x, y, z));
      spike.rotation.set(z * 0.5, 0, rz);
    });
    const bun = addHairStyle("bun");
    hairCap(bun);
    hideUnderHat(makeAvatarPart(G("Sphere", 0.52, 16, 12), m.hair, bun, 0, 2.8, -0.5));
    const bob = addHairStyle("bob");
    hairCap(bob, 1.4);
    [-1, 1].forEach((side) => lock(bob, side * 1.12, 1.55, 0.0, 0.3, 0.85, 1.05));
    lock(bob, 0, 1.45, -0.9, 1.25, 0.95, 0.42);
    lock(bob, 0, 2.38, 0.9, 1.05, 0.24, 0.38, 0.45);
    const mohawk = addHairStyle("mohawk");
    hairCap(mohawk, 1.27, Math.PI * 0.4);
    [0.9, 0.35, -0.2, -0.75, -1.2].forEach((z, index) => {
      const fin = hideUnderHat(makeAvatarPart(G("Box", 0.24, 0.8 - index * 0.06, 0.55), m.hair, mohawk, 0, 2.85 - Math.abs(z) * 0.32, z));
      fin.rotation.x = z * 0.4;
    });
    P.hairStyles = hairStyles;

    // ---- Аксессуары ----
    const accessories = {};
    const addAccessory = (id, parent = head) => {
      const group = new THREE.Group();
      parent.add(group);
      accessories[id] = group;
      return group;
    };
    const cap = addAccessory("cap");
    const capDome = makeAvatarPart(G("Sphere", 1.32, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), m.accent, cap, 0, 2.05, -0.02);
    capDome.scale.set(1, 0.72, 1);
    const brim = makeAvatarPart(G("Cylinder", 0.8, 0.8, 0.07, 20, 1, false, -Math.PI / 2, Math.PI), m.accent, cap, 0, 2.12, 1.05);
    brim.scale.set(1.05, 1, 1.1);
    brim.rotation.x = 0.1;
    const beanie = addAccessory("beanie");
    const beanieDome = makeAvatarPart(G("Sphere", 1.34, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), m.accent, beanie, 0, 2.0, -0.04);
    beanieDome.scale.set(1, 0.85, 1);
    makeAvatarPart(G("Cylinder", 1.3, 1.32, 0.4, 24), m.accent, beanie, 0, 2.08, -0.04);
    makeAvatarPart(G("Sphere", 0.3, 12, 10), m.white, beanie, 0, 3.15, -0.05);
    const headphones = addAccessory("headphones");
    const band = makeAvatarPart(G("Torus", 1.32, 0.08, 8, 28, Math.PI), m.dark, headphones, 0, 1.6, 0);
    band.scale.set(1, 1.05, 1);
    [-1, 1].forEach((side) => {
      const pad = makeAvatarPart(G("Cylinder", 0.42, 0.42, 0.24, 18), m.accent, headphones, side * 1.3, 1.5, 0);
      pad.rotation.z = Math.PI / 2;
    });
    const crown = addAccessory("crown");
    makeAvatarPart(G("Cylinder", 1.0, 1.04, 0.36, 12), m.gold, crown, 0, 2.72, 0);
    [0, 1, 2, 3, 4, 5].forEach((index) => {
      const angle = (index / 6) * Math.PI * 2;
      makeAvatarPart(G("Cone", 0.17, 0.5, 6), m.gold, crown, Math.sin(angle) * 0.95, 3.12, Math.cos(angle) * 0.95);
    });
    makeAvatarPart(G("Sphere", 0.12, 10, 8), m.ruby, crown, 0, 2.74, 1.04, false);
    const glassZ = faceSurfaceZ(0.46) + 0.12;
    const glasses = addAccessory("glasses");
    [-1, 1].forEach((side) => {
      makeAvatarPart(G("Torus", 0.3, 0.035, 8, 24), m.dark, glasses, side * 0.43, 1.62, glassZ, false);
      const arm = makeAvatarPart(G("Box", 0.04, 0.05, 1.2), m.dark, glasses, side * 0.82, 1.66, glassZ - 0.62, false);
      arm.rotation.y = side * 0.1;
    });
    makeAvatarPart(G("Box", 0.24, 0.04, 0.04), m.dark, glasses, 0, 1.66, glassZ + 0.03, false);
    const sunglasses = addAccessory("sunglasses");
    [-1, 1].forEach((side) => {
      const lens = makeAvatarPart(G("Sphere", 0.34, 16, 12), m.lens, sunglasses, side * 0.43, 1.62, glassZ, false);
      lens.scale.set(1.08, 0.72, 0.2);
      const arm = makeAvatarPart(G("Box", 0.04, 0.05, 1.2), m.dark, sunglasses, side * 0.84, 1.68, glassZ - 0.62, false);
      arm.rotation.y = side * 0.1;
    });
    makeAvatarPart(G("Box", 1.1, 0.06, 0.05), m.dark, sunglasses, 0, 1.82, glassZ + 0.02, false);
    const backpack = addAccessory("backpack", spine);
    makeAvatarPart(rbBoxGeometry(1.7, 2.0, 0.75, 0.22), m.accent, backpack, 0, 1.6, -0.9);
    makeAvatarPart(rbBoxGeometry(1.2, 0.8, 0.3, 0.1), m.dark, backpack, 0, 1.05, -1.3, false);
    [-0.55, 0.55].forEach((x) => makeAvatarPart(G("Box", 0.18, 2.4, 0.05), m.dark, backpack, x, 1.65, 0.56, false));
    P.accessories = accessories;
    P.pose = {};

    targetGroup.scale.setScalar(scale);
  }

  // ---------- Образ: одежда, причёска, тип тела (копия applyAvatarStyle) ----------
  function applyAvatarStyle(targetParts, style) {
    const P = targetParts;
    const m = P.materials;
    const outfit = TOP_STYLES[style.outfit] ? style.outfit : "hoodie";
    const topStyle = TOP_STYLES[outfit];
    const shoes = SHOE_STYLES[style.shoes] || SHOE_STYLES.sneakers;
    const pants = style.pants || "jeans";
    const body = AVATAR_BODY_TYPES[style.body] || AVATAR_BODY_TYPES.man;

    Object.entries(P.tops).forEach(([id, group]) => {
      group.visible = id === outfit;
      group.scale.set(body.width, body.height, body.depth);
    });
    P.torso.material = m[topStyle.torso];
    [P.armL, P.armR].forEach((arm) => {
      arm.joint.material = topStyle.bareShoulders ? m.skin : m[topStyle.upper];
      arm.upper.material = m[topStyle.upper];
      arm.elbowJoint.material = m[topStyle.fore];
      arm.fore.material = m[topStyle.fore];
      arm.cuff.visible = topStyle.cuff;
    });

    const isShorts = pants === "shorts";
    [P.legL, P.legR].forEach((leg) => {
      leg.lower.material = isShorts ? m.skin : m.pants;
      leg.kneeCap.material = isShorts ? m.skin : m.pants;
      leg.shin.material = isShorts ? m.skin : m.pants;
      leg.pocket.visible = pants === "cargo";
      leg.legCuff.visible = pants === "joggers";
      leg.bootTop.visible = shoes.boot;
      leg.stripe.visible = shoes.stripe;
      leg.shoe.scale.set(shoes.slim ? 0.86 : 1, shoes.slim ? 0.8 : 1, 1);
    });

    Object.entries(P.hairStyles).forEach(([id, group]) => {
      group.visible = id === style.hair;
    });
    Object.entries(P.accessories).forEach(([id, group]) => {
      group.visible = id === style.accessory;
    });
    const wearsHat = HAT_ACCESSORIES.includes(style.accessory);
    P.hatHiddenHair.forEach((mesh) => {
      mesh.visible = !wearsHat;
    });

    if (P.bodyType !== style.body) {
      P.bodyType = style.body;
      P.torso.scale.set(body.width, body.height, body.depth);
      P.torso.position.y = 1.42 * body.height;
      P.pelvis.scale.set(style.body === "girl" ? 1.02 : body.width, 1, body.depth);
      [[P.armL, -1], [P.armR, 1]].forEach(([arm, side]) => {
        arm.shoulder.position.set(side * body.shoulder, 2.62 * body.height, 0);
        arm.shoulder.scale.set(body.arm, 1, body.arm);
      });
      [[P.legL, -1], [P.legR, 1]].forEach(([leg, side]) => {
        leg.thigh.position.x = side * body.hip;
        leg.thigh.scale.set(body.leg, 1, body.leg);
      });
      P.neck.position.y = 3.02 * body.height;
      P.head.position.y = 2.92 * body.height;
      P.head.scale.setScalar(0.78 * body.head);
      P.root.scale.setScalar(P.baseScale * body.size);
    }
  }

  // ---------- Анимация скелета (копия animateAvatarRig + свои позы через options.custom) ----------
  function dampTo(current, target, lambda, delta) {
    return current + (target - current) * (1 - Math.exp(-lambda * delta));
  }

  function solveAvatarLeg(footZ, footY, out) {
    const distance = Math.min(Math.hypot(footZ, footY), LEG_THIGH + LEG_SHIN - 0.02);
    const aim = Math.atan2(footZ, -footY);
    const hipBend = Math.acos(THREE.MathUtils.clamp((LEG_THIGH * LEG_THIGH + distance * distance - LEG_SHIN * LEG_SHIN) / (2 * LEG_THIGH * distance), -1, 1));
    const kneeInner = Math.acos(THREE.MathUtils.clamp((LEG_THIGH * LEG_THIGH + LEG_SHIN * LEG_SHIN - distance * distance) / (2 * LEG_THIGH * LEG_SHIN), -1, 1));
    out.thigh = -(aim + hipBend);
    out.knee = Math.PI - kneeInner;
    return out;
  }

  function avatarStep(phase, stance, reach, lift) {
    const onGround = phase < stance;
    const t = onGround ? phase / stance : (phase - stance) / (1 - stance);
    const angle = onGround ? Math.PI * t : Math.PI * (1 + t);
    const rise = onGround ? Math.pow(Math.max(0, (t - 0.6) / 0.4), 2) * 0.5 : 0.5 * Math.pow(1 - t, 2);
    return {
      z: reach * Math.cos(angle),
      y: rise + (onGround ? 0 : lift * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.72)), 1.5)),
      pitch: onGround
        ? -0.3 * Math.pow(1 - Math.min(1, t / 0.2), 2) + 0.95 * Math.pow(Math.max(0, (t - 0.5) / 0.5), 2)
        : 0.95 * Math.pow(1 - t, 2) - 0.3 * t * t
    };
  }

  // Ноги стоят на земле при заданной высоте таза (как в позе «стоим»)
  function standLegs(target, hipHeight, leg, footL = 0.14, footR = -0.2) {
    target.hipsY = hipHeight;
    const hipJoint = hipHeight - 0.25;
    solveAvatarLeg(footL, -(hipJoint - AVATAR_ANKLE_HEIGHT), leg);
    target.thighL = leg.thigh;
    target.kneeL = leg.knee;
    target.ankleL = -(leg.thigh + leg.knee) + target.hipsPitch;
    solveAvatarLeg(footR, -(hipJoint - AVATAR_ANKLE_HEIGHT), leg);
    target.thighR = leg.thigh;
    target.kneeR = leg.knee;
    target.ankleR = -(leg.thigh + leg.knee) + target.hipsPitch;
  }

  function animateAvatarRig(P, delta, options) {
    const { moving = false, sprint = false, grounded = true, cycle = 0, time = 0, blinkTime = time } = options;
    const gait = options.gait === undefined ? (sprint ? 1 : 0) : options.gait;
    const target = {
      hipsY: AVATAR_HIP_HEIGHT, hipsX: 0, hipsYaw: 0, hipsRoll: 0, hipsPitch: 0,
      spineX: 0, spineY: 0, spineZ: 0,
      headX: 0, headY: 0, headZ: 0,
      thighL: 0, thighR: 0, kneeL: 0.05, kneeR: 0.05, ankleL: 0, ankleR: 0,
      shoulderL: 0, shoulderR: 0, shoulderLz: -0.05, shoulderRz: 0.05,
      elbowL: -0.16, elbowR: -0.16, elbowLz: 0, elbowRz: 0
    };

    if (P.wasGrounded === false && grounded) {
      P.landing = 1;
    }
    P.wasGrounded = grounded;
    P.landing = Math.max(0, (P.landing || 0) - delta * 3.6);
    const landDip = P.landing * P.landing * 1.15;
    const leg = {};

    if (!grounded) {
      Object.assign(target, {
        spineX: 0.14, headX: -0.1,
        thighL: -1.0, kneeL: 1.3, ankleL: 0.3,
        thighR: 0.22, kneeR: 0.95, ankleR: 0.45,
        shoulderL: -0.65, shoulderR: 0.5, shoulderLz: -0.42, shoulderRz: 0.42,
        elbowL: -0.9, elbowR: -0.7
      });
    } else if (moving) {
      const stance = THREE.MathUtils.lerp(0.62, 0.27, Math.pow(gait, 0.55));
      const reach = THREE.MathUtils.lerp(1.95, 3.15, gait);
      const lift = THREE.MathUtils.lerp(0.65, 2.6, gait);
      const hipDrop = THREE.MathUtils.lerp(0.28, 0.52, gait);
      const bobSize = THREE.MathUtils.lerp(0.1, 0.24, gait);
      const lean = THREE.MathUtils.lerp(0.05, 0.27, gait);
      const armSwing = THREE.MathUtils.lerp(0.42, 0.92, gait);
      const elbowBend = THREE.MathUtils.lerp(0.28, 1.62, gait);
      const turn = cycle / (Math.PI * 2);
      const phaseL = THREE.MathUtils.euclideanModulo(turn, 1);
      const phaseR = THREE.MathUtils.euclideanModulo(turn + 0.5, 1);
      const midStance = stance * Math.PI;
      const wave = Math.cos((cycle - midStance) * 2) * THREE.MathUtils.lerp(1, -1, THREE.MathUtils.smoothstep(gait, 0.2, 0.5));
      const hipHeight = AVATAR_HIP_HEIGHT - hipDrop + wave * bobSize - landDip;
      target.hipsY = hipHeight;
      const hipJoint = hipHeight - 0.25;
      [[phaseL, "L"], [phaseR, "R"]].forEach(([phase, side]) => {
        const foot = avatarStep(phase, stance, reach, lift);
        solveAvatarLeg(foot.z - lean * 1.2, -(hipJoint - AVATAR_ANKLE_HEIGHT - foot.y), leg);
        target[`thigh${side}`] = leg.thigh;
        target[`knee${side}`] = leg.knee;
        target[`ankle${side}`] = foot.pitch - (leg.thigh + leg.knee);
      });
      const s = Math.cos(cycle);
      const lag = Math.cos(cycle - 0.32);
      const lagSide = Math.sin(cycle - 0.32);
      const breathing = Math.sin(time * 2.3);
      target.shoulderL = armSwing * lag - gait * 0.16;
      target.shoulderR = -armSwing * lag - gait * 0.16;
      target.elbowL = -(elbowBend + 0.34 * Math.max(0, -lag) - 0.2 * Math.max(0, lag));
      target.elbowR = -(elbowBend + 0.34 * Math.max(0, lag) - 0.2 * Math.max(0, -lag));
      target.shoulderLz = -0.1 - gait * 0.04 + Math.max(0, -lag) * 0.1 * gait;
      target.shoulderRz = 0.1 + gait * 0.04 - Math.max(0, lag) * 0.1 * gait;
      const sway = Math.sin(cycle);
      target.hipsX = -sway * THREE.MathUtils.lerp(0.15, 0.07, gait);
      target.hipsRoll = -sway * THREE.MathUtils.lerp(0.06, 0.04, gait);
      target.hipsYaw = s * THREE.MathUtils.lerp(0.14, 0.24, gait);
      target.hipsPitch = lean * 0.45;
      target.spineX = lean * 0.8 + wave * 0.018 * gait + breathing * 0.008;
      target.spineY = -lag * THREE.MathUtils.lerp(0.14, 0.3, gait);
      target.spineZ = lagSide * 0.03;
      target.headX = -lean * 0.85 - wave * 0.02;
      target.headY = lag * 0.1;
    } else {
      const breath = Math.sin(time * 1.5);
      const shift = Math.sin(time * 0.33) + 0.35 * Math.sin(time * 0.71);
      const hipHeight = AVATAR_HIP_HEIGHT - 0.1 - 0.012 * breath - Math.abs(shift) * 0.03 - landDip;
      target.hipsY = hipHeight;
      target.hipsX = shift * 0.13;
      target.hipsRoll = shift * 0.028;
      standLegs(target, hipHeight, leg);
      target.spineX = 0.012 * breath + landDip * 0.35;
      target.spineZ = -shift * 0.022;
      target.headY = 0.3 * Math.sin(time * 0.27) * Math.sin(time * 0.11);
      target.headX = -0.012 * breath + 0.03 * Math.sin(time * 0.19);
      target.shoulderL = 0.03 * Math.sin(time * 0.4);
      target.shoulderR = -0.03 * Math.sin(time * 0.46);
      target.shoulderLz = -0.06 - 0.012 * breath;
      target.shoulderRz = 0.06 + 0.012 * breath;
    }

    if (options.custom) {
      options.custom(target, leg, time);
    }

    const lambda = options.lambda || (moving && grounded ? 20 : 10);
    const pose = P.pose;
    Object.keys(target).forEach((key) => {
      pose[key] = pose[key] === undefined ? target[key] : dampTo(pose[key], target[key], lambda, delta);
    });

    P.hips.position.x = pose.hipsX;
    P.hips.position.y = pose.hipsY;
    P.hips.rotation.set(pose.hipsPitch, pose.hipsYaw, pose.hipsRoll);
    P.spine.rotation.set(pose.spineX, pose.spineY - pose.hipsYaw, pose.spineZ - pose.hipsRoll);
    P.head.rotation.set(pose.headX, pose.headY, pose.headZ);
    P.legL.thigh.rotation.set(pose.thighL - pose.hipsPitch, 0, -0.025 - pose.hipsRoll);
    P.legR.thigh.rotation.set(pose.thighR - pose.hipsPitch, 0, 0.025 - pose.hipsRoll);
    P.legL.knee.rotation.x = pose.kneeL;
    P.legR.knee.rotation.x = pose.kneeR;
    P.legL.ankle.rotation.x = pose.ankleL;
    P.legR.ankle.rotation.x = pose.ankleR;
    P.armL.shoulder.rotation.set(pose.shoulderL, 0, pose.shoulderLz);
    P.armR.shoulder.rotation.set(pose.shoulderR, 0, pose.shoulderRz);
    P.armL.elbow.rotation.set(pose.elbowL, 0, pose.elbowLz);
    P.armR.elbow.rotation.set(pose.elbowR, 0, pose.elbowRz);

    const blinkAt = blinkTime % 4.7;
    const blink = blinkAt < 0.13 || (blinkAt > 2.9 && blinkAt < 3.0);
    setAvatarFace(P, blink);
  }

  // Позы мини-игры поверх обычной стойки/ходьбы
  const CUSTOM_POSES = {
    aim(target) {
      // правая рука вытянута вперёд, как с пистолетом; корпус не крутится
      target.spineY = target.hipsYaw;
      target.shoulderR = -Math.PI / 2 - target.spineX - target.hipsPitch + 0.04;
      target.shoulderRz = -0.1;
      target.elbowR = -0.04;
      target.elbowRz = 0;
      target.headY = 0.04;
      target.headX = 0;
    },
    wave(target, leg, t) {
      target.shoulderR = -0.12;
      target.shoulderRz = 2.6 + 0.06 * Math.sin(t * 9);
      target.elbowR = -0.2;
      target.elbowRz = 0.5 * Math.sin(t * 9);
      target.headZ = -0.08;
      target.headY = 0.1;
    },
    cheer(target, leg, t, state) {
      const h = Math.abs(Math.sin(t * 5.5));
      state.liftTarget = h * 0.9;
      standLegs(target, AVATAR_HIP_HEIGHT - 0.1 - Math.pow(1 - h, 2) * 0.55, leg);
      target.hipsX = 0;
      target.hipsRoll = 0;
      target.spineX = -0.06;
      target.spineZ = 0;
      target.shoulderL = -0.25;
      target.shoulderR = -0.25;
      target.shoulderLz = -2.6 - 0.2 * Math.sin(t * 11);
      target.shoulderRz = 2.6 + 0.2 * Math.sin(t * 11 + 1);
      target.elbowL = -0.3;
      target.elbowR = -0.3;
      target.headX = -0.22;
      target.headY = 0;
    },
    dizzy(target, leg, t) {
      const sway = Math.sin(t * 2.1);
      const wob = t * 3.4;
      target.hipsX = sway * 0.12;
      target.hipsRoll = sway * 0.05;
      standLegs(target, AVATAR_HIP_HEIGHT - 0.18 - 0.06 * Math.abs(sway), leg, 0.3, -0.3);
      target.spineX = 0.05 * Math.sin(t * 1.3);
      target.spineZ = -sway * 0.14;
      target.spineY = 0.1 * Math.sin(t * 1.7);
      target.shoulderL = 0.18 * Math.sin(t * 1.9);
      target.shoulderR = -0.18 * Math.sin(t * 1.9 + 0.7);
      target.shoulderLz = -1.25 + 0.22 * Math.sin(t * 2.6);
      target.shoulderRz = 1.25 + 0.22 * Math.sin(t * 2.6 + 1.5);
      target.elbowL = -0.2;
      target.elbowR = -0.2;
      target.headX = 0.16 * Math.sin(wob);
      target.headZ = 0.2 * Math.cos(wob);
      target.headY = 0.12 * Math.sin(wob * 0.5);
    },
    sit(target, leg, t) {
      // сидим на земле: ноги вперёд, ладони на коленях
      const breath = Math.sin(t * 1.5);
      Object.assign(target, {
        hipsY: 0.7, hipsX: 0, hipsYaw: 0, hipsRoll: 0, hipsPitch: 0,
        spineX: -0.08 + 0.012 * breath, spineY: 0, spineZ: 0,
        thighL: -1.75, thighR: -1.75, kneeL: 0.27, kneeR: 0.27, ankleL: 1.48, ankleR: 1.48,
        shoulderL: -0.9, shoulderR: -0.9, shoulderLz: -0.08, shoulderRz: 0.08,
        elbowL: -0.45, elbowR: -0.45
      });
      target.headX = 0.05 + 0.02 * breath;
      target.headY = 0.25 * Math.sin(t * 0.27) * Math.sin(t * 0.11);
    }
  };

  // ---------- Образ игрока из localStorage ----------
  const isHex = (value) => typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
  const pick = (value, list) => (list.includes(value) ? value : list[0]);

  function readPlayerLook() {
    let s = {};
    try {
      s = JSON.parse(window.localStorage.getItem(AVATAR_STORAGE_KEY) || "{}") || {};
    } catch (error) {
      s = {};
    }
    return {
      name: (typeof s.name === "string" && s.name.trim()) || "Block Hero",
      body: isHex(s.bodyColor) ? s.bodyColor : DEFAULT_COLORS.bodyColor,
      accent: isHex(s.accentColor) ? s.accentColor : DEFAULT_COLORS.accentColor,
      hair: isHex(s.hairColor) ? s.hairColor : DEFAULT_COLORS.hairColor,
      eyes: isHex(s.eyeColor) ? s.eyeColor : DEFAULT_COLORS.eyeColor,
      skin: pick(s.skinTone, OPTIONS.skinTone),
      outfit: pick(s.outfitType, OPTIONS.outfitType),
      pants: pick(s.pantsType, OPTIONS.pantsType),
      shoes: pick(s.shoesType, OPTIONS.shoesType),
      hairStyle: pick(s.hairStyle, OPTIONS.hairStyle),
      accessory: pick(s.headAccessory, OPTIONS.headAccessory),
      face: pick(s.faceMood, OPTIONS.faceMood),
      bodyType: pick(s.bodyType, OPTIONS.bodyType)
    };
  }

  // Случайный образ в том же формате (для толпы)
  const RANDOM_COLORS = ["#ff9f68", "#72ddf7", "#ff70a6", "#3a4a63", "#7ae582", "#ffd166", "#9b5de5", "#06d6a0", "#ef476f", "#5dd9ff", "#f15bb5", "#fee440", "#00bbf9", "#8338ec", "#fb5607", "#2b2d42", "#f5f5f5", "#e63946"];
  const RANDOM_HAIR = ["#352f36", "#c9a46a", "#42312b", "#1d1f24", "#8a3b1e", "#e3c16f", "#2f3542", "#e07a5f", "#5a3825", "#b0b0b0"];
  const RANDOM_EYES = ["#3d6b3a", "#3a6ea5", "#5a3b24", "#2b2d42", "#4b7f52"];
  function randomLook(random = Math.random) {
    const any = (list) => list[Math.floor(random() * list.length)];
    const bodyType = any(OPTIONS.bodyType);
    return {
      body: any(RANDOM_COLORS), accent: any(RANDOM_COLORS), hair: any(RANDOM_HAIR), eyes: any(RANDOM_EYES),
      skin: any(OPTIONS.skinTone), outfit: any(OPTIONS.outfitType), pants: any(OPTIONS.pantsType), shoes: any(OPTIONS.shoesType),
      hairStyle: any(bodyType === "girl" ? ["long", "bob", "ponytail", "bun", "curly"] : ["short", "spiky", "mohawk", "buzz", "curly", "short"]),
      accessory: random() < 0.45 ? "none" : any(OPTIONS.headAccessory), face: any(OPTIONS.faceMood), bodyType
    };
  }

  // ---------- Публичный конструктор ----------
  const DEFAULT_WALK_UNITS = 15; // скорость прохожих в городе, единиц аватара в секунду
  const DEFAULT_RUN_UNITS = 61.5; // бег игрока (Shift) в городе
  const WALK_CYCLE_PER_UNIT = 3.0 * 0.28; // как у прохожих: 3 рад на метр при масштабе 0.28
  const RUN_CYCLE_PER_UNIT = 0.64 * 0.29; // как у игрока при беге

  function create(look, opts = {}) {
    look = Object.assign({}, NPC_LOOKS[0], look || {});
    const height = opts.height > 0 ? opts.height : 2.0;
    const castShadow = opts.castShadow !== false;
    const body = AVATAR_BODY_TYPES[look.bodyType] || AVATAR_BODY_TYPES.man;
    const bodyTop = bodyTopUnits(body);
    // по умолчанию height — рост «парня», девушка и мальчик ниже, как в городе
    const baseScale = opts.normalize ? height / (bodyTop * body.size) : height / MAN_TOP;
    const rigScale = baseScale * body.size;

    const group = new THREE.Group();
    group.name = "BlobloxAvatar";
    const rig = new THREE.Group();
    group.add(rig);
    const parts = {};
    const { materials, keys } = createLookMaterials(look);
    buildPlayerAvatar(rig, parts, baseScale, materials);
    applyAvatarStyle(parts, {
      outfit: look.outfit, pants: look.pants, shoes: look.shoes,
      hair: look.hairStyle, accessory: look.accessory, body: look.bodyType
    });
    // невыбранные варианты одежды/причёсок/аксессуаров не нужны: убираем из сцены
    [parts.tops, parts.hairStyles, parts.accessories].forEach((set) => {
      Object.values(set).forEach((g) => {
        if (!g.visible && g.parent) g.parent.remove(g);
      });
    });
    if (!castShadow) {
      rig.traverse((o) => { o.castShadow = false; });
    }
    parts.faceId = OPTIONS.faceMood.includes(look.face) || look.face === "dizzy" ? look.face : "smile";
    setAvatarFace(parts, false);

    // точка крепления на макушке: масштаб компенсирован, 1 единица = 1 единица группы аватара
    const headScale = rigScale * 0.78 * body.head;
    const head = new THREE.Object3D();
    head.name = "headTop";
    head.position.y = HEAD_TOP;
    head.scale.setScalar(1 / headScale);
    parts.head.add(head);

    // точка в кулаке правой руки: +Z — куда смотрят пальцы (в позе aim — вперёд), +Y — тыльная сторона кисти (в aim — вверх)
    const handR = new THREE.Object3D();
    handR.name = "handR";
    handR.position.y = -0.3;
    handR.rotation.x = Math.PI / 2;
    handR.scale.set(1 / (rigScale * body.arm), 1 / (rigScale * body.arm), 1 / rigScale);
    parts.armR.hand.add(handR);

    const state = {
      time: Math.random() * 10,
      blinkOffset: Math.random() * 4.7,
      cycle: Math.random() * Math.PI * 2,
      lift: 0,
      liftTarget: 0
    };

    const avatarObj = {
      group,
      parts,
      head,
      handR,
      height: bodyTop * rigScale,
      headRadius: HEAD_RADIUS * headScale,
      scale: rigScale,
      look,
      _materialKeys: keys,
      setFace(id) {
        parts.faceId = id || "smile";
        setAvatarFace(parts, false);
      },
      animate(dt, mode = "idle", speed = 0) {
        dt = Math.min(Math.max(Number(dt) || 0, 0), 0.1);
        state.time += dt;
        const t = state.time;
        const options = { time: t, blinkTime: t + state.blinkOffset, grounded: true };
        state.liftTarget = 0;
        const walkLegs = (v, run) => {
          const units = (v > 0 ? v / rigScale : run ? DEFAULT_RUN_UNITS : DEFAULT_WALK_UNITS);
          state.cycle += units * (run ? RUN_CYCLE_PER_UNIT : WALK_CYCLE_PER_UNIT) * dt;
          options.moving = true;
          options.sprint = run;
          options.gait = run ? 1 : 0;
          options.cycle = state.cycle;
        };
        if (mode === "walk") {
          walkLegs(speed, false);
        } else if (mode === "run") {
          walkLegs(speed, true);
        } else if (CUSTOM_POSES[mode]) {
          if (mode === "aim" && speed > 0) walkLegs(speed, false);
          options.custom = (target, leg, time) => CUSTOM_POSES[mode](target, leg, time, state);
          if (mode === "wave" || mode === "cheer") options.lambda = 14;
        }
        animateAvatarRig(parts, dt, options);
        state.lift = dampTo(state.lift, state.liftTarget, 30, dt);
        rig.position.y = state.lift * rigScale;
      }
    };
    return avatarObj;
  }

  function dispose(avatarObj) {
    if (!avatarObj || avatarObj._disposed) return;
    avatarObj._disposed = true;
    if (avatarObj.group.parent) avatarObj.group.parent.remove(avatarObj.group);
    (avatarObj._materialKeys || []).forEach(releaseMaterial);
    avatarObj._materialKeys = [];
  }

  window.BlobloxAvatar = {
    readPlayerLook,
    NPC_LOOKS,
    randomLook,
    create,
    dispose,
    FACES: OPTIONS.faceMood.concat(["dizzy"]),
    MODES: ["idle", "walk", "run", "aim", "wave", "cheer", "dizzy", "sit"]
  };
})();
