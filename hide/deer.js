// «Кто из них?» — олени: модель, анимации и поведение стад.
// Все олени рисуются пятью InstancedMesh (туловище, голова оленя с рогами, голова оленихи, туловище оленёнка, ноги),
// поэтому даже 40 оленей — это всего несколько вызовов отрисовки.
(function () {
  "use strict";
  const U = window.HideUtil;
  const BROWN = 0x9a6234;
  const BROWN_DARK = 0x7a4a26;
  const CREAM = 0xf3e6cf;
  const BLACK = 0x1d1a18;

  // ---------- Модель из простых фигур ----------
  function ellipsoid(rx, ry, rz) {
    const g = new THREE.SphereGeometry(1, 14, 10);
    g.scale(rx, ry, rz);
    return g;
  }
  function buildGeometries() {
    const body = (spots) => {
      const parts = [
        { geo: ellipsoid(0.32, 0.31, 0.62), matrix: U.m4(0, 1.06, 0), color: BROWN },
        { geo: ellipsoid(0.27, 0.2, 0.5), matrix: U.m4(0, 0.93, 0.02), color: CREAM },
        { geo: ellipsoid(0.3, 0.3, 0.3), matrix: U.m4(0, 1.1, 0.42), color: BROWN },
        { geo: ellipsoid(0.24, 0.24, 0.2), matrix: U.m4(0, 1.08, -0.58), color: CREAM },
        { geo: (() => { const g = new THREE.ConeGeometry(0.09, 0.26, 7); return g; })(), matrix: U.m4(0, 1.24, -0.68, -0.9), color: CREAM },
        { geo: (() => { const g = new THREE.ConeGeometry(0.08, 0.18, 7); return g; })(), matrix: U.m4(0, 1.3, -0.66, -0.9), color: BROWN_DARK }
      ];
      if (spots) {
        const r = U.random(5);
        for (let i = 0; i < 16; i += 1) {
          const a = r() * Math.PI - Math.PI / 2;
          const z = -0.45 + r() * 0.85;
          const side = r() < 0.5 ? -1 : 1;
          parts.push({ geo: new THREE.SphereGeometry(0.045, 6, 5), matrix: U.m4(side * Math.cos(a) * 0.3, 1.16 + Math.sin(a) * 0.12, z), color: 0xfff6e8 });
        }
      }
      return U.merge(parts);
    };
    // голова вместе с шеей: точка поворота — основание шеи
    const head = (antlers) => {
      const parts = [
        { geo: (() => { const g = new THREE.CylinderGeometry(0.1, 0.15, 0.62, 10); return g; })(), matrix: U.m4(0, 0.25, 0.12, 0.45), color: BROWN },
        { geo: ellipsoid(0.15, 0.16, 0.2), matrix: U.m4(0, 0.56, 0.3), color: BROWN },
        { geo: ellipsoid(0.1, 0.1, 0.17), matrix: U.m4(0, 0.5, 0.47), color: BROWN_DARK },
        { geo: new THREE.SphereGeometry(0.055, 8, 6), matrix: U.m4(0, 0.52, 0.62), color: BLACK },
        { geo: ellipsoid(0.12, 0.06, 0.08), matrix: U.m4(0, 0.47, 0.5), color: CREAM },
        { geo: new THREE.SphereGeometry(0.035, 8, 6), matrix: U.m4(0.12, 0.6, 0.38), color: BLACK },
        { geo: new THREE.SphereGeometry(0.035, 8, 6), matrix: U.m4(-0.12, 0.6, 0.38), color: BLACK },
        { geo: new THREE.SphereGeometry(0.012, 5, 4), matrix: U.m4(0.145, 0.615, 0.4), color: 0xffffff },
        { geo: new THREE.SphereGeometry(0.012, 5, 4), matrix: U.m4(-0.145, 0.615, 0.4), color: 0xffffff }
      ];
      [-1, 1].forEach((s) => {
        parts.push({ geo: ellipsoid(0.06, 0.14, 0.035), matrix: U.m4(s * 0.17, 0.72, 0.22, 0.2, 0, -s * 0.9), color: BROWN });
        parts.push({ geo: ellipsoid(0.035, 0.1, 0.02), matrix: U.m4(s * 0.175, 0.72, 0.245, 0.2, 0, -s * 0.9), color: 0xf2b8a8 });
        if (antlers) {
          const antler = 0xe8d6b0;
          parts.push({ geo: new THREE.CylinderGeometry(0.022, 0.035, 0.42, 6), matrix: U.m4(s * 0.12, 0.88, 0.2, -0.35, 0, -s * 0.35), color: antler });
          parts.push({ geo: new THREE.CylinderGeometry(0.018, 0.026, 0.32, 6), matrix: U.m4(s * 0.22, 1.12, 0.12, -0.75, 0, -s * 0.2), color: antler });
          parts.push({ geo: new THREE.CylinderGeometry(0.015, 0.022, 0.2, 6), matrix: U.m4(s * 0.17, 1.0, 0.3, 0.6, 0, -s * 0.3), color: antler });
          parts.push({ geo: new THREE.CylinderGeometry(0.012, 0.02, 0.18, 6), matrix: U.m4(s * 0.27, 1.25, 0.02, -0.2, 0, -s * 0.7), color: antler });
          parts.push({ geo: new THREE.CylinderGeometry(0.012, 0.02, 0.18, 6), matrix: U.m4(s * 0.2, 1.3, 0.14, 0.4, 0, -s * 0.1), color: antler });
        }
      });
      return U.merge(parts);
    };
    // нога: точка поворота наверху, бедро, голень, копытце
    const leg = U.merge([
      { geo: new THREE.CylinderGeometry(0.075, 0.06, 0.52, 8), matrix: U.m4(0, -0.24, 0), color: BROWN },
      { geo: new THREE.CylinderGeometry(0.045, 0.038, 0.48, 7), matrix: U.m4(0, -0.72, 0), color: 0xb07a4a },
      { geo: new THREE.CylinderGeometry(0.042, 0.05, 0.08, 7), matrix: U.m4(0, -0.98, 0), color: BLACK }
    ]);
    return { body: body(false), bodyFawn: body(true), headStag: head(true), headDoe: head(false), leg };
  }

  const HIPS = [[0.17, 1.0, 0.42], [-0.17, 1.0, 0.42], [0.17, 1.02, -0.44], [-0.17, 1.02, -0.44]];
  const NECK = [0, 1.22, 0.5];
  const HEAD_DOWN = 1.8;

  function create(scene, world, count) {
    const geos = buildGeometries();
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.82 });
    const make = (geo, n) => {
      const mesh = new THREE.InstancedMesh(geo, mat, n);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.frustumCulled = false;
      // буфер цветов создаётся по текущему числу экземпляров — поэтому сначала цвет, потом count = 0
      mesh.setColorAt(0, new THREE.Color(1, 1, 1));
      mesh.count = 0;
      scene.add(mesh);
      return mesh;
    };
    const meshes = {
      body: make(geos.body, count), bodyFawn: make(geos.bodyFawn, count),
      headStag: make(geos.headStag, count), headDoe: make(geos.headDoe, count), leg: make(geos.leg, count * 4)
    };
    const deer = [];
    const herds = [];
    const tmp = { root: new THREE.Matrix4(), part: new THREE.Matrix4(), m: new THREE.Matrix4(), q: new THREE.Quaternion(), e: new THREE.Euler(), v: new THREE.Vector3(), s: new THREE.Vector3(), color: new THREE.Color() };
    const random = Math.random;
    const sys = { deer, herds, meshes, threat: null };

    function addDeer(kind, x, z, herd) {
      const d = {
        id: deer.length, kind, x, z, y: world.groundAt(x, z), yaw: Math.random() * 6.28, speed: 0, wantSpeed: 0, moveX: 0, moveZ: 0,
        scale: kind === "fawn" ? 0.66 : kind === "stag" ? 1.08 + random() * 0.08 : 0.95 + random() * 0.08,
        tint: 0.88 + random() * 0.2, herd, state: "graze", timer: random() * 4, phase: random() * 6,
        headPitch: 0.6, headYaw: 0, wantPitch: 0.6, wantYaw: 0, lie: 0, wantLie: 0, shake: 0, jumpY: 0, vy: 0,
        bodyPitch: 0, isPlayer: false, isHider: false, hidden: false, caught: false, target: null,
        oddness: 0, alarmDelay: 0, fleeing: 0, tell: null, tellTimer: 8 + random() * 8, lookAt: null, name: ""
      };
      deer.push(d);
      if (herd) herd.members.push(d);
      return d;
    }

    function spawnHerds(nHerds) {
      deer.length = 0;
      herds.length = 0;
      const spots = world.grazeSpots.slice().sort(() => random() - 0.5);
      for (let h = 0; h < nHerds; h += 1) {
        const [hx, hz] = spots[h % spots.length];
        const herd = { members: [], x: hx, z: hz, tx: hx, tz: hz, mode: "graze", timer: 15 + random() * 25, flee: 0, fleeX: 0, fleeZ: 0, drink: false };
        herds.push(herd);
        const size = 5 + Math.floor(random() * 3);
        for (let i = 0; i < size; i += 1) {
          const kind = i === 0 ? "stag" : random() < 0.22 ? "fawn" : random() < 0.25 ? "stag" : "doe";
          const a = random() * Math.PI * 2;
          const r = 1.5 + random() * 6;
          addDeer(kind, hx + Math.cos(a) * r, hz + Math.sin(a) * r, herd);
        }
        herd.leader = herd.members[0];
        herd.members.forEach((d, i) => {
          const a = (i / herd.members.length) * Math.PI * 2 + random() * 0.6;
          d.slot = [Math.cos(a) * (2 + random() * 4.5), Math.sin(a) * (2 + random() * 4.5)];
        });
      }
    }

    // ---------- Поведение ----------
    function herdCenter(herd) {
      let x = 0;
      let z = 0;
      let n = 0;
      herd.members.forEach((d) => { if (!d.caught) { x += d.x; z += d.z; n += 1; } });
      return n ? [x / n, z / n] : [herd.x, herd.z];
    }

    function pickTarget(herd) {
      const drink = random() < 0.28;
      const list = drink ? world.drinkSpots : world.grazeSpots;
      const [tx, tz] = list[Math.floor(random() * list.length)];
      herd.tx = tx + (random() - 0.5) * 6;
      herd.tz = tz + (random() - 0.5) * 6;
      herd.drink = drink;
      herd.mode = "move";
    }

    // выстрел или резкий звук: олени рядом убегают
    sys.alarm = (x, z, radius = 70) => {
      herds.forEach((herd) => {
        const [cx, cz] = herdCenter(herd);
        const d = Math.hypot(cx - x, cz - z);
        if (d > radius) return;
        let ax = cx - x;
        let az = cz - z;
        const len = Math.hypot(ax, az) || 1;
        ax /= len;
        az /= len;
        herd.mode = "flee";
        herd.flee = 5 + random() * 2;
        let fx = cx + ax * 40;
        let fz = cz + az * 40;
        const r = Math.hypot(fx, fz);
        if (r > world.PLAY_R - 12) {
          fx *= (world.PLAY_R - 12) / r;
          fz *= (world.PLAY_R - 12) / r;
        }
        herd.fleeX = fx;
        herd.fleeZ = fz;
        herd.members.forEach((m) => { m.alarmDelay = m.isPlayer || m.netCtl ? 0.9 : 0.05 + random() * 0.35; });
      });
    };

    function steerTo(d, tx, tz, speed) {
      const dx = tx - d.x;
      const dz = tz - d.z;
      const dist = Math.hypot(dx, dz);
      if (dist < 0.35) {
        d.wantSpeed = 0;
        return dist;
      }
      d.moveX = dx / dist;
      d.moveZ = dz / dist;
      d.wantSpeed = Math.min(speed, dist * 1.4);
      return dist;
    }

    function updateHerd(herd, dt) {
      herd.timer -= dt;
      const leader = herd.leader.caught ? herd.members.find((m) => !m.caught) || herd.leader : herd.leader;
      herd.leader = leader;
      if (herd.mode === "flee") {
        herd.flee -= dt;
        if (herd.flee <= 0) {
          herd.mode = "graze";
          herd.timer = 10 + random() * 15;
          herd.x = leader.x;
          herd.z = leader.z;
        }
      } else if (herd.mode === "graze") {
        if (herd.timer <= 0) pickTarget(herd);
      } else if (herd.mode === "move") {
        const dist = Math.hypot(herd.tx - leader.x, herd.tz - leader.z);
        if (dist < 2.5) {
          herd.mode = "graze";
          herd.timer = herd.drink ? 12 + random() * 10 : 22 + random() * 30;
          herd.x = herd.tx;
          herd.z = herd.tz;
        }
      }
    }

    // обычный олень: щиплет траву, оглядывается, переходит, иногда ложится
    function thinkNpc(d, dt, hunter) {
      const herd = d.herd;
      d.timer -= dt;
      // если рядом охотник — настораживается, а совсем близко отбегает
      if (hunter && herd.mode !== "flee") {
        const hd = Math.hypot(hunter.x - d.x, hunter.z - d.z);
        if (hd < 9 && d.state !== "wary") {
          d.state = hd < 5.5 ? "shy" : "wary";
          d.timer = hd < 5.5 ? 1.5 + random() : 2 + random() * 2;
          d.wantLie = 0;
        }
      }
      if (herd.mode === "flee") {
        if (d.alarmDelay > 0) {
          d.alarmDelay -= dt;
          d.wantSpeed = 0;
          d.wantPitch = -0.3;
          return;
        }
        d.wantLie = 0;
        steerTo(d, herd.fleeX + d.slot[0] * 1.5, herd.fleeZ + d.slot[1] * 1.5, 6.6 + (d.id % 3) * 0.3);
        d.wantPitch = -0.1;
        d.wantYaw = 0;
        return;
      }
      if (herd.mode === "move") {
        d.wantLie = 0;
        const isLeader = d === herd.leader;
        const tx = isLeader ? herd.tx : herd.leader.x + d.slot[0];
        const tz = isLeader ? herd.tz : herd.leader.z + d.slot[1];
        const dist = steerTo(d, tx, tz, isLeader ? 1.25 : 1.45);
        if (!isLeader && dist > 9) d.wantSpeed = 3.2;
        d.wantPitch = 0.05;
        d.wantYaw = 0;
        return;
      }
      if (d.state === "shy" && hunter) {
        const ax = d.x - hunter.x;
        const az = d.z - hunter.z;
        const len = Math.hypot(ax, az) || 1;
        steerTo(d, d.x + (ax / len) * 6, d.z + (az / len) * 6, 3.4);
        d.wantPitch = -0.3;
        if (d.timer <= 0) { d.state = "look"; d.timer = 2; }
        return;
      }
      if (d.state === "wary" && hunter) {
        d.wantSpeed = 0;
        d.wantPitch = -0.35;
        const a = Math.atan2(hunter.x - d.x, hunter.z - d.z) - d.yaw;
        d.wantYaw = Math.max(-0.9, Math.min(0.9, Math.atan2(Math.sin(a), Math.cos(a))));
        if (d.timer <= 0) { d.state = "graze"; d.timer = 3; d.wantYaw = 0; }
        return;
      }
      if (d.state === "step") {
        const dist = steerTo(d, d.target[0], d.target[1], 1.1);
        d.wantPitch = 0.15;
        if (dist < 0.4 || d.timer <= 0) { d.state = "graze"; d.timer = 3 + random() * 5; }
        return;
      }
      d.wantSpeed = 0;
      if (d.state === "graze") {
        d.wantPitch = HEAD_DOWN;
        d.wantYaw = Math.sin(d.phase * 0.7) * 0.15;
      } else if (d.state === "look") {
        d.wantPitch = -0.3;
        d.wantYaw = Math.sin(d.timer * 1.3) * 0.7;
      } else if (d.state === "lie") {
        d.wantLie = 1;
        d.wantPitch = 0.1;
      } else if (d.state === "shake") {
        d.shake = 1;
      }
      if (d.timer <= 0) {
        const r = random();
        d.wantLie = 0;
        const [cx, cz] = herd.drink ? [herd.x, herd.z] : [herd.x, herd.z];
        if (d.state === "lie" && r < 0.7) { d.timer = 6 + random() * 10; return; }
        if (r < 0.42) { d.state = "graze"; d.timer = 3 + random() * 6; }
        else if (r < 0.62) { d.state = "look"; d.timer = 1.5 + random() * 2.5; }
        else if (r < 0.9) {
          d.state = "step";
          d.timer = 6;
          const a = random() * Math.PI * 2;
          const rr = 1 + random() * (herd.drink ? 2 : 7);
          d.target = [cx + d.slot[0] * 0.6 + Math.cos(a) * rr, cz + d.slot[1] * 0.6 + Math.sin(a) * rr];
        } else if (r < 0.96 && herd.timer > 12 && !herd.drink) { d.state = "lie"; d.timer = 10 + random() * 12; }
        else { d.state = "shake"; d.timer = 1; }
      }
    }

    // бот-«игрок» внутри оленя: ведёт себя как стадо, но иногда ошибается
    function thinkHiderBot(d, dt, hunter, tellEvery) {
      d.tellTimer -= dt;
      if (!d.tell && d.tellTimer <= 0) {
        const kinds = ["lag", "stare", "wander", "speed", "lag", "stare"];
        d.tell = { kind: kinds[Math.floor(random() * kinds.length)], t: 3 + random() * 3 };
        if (d.tell.kind === "wander") {
          const a = random() * Math.PI * 2;
          d.tell.tx = d.x + Math.cos(a) * 12;
          d.tell.tz = d.z + Math.sin(a) * 12;
        }
        d.tellTimer = tellEvery * (0.7 + random() * 0.6);
      }
      if (d.herd.mode === "flee" && d.alarmDelay > 0) d.alarmDelay += dt * 0.6; // реагирует позже остальных
      thinkNpc(d, dt, hunter);
      if (!d.tell) return;
      d.tell.t -= dt;
      const kind = d.tell.kind;
      if (kind === "lag" && d.herd.mode === "move") { d.wantSpeed = 0; d.wantPitch = HEAD_DOWN; }
      else if (kind === "stare" && hunter) {
        const a = Math.atan2(hunter.x - d.x, hunter.z - d.z) - d.yaw;
        d.wantYaw = Math.max(-1, Math.min(1, Math.atan2(Math.sin(a), Math.cos(a))));
        d.wantPitch = -0.3;
        d.wantSpeed = 0;
      } else if (kind === "wander") steerTo(d, d.tell.tx, d.tell.tz, 1.6);
      else if (kind === "speed" && d.wantSpeed > 0.5) d.wantSpeed *= 1.7;
      if (d.tell.t <= 0) d.tell = null;
    }

    // насколько олень выбивается из стада — это видит охотник (и бот, и по честным правилам игрок)
    function measureOddness(d, dt, hunter) {
      const herd = d.herd;
      let odd = 0;
      const [cx, cz] = herdCenter(herd);
      const fromHerd = Math.hypot(d.x - cx, d.z - cz);
      if (fromHerd > 13) odd += Math.min(1.5, (fromHerd - 13) / 8);
      let mean = 0;
      let n = 0;
      herd.members.forEach((m) => { if (!m.caught && m !== d) { mean += m.speed; n += 1; } });
      mean = n ? mean / n : d.speed;
      if (herd.mode === "move" && d.speed < 0.25 && mean > 0.8) odd += 0.9;
      if (herd.mode === "graze" && d.speed > 3 && !d.fleeing) odd += 1.2;
      if (herd.mode === "flee" && d.alarmDelay <= 0 && d.speed < 2.5) odd += 1.4;
      if (herd.mode !== "flee") odd += Math.min(0.8, Math.abs(d.speed - mean) * 0.25);
      if (d.jumpY > 0.2 && herd.mode !== "flee") odd += 1.2;
      if (hunter) {
        const hd = Math.hypot(hunter.x - d.x, hunter.z - d.z);
        if (hd > 11 && hd < 40) {
          const a = Math.atan2(hunter.x - d.x, hunter.z - d.z) - (d.yaw + d.headYaw);
          if (Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) < 0.3 && d.headPitch < 0.2) odd += 0.6;
        }
      }
      d.oddness += (odd - d.oddness) * Math.min(1, dt * 1.5);
    }

    // общий шаг движения и анимации
    function move(d, dt) {
      d.speed += (d.wantSpeed - d.speed) * Math.min(1, dt * (d.wantSpeed > d.speed ? 2.4 : 3.5));
      if (d.speed > 0.05) {
        const want = Math.atan2(d.moveX, d.moveZ);
        let diff = want - d.yaw;
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));
        d.yaw += diff * Math.min(1, dt * (d.speed > 3 ? 5 : 3));
        let nx = d.x + Math.sin(d.yaw) * d.speed * dt;
        let nz = d.z + Math.cos(d.yaw) * d.speed * dt;
        // вода, деревья, край карты и соседи
        if (world.isDeepWater(nx, nz, 0.35)) { nx = d.x; nz = d.z; d.wantSpeed = 0; }
        for (const c of world.colliders) {
          const dx = nx - c.x;
          const dz = nz - c.z;
          const rr = c.r + 0.45 * d.scale;
          const dist2 = dx * dx + dz * dz;
          if (dist2 < rr * rr && dist2 > 1e-6) {
            const dist = Math.sqrt(dist2);
            nx = c.x + (dx / dist) * rr;
            nz = c.z + (dz / dist) * rr;
          }
        }
        const r = Math.hypot(nx, nz);
        if (r > world.PLAY_R) { nx *= world.PLAY_R / r; nz *= world.PLAY_R / r; }
        d.x = nx;
        d.z = nz;
      }
      // не толпятся в одной точке
      if (!d.isPlayer) {
        for (const m of d.herd.members) {
          if (m === d || m.caught) continue;
          const dx = d.x - m.x;
          const dz = d.z - m.z;
          const dist = Math.hypot(dx, dz);
          if (dist < 1.1 && dist > 1e-4) {
            d.x += (dx / dist) * (1.1 - dist) * 0.5;
            d.z += (dz / dist) * (1.1 - dist) * 0.5;
          }
        }
      }
      pose(d, dt, true);
    }

    // высота над землёй, наклон по склону, голова и поза (общая часть для всех оленей)
    function pose(d, dt, local) {
      d.fleeing = d.speed > 4.5;
      // прыжок (по сети высоту прыжка присылают готовой)
      if (local && (d.jumpY > 0 || d.vy > 0)) {
        d.vy -= 22 * dt;
        d.jumpY = Math.max(0, d.jumpY + d.vy * dt);
        if (d.jumpY === 0) d.vy = 0;
      }
      const ground = world.groundAt(d.x, d.z);
      d.y = ground + d.jumpY;
      const ahead = world.groundAt(d.x + Math.sin(d.yaw) * 0.7, d.z + Math.cos(d.yaw) * 0.7);
      const behind = world.groundAt(d.x - Math.sin(d.yaw) * 0.7, d.z - Math.cos(d.yaw) * 0.7);
      d.bodyPitch += (-Math.atan2(ahead - behind, 1.4) - d.bodyPitch) * Math.min(1, dt * 6);
      // голова и поза (по сети они уже сглажены у хозяина, догоняем быстрее)
      const rate = Math.min(1, dt * (local ? 3.2 : 9));
      d.headPitch += (d.wantPitch - d.headPitch) * rate;
      d.headYaw += (d.wantYaw - d.headYaw) * rate;
      d.lie += (d.wantLie - d.lie) * Math.min(1, dt * (local ? 1.8 : 9));
      d.shake = Math.max(0, d.shake - dt * 1.4);
      d.phase += dt * (d.speed > 0.05 ? 2.2 + d.speed * 1.4 : 0.8);
    }

    function writeMatrices() {
      const counters = { body: 0, bodyFawn: 0, headStag: 0, headDoe: 0, leg: 0 };
      const { root, part, m, q, e, v, s, color } = tmp;
      deer.forEach((d) => {
        if (d.hidden) return;
        const sc = d.scale;
        const run = Math.min(1, Math.max(0, (d.speed - 3) / 3));
        const walk = Math.min(1, d.speed / 1.4) * (1 - run);
        const bounce = walk * Math.abs(Math.sin(d.phase)) * 0.03 + run * Math.abs(Math.sin(d.phase)) * 0.16;
        const lieDrop = d.lie * 0.62;
        const runPitch = run * Math.sin(d.phase) * 0.12;
        e.set(d.bodyPitch + runPitch, d.yaw, 0, "YXZ");
        q.setFromEuler(e);
        v.set(d.x, d.y + bounce - lieDrop * sc, d.z);
        s.set(sc, sc, sc);
        root.compose(v, q, s);
        color.setScalar(d.tint);
        const bodyMesh = d.kind === "fawn" ? meshes.bodyFawn : meshes.body;
        const bodyKey = d.kind === "fawn" ? "bodyFawn" : "body";
        bodyMesh.setMatrixAt(counters[bodyKey], root);
        bodyMesh.setColorAt(counters[bodyKey], color);
        counters[bodyKey] += 1;
        // голова на шее
        const nod = d.speed > 0.1 ? Math.sin(d.phase * 2) * 0.06 : 0;
        const shake = d.shake > 0 ? Math.sin(d.shake * 40) * 0.35 * d.shake : 0;
        const nibble = d.headPitch > 0.8 && d.speed < 0.1 ? Math.sin(d.phase * 6) * 0.05 : 0;
        e.set(d.headPitch + nod + nibble, d.headYaw, shake, "YXZ");
        q.setFromEuler(e);
        part.compose(v.set(NECK[0], NECK[1], NECK[2]), q, s.set(1, 1, 1));
        m.multiplyMatrices(root, part);
        const headKey = d.kind === "stag" ? "headStag" : "headDoe";
        meshes[headKey].setMatrixAt(counters[headKey], m);
        meshes[headKey].setColorAt(counters[headKey], color);
        counters[headKey] += 1;
        // ноги: шаг по диагонали, на бегу — галоп, лёжа — поджаты
        HIPS.forEach(([hx, hy, hz], i) => {
          const front = i < 2;
          const side = i % 2 === 0 ? 1 : -1;
          let swing = 0;
          if (walk > 0) swing += Math.sin(d.phase + ((front ? 0 : Math.PI) + (side > 0 ? 0 : Math.PI))) * 0.42 * walk;
          if (run > 0) swing += Math.sin(d.phase + (front ? 0 : 2.4) + (side > 0 ? 0 : 0.35)) * 0.85 * run;
          const fold = d.lie * (front ? -1.45 : 1.45);
          e.set(swing + fold, 0, 0, "XYZ");
          q.setFromEuler(e);
          const lift = d.lie * 0.25;
          part.compose(v.set(hx, hy + lift, hz), q, s.set(1, 1 - d.lie * 0.35, 1));
          m.multiplyMatrices(root, part);
          meshes.leg.setMatrixAt(counters.leg, m);
          meshes.leg.setColorAt(counters.leg, color);
          counters.leg += 1;
        });
      });
      Object.keys(meshes).forEach((k) => {
        meshes[k].count = counters[k];
        meshes[k].instanceMatrix.needsUpdate = true;
        if (meshes[k].instanceColor) meshes[k].instanceColor.needsUpdate = true;
      });
    }

    // олень, которым управляют по сети: догоняет присланное положение, чуть забегая вперёд по скорости
    function netFollow(d, dt) {
      const n = d.net;
      if (!n) return;
      if (n.snap) {
        d.x = n.x;
        d.z = n.z;
        d.yaw = n.yaw;
        d.speed = n.speed;
        d.headPitch = n.hp;
        d.lie = n.lie;
        n.snap = false;
      }
      if (n.age < 0.35) {
        n.x += Math.sin(n.yaw) * n.speed * dt;
        n.z += Math.cos(n.yaw) * n.speed * dt;
      }
      n.age += dt;
      const k = Math.min(1, dt * 9);
      d.x += (n.x - d.x) * k;
      d.z += (n.z - d.z) * k;
      let dy = n.yaw - d.yaw;
      dy = Math.atan2(Math.sin(dy), Math.cos(dy));
      d.yaw += dy * k;
      d.speed += (n.speed - d.speed) * k;
      d.jumpY += (n.jy - d.jumpY) * Math.min(1, dt * 14);
      d.wantPitch = n.hp;
      d.wantYaw = n.hy;
      d.wantLie = n.lie;
      if (n.shake > 0.5 && d.shake < 0.1) d.shake = 1;
      n.shake = 0;
      if (d.alarmDelay > 0) d.alarmDelay -= dt;
      pose(d, dt, false);
    }

    // follower = true: этот браузер не ведёт оленей, а только показывает присланное хозяином
    sys.update = (dt, hunter, tellEvery, follower) => {
      if (!follower) herds.forEach((h) => updateHerd(h, dt));
      deer.forEach((d) => {
        if (d.caught) return;
        if (d.netCtl) {
          netFollow(d, dt);
          if (!follower) measureOddness(d, dt, hunter);
          return;
        }
        if (d.isPlayer) {
          // игроком управляет game.js через d.wantSpeed/moveX/moveZ и позы
          if (d.alarmDelay > 0) d.alarmDelay -= dt;
        } else if (follower) return;
        else if (d.isHider) thinkHiderBot(d, dt, hunter, tellEvery);
        else thinkNpc(d, dt, hunter);
        move(d, dt);
        if (!follower) measureOddness(d, dt, hunter);
      });
      writeMatrices();
    };
    sys.spawnHerds = spawnHerds;

    // ---------- Сеть ----------
    const KINDS = ["doe", "stag", "fawn"];
    // состав стада для остальных игроков: вид, размер, оттенок, номер стада
    sys.exportInit = () => deer.map((d) => [KINDS.indexOf(d.kind), Math.round(d.scale * 1000), Math.round(d.tint * 1000), herds.indexOf(d.herd)]);
    sys.initFrom = (list) => {
      deer.length = 0;
      herds.length = 0;
      list.forEach(([kind, scale, tint, h]) => {
        while (herds.length <= h) herds.push({ members: [], x: 0, z: 0, tx: 0, tz: 0, mode: "graze", timer: 99, flee: 0, fleeX: 0, fleeZ: 0, drink: false });
        const d = addDeer(KINDS[kind] || "doe", 0, 0, herds[h]);
        d.scale = scale / 1000;
        d.tint = tint / 1000;
        d.netCtl = true;
      });
      herds.forEach((h) => { h.leader = h.members[0]; });
    };
    // положение и поза каждого оленя целыми числами — так сообщение короче
    const N = 11;
    sys.snapshot = () => {
      const out = [];
      deer.forEach((d) => {
        out.push(Math.round(d.x * 100), Math.round(d.z * 100), Math.round(d.yaw * 100), Math.round(d.speed * 100), Math.round(d.headPitch * 100),
          Math.round(d.headYaw * 100), Math.round(d.lie * 100), Math.round(d.jumpY * 100), d.shake > 0.6 ? 1 : 0, Math.round(d.oddness * 100), (d.hidden ? 1 : 0) | (d.caught ? 2 : 0));
      });
      return out;
    };
    sys.applySnapshot = (arr, first) => {
      deer.forEach((d, i) => {
        const o = i * N;
        if (o + N > arr.length) return;
        d.oddness = arr[o + 9] / 100;
        if (!d.netCtl) return;
        const n = d.net || (d.net = { snap: true });
        n.x = arr[o] / 100;
        n.z = arr[o + 1] / 100;
        n.yaw = arr[o + 2] / 100;
        n.speed = arr[o + 3] / 100;
        n.hp = arr[o + 4] / 100;
        n.hy = arr[o + 5] / 100;
        n.lie = arr[o + 6] / 100;
        n.jy = arr[o + 7] / 100;
        n.shake = arr[o + 8];
        n.age = 0;
        if (first) n.snap = true;
      });
    };
    // свой олень игрока для хозяина: [номер, x, z, курс, скорость, голова, поворот головы, лёжа, прыжок, встряхнулся]
    sys.playerState = (d) => [deer.indexOf(d), Math.round(d.x * 100), Math.round(d.z * 100), Math.round(d.yaw * 100), Math.round(d.speed * 100),
      Math.round(d.headPitch * 100), Math.round(d.headYaw * 100), Math.round(d.lie * 100), Math.round(d.jumpY * 100), d.shake > 0.6 ? 1 : 0];
    sys.applyPlayerState = (a) => {
      const d = deer[a[0]];
      if (!d || !d.netCtl) return;
      const n = d.net || (d.net = { snap: true });
      n.x = a[1] / 100;
      n.z = a[2] / 100;
      n.yaw = a[3] / 100;
      n.speed = a[4] / 100;
      n.hp = a[5] / 100;
      n.hy = a[6] / 100;
      n.lie = a[7] / 100;
      n.jy = a[8] / 100;
      n.shake = a[9];
      n.age = 0;
    };
    sys.dispose = () => {
      Object.values(meshes).forEach((m) => {
        scene.remove(m);
        m.geometry.dispose();
      });
      mat.dispose();
    };
    sys.herdCenter = herdCenter;
    // лучи выстрела: центр туловища и головы с радиусами
    sys.hitTest = (origin, dir, maxDist) => {
      let best = null;
      let bestT = maxDist;
      const test = (cx, cy, cz, r, d) => {
        const ox = origin.x - cx;
        const oy = origin.y - cy;
        const oz = origin.z - cz;
        const b = ox * dir.x + oy * dir.y + oz * dir.z;
        const c = ox * ox + oy * oy + oz * oz - r * r;
        const disc = b * b - c;
        if (disc < 0) return;
        const t = -b - Math.sqrt(disc);
        if (t > 0 && t < bestT) { bestT = t; best = d; }
      };
      deer.forEach((d) => {
        if (d.hidden || d.caught) return;
        const sc = d.scale;
        const lieDrop = d.lie * 0.62 * sc;
        test(d.x, d.y + 1.05 * sc - lieDrop, d.z, 0.55 * sc, d);
        test(d.x + Math.sin(d.yaw) * 0.75 * sc, d.y + 1.7 * sc - lieDrop - d.headPitch * 0.4 * sc, d.z + Math.cos(d.yaw) * 0.75 * sc, 0.3 * sc, d);
      });
      return best ? { deer: best, t: bestT } : null;
    };
    return sys;
  }

  window.HideDeer = { create };
})();
