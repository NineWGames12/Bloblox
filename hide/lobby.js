// «Кто из них?» — лобби: поляна с костром, домик охотника, лавка продавца и круги голосования за карту.
(function () {
  "use strict";
  const U = window.HideUtil;

  // картинка карты для щита над кругом голосования
  function drawPreview(ctx, map, w, h) {
    const pal = {
      summer: { sky: ["#7fb8f0", "#ffe2b8"], ground: ["#7cbf55", "#4f8f3a"], tree: ["#2f6a3a", "#3b7a3f"], crown: "#5f9f44", lake: "#4fa3c7" },
      autumn: { sky: ["#86b2e0", "#ffd2a0"], ground: ["#b8a24a", "#8a7a3a"], tree: ["#2f6a3a", "#356a3a"], crown: "#d9822b", lake: "#4f9ac0" },
      winter: { sky: ["#9fc2ea", "#f2f4f8"], ground: ["#f2f6fa", "#d5e0ea"], tree: ["#2d5240", "#34584a"], crown: "#eef3f7", lake: "#cfe6f2" },
      sunset: { sky: ["#4a4f9a", "#ff9a6a"], ground: ["#5a8a3a", "#3a5a2a"], tree: ["#24452a", "#2a5030"], crown: "#4b7a38", lake: "#e08a7a" }
    }[map.season];
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.6);
    sky.addColorStop(0, pal.sky[0]);
    sky.addColorStop(1, pal.sky[1]);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = map.season === "sunset" ? "#ffd27a" : "#fff6d8";
    ctx.beginPath();
    ctx.arc(w * (map.season === "sunset" ? 0.5 : 0.78), h * (map.season === "sunset" ? 0.5 : 0.22), h * 0.09, 0, Math.PI * 2);
    ctx.fill();
    // холмы
    ctx.fillStyle = map.season === "winter" ? "#c9d6e2" : "#6f8f7a";
    ctx.beginPath();
    ctx.moveTo(0, h * 0.55);
    for (let x = 0; x <= w; x += w / 8) ctx.lineTo(x, h * (0.4 + Math.sin(x * 0.02 + map.seed) * 0.06));
    ctx.lineTo(w, h * 0.6);
    ctx.lineTo(0, h * 0.6);
    ctx.fill();
    const ground = ctx.createLinearGradient(0, h * 0.55, 0, h);
    ground.addColorStop(0, pal.ground[0]);
    ground.addColorStop(1, pal.ground[1]);
    ctx.fillStyle = ground;
    ctx.fillRect(0, h * 0.55, w, h * 0.45);
    // озеро
    ctx.fillStyle = pal.lake;
    ctx.beginPath();
    ctx.ellipse(w * (0.3 + (map.seed % 3) * 0.2), h * 0.72, w * 0.16, h * 0.07, 0, 0, Math.PI * 2);
    ctx.fill();
    // ели и лиственные деревья
    const r = U.random(map.seed * 31);
    for (let i = 0; i < 16; i += 1) {
      const x = r() * w;
      const y = h * (0.5 + r() * 0.12);
      const s = 0.7 + r() * 0.6;
      if (r() < 0.55) {
        ctx.fillStyle = pal.tree[i % 2];
        for (let k = 0; k < 3; k += 1) {
          ctx.beginPath();
          ctx.moveTo(x - (16 - k * 4) * s, y - k * 12 * s);
          ctx.lineTo(x + (16 - k * 4) * s, y - k * 12 * s);
          ctx.lineTo(x, y - (24 + k * 12) * s);
          ctx.fill();
          if (map.season === "winter") {
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.moveTo(x - 6 * s, y - (16 + k * 12) * s);
            ctx.lineTo(x + 6 * s, y - (16 + k * 12) * s);
            ctx.lineTo(x, y - (24 + k * 12) * s);
            ctx.fill();
            ctx.fillStyle = pal.tree[i % 2];
          }
        }
      } else {
        ctx.fillStyle = "#5a3e2a";
        ctx.fillRect(x - 2 * s, y - 18 * s, 4 * s, 18 * s);
        ctx.fillStyle = pal.crown;
        ctx.beginPath();
        ctx.arc(x, y - 26 * s, 13 * s, 0, Math.PI * 2);
        ctx.arc(x - 9 * s, y - 20 * s, 9 * s, 0, Math.PI * 2);
        ctx.arc(x + 9 * s, y - 20 * s, 9 * s, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // олени
    const deer = (x, y, s) => {
      ctx.fillStyle = "#9a6234";
      ctx.beginPath();
      ctx.ellipse(x, y, 16 * s, 8 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      [-10, -5, 6, 11].forEach((lx) => ctx.fillRect(x + lx * s - 1.5 * s, y + 4 * s, 3 * s, 15 * s));
      ctx.beginPath();
      ctx.moveTo(x + 9 * s, y - 4 * s);
      ctx.lineTo(x + 14 * s, y - 18 * s);
      ctx.lineTo(x + 19 * s, y - 16 * s);
      ctx.lineTo(x + 14 * s, y - 2 * s);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(x + 18 * s, y - 20 * s, 6 * s, 4 * s, 0.3, 0, Math.PI * 2);
      ctx.fill();
    };
    deer(w * 0.55, h * 0.85, 1.4);
    deer(w * 0.75, h * 0.8, 1.1);
    deer(w * 0.2, h * 0.88, 1.2);
    if (map.season === "winter") {
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      for (let i = 0; i < 70; i += 1) ctx.fillRect(r() * w, r() * h, 2, 2);
    }
    if (map.season === "sunset") {
      ctx.fillStyle = "rgba(255,240,120,0.9)";
      for (let i = 0; i < 18; i += 1) ctx.fillRect(r() * w, h * (0.6 + r() * 0.35), 3, 3);
    }
  }

  function build(parentScene, maps) {
    const root = new THREE.Group();
    parentScene.add(root);
    const random = U.random(777);
    const colliders = [];
    const lobby = { root, colliders, pads: [], R: 36 };
    const flat = (x, z) => {
      const r = Math.hypot(x, z);
      return U.smooth(r, 40, 80) * U.smooth(r, 40, 80) * 22 + U.smooth(r, 40, 80) * 3 * Math.sin(x * 0.11 + z * 0.09);
    };
    lobby.groundAt = (x, z) => {
      // на кругах голосования стоишь чуть выше
      for (const pad of lobby.pads) if (Math.hypot(x - pad.x, z - pad.z) < 2.65) return 0.3;
      return flat(x, z);
    };

    // небо и свет — как на карте «Лесная поляна»
    const sky = new THREE.Mesh(new THREE.SphereGeometry(700, 24, 12), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, fog: false,
      vertexShader: "varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "varying vec3 vDir; void main(){ float h = clamp(vDir.y, 0.0, 1.0); gl_FragColor = vec4(mix(vec3(0.98,0.86,0.72), vec3(0.36,0.62,0.95), pow(h, 0.55)), 1.0); }"
    }));
    root.add(sky);
    root.add(new THREE.HemisphereLight(0xd7ecff, 0x6f6146, 0.8));
    const sun = new THREE.DirectionalLight(0xffe2b8, 1.3);
    sun.position.set(-60, 90, 70);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    ["left", "right", "top", "bottom"].forEach((k, i) => { sun.shadow.camera[k] = i % 2 ? 45 : -45; });
    sun.shadow.camera.left = -45;
    sun.shadow.camera.right = 45;
    sun.shadow.camera.top = 45;
    sun.shadow.camera.bottom = -45;
    sun.shadow.camera.far = 300;
    sun.shadow.bias = -0.0006;
    root.add(sun);
    root.add(sun.target);

    // земля: трава, каменная площадка у костра, тропинки
    const g = new THREE.PlaneGeometry(240, 240, 120, 120);
    g.rotateX(-Math.PI / 2);
    const p = g.attributes.position;
    const col = new Float32Array(p.count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < p.count; i += 1) {
      const x = p.getX(i);
      const z = p.getZ(i);
      p.setY(i, flat(x, z));
      const r = Math.hypot(x, z);
      c.set(0x6aa84a).lerp(new THREE.Color(0x9cb85a), Math.max(0, Math.sin(x * 0.13) * Math.cos(z * 0.11)) * 0.4);
      if (r < 15) c.lerp(new THREE.Color(0xb9b2a4), (1 - U.smooth(r, 13.5, 15)));
      const path = Math.min(Math.abs(x) - 1.6, 99) < 0 && z < -14 && z > -24 ? 1 : 0;
      if (path) c.set(0x9a7b52);
      c.lerp(new THREE.Color(0x4e6e36), U.smooth(r, 40, 70) * 0.7);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    g.computeVertexNormals();
    const groundMesh = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }));
    groundMesh.receiveShadow = true;
    root.add(groundMesh);
    // плитка площадки
    const tileTex = U.canvasTexture(128, (ctx, s) => {
      ctx.fillStyle = "#8f887c";
      ctx.fillRect(0, 0, s, s);
      for (let y = 0; y < 4; y += 1) {
        for (let x = 0; x < 4; x += 1) {
          const v = 128 + Math.floor(Math.random() * 30);
          ctx.fillStyle = `rgb(${v},${v - 6},${v - 16})`;
          ctx.fillRect(x * 32 + (y % 2) * 16 + 2, y * 32 + 2, 28, 28);
        }
      }
    }, 6);
    const plaza = new THREE.Mesh(new THREE.CircleGeometry(14.5, 48), new THREE.MeshStandardMaterial({ map: tileTex, roughness: 0.95 }));
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.y = 0.03;
    plaza.receiveShadow = true;
    root.add(plaza);

    const parts = [];
    const put = (geo, x, y, z, color, rx = 0, ry = 0, rz = 0) => parts.push({ geo, matrix: U.m4(x, y, z, rx, ry, rz), color });

    // костёр в центре: камни, брёвна, огонь и тёплый свет
    for (let i = 0; i < 10; i += 1) {
      const a = (i / 10) * Math.PI * 2;
      put(new THREE.DodecahedronGeometry(0.42, 0), Math.cos(a) * 1.5, 0.25, Math.sin(a) * 1.5, 0x8f8c84, a, a, 0);
    }
    for (let i = 0; i < 4; i += 1) {
      const a = (i / 4) * Math.PI * 2 + 0.4;
      put(new THREE.CylinderGeometry(0.16, 0.18, 1.8, 7), Math.cos(a) * 0.4, 0.45, Math.sin(a) * 0.4, 0x5a3e2a, 0.9, a, 0);
    }
    colliders.push({ x: 0, z: 0, r: 2.1 });
    const flames = [];
    const fireMat = new THREE.MeshBasicMaterial({ color: 0xff8a2a, transparent: true, opacity: 0.9 });
    const fireMat2 = new THREE.MeshBasicMaterial({ color: 0xffd23f, transparent: true, opacity: 0.95 });
    [[0, 0, 0.6, 1.6, fireMat], [0.25, 0.1, 0.4, 1.1, fireMat2], [-0.2, -0.15, 0.38, 1.0, fireMat2], [0.05, 0.25, 0.3, 0.9, fireMat]].forEach(([x, z, r, h, m]) => {
      const flame = new THREE.Mesh(new THREE.ConeGeometry(r, h, 7), m);
      flame.position.set(x, 0.45 + h / 2, z);
      root.add(flame);
      flames.push({ mesh: flame, h, phase: random() * 6 });
    });
    const fireLight = new THREE.PointLight(0xff9a4a, 1.4, 20, 2);
    fireLight.position.set(0, 2, 0);
    root.add(fireLight);
    // лавки-брёвна вокруг костра
    [0.3, 1.9, 3.5, 5.1].forEach((a) => {
      const x = Math.cos(a) * 5.2;
      const z = Math.sin(a) * 5.2;
      put(new THREE.CylinderGeometry(0.42, 0.45, 3.2, 10), x, 0.42, z, 0x7a5236, 0, -a + Math.PI / 2, Math.PI / 2);
      colliders.push({ x, z, r: 1.2 });
    });

    // домик охотника за костром
    const lodgeZ = -26;
    for (let row = 0; row < 9; row += 1) {
      const y = 0.25 + row * 0.5;
      put(new THREE.CylinderGeometry(0.26, 0.26, 12.6, 8), 0, y, lodgeZ + 4, row % 2 ? 0x8a5a36 : 0x7a4e2e, 0, 0, Math.PI / 2);
      put(new THREE.CylinderGeometry(0.26, 0.26, 12.6, 8), 0, y, lodgeZ - 4, row % 2 ? 0x8a5a36 : 0x7a4e2e, 0, 0, Math.PI / 2);
      [-6, 6].forEach((x) => put(new THREE.CylinderGeometry(0.26, 0.26, 8.6, 8), x, y + 0.25, lodgeZ, row % 2 ? 0x7a4e2e : 0x8a5a36, Math.PI / 2, 0, 0));
    }
    const roofShape = new THREE.Shape();
    roofShape.moveTo(-5.6, 0);
    roofShape.lineTo(5.6, 0);
    roofShape.lineTo(0, 3.4);
    roofShape.lineTo(-5.6, 0);
    const roofGeo = new THREE.ExtrudeGeometry(roofShape, { depth: 14, bevelEnabled: false });
    roofGeo.translate(0, 0, -7);
    roofGeo.rotateY(Math.PI / 2);
    put(roofGeo, 0, 4.6, lodgeZ, 0x6b3a2a);
    put(new THREE.BoxGeometry(2.2, 3.2, 0.2), 0, 1.6, lodgeZ + 4.3, 0x5a3220);
    [-3.6, 3.6].forEach((x) => {
      put(new THREE.BoxGeometry(1.8, 1.5, 0.15), x, 2.4, lodgeZ + 4.33, 0xffe2a0);
      put(new THREE.BoxGeometry(2.1, 0.15, 0.3), x, 1.6, lodgeZ + 4.4, 0x5a3220);
    });
    put(new THREE.BoxGeometry(12.6, 0.25, 3), 0, 0.12, lodgeZ + 5.6, 0xa87a4e);
    [-5.8, 5.8].forEach((x) => put(new THREE.CylinderGeometry(0.16, 0.16, 4.4, 7), x, 2.2, lodgeZ + 6.9, 0x6f4f32));
    put(new THREE.BoxGeometry(13, 0.2, 3.4), 0, 4.45, lodgeZ + 5.6, 0x6b3a2a, -0.12);
    // рога над дверью
    [-1, 1].forEach((s) => {
      put(new THREE.CylinderGeometry(0.05, 0.08, 1.1, 6), s * 0.45, 3.95, lodgeZ + 4.45, 0xe8d6b0, 0, 0, -s * 0.5);
      put(new THREE.CylinderGeometry(0.04, 0.06, 0.5, 6), s * 0.75, 4.3, lodgeZ + 4.45, 0xe8d6b0, 0, 0, -s * 1.1);
    });
    colliders.push({ minX: -6.4, maxX: 6.4, minZ: lodgeZ - 4.4, maxZ: lodgeZ + 4.4 });
    // вывеска игры над тропинкой к домику
    const signTex = U.canvasTexture(512, (ctx) => {
      ctx.fillStyle = "#8a5a36";
      ctx.fillRect(0, 0, 512, 512);
      ctx.fillStyle = "#6b4228";
      for (let y = 0; y < 512; y += 64) ctx.fillRect(0, y, 512, 4);
      ctx.fillStyle = "#fff3d6";
      ctx.font = "bold 92px Segoe UI, Arial";
      ctx.textAlign = "center";
      ctx.fillText("Кто из них?", 256, 290);
    });
    signTex.repeat.set(1, 1);
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(7, 1.8), new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.8 }));
    signTex.offset.set(0, 0.32);
    signTex.repeat.set(1, 0.36);
    sign.position.set(0, 6.4, lodgeZ + 4.6);
    root.add(sign);

    // лавка продавца: прилавок, полосатый навес, полки с товарами
    const vx = 17;
    const vz = -6;
    put(new THREE.BoxGeometry(4.6, 1.2, 1.2), vx, 0.6, vz, 0xa87a4e);
    put(new THREE.BoxGeometry(4.8, 0.12, 1.4), vx, 1.26, vz, 0x7a4e2e);
    [-2.2, 2.2].forEach((dx) => [-0.5, 2.6].forEach((dz) => put(new THREE.CylinderGeometry(0.1, 0.1, 3.4, 6), vx + dx, 1.7, vz - dz, 0x6f4f32)));
    put(new THREE.BoxGeometry(4.6, 2.2, 0.15), vx, 1.9, vz - 2.7, 0x8a5a36);
    [1.4, 2.3].forEach((y) => put(new THREE.BoxGeometry(4.2, 0.08, 0.5), vx, y, vz - 2.45, 0x6f4f32));
    for (let i = 0; i < 6; i += 1) {
      put(new THREE.BoxGeometry(0.42, 0.22, 0.12), vx - 1.6 + i * 0.64, 1.56, vz - 2.4, [0x3a3f47, 0xd8b45a, 0x35e0ff, 0x6b4a34, 0xff7a1a, 0xd94f4f][i]);
      put(new THREE.CylinderGeometry(0.2, 0.22, 0.25, 10), vx - 1.6 + i * 0.64, 2.48, vz - 2.4, [0xff7a1a, 0x7a4e2e, 0xd8b45a, 0x3a5a8a, 0x2f6a3a, 0xd94f4f][i]);
    }
    colliders.push({ minX: vx - 2.5, maxX: vx + 2.5, minZ: vz - 3, maxZ: vz + 0.7 });
    const awningTex = U.canvasTexture(64, (ctx, s) => {
      ctx.fillStyle = "#fff4e0";
      ctx.fillRect(0, 0, s, s);
      ctx.fillStyle = "#e86a2a";
      for (let x = 0; x < s; x += 16) ctx.fillRect(x, 0, 8, s);
    }, 1);
    awningTex.repeat.set(3, 1);
    const awning = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.1, 3.6), new THREE.MeshStandardMaterial({ map: awningTex, roughness: 0.9 }));
    awning.position.set(vx, 3.45, vz - 1.1);
    awning.rotation.x = 0.18;
    awning.castShadow = true;
    root.add(awning);
    const shopSign = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.7), new THREE.MeshStandardMaterial({
      map: U.canvasTexture(256, (ctx) => {
        ctx.fillStyle = "#3a2a1e";
        ctx.fillRect(0, 0, 256, 256);
        ctx.fillStyle = "#ffd23f";
        ctx.font = "bold 40px Segoe UI, Arial";
        ctx.textAlign = "center";
        ctx.fillText("Лавка охотника", 128, 140);
      }), roughness: 0.7
    }));
    shopSign.material.map.offset.set(0, 0.38);
    shopSign.material.map.repeat.set(1, 0.22);
    shopSign.position.set(vx, 3.9, vz + 0.75);
    root.add(shopSign);
    lobby.vendor = { x: vx, z: vz + 1.6 };

    // фонари, сено, деревянный олень
    for (let i = 0; i < 8; i += 1) {
      const a = (i / 8) * Math.PI * 2 + 0.2;
      const x = Math.cos(a) * 15.5;
      const z = Math.sin(a) * 15.5;
      put(new THREE.CylinderGeometry(0.09, 0.12, 2.6, 6), x, 1.3, z, 0x3a3f47);
      put(new THREE.BoxGeometry(0.4, 0.5, 0.4), x, 2.75, z, 0xffd27a);
      colliders.push({ x, z, r: 0.3 });
    }
    [[-12, -10], [-13.5, -8.5], [10, 12]].forEach(([x, z]) => {
      put(new THREE.CylinderGeometry(0.7, 0.7, 1.4, 12), x, 0.7, z, 0xe2c25a, Math.PI / 2, 0.4, 0);
      colliders.push({ x, z, r: 0.9 });
    });
    const sx = -14;
    const sz = -14;
    put(new THREE.BoxGeometry(1.6, 0.4, 0.8), sx, 0.2, sz, 0x6f4f32);
    put(new THREE.SphereGeometry(0.7, 10, 8), sx, 1.9, sz, 0xa87a4e);
    put(new THREE.CylinderGeometry(0.2, 0.25, 0.9, 7), sx + 0.6, 2.3, sz, 0xa87a4e, 0, 0, -0.6);
    put(new THREE.SphereGeometry(0.28, 8, 6), sx + 0.95, 2.75, sz, 0xa87a4e);
    [-0.4, 0.4].forEach((dz) => [-0.4, 0.4].forEach((dx) => put(new THREE.CylinderGeometry(0.08, 0.07, 1.4, 6), sx + dx, 1.0, sz + dz * 0.6, 0x8a5a36)));
    [-1, 1].forEach((s) => put(new THREE.CylinderGeometry(0.04, 0.06, 0.7, 6), sx + 0.9, 3.15, sz + s * 0.16, 0xe8d6b0, s * 0.4, 0, 0));
    colliders.push({ x: sx, z: sz, r: 1.1 });

    // круги голосования и щиты с картинками карт
    const padColors = [0x5ad17a, 0xff9a3c, 0x7ac8ff, 0xff6a8a];
    maps.forEach((map, i) => {
      const x = -21 + i * 14;
      const z = 18;
      put(new THREE.CylinderGeometry(2.6, 2.8, 0.3, 32), x, 0.15, z, 0xb9b2a4);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.14, 8, 40), new THREE.MeshBasicMaterial({ color: padColors[i] }));
      ring.rotation.x = Math.PI / 2;
      ring.position.set(x, 0.34, z);
      root.add(ring);
      const glow = new THREE.Mesh(new THREE.CircleGeometry(2.2, 32), new THREE.MeshBasicMaterial({ color: padColors[i], transparent: true, opacity: 0.25, depthWrite: false }));
      glow.rotation.x = -Math.PI / 2;
      glow.position.set(x, 0.32, z);
      root.add(glow);
      [-2.6, 2.6].forEach((dx) => put(new THREE.CylinderGeometry(0.14, 0.16, 6.4, 7), x + dx, 3.2, z + 3, 0x6f4f32));
      put(new THREE.BoxGeometry(5.6, 3.7, 0.18), x, 4.45, z + 3.1, 0x6f4f32);
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 340;
      const tex = new THREE.CanvasTexture(canvas);
      const board = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 3.45), new THREE.MeshBasicMaterial({ map: tex }));
      board.position.set(x, 4.45, z + 2.99);
      board.rotation.y = Math.PI;
      root.add(board);
      const back = board.clone();
      back.rotation.y = 0;
      back.position.z = z + 3.21;
      root.add(back);
      lobby.pads.push({ x, z, r: 2.4, map, ring, glow, canvas, tex, votes: -1, mine: false });
    });
    lobby.drawPads = (counts, mineIndex) => {
      lobby.pads.forEach((pad, i) => {
        const votes = counts[i] || 0;
        const mine = i === mineIndex;
        if (votes === pad.votes && mine === pad.mine) return;
        pad.votes = votes;
        pad.mine = mine;
        const ctx = pad.canvas.getContext("2d");
        drawPreview(ctx, pad.map, 512, 260);
        ctx.fillStyle = mine ? "#00a2ff" : "#1d2633";
        ctx.fillRect(0, 260, 512, 80);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 34px Segoe UI, Arial";
        ctx.textAlign = "left";
        ctx.fillText(pad.map.name, 18, 312);
        ctx.textAlign = "right";
        ctx.fillText(`${votes} 🗳`, 494, 312);
        pad.tex.needsUpdate = true;
        pad.glow.material.opacity = mine ? 0.55 : 0.25;
      });
    };
    lobby.drawPads([], -1);

    // деревья вокруг поляны
    const trunks = [];
    const crowns = [];
    const cones = [];
    for (let i = 0; i < 150; i += 1) {
      const a = random() * Math.PI * 2;
      const r = 38 + random() * 45;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      const y = flat(x, z) - 0.1;
      const s = 0.8 + random() * 0.6;
      if (random() < 0.45) {
        trunks.push([x, y, z, 0.28 * s, 2 * s, 0x4e3726]);
        for (let k = 0; k < 4; k += 1) cones.push([x, y + (1 + k * 1.6) * s, z, (2.6 - k * 0.5) * s, 3 * s, [0x2d5e34, 0x356a3a][k % 2]]);
      } else {
        const h = (3.6 + random() * 1.6) * s;
        trunks.push([x, y, z, 0.34 * s, h + 1.2 * s, 0x5d4532]);
        [[0, 1.3, 0, 2.2], [1.4, 0.6, 0.4, 1.7], [-1.3, 0.7, -0.5, 1.7], [0.3, 2.1, 0.2, 1.5]].forEach(([dx, dy, dz, rr]) => crowns.push([x + dx * s, y + h + dy * s, z + dz * s, rr * s, rr * 0.82 * s, [0x4b8a38, 0x569a3e, 0x5f9f44][k3(i)]]));
      }
    }
    function k3(i) { return i % 3; }
    const inst = (geo, list, scaleY) => {
      const mesh = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }), list.length);
      const o = new THREE.Object3D();
      list.forEach(([x, y, z, s, h, color], i) => {
        o.position.set(x, y, z);
        o.scale.set(s, scaleY ? h : h, s);
        o.updateMatrix();
        mesh.setMatrixAt(i, o.matrix);
        mesh.setColorAt(i, new THREE.Color(color));
      });
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      root.add(mesh);
    };
    const trunkGeo = new THREE.CylinderGeometry(0.65, 1, 1, 7);
    trunkGeo.translate(0, 0.5, 0);
    const coneGeo = new THREE.ConeGeometry(1, 1, 9);
    coneGeo.translate(0, 0.5, 0);
    inst(trunkGeo, trunks, true);
    inst(coneGeo, cones, true);
    inst(new THREE.IcosahedronGeometry(1, 1), crowns, true);

    const merged = new THREE.Mesh(U.merge(parts), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85 }));
    merged.castShadow = true;
    merged.receiveShadow = true;
    root.add(merged);

    lobby.spawn = { x: 0, z: -9, yaw: 0 };
    lobby.update = (dt, t, focus) => {
      flames.forEach((f, i) => {
        const k = 0.85 + Math.sin(t * 9 + f.phase) * 0.12 + Math.sin(t * 17 + i) * 0.06;
        f.mesh.scale.set(1, k, 1);
        f.mesh.rotation.y = t * 0.8 + i;
      });
      fireLight.intensity = 1.25 + Math.sin(t * 11) * 0.12 + Math.sin(t * 23) * 0.08;
      lobby.pads.forEach((pad, i) => { pad.ring.position.y = 0.34 + Math.sin(t * 2 + i) * 0.04; });
      if (focus) {
        sun.position.set(focus.x - 60, 90, focus.z + 70);
        sun.target.position.set(focus.x, 0, focus.z);
        sun.target.updateMatrixWorld();
      }
      sky.position.copy(focus || sky.position);
    };
    lobby.show = (on) => {
      root.visible = on;
      if (on) parentScene.fog = new THREE.Fog(0xdfe6dc, 70, 260);
    };
    return lobby;
  }

  window.HideLobby = { build, drawPreview };
})();
