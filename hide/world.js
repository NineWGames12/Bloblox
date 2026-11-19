// «Кто из них?» — мир «Лесная поляна»: рельеф, озеро, ручей с мостиком, вышка, кормушка,
// лес, луг с высокой травой и цветами, бабочки, птицы, рыбы и утренний туман.
(function () {
  "use strict";

  // ---------- Мелкие помощники ----------
  const U = {
    random(seed) {
      let value = seed >>> 0;
      return () => {
        value += 0x6d2b79f5;
        let t = value;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    },
    smooth(x, a, b) {
      const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
      return t * t * (3 - 2 * t);
    },
    lerp(a, b, t) { return a + (b - a) * t; },
    // склейка простых фигур в одну геометрию с цветом в вершинах
    merge(parts) {
      let total = 0;
      const ready = parts.map((p) => {
        const g = (p.geo.index ? p.geo.toNonIndexed() : p.geo.clone());
        if (p.matrix) g.applyMatrix4(p.matrix);
        total += g.attributes.position.count;
        return { g, color: new THREE.Color(p.color === undefined ? 0xffffff : p.color) };
      });
      const pos = new Float32Array(total * 3);
      const nor = new Float32Array(total * 3);
      const col = new Float32Array(total * 3);
      let o = 0;
      ready.forEach(({ g, color }) => {
        const n = g.attributes.position.count;
        pos.set(g.attributes.position.array, o * 3);
        g.computeVertexNormals();
        nor.set(g.attributes.normal.array, o * 3);
        for (let i = 0; i < n; i += 1) {
          col[(o + i) * 3] = color.r;
          col[(o + i) * 3 + 1] = color.g;
          col[(o + i) * 3 + 2] = color.b;
        }
        o += n;
        g.dispose();
      });
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
      geo.computeBoundingSphere();
      return geo;
    },
    m4(x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = sx, sz = sx) {
      const o = new THREE.Object3D();
      o.position.set(x, y, z);
      o.rotation.set(rx, ry, rz);
      o.scale.set(sx, sy, sz);
      o.updateMatrix();
      return o.matrix.clone();
    },
    canvasTexture(size, draw, repeat = 1) {
      const c = document.createElement("canvas");
      c.width = size;
      c.height = size;
      draw(c.getContext("2d"), size);
      const t = new THREE.CanvasTexture(c);
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(repeat, repeat);
      t.anisotropy = 4;
      return t;
    }
  };
  window.HideUtil = U;

  // ---------- Карта ----------
  // базовая раскладка карты; для каждой карты она поворачивается и отражается — озеро, ручей и вышка оказываются в других местах
  const BASE = {
    LAKE: { x: 38, z: -28, r: 20 },
    MEADOW: { x: -20, z: 15, r: 42 },
    FEEDER: { x: -34, z: 34 },
    TOWER: { x: -78, z: 64, top: 6.2 },
    STREAM: [[112, -100], [100, -86], [88, -73], [78, -60], [66, -48], [54, -38], [44, -32]],
    TRAIL: [[-78, 52], [-62, 44], [-40, 36], [-18, 24], [4, 12], [22, 0], [30, -6], [50, -10], [66, -22], [76, -40], [80, -60], [86, -76], [100, -92]],
    BRIDGE: { x: 79.5, z: -60.5, ux: 0.8, uz: 0.6, half: 4.2, width: 1.25 }
  };
  const PLAY_R = 118;
  let LAKE;
  let MEADOW;
  let FEEDER;
  let TOWER;
  let STREAM;
  let TRAIL;
  let BRIDGE;
  let NOISE = [0.6, -0.3, 1.1];
  function applyLayout(rot, mirror) {
    const c = Math.cos(rot);
    const s = Math.sin(rot);
    const T = (x, z) => {
      const mx = mirror ? -x : x;
      return [mx * c - z * s, mx * s + z * c];
    };
    const P = (p) => { const [x, z] = T(p.x, p.z); return { ...p, x, z }; };
    LAKE = P(BASE.LAKE);
    MEADOW = P(BASE.MEADOW);
    FEEDER = P(BASE.FEEDER);
    TOWER = P(BASE.TOWER);
    STREAM = BASE.STREAM.map(([x, z]) => T(x, z));
    TRAIL = BASE.TRAIL.map(([x, z]) => T(x, z));
    BRIDGE = P(BASE.BRIDGE);
    const [ux, uz] = T(BASE.BRIDGE.ux, BASE.BRIDGE.uz);
    BRIDGE.ux = ux;
    BRIDGE.uz = uz;
  }
  applyLayout(0, false);

  // времена года: цвета земли, деревьев, неба и света
  const SEASONS = {
    summer: {
      grass: 0x6aa84a, dry: 0x9cb85a, dark: 0x4e8a3c, floor: 0x5a6e36, greens: [0x4b8a38, 0x569a3e, 0x3f7a32, 0x5f9f44, 0x6aa84a],
      birch: [0x6c9c3e, 0x75a446, 0x638f38], spruce: [0x2d5e34, 0x2a5530, 0x356a3a], tuft: [0x5e9a3a, 0x6aa33e, 0x77a843, 0x4f8a34, 0x86ad48, 0x9fb55a],
      flowers: true, fog: 0xdfe6dc, skyTop: [0.36, 0.62, 0.95], skyHor: [0.98, 0.86, 0.72], sun: 0xffe2b8, sunPower: 1.35, sunDir: [-0.55, 0.32, 0.77], hemi: 0.78, butterflies: true
    },
    autumn: {
      grass: 0x9aa84a, dry: 0xc2a24a, dark: 0x7a8a3c, floor: 0x7a6236, greens: [0xd9822b, 0xc9501f, 0xe0b23a, 0xb8402a, 0x8a9a3a, 0xd96a2a],
      birch: [0xf0c23a, 0xe8b02a, 0xdca838], spruce: [0x2d5e34, 0x2a5530, 0x356a3a], tuft: [0xb8a24a, 0xa89a3a, 0xc9a84a, 0x8a8a3a, 0xd0b050],
      flowers: false, leaves: true, fog: 0xeadcc6, skyTop: [0.42, 0.6, 0.86], skyHor: [1.0, 0.82, 0.6], sun: 0xffd29a, sunPower: 1.3, sunDir: [0.6, 0.28, 0.75], hemi: 0.75, butterflies: false
    },
    winter: {
      grass: 0xf2f6fa, dry: 0xe2eaf2, dark: 0xd5e0ea, floor: 0xe8eef4, greens: [0xeef3f7, 0xe2e9ef, 0xd8e1e8],
      birch: [0xe6edf2, 0xdde6ec], spruce: [0x2d5240, 0x2a4d3a, 0x34584a], tuft: [0xc9b98a, 0xb8aa7a, 0xd8cca0],
      flowers: false, snow: true, ice: true, fog: 0xe6eef6, skyTop: [0.55, 0.7, 0.92], skyHor: [0.95, 0.94, 0.96], sun: 0xfff2e0, sunPower: 1.15, sunDir: [-0.3, 0.35, -0.88], hemi: 0.95, butterflies: false
    },
    sunset: {
      grass: 0x6a9a4a, dry: 0x9aa85a, dark: 0x4a7a3c, floor: 0x4e5e36, greens: [0x4b8a38, 0x569a3e, 0x3f7a32, 0x5f9f44],
      birch: [0x6c9c3e, 0x75a446], spruce: [0x2d5e34, 0x2a5530, 0x356a3a], tuft: [0x5e9a3a, 0x6aa33e, 0x77a843, 0x4f8a34],
      flowers: true, fireflies: true, fog: 0xf0b89a, skyTop: [0.3, 0.32, 0.62], skyHor: [1.0, 0.6, 0.42], sun: 0xff9a5a, sunPower: 1.25, sunDir: [0.85, 0.16, -0.5], hemi: 0.62, butterflies: false
    }
  };
  let SEASON = SEASONS.summer;

  function distToPolyline(x, z, points) {
    let best = 1e9;
    for (let i = 0; i < points.length - 1; i += 1) {
      const [ax, az] = points[i];
      const [bx, bz] = points[i + 1];
      const dx = bx - ax;
      const dz = bz - az;
      const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)));
      best = Math.min(best, Math.hypot(x - (ax + dx * t), z - (az + dz * t)));
    }
    return best;
  }

  // высота земли без построек
  function terrainHeight(x, z) {
    let h = 2.4 * Math.sin(x * 0.031 + NOISE[0]) * Math.cos(z * 0.027 + NOISE[1])
      + 1.4 * Math.sin(x * 0.067 - z * 0.052 + NOISE[2])
      + 0.5 * Math.sin(x * 0.17 + z * 0.13) + 1.2;
    // луг ровнее
    const meadow = Math.hypot(x - MEADOW.x, z - MEADOW.z);
    h *= 0.25 + 0.75 * U.smooth(meadow, 16, 60);
    // края карты поднимаются холмами — конца леса не видно
    const r = Math.hypot(x, z);
    const edge = U.smooth(r, 112, 175);
    h += edge * edge * 30 + edge * 7 * Math.sin(x * 0.09 + z * 0.07);
    // ручей прорезает русло и сбегает к озеру
    const ds = distToPolyline(x, z, STREAM);
    if (ds < 5) h -= 1.15 * (1 - U.smooth(ds, 1.3, 4.6));
    // озеро: чаша с пологим берегом
    const dl = Math.hypot(x - LAKE.x, z - LAKE.z) / LAKE.r;
    if (dl < 1.9) {
      const lake = dl < 1 ? -2.6 * Math.pow(1 - dl * dl, 0.6) + 0.05 : 0.38 * (dl - 1) / 0.9;
      h = U.lerp(h, lake, 1 - U.smooth(dl, 1.0, 1.9));
    }
    return h;
  }

  // высота под ногами с постройками: мостик, лестница и площадка вышки
  function groundAt(x, z, y = 1e9) {
    let g = terrainHeight(x, z);
    if (SEASON.ice && Math.hypot(x - LAKE.x, z - LAKE.z) < LAKE.r + 1.5) g = Math.max(g, 0.03);
    const bx = x - BRIDGE.x;
    const bz = z - BRIDGE.z;
    const u = bx * BRIDGE.ux + bz * BRIDGE.uz;
    const v = -bx * BRIDGE.uz + bz * BRIDGE.ux;
    if (Math.abs(u) < BRIDGE.half && Math.abs(v) < BRIDGE.width) {
      const deck = BRIDGE.base + 0.55 * Math.cos((u / BRIDGE.half) * Math.PI / 2);
      if (y >= deck - 1.2) g = Math.max(g, deck);
    }
    const tx = x - TOWER.x;
    const tz = z - TOWER.z;
    if (Math.abs(tx) < 2.6 && Math.abs(tz) < 2.6 && y >= TOWER.floor - 1.4) g = Math.max(g, TOWER.floor);
    if (Math.abs(tx) < 0.75 && tz > -10.5 && tz < -2.5) {
      const ramp = U.lerp(TOWER.base, TOWER.floor, (tz + 10.5) / 8);
      if (y >= ramp - 1.2) g = Math.max(g, ramp);
    }
    return g;
  }

  // вода есть только в озере и ручье; низины между холмами — это просто земля
  function isDeepWater(x, z, depth = 0.45) {
    if (SEASON.ice || Math.hypot(x - LAKE.x, z - LAKE.z) > LAKE.r) return false;
    return terrainHeight(x, z) < -depth;
  }
  function isWater(x, z) {
    return Math.hypot(x - LAKE.x, z - LAKE.z) < LAKE.r + 0.3 || distToPolyline(x, z, STREAM) < 1.5;
  }

  // ---------- Материалы ----------
  const wind = { value: 0 };
  function windMaterial(base, strength) {
    const material = new THREE.MeshStandardMaterial(base);
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uWind = wind;
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nuniform float uWind;")
        .replace("#include <begin_vertex>", `#include <begin_vertex>
          #ifdef USE_INSTANCING
            vec4 rootW = modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
          #else
            vec4 rootW = modelMatrix * vec4(0.0, 0.0, 0.0, 1.0);
          #endif
          float bend = max(position.y, 0.0) * ${strength.toFixed(3)};
          transformed.x += sin(uWind * 1.7 + rootW.x * 0.31 + rootW.z * 0.17) * bend;
          transformed.z += cos(uWind * 1.3 + rootW.x * 0.21 + rootW.z * 0.27) * bend * 0.7;`);
    };
    return material;
  }

  // ---------- Пачки одинаковых объектов, нарезанные кусками для отсечения ----------
  function makeBatches(scene, geometry, material, items, options = {}) {
    const cell = options.cell || 90;
    const groups = new Map();
    items.forEach((it) => {
      const key = `${Math.floor(it.x / cell)},${Math.floor(it.z / cell)}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(it);
    });
    const o = new THREE.Object3D();
    const color = new THREE.Color();
    const meshes = [];
    groups.forEach((list) => {
      const geo = geometry.clone();
      const mesh = new THREE.InstancedMesh(geo, material, list.length);
      let cx = 0;
      let cz = 0;
      let cy = 0;
      list.forEach((it, i) => {
        o.position.set(it.x, it.y, it.z);
        o.rotation.set(it.rx || 0, it.ry || 0, it.rz || 0);
        o.scale.set(it.sx || 1, it.sy || it.sx || 1, it.sz || it.sx || 1);
        o.updateMatrix();
        mesh.setMatrixAt(i, o.matrix);
        if (it.color !== undefined) mesh.setColorAt(i, color.set(it.color));
        cx += it.x;
        cz += it.z;
        cy += it.y;
      });
      cx /= list.length;
      cz /= list.length;
      cy /= list.length;
      let radius = 0;
      list.forEach((it) => { radius = Math.max(radius, Math.hypot(it.x - cx, it.z - cz) + (it.sy || it.sx || 1) * 2 + 4); });
      geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(cx, cy, cz), radius + 10);
      mesh.castShadow = !!options.shadow;
      mesh.receiveShadow = options.receive !== false;
      scene.add(mesh);
      meshes.push(mesh);
    });
    return meshes;
  }

  // ---------- Постройка мира ----------
  function build(parentScene, options = {}) {
    // карта строится в своей группе — после раунда её целиком убирают
    const root = new THREE.Group();
    parentScene.add(root);
    const scene = root;
    applyLayout(options.rot || 0, !!options.mirror);
    SEASON = SEASONS[options.season] || SEASONS.summer;
    const seed = options.seed || 1;
    NOISE = [0.6 + seed * 1.7, -0.3 + seed * 2.3, 1.1 + seed * 0.9];
    const random = U.random(20261119 + seed * 7919);
    const colliders = [];
    const canopies = [];
    const world = { colliders, canopies, LAKE, MEADOW, FEEDER, TOWER, PLAY_R, STREAM, BRIDGE, groundAt, terrainHeight, isDeepWater, isWater, update: null };

    // небо: мягкий утренний градиент, солнце и облака
    const sky = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, fog: false,
      uniforms: {
        sunDir: { value: new THREE.Vector3(...SEASON.sunDir).normalize() },
        top: { value: new THREE.Vector3(...SEASON.skyTop) },
        hor: { value: new THREE.Vector3(...SEASON.skyHor) }
      },
      vertexShader: "varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: `uniform vec3 sunDir; uniform vec3 top; uniform vec3 hor; varying vec3 vDir;
        void main(){
          float h = clamp(vDir.y, -0.2, 1.0);
          vec3 col = mix(hor, top, pow(max(h, 0.0), 0.55));
          float s = max(dot(normalize(vDir), sunDir), 0.0);
          col += vec3(1.0, 0.85, 0.6) * pow(s, 18.0) * 0.55 + vec3(1.0, 0.95, 0.85) * pow(s, 900.0) * 3.0;
          gl_FragColor = vec4(col, 1.0);
        }`
    }));
    sky.renderOrder = -10;
    scene.add(sky);
    world.sky = sky;

    const cloudTex = U.canvasTexture(128, (ctx, s) => {
      for (let i = 0; i < 22; i += 1) {
        const x = 20 + Math.random() * 88;
        const y = 44 + Math.random() * 40;
        const r = 14 + Math.random() * 22;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, "rgba(255,255,255,0.75)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, s, s);
      }
    });
    cloudTex.wrapS = cloudTex.wrapT = THREE.ClampToEdgeWrapping;
    const clouds = [];
    for (let i = 0; i < 14; i += 1) {
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloudTex, transparent: true, opacity: 0.85, depthWrite: false, fog: false }));
      const a = random() * Math.PI * 2;
      const d = 260 + random() * 260;
      sprite.position.set(Math.cos(a) * d, 120 + random() * 70, Math.sin(a) * d);
      sprite.scale.set(160 + random() * 120, 70 + random() * 40, 1);
      scene.add(sprite);
      clouds.push(sprite);
    }

    // свет
    const hemi = new THREE.HemisphereLight(0xd7ecff, SEASON.snow ? 0xb8c4d0 : 0x6f6146, SEASON.hemi);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight(SEASON.sun, SEASON.sunPower);
    sun.position.set(...SEASON.sunDir).normalize().multiplyScalar(200);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -55;
    sun.shadow.camera.right = 55;
    sun.shadow.camera.top = 55;
    sun.shadow.camera.bottom = -55;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 400;
    sun.shadow.bias = -0.0006;
    sun.shadow.normalBias = 0.04;
    scene.add(sun);
    scene.add(sun.target);
    world.sun = sun;
    world.sunOffset = sun.position.clone();
    parentScene.fog = new THREE.Fog(SEASON.fog, 80, 430);

    // земля: трава, проплешины, тропинка, песок у воды, камни на склонах
    const SIZE = 380;
    const SEG = 190;
    const terrainGeo = new THREE.PlaneGeometry(SIZE, SIZE, SEG, SEG);
    terrainGeo.rotateX(-Math.PI / 2);
    const tp = terrainGeo.attributes.position;
    const tcol = new Float32Array(tp.count * 3);
    const c = new THREE.Color();
    const grass = new THREE.Color(SEASON.grass);
    const grassDry = new THREE.Color(SEASON.dry);
    const grassDark = new THREE.Color(SEASON.dark);
    const forestFloor = new THREE.Color(SEASON.floor);
    const dirt = new THREE.Color(0x9a7b52);
    const sand = new THREE.Color(0xcdb98a);
    const mud = new THREE.Color(0x6e5a3e);
    const rock = new THREE.Color(0x8a877c);
    if (SEASON.snow) {
      dirt.set(0xd8d2c8);
      sand.set(0xeef2f6);
      mud.set(0xc9d6e2);
      rock.set(0xdfe6ec);
    }
    for (let i = 0; i < tp.count; i += 1) {
      const x = tp.getX(i);
      const z = tp.getZ(i);
      const h = terrainHeight(x, z);
      tp.setY(i, h);
      const n = Math.sin(x * 0.11 + 1.3) * Math.cos(z * 0.09) + 0.6 * Math.sin(x * 0.27 - z * 0.21);
      c.copy(grass).lerp(n > 0 ? grassDry : grassDark, Math.min(0.6, Math.abs(n) * 0.45));
      const meadow = Math.hypot(x - MEADOW.x, z - MEADOW.z);
      c.lerp(forestFloor, U.smooth(meadow, 50, 85) * 0.75);
      const trail = distToPolyline(x, z, TRAIL);
      c.lerp(dirt, (1 - U.smooth(trail, 0.8, 2.2)) * 0.85);
      const dl = Math.hypot(x - LAKE.x, z - LAKE.z) / LAKE.r;
      if (dl < 1.25) c.lerp(sand, 1 - U.smooth(dl, 1.0, 1.25));
      if (dl < 1) c.copy(mud).lerp(sand, Math.max(0, dl - 0.6) * 1.5);
      const ds = distToPolyline(x, z, STREAM);
      if (ds < 3) c.lerp(mud, (1 - U.smooth(ds, 1.2, 3)) * 0.8);
      const r = Math.hypot(x, z);
      c.lerp(rock, U.smooth(r, 150, 185) * 0.7);
      tcol[i * 3] = c.r;
      tcol[i * 3 + 1] = c.g;
      tcol[i * 3 + 2] = c.b;
    }
    terrainGeo.setAttribute("color", new THREE.BufferAttribute(tcol, 3));
    terrainGeo.computeVertexNormals();
    const grassTex = U.canvasTexture(128, (ctx, s) => {
      ctx.fillStyle = "rgb(236,236,236)";
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 1400; i += 1) {
        const v = 190 + Math.floor(Math.random() * 65);
        ctx.fillStyle = `rgb(${v},${Math.min(255, v + 8)},${v - 10})`;
        ctx.fillRect(Math.random() * s, Math.random() * s, 1, 2 + Math.random() * 4);
      }
    }, SIZE / 5);
    const terrain = new THREE.Mesh(terrainGeo, new THREE.MeshStandardMaterial({ vertexColors: true, map: grassTex, roughness: 1 }));
    terrain.receiveShadow = true;
    scene.add(terrain);
    world.terrain = terrain;

    // вода: озеро и ручей с бегущей рябью
    const waterNormal = U.canvasTexture(256, (ctx, s) => {
      const img = ctx.createImageData(s, s);
      for (let y = 0; y < s; y += 1) {
        for (let x = 0; x < s; x += 1) {
          const a = (x / s) * Math.PI * 2;
          const b = (y / s) * Math.PI * 2;
          const dx = Math.cos(a * 3 + b * 2) * 0.5 + Math.cos(a * 7 - b * 5) * 0.3 + Math.cos(a * 11 + b * 13) * 0.2;
          const dy = Math.cos(b * 4 - a) * 0.5 + Math.cos(b * 9 + a * 6) * 0.3 + Math.cos(b * 15 - a * 7) * 0.2;
          const i = (y * s + x) * 4;
          img.data[i] = 128 + dx * 60;
          img.data[i + 1] = 128 + dy * 60;
          img.data[i + 2] = 255;
          img.data[i + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
    }, 6);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x3a9fc2, transparent: true, opacity: 0.72, roughness: 0.08, metalness: 0.15,
      normalMap: waterNormal, normalScale: new THREE.Vector2(0.35, 0.35), depthWrite: false
    });
    const lake = new THREE.Mesh(new THREE.CircleGeometry(LAKE.r + 1.6, 64), waterMat);
    lake.rotation.x = -Math.PI / 2;
    lake.position.set(LAKE.x, 0.02, LAKE.z);
    lake.renderOrder = 2;
    scene.add(lake);
    if (SEASON.ice) {
      // зимой озеро и ручей замёрзли — по льду можно ходить
      waterMat.color.set(0xd6ebf5);
      waterMat.opacity = 0.95;
      waterMat.normalScale.set(0.04, 0.04);
      waterMat.roughness = 0.15;
    }
    const streamMat = waterMat.clone();
    streamMat.normalMap = waterNormal.clone();
    streamMat.normalMap.needsUpdate = true;
    streamMat.normalMap.repeat.set(1, 8);
    const streamGeo = (() => {
      const pts = [];
      for (let i = 0; i < STREAM.length - 1; i += 1) {
        const [ax, az] = STREAM[i];
        const [bx, bz] = STREAM[i + 1];
        const steps = Math.ceil(Math.hypot(bx - ax, bz - az) / 1.5);
        for (let k = 0; k < steps; k += 1) pts.push([U.lerp(ax, bx, k / steps), U.lerp(az, bz, k / steps)]);
      }
      pts.push(STREAM[STREAM.length - 1]);
      const pos = [];
      const uv = [];
      const idx = [];
      pts.forEach(([x, z], i) => {
        const [nx, nz] = pts[Math.min(i + 1, pts.length - 1)];
        const [px, pz] = pts[Math.max(i - 1, 0)];
        let dx = nx - px;
        let dz = nz - pz;
        const len = Math.hypot(dx, dz) || 1;
        dx /= len;
        dz /= len;
        const w = 1.55;
        const y = Math.max(terrainHeight(x, z) + 0.42, 0.03);
        pos.push(x - dz * w, y, z + dx * w, x + dz * w, y, z - dx * w);
        uv.push(0, i * 0.12, 1, i * 0.12);
        if (i > 0) {
          const a = (i - 1) * 2;
          idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
        }
      });
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
      g.setIndex(idx);
      g.computeVertexNormals();
      return g;
    })();
    const stream = new THREE.Mesh(streamGeo, streamMat);
    stream.renderOrder = 2;
    scene.add(stream);

    // деревянный мостик через ручей
    const wood = new THREE.MeshStandardMaterial({ color: 0xa87a4e, roughness: 0.85 });
    const woodDark = new THREE.MeshStandardMaterial({ color: 0x6f4f32, roughness: 0.9 });
    const bA = terrainHeight(BRIDGE.x - BRIDGE.ux * BRIDGE.half, BRIDGE.z - BRIDGE.uz * BRIDGE.half);
    const bB = terrainHeight(BRIDGE.x + BRIDGE.ux * BRIDGE.half, BRIDGE.z + BRIDGE.uz * BRIDGE.half);
    BRIDGE.base = Math.max(bA, bB) + 0.15;
    const bridge = new THREE.Group();
    bridge.position.set(BRIDGE.x, 0, BRIDGE.z);
    bridge.rotation.y = Math.atan2(BRIDGE.ux, BRIDGE.uz) - Math.PI / 2;
    const plankParts = [];
    for (let u = -BRIDGE.half + 0.2; u <= BRIDGE.half - 0.2; u += 0.42) {
      const y = BRIDGE.base + 0.55 * Math.cos((u / BRIDGE.half) * Math.PI / 2);
      const slope = -0.55 * Math.PI / 2 / BRIDGE.half * Math.sin((u / BRIDGE.half) * Math.PI / 2);
      plankParts.push({ geo: new THREE.BoxGeometry(0.38, 0.09, BRIDGE.width * 2), matrix: U.m4(u, y - 0.045, 0, 0, 0, Math.atan(slope)), color: 0xb08250 + Math.floor(random() * 3) * 0x050302 });
      if (Math.abs(u) > BRIDGE.half - 0.7 || Math.abs(u) < 0.25) {
        [-1, 1].forEach((s) => plankParts.push({ geo: new THREE.BoxGeometry(0.12, 1.0, 0.12), matrix: U.m4(u, y + 0.5, s * (BRIDGE.width - 0.06)), color: 0x6f4f32 }));
      }
    }
    for (let k = 0; k < 16; k += 1) {
      const u0 = -BRIDGE.half + (k / 16) * BRIDGE.half * 2;
      const u1 = -BRIDGE.half + ((k + 1) / 16) * BRIDGE.half * 2;
      const y0 = BRIDGE.base + 0.55 * Math.cos((u0 / BRIDGE.half) * Math.PI / 2) + 0.95;
      const y1 = BRIDGE.base + 0.55 * Math.cos((u1 / BRIDGE.half) * Math.PI / 2) + 0.95;
      const len = Math.hypot(u1 - u0, y1 - y0);
      [-1, 1].forEach((s) => plankParts.push({ geo: new THREE.BoxGeometry(len, 0.08, 0.1), matrix: U.m4((u0 + u1) / 2, (y0 + y1) / 2, s * (BRIDGE.width - 0.06), 0, 0, Math.atan2(y1 - y0, u1 - u0)), color: 0x8a6440 }));
    }
    const bridgeMesh = new THREE.Mesh(U.merge(plankParts), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85 }));
    bridgeMesh.castShadow = true;
    bridgeMesh.receiveShadow = true;
    bridge.add(bridgeMesh);
    scene.add(bridge);

    // охотничья вышка с лестницей
    TOWER.base = terrainHeight(TOWER.x, TOWER.z - 10.5);
    TOWER.floor = terrainHeight(TOWER.x, TOWER.z) + TOWER.top;
    const towerParts = [];
    const tg = terrainHeight(TOWER.x, TOWER.z);
    [[-2.3, -2.3], [2.3, -2.3], [-2.3, 2.3], [2.3, 2.3]].forEach(([px, pz]) => {
      const h = TOWER.floor - tg + 3.2;
      towerParts.push({ geo: new THREE.CylinderGeometry(0.16, 0.2, h, 7), matrix: U.m4(px, tg + h / 2 - 0.3, pz), color: 0x6f4f32 });
      colliders.push({ x: TOWER.x + px, z: TOWER.z + pz, r: 0.35, top: TOWER.floor + 3 });
    });
    towerParts.push({ geo: new THREE.BoxGeometry(5.4, 0.18, 5.4), matrix: U.m4(0, TOWER.floor - 0.09, 0), color: 0xa87a4e });
    [[0, 2.6, 5.4, 0.12], [-2.6, 0, 0.12, 5.4], [2.6, 0, 0.12, 5.4]].forEach(([px, pz, w, d]) => {
      towerParts.push({ geo: new THREE.BoxGeometry(w, 0.1, d), matrix: U.m4(px, TOWER.floor + 1.0, pz), color: 0x8a6440 });
      towerParts.push({ geo: new THREE.BoxGeometry(w, 0.9, d), matrix: U.m4(px, TOWER.floor + 0.45, pz), color: 0x9a7048 });
    });
    [[-1.6, -2.6], [1.6, -2.6]].forEach(([px, pz]) => towerParts.push({ geo: new THREE.BoxGeometry(2.2, 0.9, 0.1), matrix: U.m4(px, TOWER.floor + 0.45, pz), color: 0x9a7048 }));
    const roofShape = new THREE.ConeGeometry(4.6, 1.6, 4, 1);
    towerParts.push({ geo: roofShape, matrix: U.m4(0, TOWER.floor + 3.4, 0, 0, Math.PI / 4), color: 0x6b4a3a });
    for (let i = 0; i <= 18; i += 1) {
      const t = i / 18;
      const z = -10.5 + t * 8;
      const y = U.lerp(TOWER.base, TOWER.floor, t);
      towerParts.push({ geo: new THREE.BoxGeometry(1.5, 0.08, 0.32), matrix: U.m4(0, y - 0.04, z), color: 0xb08250 });
    }
    [-0.78, 0.78].forEach((px) => {
      const len = Math.hypot(8, TOWER.floor - TOWER.base);
      towerParts.push({ geo: new THREE.BoxGeometry(0.1, 0.12, len), matrix: U.m4(px, (TOWER.base + TOWER.floor) / 2 + 0.9, -6.5, -Math.atan2(TOWER.floor - TOWER.base, 8)), color: 0x6f4f32 });
    });
    const tower = new THREE.Mesh(U.merge(towerParts), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85 }));
    tower.position.set(TOWER.x, 0, TOWER.z);
    tower.castShadow = true;
    tower.receiveShadow = true;
    scene.add(tower);

    // кормушка с сеном — олени любят собираться здесь
    const fg = terrainHeight(FEEDER.x, FEEDER.z);
    const feederParts = [];
    [[-1.4, -0.8], [1.4, -0.8], [-1.4, 0.8], [1.4, 0.8]].forEach(([px, pz]) => feederParts.push({ geo: new THREE.BoxGeometry(0.16, 2.4, 0.16), matrix: U.m4(px, fg + 1.2, pz), color: 0x6f4f32 }));
    feederParts.push({ geo: new THREE.BoxGeometry(3.0, 0.7, 1.4), matrix: U.m4(0, fg + 0.85, 0), color: 0x9a7048 });
    feederParts.push({ geo: new THREE.BoxGeometry(2.8, 0.5, 1.2), matrix: U.m4(0, fg + 1.35, 0), color: 0xe2c25a });
    [-1, 1].forEach((s) => feederParts.push({ geo: new THREE.BoxGeometry(3.6, 0.08, 1.2), matrix: U.m4(0, fg + 2.55, s * 0.5, s * 0.55), color: 0x7a4e36 }));
    const feeder = new THREE.Mesh(U.merge(feederParts), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 }));
    feeder.position.set(FEEDER.x, 0, FEEDER.z);
    feeder.castShadow = true;
    feeder.receiveShadow = true;
    scene.add(feeder);
    colliders.push({ x: FEEDER.x, z: FEEDER.z, r: 1.5, top: fg + 2.6 });

    // ---------- Деревья ----------
    const blobGeo = (() => {
      const g = new THREE.IcosahedronGeometry(1, 1);
      const p = g.attributes.position;
      const r2 = U.random(77);
      const seen = new Map();
      for (let i = 0; i < p.count; i += 1) {
        const k = `${p.getX(i).toFixed(3)},${p.getY(i).toFixed(3)},${p.getZ(i).toFixed(3)}`;
        if (!seen.has(k)) seen.set(k, 0.86 + r2() * 0.28);
        const f = seen.get(k);
        p.setXYZ(i, p.getX(i) * f, p.getY(i) * f, p.getZ(i) * f);
      }
      g.computeVertexNormals();
      return g;
    })();
    const blobLow = new THREE.IcosahedronGeometry(1, 0);
    const coneGeo = (() => { const g = new THREE.ConeGeometry(1, 1, 9, 1); g.translate(0, 0.5, 0); return g; })();
    const trunkGeo = (() => { const g = new THREE.CylinderGeometry(0.65, 1, 1, 7); g.translate(0, 0.5, 0); return g; })();
    const birchTex = U.canvasTexture(64, (ctx, s) => {
      ctx.fillStyle = "#efebe3";
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 18; i += 1) {
        ctx.fillStyle = `rgba(35,35,35,${0.5 + Math.random() * 0.4})`;
        ctx.fillRect(Math.random() * s, Math.random() * s, 4 + Math.random() * 16, 2 + Math.random() * 3);
      }
    });
    const trunks = [];
    const birches = [];
    const crowns = [];
    const crownsLow = [];
    const cones = [];
    const greens = SEASON.greens;
    const avoid = (x, z, pad) => {
      if (Math.hypot(x - LAKE.x, z - LAKE.z) < LAKE.r + 4 + pad) return true;
      if (distToPolyline(x, z, TRAIL) < 2.6 + pad) return true;
      if (distToPolyline(x, z, STREAM) < 3.4 + pad) return true;
      if (Math.hypot(x - TOWER.x, z - TOWER.z + 4) < 9 + pad) return true;
      if (Math.hypot(x - FEEDER.x, z - FEEDER.z) < 7 + pad) return true;
      return false;
    };
    world.avoid = avoid;
    const plantTree = (x, z, kind, s, far) => {
      const y = terrainHeight(x, z) - 0.15;
      const yaw = random() * 6.28;
      const shade = greens[Math.floor(random() * greens.length)];
      const list = far ? crownsLow : crowns;
      if (kind === "oak") {
        const h = (3.6 + random() * 1.6) * s;
        trunks.push({ x, y, z, sx: 0.34 * s, sy: h + 1.2 * s, sz: 0.34 * s, ry: yaw, color: 0x5d4532 });
        [[0, 1.3, 0, 2.2], [1.4, 0.6, 0.4, 1.7], [-1.3, 0.7, -0.5, 1.7], [0.3, 0.5, 1.4, 1.5], [-0.3, 2.2, 0.2, 1.4]].forEach(([dx, dy, dz, r]) => {
          const rr = r * s * (0.85 + random() * 0.3);
          list.push({ x: x + (dx * Math.cos(yaw) - dz * Math.sin(yaw)) * s, y: y + h + dy * s, z: z + (dx * Math.sin(yaw) + dz * Math.cos(yaw)) * s, sx: rr, sy: rr * 0.82, sz: rr, ry: random() * 3, color: shade });
        });
        colliders.push({ x, z, r: 0.45 * s, top: y + h });
        canopies.push({ x, z, r: 3.2 * s, bottom: y + h - 1.5 * s, top: y + h + 4 * s });
      } else if (kind === "birch") {
        const h = (6 + random() * 3) * s;
        birches.push({ x, y, z, sx: 0.18 * s, sy: h, sz: 0.18 * s, ry: yaw, color: 0xffffff });
        const bg = random() < 0.12 && !SEASON.snow ? 0xc9b24a : SEASON.birch[Math.floor(random() * SEASON.birch.length)];
        for (let i = 0; i < 4; i += 1) {
          const a = yaw + i * 1.6;
          const rr = (1.5 - i * 0.12) * s * (0.85 + random() * 0.3);
          list.push({ x: x + Math.cos(a) * 0.7 * s, y: y + h * (0.68 + i * 0.1), z: z + Math.sin(a) * 0.7 * s, sx: rr, sy: rr * 1.2, sz: rr, ry: random() * 3, color: bg });
        }
        colliders.push({ x, z, r: 0.25 * s, top: y + h });
        canopies.push({ x, z, r: 2 * s, bottom: y + h * 0.6, top: y + h + 2 * s });
      } else {
        const col = SEASON.spruce[Math.floor(random() * SEASON.spruce.length)];
        trunks.push({ x, y, z, sx: 0.26 * s, sy: 2 * s, sz: 0.26 * s, ry: yaw, color: 0x4e3726 });
        for (let i = 0; i < 4; i += 1) {
          const rr = (2.6 - i * 0.5) * s;
          cones.push({ x, y: y + (1.0 + i * 1.6) * s, z, sx: rr, sy: 3.0 * s, sz: rr, ry: yaw + i, color: col });
          if (SEASON.snow) cones.push({ x, y: y + (1.0 + i * 1.6) * s + 1.5 * s, z, sx: rr * 0.6, sy: 1.6 * s, sz: rr * 0.6, ry: yaw + i, color: 0xf4f8fb });
        }
        colliders.push({ x, z, r: 0.4 * s, top: y + 8 * s });
        canopies.push({ x, z, r: 2.8 * s, bottom: y + 0.6 * s, top: y + 8 * s });
      }
    };
    const step = 5.6;
    for (let gx = -185; gx < 185; gx += step) {
      for (let gz = -185; gz < 185; gz += step) {
        const x = gx + random() * step * 0.9;
        const z = gz + random() * step * 0.9;
        const r = Math.hypot(x, z);
        if (r > 190) continue;
        const meadow = Math.hypot(x - MEADOW.x, z - MEADOW.z);
        const density = 0.08 + 0.85 * U.smooth(meadow, 34, 78);
        const clearing = Math.sin(x * 0.07 + 2) * Math.cos(z * 0.06 - 1) > 0.72 && r < 100;
        if (random() > (clearing ? 0.15 : density) || avoid(x, z, 0)) continue;
        const pick = random();
        const kind = pick < 0.38 ? "spruce" : pick < 0.72 ? "oak" : "birch";
        plantTree(x, z, kind, 0.75 + random() * 0.6, r > 128);
      }
    }
    const crownMat = windMaterial({ color: 0xffffff, roughness: 0.85 }, 0.02);
    makeBatches(scene, trunkGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 }), trunks, { shadow: true });
    makeBatches(scene, trunkGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, map: birchTex, roughness: 0.8 }), birches, { shadow: true });
    makeBatches(scene, blobGeo, crownMat, crowns, { shadow: true });
    makeBatches(scene, blobLow, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, flatShading: true }), crownsLow, { shadow: false });
    makeBatches(scene, coneGeo, windMaterial({ color: 0xffffff, roughness: 0.85 }, 0.015), cones, { shadow: true });

    // ---------- Кусты, камни, пни, брёвна, грибы ----------
    const bushes = [];
    const berries = [];
    const rocks = [];
    const stumps = [];
    for (let i = 0; i < 260; i += 1) {
      const a = random() * Math.PI * 2;
      const d = 20 + random() * 110;
      const x = MEADOW.x + Math.cos(a) * d;
      const z = MEADOW.z + Math.sin(a) * d;
      if (Math.hypot(x, z) > 135 || avoid(x, z, -1.5)) continue;
      const y = terrainHeight(x, z);
      const kind = random();
      if (kind < 0.55) {
        const s = 0.7 + random() * 0.7;
        for (let k = 0; k < 3; k += 1) {
          const rr = s * (0.6 + random() * 0.45);
          bushes.push({ x: x + (random() - 0.5) * s * 1.6, y: y + rr * 0.45, z: z + (random() - 0.5) * s * 1.6, sx: rr, sy: rr * 0.8, sz: rr, ry: random() * 3, color: greens[Math.floor(random() * 5)] });
        }
        if (random() < 0.35) {
          const bc = random() < 0.5 ? 0xd1233c : 0x3b3f9e;
          for (let k = 0; k < 7; k += 1) berries.push({ x: x + (random() - 0.5) * s * 2, y: y + 0.4 + random() * s, z: z + (random() - 0.5) * s * 2, sx: 0.09, color: bc });
        }
      } else if (kind < 0.85) {
        const s = 0.4 + random() * 1.3;
        rocks.push({ x, y: y + s * 0.25, z, sx: s, sy: s * 0.65, sz: s * (0.8 + random() * 0.4), rx: random(), ry: random() * 3, rz: random(), color: random() < 0.5 ? 0x8f8c84 : 0x7f8a74 });
        if (s > 1.1) colliders.push({ x, z, r: s * 0.75, top: y + s * 0.6 });
      } else {
        const s = 0.8 + random() * 0.5;
        stumps.push({ x, y: y - 0.05, z, sx: 0.42 * s, sy: 0.55 * s, sz: 0.42 * s, color: 0x6b4c34 });
        colliders.push({ x, z, r: 0.45 * s, top: y + 0.5 * s });
      }
    }
    // большие валуны у вышки и на склоне — укрытия
    [[-62, -58, 3.4], [-56, -64, 2.6], [-70, -52, 2.2], [12, 58, 2.8], [18, 62, 2.0], [-95, 10, 3.0]].forEach(([x, z, s]) => {
      const y = terrainHeight(x, z);
      rocks.push({ x, y: y + s * 0.3, z, sx: s, sy: s * 0.7, sz: s * 0.9, rx: random(), ry: random() * 3, rz: random() * 0.3, color: 0x8f8c84 });
      colliders.push({ x, z, r: s * 0.85, top: y + s });
    });
    makeBatches(scene, blobGeo, windMaterial({ color: 0xffffff, roughness: 0.85 }, 0.03), bushes, { shadow: true });
    makeBatches(scene, new THREE.IcosahedronGeometry(1, 0), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 }), berries, { shadow: false });
    makeBatches(scene, new THREE.DodecahedronGeometry(1, 0), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95, flatShading: true }), rocks, { shadow: true });
    makeBatches(scene, (() => { const g = new THREE.CylinderGeometry(0.85, 1, 1, 9); g.translate(0, 0.5, 0); return g; })(), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 }), stumps, { shadow: true });

    // упавшие брёвна
    const logParts = [];
    [[-48, -18, 0.6], [6, 44, 2.1], [-8, -30, 1.2], [60, 16, -0.4]].forEach(([x, z, yaw]) => {
      const y = terrainHeight(x, z) + 0.35;
      logParts.push({ geo: new THREE.CylinderGeometry(0.38, 0.45, 6, 10), matrix: U.m4(x, y, z, Math.PI / 2, yaw), color: 0x6b4c34 });
      logParts.push({ geo: new THREE.CylinderGeometry(0.3, 0.3, 0.05, 10), matrix: U.m4(x + Math.sin(yaw) * 3.01, y, z + Math.cos(yaw) * 3.01, Math.PI / 2, yaw), color: 0xc9a77c });
      colliders.push({ x, z, r: 1.2, top: y + 0.4 });
      colliders.push({ x: x + Math.sin(yaw) * 2.2, z: z + Math.cos(yaw) * 2.2, r: 0.7, top: y + 0.4 });
      colliders.push({ x: x - Math.sin(yaw) * 2.2, z: z - Math.cos(yaw) * 2.2, r: 0.7, top: y + 0.4 });
    });
    const logs = new THREE.Mesh(U.merge(logParts), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 }));
    logs.castShadow = true;
    logs.receiveShadow = true;
    scene.add(logs);

    // грибы
    const mushroomParts = [];
    for (let i = 0; i < 46; i += 1) {
      const x = -110 + random() * 220;
      const z = -110 + random() * 220;
      if (Math.hypot(x - MEADOW.x, z - MEADOW.z) < 40 || avoid(x, z, 0)) continue;
      const y = terrainHeight(x, z);
      const red = random() < 0.4;
      const s = 0.18 + random() * 0.12;
      mushroomParts.push({ geo: new THREE.CylinderGeometry(s * 0.35, s * 0.45, s * 1.2, 6), matrix: U.m4(x, y + s * 0.6, z), color: 0xf2ead8 });
      mushroomParts.push({ geo: new THREE.SphereGeometry(s, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2), matrix: U.m4(x, y + s * 1.1, z), color: red ? 0xd3302a : 0x9a5a2a });
    }
    scene.add(new THREE.Mesh(U.merge(mushroomParts), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6 })));

    // ---------- Высокая трава и цветы ----------
    const tuftGeo = (() => {
      const parts = [];
      [[0, 0, 1, 0, 0], [0.12, 0.05, 0.85, 0.3, 1.2], [-0.1, 0.08, 0.9, -0.28, 2.6], [0.04, -0.12, 0.75, 0.28, 4], [-0.06, -0.08, 0.7, -0.3, 5.3]].forEach(([ox, oz, h, tilt, yaw]) => {
        const b = new THREE.ConeGeometry(0.05, 1, 3, 1, true);
        b.translate(0, 0.5, 0);
        b.scale(1, h, 1);
        b.rotateZ(tilt);
        b.rotateY(yaw);
        b.translate(ox, 0, oz);
        parts.push({ geo: b, color: 0xffffff });
      });
      return U.merge(parts);
    })();
    const tufts = [];
    const flowers = [];
    const grassGreens = SEASON.tuft;
    const flowerColors = [0xffffff, 0xffd23f, 0xb784f0, 0xff7ab8, 0x5aa0ff, 0xff5a4a, 0xff9a3c];
    for (let i = 0; i < 9500; i += 1) {
      const meadowPick = random() < 0.62;
      const a = random() * Math.PI * 2;
      const d = meadowPick ? Math.sqrt(random()) * MEADOW.r * 1.15 : random() * 125;
      const x = meadowPick ? MEADOW.x + Math.cos(a) * d : Math.cos(a) * d;
      const z = meadowPick ? MEADOW.z + Math.sin(a) * d : Math.sin(a) * d;
      if (Math.hypot(x, z) > 140 || Math.hypot(x - LAKE.x, z - LAKE.z) < LAKE.r + 1 || distToPolyline(x, z, TRAIL) < 1.3 || distToPolyline(x, z, STREAM) < 2) continue;
      const y = terrainHeight(x, z) - 0.05;
      const tall = meadowPick ? 0.6 + random() * 0.45 : 0.4 + random() * 0.35;
      tufts.push({ x, y, z, sx: 1.2 + random() * 0.6, sy: tall, sz: 1.2 + random() * 0.6, ry: random() * 6.28, color: grassGreens[Math.floor(random() * grassGreens.length)] });
      if (meadowPick && SEASON.flowers && random() < 0.16) {
        const fc = flowerColors[Math.floor(random() * flowerColors.length)];
        const n = 1 + Math.floor(random() * 3);
        for (let k = 0; k < n; k += 1) flowers.push({ x: x + (random() - 0.5) * 0.8, y: y + tall * 0.75 + random() * 0.25, z: z + (random() - 0.5) * 0.8, sx: 0.09 + random() * 0.04, sy: 0.06, color: fc });
      }
    }
    makeBatches(scene, tuftGeo, windMaterial({ color: 0xffffff, roughness: 1, side: THREE.DoubleSide, vertexColors: false }, 0.16), tufts, { shadow: false, cell: 60 });
    makeBatches(scene, new THREE.OctahedronGeometry(1, 0), windMaterial({ color: 0xffffff, roughness: 0.6 }, 0.12), flowers, { shadow: false, cell: 60 });

    // камыши и кувшинки у озера
    const reeds = [];
    const pads = [];
    for (let i = 0; i < 420; i += 1) {
      const a = random() * Math.PI * 2;
      const d = LAKE.r * (0.86 + random() * 0.22);
      const x = LAKE.x + Math.cos(a) * d;
      const z = LAKE.z + Math.sin(a) * d;
      if (Math.cos(a) < -0.6 && Math.sin(a) > 0) continue; // проход к воде для оленей
      const reedColor = SEASON.snow ? 0xc9b98a : random() < 0.3 ? 0x8a9a4a : 0x5f8a3a;
      reeds.push({ x, y: terrainHeight(x, z) - 0.2, z, sx: 1.6, sy: 1.4 + random() * 1.0, sz: 1.6, ry: random() * 6, color: reedColor });
    }
    for (let i = 0; i < (SEASON.ice ? 0 : 70); i += 1) {
      const a = random() * Math.PI * 2;
      const d = LAKE.r * (0.35 + random() * 0.5);
      pads.push({ x: LAKE.x + Math.cos(a) * d, y: 0.05, z: LAKE.z + Math.sin(a) * d, sx: 0.45 + random() * 0.3, sy: 1, ry: random() * 6, color: random() < 0.15 ? 0xf2a6c8 : 0x3f8a3a });
    }
    makeBatches(scene, tuftGeo, windMaterial({ color: 0xffffff, roughness: 1, side: THREE.DoubleSide }, 0.12), reeds, { shadow: false });
    makeBatches(scene, (() => { const g = new THREE.CircleGeometry(1, 10, 0.3, Math.PI * 1.85); g.rotateX(-Math.PI / 2); return g; })(), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, side: THREE.DoubleSide }), pads, { shadow: false });

    // далёкие горы за лесом
    const mountainParts = [];
    for (let i = 0; i < 28; i += 1) {
      const a = (i / 28) * Math.PI * 2 + random() * 0.15;
      const d = 300 + random() * 90;
      const h = 70 + random() * 80;
      mountainParts.push({ geo: new THREE.ConeGeometry(70 + random() * 50, h, 6, 1), matrix: U.m4(Math.cos(a) * d, h / 2 - 8, Math.sin(a) * d, 0, random() * 3), color: random() < 0.5 ? 0x7f9a8a : 0x8aa39a });
      mountainParts.push({ geo: new THREE.ConeGeometry(18 + random() * 8, h * 0.28, 6, 1), matrix: U.m4(Math.cos(a) * d, h - h * 0.14 - 8 + 0.5, Math.sin(a) * d, 0, random() * 3), color: 0xf2f5f7 });
    }
    scene.add(new THREE.Mesh(U.merge(mountainParts), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, flatShading: true })));

    // ---------- Живность: бабочки, птицы, рыбы, туман ----------
    const butterflyGeo = (() => {
      const wing = new THREE.CircleGeometry(0.11, 6);
      const l = wing.clone();
      l.translate(-0.1, 0, 0);
      const r = wing.clone();
      r.translate(0.1, 0, 0);
      return U.merge([{ geo: l, color: 0xffffff }, { geo: r, color: 0xffffff }]);
    })();
    const butterflies = new THREE.InstancedMesh(butterflyGeo, new THREE.MeshBasicMaterial({ vertexColors: false, side: THREE.DoubleSide }), 46);
    butterflies.frustumCulled = false;
    const bflies = [];
    const bColors = [0xffd23f, 0xffffff, 0xff7ab8, 0x5aa0ff, 0xff9a3c];
    for (let i = 0; i < 46; i += 1) {
      const a = random() * Math.PI * 2;
      const d = Math.sqrt(random()) * MEADOW.r;
      bflies.push({ cx: MEADOW.x + Math.cos(a) * d, cz: MEADOW.z + Math.sin(a) * d, phase: random() * 10, speed: 0.4 + random() * 0.5, r: 1 + random() * 3 });
      butterflies.setColorAt(i, new THREE.Color(bColors[i % bColors.length]));
    }
    scene.add(butterflies);

    const birdGeo = U.merge([
      { geo: (() => { const g = new THREE.BoxGeometry(0.9, 0.04, 0.22); g.translate(-0.45, 0, 0); return g; })(), color: 0x2a2d33 },
      { geo: (() => { const g = new THREE.BoxGeometry(0.9, 0.04, 0.22); g.translate(0.45, 0, 0); return g; })(), color: 0x2a2d33 },
      { geo: new THREE.BoxGeometry(0.16, 0.14, 0.5), color: 0x3a3d43 }
    ]);
    const birds = new THREE.InstancedMesh(birdGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.8 }), 14);
    birds.frustumCulled = false;
    const birdData = [];
    for (let i = 0; i < 14; i += 1) birdData.push({ cx: -60 + random() * 120, cz: -60 + random() * 120, r: 25 + random() * 40, h: 28 + random() * 20, speed: 0.12 + random() * 0.1, phase: random() * 10 });
    scene.add(birds);

    const fishGeo = U.merge([
      { geo: (() => { const g = new THREE.SphereGeometry(0.22, 8, 6); g.scale(0.6, 0.7, 1.4); return g; })(), color: 0xd98a3a },
      { geo: (() => { const g = new THREE.ConeGeometry(0.16, 0.28, 4); g.rotateX(Math.PI / 2); g.translate(0, 0, -0.4); return g; })(), color: 0xc9702a }
    ]);
    const fish = new THREE.InstancedMesh(fishGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.4 }), 6);
    fish.frustumCulled = false;
    const fishData = [];
    for (let i = 0; i < 6; i += 1) fishData.push({ t: -random() * 12, x: 0, z: 0, yaw: 0 });
    scene.add(fish);
    fish.visible = !SEASON.ice;
    butterflies.visible = !!SEASON.butterflies;

    // осенью на земле опавшие листья
    if (SEASON.leaves) {
      const leafGeo = (() => {
        const sh = new THREE.Shape();
        sh.moveTo(0, -0.5); sh.lineTo(0.3, -0.1); sh.lineTo(0.22, 0.25); sh.lineTo(0, 0.5); sh.lineTo(-0.22, 0.25); sh.lineTo(-0.3, -0.1); sh.lineTo(0, -0.5);
        const g = new THREE.ShapeGeometry(sh);
        g.rotateX(-Math.PI / 2);
        return g;
      })();
      const leaves = [];
      for (let i = 0; i < 2600; i += 1) {
        const x = -130 + random() * 260;
        const z = -130 + random() * 260;
        if (Math.hypot(x - LAKE.x, z - LAKE.z) < LAKE.r + 0.5) continue;
        const s = 0.35 + random() * 0.3;
        leaves.push({ x, y: terrainHeight(x, z) + 0.06, z, sx: s, sy: 1, sz: s, rx: (random() - 0.5) * 0.3, ry: random() * 6.28, color: greens[Math.floor(random() * greens.length)] });
      }
      makeBatches(scene, leafGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, side: THREE.DoubleSide }), leaves, { shadow: false, cell: 60 });
    }
    // зимой идёт снег, на закате над лугом светлячки
    let flakes = null;
    if (SEASON.snow || SEASON.fireflies) {
      const n = SEASON.snow ? 1600 : 160;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(n * 3);
      for (let i = 0; i < n; i += 1) {
        pos[i * 3] = (random() - 0.5) * 120;
        pos[i * 3 + 1] = random() * 30;
        pos[i * 3 + 2] = (random() - 0.5) * 120;
      }
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      flakes = new THREE.Points(geo, new THREE.PointsMaterial({
        color: SEASON.snow ? 0xffffff : 0xfff07a, size: SEASON.snow ? 0.22 : 0.3, transparent: true, opacity: SEASON.snow ? 0.9 : 1,
        depthWrite: false, blending: SEASON.snow ? THREE.NormalBlending : THREE.AdditiveBlending
      }));
      flakes.frustumCulled = false;
      scene.add(flakes);
    }
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6, depthWrite: false });
    const rings = [];
    for (let i = 0; i < 8; i += 1) {
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.85, 1, 24), ringMat.clone());
      ring.rotation.x = -Math.PI / 2;
      ring.visible = false;
      scene.add(ring);
      rings.push({ mesh: ring, t: 1 });
    }
    const splash = (x, z) => {
      const r = rings.find((it) => it.t >= 1);
      if (!r) return;
      r.t = 0;
      r.mesh.position.set(x, 0.06, z);
      r.mesh.visible = true;
    };
    world.splash = splash;

    const mistTex = U.canvasTexture(128, (ctx, s) => {
      const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, "rgba(255,255,255,0.55)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, s, s);
    });
    mistTex.wrapS = mistTex.wrapT = THREE.ClampToEdgeWrapping;
    const mists = [];
    for (let i = 0; i < 26; i += 1) {
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: mistTex, transparent: true, opacity: 0.32, depthWrite: false }));
      const a = random() * Math.PI * 2;
      const d = 45 + random() * 70;
      const x = i < 6 ? LAKE.x + (random() - 0.5) * 30 : Math.cos(a) * d;
      const z = i < 6 ? LAKE.z + (random() - 0.5) * 30 : Math.sin(a) * d;
      sprite.position.set(x, terrainHeight(x, z) + 1.6, z);
      sprite.scale.set(22 + random() * 16, 5 + random() * 3, 1);
      scene.add(sprite);
      mists.push({ sprite, x, z, phase: random() * 6 });
    }

    // ---------- Оживление каждый кадр ----------
    const o = new THREE.Object3D();
    world.update = (dt, t, focus) => {
      wind.value = t;
      if (flakes && focus) {
        const p = flakes.geometry.attributes.position;
        for (let i = 0; i < p.count; i += 1) {
          let x = p.getX(i);
          let y = p.getY(i);
          let z = p.getZ(i);
          if (SEASON.snow) {
            y -= dt * (1.2 + (i % 5) * 0.25);
            x += Math.sin(t * 0.7 + i) * dt * 0.4;
          } else {
            x += Math.sin(t * 0.8 + i * 1.7) * dt * 0.6;
            y += Math.cos(t * 0.9 + i) * dt * 0.3;
          }
          if (y < 0 || Math.abs(x - focus.x) > 60 || Math.abs(z - focus.z) > 60) {
            x = focus.x + (random() - 0.5) * 120;
            z = focus.z + (random() - 0.5) * 120;
            y = SEASON.snow ? focus.y + 15 + random() * 15 : terrainHeight(x, z) + 0.6 + random() * 2.5;
          }
          p.setXYZ(i, x, y, z);
        }
        p.needsUpdate = true;
        if (SEASON.fireflies) flakes.material.opacity = 0.6 + Math.sin(t * 3) * 0.4;
      }
      waterNormal.offset.set(t * 0.012, t * 0.008);
      streamMat.normalMap.offset.set(0, -t * 0.35);
      if (focus) {
        sun.position.copy(focus).add(world.sunOffset);
        sun.target.position.copy(focus);
        sun.target.updateMatrixWorld();
      }
      bflies.forEach((b, i) => {
        b.phase += dt * b.speed;
        const x = b.cx + Math.sin(b.phase * 1.3) * b.r + Math.sin(b.phase * 3.1) * 0.4;
        const z = b.cz + Math.cos(b.phase * 0.9) * b.r;
        const y = terrainHeight(x, z) + 0.9 + Math.sin(b.phase * 2.3) * 0.35;
        o.position.set(x, y, z);
        o.rotation.set(0, b.phase * 2, 0);
        const flap = 0.25 + Math.abs(Math.sin(t * 16 + i)) * 0.9;
        o.scale.set(flap, 1, 1);
        o.updateMatrix();
        butterflies.setMatrixAt(i, o.matrix);
      });
      butterflies.instanceMatrix.needsUpdate = true;
      birdData.forEach((b, i) => {
        const a = t * b.speed + b.phase;
        o.position.set(b.cx + Math.cos(a) * b.r, b.h + Math.sin(a * 2) * 2, b.cz + Math.sin(a) * b.r);
        o.rotation.set(0, -a, Math.sin(a * 3) * 0.2);
        o.scale.set(1, 1 + Math.sin(t * 9 + i) * 0.6, 1);
        o.updateMatrix();
        birds.setMatrixAt(i, o.matrix);
      });
      birds.instanceMatrix.needsUpdate = true;
      if (!SEASON.ice) fishData.forEach((f, i) => {
        f.t += dt;
        if (f.t > 1.1 || f.t < 0) {
          if (f.t > 1.1) f.t = -3 - random() * 9;
          o.scale.set(0, 0, 0);
          if (f.t < 0 && f.t > -dt * 1.5) {
            const a = random() * Math.PI * 2;
            const d = LAKE.r * (0.2 + random() * 0.55);
            f.x = LAKE.x + Math.cos(a) * d;
            f.z = LAKE.z + Math.sin(a) * d;
            f.yaw = random() * 6.28;
            f.t = 0;
            splash(f.x, f.z);
          }
        } else {
          const k = f.t / 1.1;
          o.position.set(f.x + Math.sin(f.yaw) * (k - 0.5) * 1.6, Math.sin(k * Math.PI) * 1.1 - 0.1, f.z + Math.cos(f.yaw) * (k - 0.5) * 1.6);
          o.rotation.set(-Math.cos(k * Math.PI) * 1.1, f.yaw, 0);
          o.scale.set(1, 1, 1);
          if (Math.abs(f.t - 1.0) < dt) splash(o.position.x, o.position.z);
        }
        o.updateMatrix();
        fish.setMatrixAt(i, o.matrix);
      });
      fish.instanceMatrix.needsUpdate = true;
      rings.forEach((r) => {
        if (r.t >= 1) return;
        r.t += dt * 0.8;
        const s = 0.3 + r.t * 2.4;
        r.mesh.scale.set(s, s, s);
        r.mesh.material.opacity = 0.6 * (1 - r.t);
        if (r.t >= 1) r.mesh.visible = false;
      });
      mists.forEach((m) => {
        m.sprite.position.x = m.x + Math.sin(t * 0.05 + m.phase) * 4;
        m.sprite.material.opacity = 0.24 + Math.sin(t * 0.2 + m.phase) * 0.08;
      });
      clouds.forEach((cl, i) => { cl.position.x += dt * (0.6 + (i % 3) * 0.2); if (cl.position.x > 600) cl.position.x = -600; });
      sky.position.copy(focus || sky.position);
    };

    // места, куда ходят стада
    world.grazeSpots = [
      [MEADOW.x, MEADOW.z], [MEADOW.x - 18, MEADOW.z + 14], [MEADOW.x + 16, MEADOW.z - 10], [MEADOW.x + 6, MEADOW.z + 22],
      [FEEDER.x + 3, FEEDER.z - 4], [-50, -20], [-20, -40], [14, 40], [60, 20], [-60, 70]
    ];
    world.drinkSpots = [];
    for (let i = 0; i < 6; i += 1) {
      const a = Math.PI * 0.62 + (i / 6) * Math.PI * 0.5;
      world.drinkSpots.push([LAKE.x + Math.cos(a) * (LAKE.r + 1.2), LAKE.z + Math.sin(a) * (LAKE.r + 1.2)]);
    }
    world.distToStream = (x, z) => distToPolyline(x, z, STREAM);
    world.season = SEASON;
    world.root = root;
    // убрать карту целиком и освободить видеопамять
    world.dispose = () => {
      parentScene.remove(root);
      root.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        [].concat(o.material || []).forEach((m) => {
          ["map", "normalMap"].forEach((k) => { if (m[k]) m[k].dispose(); });
          m.dispose();
        });
      });
    };
    return world;
  }

  window.HideWorld = { build };
})();
