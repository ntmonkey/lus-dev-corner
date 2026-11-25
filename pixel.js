/* Pixel art engine for Lu's Dev Corner: sprites, icons, and the animated dev-room scene. */

(function () {
  "use strict";

  var PAL = {
    k: "#0b1b1c", w: "#f5efe0", r: "#ff4d6d", y: "#ffd23f", g: "#3ddc84", d: "#1e7a4c",
    b: "#4d8dff", s: "#c9c3d9", c: "#4de1ff", p: "#54989a", o: "#ff9f43", n: "#8b5a3c", e: "#f2c9a0", v: "#8a63ff", R: "#e63946", h: "#3a4f7a", m: "#a0aec0",
    A: "#cf402d", B: "#b4b4b4", C: "#fdf8c3", D: "#464646", E: "#000000", F: "#0a7cff", G: "#ffffff"
  };

  var SPRITES = {
    heart: [
      ".rr..rr.",
      "rwrrrrrr",
      "rrrrrrrr",
      "rrrrrrrr",
      ".rrrrrr.",
      "..rrrr..",
      "...rr..."
    ],
    tinyHeart: [".r.r.", "rrrrr", ".rrr.", "..r.."],
    star: [
      "...yy...",
      "...yy...",
      "yyyyyyyy",
      ".yyyyyy.",
      "..yyyy..",
      ".yyyyyy.",
      ".yy..yy.",
      "yy....yy"
    ],
    floppy: [
      "bbbbbbbk",
      "bsssssbk",
      "bsssssbk",
      "bbbbbbbk",
      "bbbbbbbk",
      "bwwwwwbk",
      "bwkwwwbk",
      "bwwwwwbk"
    ],
    gem: [
      "..cccc..",
      ".cwcccc.",
      "cwcccccc",
      "cccccccc",
      ".cccccc.",
      "..cccc..",
      "...cc..."
    ],
    pad: [
      ".kkkkkkkk.",
      "kssssssssk",
      "ksksssyssk",
      "kkkkssysrk",
      "ksksssrssk",
      ".kkkkkkkk."
    ],
    cart: [
      "kkkkkkkk",
      "kssssssk",
      "krrrrrrk",
      "krwwwwrk",
      "krrrrrrk",
      "kssssssk",
      "kssssssk",
      ".kkkkkk."
    ],
    player: [
      ".............BBB",
      ".BBC....A..EED..",
      "BBBCC..AAA.E.BB.",
      "BABAC.AABAAE....",
      ".BEC..ABBBA.....",
      ".CCC.AAFBFAA....",
      "......ABDBA.....",
      "....BAAAAAAAB...",
      "....BAAAGAAAB...",
      ".....AAAGAAA....",
      "......AAAAA.....",
      "......AAAAA.....",
      ".....AAAAAAA...."
    ],
    playerRun: [
      "..rrrr..",
      ".rrrrrr.",
      ".eekeke.",
      ".eeeeee.",
      "..bbbb..",
      ".ebbbbe.",
      ".b....b.",
      "kk....kk"
    ],
    computer: [
      "kkkkkkkkkk",
      "kssssssssk",
      "ksccccccsk",
      "ksccwcccsk",
      "ksccccccsk",
      "kssssssssk",
      "kkkkkkkkkk",
      "...kssk...",
      "..kssssk.."
    ],
    envelope: [
      "kkkkkkkkkk",
      "kwkwwwwkwk",
      "kwwkwwkwwk",
      "kwwwkkwwwk",
      "kwwwwwwwwk",
      "kwwwwwwwwk",
      "kkkkkkkkkk"
    ],
    bubble: [
      ".kkkkkkkk.",
      "kcccccccck",
      "kcwcwcwcck",
      "kcccccccck",
      ".kkkkkkkk.",
      "..kcck....",
      "..kk......"
    ],
    briefcase: [
      "...kkkk...",
      "...k..k...",
      "kkkkkkkkkk",
      "kooooooook",
      "koooyyoook",
      "kooooooook",
      "kkkkkkkkkk"
    ],
    pano: [
      "wwwwww......wwwwww",
      "w....wwwwwwww....w",
      "w................w",
      "w.www............w",
      "w.w.w........w...w",
      "w.www...w...w.w..w",
      "w......w.w.w...w.w",
      "w.....w...w.....ww",
      "w....w...w.......w",
      "w....wwwwwwww....w",
      "wwwwww......wwwwww"
    ],
    camera: [
      "sssssssssss",
      "scccsssssss",
      "kkkkkrkkkkk",
      "kkkkssskkkk",
      "kkkscccskkk",
      "kkkscwcskkk",
      "kkkscccskkk",
      "kkkkssskkkk",
      "kkkkkkkkkkk"
    ],
    slime: [
      "..gggg..",
      ".gggggg.",
      "ggwkgwkg",
      "gggggggg",
      ".gggggg.",
      "..dddd.."
    ]
  };

  function drawSprite(ctx, rows, x, y, scale) {
    scale = scale || 1;
    for (var r = 0; r < rows.length; r++) {
      var row = rows[r];
      for (var c = 0; c < row.length; c++) {
        var ch = row.charAt(c);
        if (ch === "." || !PAL[ch]) continue;
        ctx.fillStyle = PAL[ch];
        ctx.fillRect(x + c * scale, y + r * scale, scale, scale);
      }
    }
  }

  /* Fill every <canvas data-sprite="name" data-scale="3"> with its sprite. */
  function initIcons(root) {
    var list = (root || document).querySelectorAll("canvas[data-sprite]");
    for (var i = 0; i < list.length; i++) {
      var cv = list[i];
      if (cv.getAttribute("data-done")) continue;
      var rows = SPRITES[cv.getAttribute("data-sprite")];
      if (!rows) continue;
      var attr = cv.getAttribute("data-scale") || "3";
      cv.width = rows[0].length;
      cv.height = rows.length;
      if (attr === "auto") {
        /* one shared pixel size (--px in style.css) so every sprite matches the scene */
        cv.style.width = "calc(" + rows[0].length + " * var(--px))";
        cv.style.height = "calc(" + rows.length + " * var(--px))";
      } else {
        var scale = parseInt(attr, 10);
        cv.style.width = rows[0].length * scale + "px";
        cv.style.height = rows.length * scale + "px";
      }
      drawSprite(cv.getContext("2d"), rows, 0, 0, 1);
      cv.setAttribute("data-done", "1");
    }
  }

  /* The home page scene: Lu's desk at night, a retro 49" ultrawide running a tiny platformer. */
  function startScene() {
    var cv = document.getElementById("scene");
    if (!cv) return;
    var ctx = cv.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    var W = 160, H = 96;

    function R(x, y, w, h, c) {
      ctx.fillStyle = c;
      ctx.fillRect(Math.round(x), Math.round(y), w, h);
    }
    function mod(a, n) { return ((a % n) + n) % n; }
    function disc(cx, cy, r, c) {
      for (var dy = -r; dy <= r; dy++) {
        for (var dx = -r; dx <= r; dx++) {
          if (dx * dx + dy * dy <= r * r) R(cx + dx, cy + dy, 1, 1, c);
        }
      }
    }

    /* tiny 3x5 font for the neon sign and the monitor badge */
    var FONT = {
      L: ["100", "100", "100", "100", "111"], U: ["101", "101", "101", "101", "111"],
      S: ["111", "100", "111", "001", "111"], D: ["110", "101", "101", "101", "110"],
      E: ["111", "100", "110", "100", "111"], V: ["101", "101", "101", "101", "010"],
      C: ["111", "100", "100", "100", "111"], O: ["111", "101", "101", "101", "111"],
      R: ["110", "101", "110", "101", "101"], N: ["101", "111", "111", "111", "101"],
      W: ["101", "101", "111", "111", "101"], I: ["111", "010", "010", "010", "111"],
      "4": ["101", "101", "111", "001", "001"], "9": ["111", "101", "111", "001", "111"],
      "'": ["1", "1", "0", "0", "0"]
    };
    function textWidth(s) {
      var w = 0;
      for (var i = 0; i < s.length; i++) w += s.charAt(i) === " " ? 2 : FONT[s.charAt(i)][0].length + 1;
      return w - 1;
    }
    function drawText(s, x, y, color) {
      for (var i = 0; i < s.length; i++) {
        var ch = s.charAt(i);
        if (ch === " ") { x += 2; continue; }
        var g = FONT[ch];
        for (var r = 0; r < g.length; r++) {
          for (var c = 0; c < g[r].length; c++) {
            if (g[r].charAt(c) === "1") R(x + c, y + r, 1, 1, color);
          }
        }
        x += g[0].length + 1;
      }
    }

    /* ---- the window shows the sky for the viewer's real local time ----
       Add ?hour=15.5 to the page address (when opening the files locally) to preview another time of day. */
    var SKY = [   /* [hour, top color, bottom color] — colors blend smoothly between these */
      [0,    "#0b1b1c", "#12292b"],  /* night */
      [5,    "#0b1b1c", "#12292b"],
      [6,    "#3a4a8c", "#ff9a5c"],  /* dawn */
      [7.5,  "#5aa8e0", "#f2c9a0"],  /* morning */
      [9,    "#5db4ec", "#bfe6f5"],
      [12,   "#3d9ae8", "#9fd8f5"],  /* noon */
      [15.5, "#4aa0e0", "#c8e3f0"],  /* afternoon */
      [17.5, "#6a8fd0", "#f2c48a"],
      [18.5, "#5a4a8a", "#ff7a45"],  /* sunset */
      [19.5, "#2a2a5a", "#7a3a6a"],  /* dusk */
      [21,   "#0b1b1c", "#12292b"],  /* night */
      [24,   "#0b1b1c", "#12292b"]
    ];
    function hex2rgb(h) { return [parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16)]; }
    function mixRgb(c1, c2, f) {   /* same as mix, but c1 and c2 may already be rgb() strings */
      var a = c1.charAt(0) === "#" ? hex2rgb(c1) : c1.match(/\d+/g).map(Number);
      var b = c2.charAt(0) === "#" ? hex2rgb(c2) : c2.match(/\d+/g).map(Number);
      return "rgb(" + Math.round(a[0] + (b[0] - a[0]) * f) + "," + Math.round(a[1] + (b[1] - a[1]) * f) + "," + Math.round(a[2] + (b[2] - a[2]) * f) + ")";
    }
    function clock() {
      var m = /[?&]hour=([\d.]+)/.exec(window.location.search);
      if (m) return parseFloat(m[1]) % 24;
      var d = new Date();
      return d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600;
    }
    function skyColors(h) {   /* returns [top, bottom] for this hour */
      for (var k = 1; k < SKY.length; k++) {
        if (h <= SKY[k][0]) {
          var f = (h - SKY[k - 1][0]) / (SKY[k][0] - SKY[k - 1][0]);
          return [mixRgb(SKY[k - 1][1], SKY[k][1], f), mixRgb(SKY[k - 1][2], SKY[k][2], f)];
        }
      }
      return [SKY[0][1], SKY[0][2]];
    }
    function nightAmount(h) {   /* 1 = full night (stars out), 0 = day */
      if (h < 5 || h > 21) return 1;
      if (h < 6.5) return (6.5 - h) / 1.5;
      if (h > 19) return (h - 19) / 2;
      return 0;
    }

    function drawWindow(t) {
      var stars = [[8, 8], [12, 11], [20, 7], [17, 13], [9, 14]];
      var bw = [4, 5, 3, 4, 4], bh = [6, 9, 5, 7, 8];
      var i, h = clock(), night = nightAmount(h), sc = skyColors(h), rowCol = [];
      R(4, 4, 24, 22, "#74c8cb");
      /* sky: 6 chunky bands from top color to bottom color */
      for (i = 0; i < 18; i++) {
        rowCol[i] = mixRgb(sc[0], sc[1], Math.floor(i / 3) / 5);
        R(6, 6 + i, 20, 1, rowCol[i]);
      }
      /* stars come out at night */
      if (night > 0.3) {
        for (i = 0; i < stars.length; i++) {
          R(stars[i][0], stars[i][1], 1, 1, Math.sin(t * 2 + i * 1.7) > -0.3 ? "#f5efe0" : "#42797b");
        }
      }
      /* sun by day (6:00 to 18:00), moon by night; both ride an arc across the window */
      var sunUp = h >= 6 && h < 18;
      var frac = sunUp ? (h - 6) / 12 : mod(h - 18, 24) / 12;
      var ax = 11 + frac * 16, ay = 21 - Math.sin(Math.PI * frac) * 13;
      ctx.save();
      ctx.beginPath(); ctx.rect(6, 6, 20, 18); ctx.clip();   /* keep everything inside the window glass */
      if (sunUp) {
        var low = 1 - Math.sin(Math.PI * frac);               /* 0 at noon, 1 at the horizon */
        disc(ax, ay, 3, mixRgb("#ffe45e", "#ff8a3c", Math.min(1, low * 1.3)));
        R(ax - 1, ay - 1, 2, 2, "#fff6b0");
        /* a couple of clouds drift by in daylight */
        if (h > 7 && h < 17.5) {
          cloud(mod(t * 0.6, 36) - 8, 10);
          cloud(mod(t * 0.4 + 20, 36) - 8, 15);
        }
      } else {
        /* full round moon with a few soft craters */
        disc(ax, ay, 3, "#f5efe0");
        R(ax - 2, ay - 1, 1, 1, "#d9d2bd");
        R(ax + 1, ay + 1, 2, 1, "#d9d2bd");
        R(ax, ay - 2, 1, 1, "#d9d2bd");
      }
      ctx.restore();
      /* skyline: dark silhouettes at night, hazy blue in daylight; windows light up after dark */
      var bcol = mixRgb("#5f8fa6", "#0b1b1c", night);
      var x0 = 6;
      for (i = 0; i < bw.length; i++) {
        R(x0, 24 - bh[i], bw[i], bh[i], bcol);
        for (var wy = 24 - bh[i] + 1; wy < 23; wy += 2) {
          for (var wx = x0 + 1; wx < x0 + bw[i] - 1; wx += 2) {
            var seed = (wx * 13 + wy * 7) % 11;
            if (night > 0.4) {
              if (seed < 4 && (seed + Math.floor(t / 3)) % 3 !== 0) R(wx, wy, 1, 1, "#ffd23f");
            } else if (seed < 4) {
              R(wx, wy, 1, 1, "#86b4c8");
            }
          }
        }
        x0 += bw[i];
      }
      R(15, 6, 2, 18, "#74c8cb");
      R(6, 14, 20, 2, "#74c8cb");
      R(2, 26, 28, 2, "#54989a");
    }

    // The poster: a 20x18 pixel version of Van Gogh's The Starry Night (public domain).
    // Each letter is a color from POSTER_PAL; edit the rows to repaint it.
    var POSTER_PAL = { a: "#0f1d1c", b: "#16275e", c: "#1f3f8f", d: "#2d63c8", e: "#4f8fe6", f: "#86bff2", g: "#d9ecc0", h: "#ffd23f", i: "#2f5a3a", j: "#7a5a2e" };
    var POSTER = [
      "gddddffgfddegfeeeefg",
      "edcddddddddegfddefgh",
      "edjhddefffeeedeeeghh",
      "dddfeffgfffffdggefgh",
      "eedffffeeefffefgfefg",
      "ffiffgeefffffeeeeeff",
      "feafeffffffffeffefee",
      "fiadddfffeeeffffffff",
      "gjacffgfffffffffffgg",
      "fiacfgggeeeeeffffggf",
      "eaacegggffffffggggfe",
      "faaadfgggfgffffffdcd",
      "fbaaadffeffeddcdddde",
      "ecaaaacddddedddeeeef",
      "baaaaaabcddeeedccede",
      "baaaaaabcccccdccccde",
      "baaaaaaaaaicbaabcbcc",
      "iaaaaaaaaabbibabcdcc"
    ];

    function drawPoster() {
      /* brown wooden frame: dark outer edge, lighter inner edge, 2px thick all around */
      R(132, 4, 24, 22, "#6b3f26");
      R(133, 5, 22, 20, "#a8683c");
      for (var y = 0; y < POSTER.length; y++) {
        for (var x = 0; x < POSTER[y].length; x++) {
          R(134 + x, 6 + y, 1, 1, POSTER_PAL[POSTER[y].charAt(x)]);
        }
      }
    }

    /* third sign effect (the last 5s of each 15s loop): matrix-style rain, then the letters slowly appear.
       0-2s: columns of falling pixels   2-5s: the rain thins out while the letters fade in */
    function hh(n) { var v = Math.sin(n * 127.1) * 43758.5453; return v - Math.floor(v); }   /* repeatable "random" 0..1 */
    var signPixels = null;
    function drawRain(local, s) {
      var i, k, x, y, c, r, g, ch;
      if (!signPixels) {            /* every lit pixel of the sign text, found once */
        signPixels = [];
        x = 53;
        for (i = 0; i < s.length; i++) {
          ch = s.charAt(i);
          if (ch === " ") { x += 2; continue; }
          g = FONT[ch];
          for (r = 0; r < g.length; r++) {
            for (c = 0; c < g[r].length; c++) {
              if (g[r].charAt(c) === "1") signPixels.push([x + c, 8 + r]);
            }
          }
          x += g[0].length + 1;
        }
      }
      /* letters: each pixel fades in at its own moment between 2.0s and about 4.9s */
      for (i = 0; i < signPixels.length; i++) {
        var p = signPixels[i];
        var rv = Math.max(0, Math.min(1, (local - 2.0 - 2.4 * hh(p[0] * 1.7 + p[1] * 9.1)) / 0.5));
        if (rv > 0) {
          ctx.globalAlpha = rv * 0.9;
          R(p[0], p[1], 1, 1, "#ff1f1f");
        }
      }
      /* rain: one falling streak per column inside the sign (x 50..109, y 5..15) */
      var amp = local < 2 ? 1 : Math.max(0, 1 - (local - 2) / 2.8);   /* how many columns still rain */
      for (var col = 50; col < 110; col++) {
        if (hh(col * 5.7) >= amp) continue;
        var speed = 9 + 7 * hh(col), tail = 4 + Math.floor(hh(col * 7.3) * 3);
        var period = 11 + tail + 3;
        var head = 5 + Math.floor(mod(local * speed + hh(col * 3.1) * 20, period)) - tail;
        for (k = 0; k <= tail; k++) {
          y = head - k;
          if (y < 5 || y > 15) continue;
          if (k === 0) {
            ctx.globalAlpha = 1;
            R(col, y, 1, 1, "#ff6a5a");           /* bright head */
          } else {
            ctx.globalAlpha = 0.85 * (1 - k / (tail + 1));
            R(col, y, 1, 1, "#ff1f1f");           /* fading red tail */
          }
        }
      }
    }

    function drawSign(t) {
      var s = "LU'S DEV CORNER";
      /* three effects, 5s each: pulse (0-5s), scan (5-10s), rain (10-15s) */
      var phase = (t - 3.2) % 15;
      var pulse = 0.5 + 0.5 * Math.sin(t * 2.5);
      var coreAlpha = 0.4 + 0.6 * pulse;
      var glowAlpha = 0.05 + 0.45 * pulse;
      /* knight rider scan: one full left-right-left sweep in 5s */
      var half = (phase - 5) / 5;
      if (half < 0) half = 0;
      var head_pos = half <= 0.5 ? half * 2 : (1 - half) * 2;
      var text_min = 53, text_max = 110;
      var head_x = text_min + head_pos * (text_max - text_min);
      var scan_radius = 8;
      R(49, 4, 62, 13, "#0b1b1c");
      R(49, 4, 62, 1, "#54989a");
      R(49, 16, 62, 1, "#54989a");
      R(49, 4, 1, 13, "#54989a");
      R(110, 4, 1, 13, "#54989a");
      R(60, 0, 1, 4, "#54989a");
      R(100, 0, 1, 4, "#54989a");
      /* build per-character intensity based on distance from scan head */
      var x = 53;
      for (var ci = 0; ci < s.length; ci++) {
        var ch = s.charAt(ci);
        if (ch === " ") { x += 2; continue; }
        var cw = FONT[ch][0].length + 1;
        var char_center = x + cw / 2 - 1;
        var intensity;
        if (phase < 5) {
          /* pulse: uniform flicker */
          intensity = coreAlpha;
        } else if (phase < 10) {
          /* scan: boost near the head */
          var dist = Math.abs(char_center - head_x);
          intensity = 0.3 + 0.7 * Math.max(0, 1 - dist / scan_radius);
        } else {
          /* rain: the letters are drawn by drawRain below, so skip them here */
          x += cw;
          continue;
        }
        ctx.globalAlpha = intensity;
        drawText(ch, x, 8, "#ff1f1f");
        ctx.globalAlpha = intensity * 0.15;
        drawText(ch, x, 8, "#ff5a4a");
        x += cw;
      }
      if (phase >= 10) drawRain(phase - 10, s);
      ctx.globalAlpha = 1;
    }

    function drawDeskTop() {
      R(0, 75, W, 8, "#a8683c"); R(0, 75, W, 1, "#d18a52"); R(0, 82, W, 1, "#8a5330");
    }

    function drawDeskFront() {
      R(0, 83, W, 13, "#6b3f26"); R(56, 83, 48, 13, "#2a1a14");
    }

    function cloud(cx, cy) {
      R(cx + 1, cy, 5, 1, "#ffffff");
      R(cx, cy + 1, 7, 2, "#ffffff");
      R(cx + 2, cy - 1, 3, 1, "#ffffff");
    }

    var SX = 20, SY = 32, SW = 120, SH = 32;

    // ---- the monitor game: a little lane-crossing frog (original, not a copy of anything) ----
    // The screen is 120 wide and 32 tall, so the lanes run left to right and the frog hops up the screen.
    var HOPT = 0.16, STEPT = 0.6, T0 = 0.8, HOLD = 1.0, NSTEP = 7;   // hop time, time per step, wait at start, wait at goal
    var TC = T0 + HOPT + (NSTEP - 1) * STEPT + HOLD;                  // one full crossing
    var LY = [28, 24, 19, 14, 10, 7, 2, 0];                           // top row of the frog at each stop (start, 3 road, median, 2 river, goal)
    var LANE = {
      1: { y: 24, v: 14,  o: [[0, 8], [55, 8], [110, 8]] },           // road, bottom lane
      2: { y: 19, v: -20, o: [[20, 10], [85, 8], [130, 8]] },
      3: { y: 14, v: 10,  o: [[10, 8], [60, 8], [112, 10]] },
      5: { y: 7,  v: -10, o: [[0, 22], [55, 20], [110, 22]] },        // river, logs
      6: { y: 2,  v: 8,   o: [[25, 20], [80, 22], [135, 18]] }
    };
    var CAR_COLORS = ["#ff4d6d", "#4de1ff", "#ffd23f", "#b08cff"];
    var plans = {};

    function SR(x, y, w, h, c) { R(SX + x, SY + y, w, h, c); }
    function objX(l, ob, t) { return mod(ob[0] + l.v * t, 160) - 30; }
    function hitsCar(l, x, t) {
      for (var i = 0; i < l.o.length; i++) {
        var ox = objX(l, l.o[i], t);
        if (x + 5.5 > ox && x - 5.5 < ox + l.o[i][1]) return true;
      }
      return false;
    }
    function onLog(l, x, t) {
      for (var i = 0; i < l.o.length; i++) {
        var ox = objX(l, l.o[i], t);
        if (x - 2.5 >= ox && x + 2.5 <= ox + l.o[i][1]) return true;
      }
      return false;
    }

    // Plan one crossing: pick a safe landing spot for every hop, so the frog dodges cars and rides logs.
    function planFor(c) {
      if (plans[c]) return plans[c];
      var base = c * TC, s0 = 12 + mod(c * 47, 96), land = [s0], deps = [s0], bad = 0;
      for (var k = 1; k <= NSTEP; k++) {
        var prev = deps[k - 1], l = LANE[k], tk = base + T0 + HOPT + (k - 1) * STEPT;
        if (!l) { land[k] = Math.max(6, Math.min(114, Math.round(prev))); deps[k] = land[k]; continue; }
        var best = Math.round(prev), bs = 1e9;
        for (var cand = Math.max(5, Math.round(prev) - 40); cand <= Math.min(115, Math.round(prev) + 40); cand++) {
          var sc = Math.abs(cand - prev) * 0.5 + 0.05 * Math.abs(cand - 60);
          if (k < 4) {
            for (var tt = tk - HOPT; tt <= tk + STEPT - HOPT; tt += 0.06) if (hitsCar(l, cand, tt)) sc += 1000;
          } else {
            if (!onLog(l, cand, tk)) sc += 1000;
            var end = cand + l.v * (STEPT - HOPT);
            if (end < 5 || end > 115) sc += 1000;
          }
          if (sc < bs) { bs = sc; best = cand; }
        }
        if (bs >= 1000) bad++;
        land[k] = best;
        deps[k] = k < 4 ? best : best + l.v * (STEPT - HOPT);
      }
      delete plans[c - 3];
      plans[c] = { land: land, deps: deps, bad: bad };
      return plans[c];
    }

    // Where is the frog at time t?
    function frogAt(t) {
      var c = Math.floor(t / TC), p = planFor(c), lt = t - c * TC;
      if (lt < T0) return { x: p.land[0], y: LY[0], hop: false, goal: false };
      var k = Math.min(NSTEP - 1, Math.floor((lt - T0) / STEPT)), ph = lt - (T0 + k * STEPT);
      if (ph < HOPT) {
        var u = ph / HOPT;
        return { x: p.deps[k] + (p.land[k + 1] - p.deps[k]) * u, y: LY[k] + (LY[k + 1] - LY[k]) * u, hop: true, goal: false };
      }
      var l = LANE[k + 1], x = p.land[k + 1];
      if (l && k + 1 >= 5) x += l.v * (ph - HOPT);
      return { x: x, y: LY[k + 1], hop: false, goal: k === NSTEP - 1, since: ph - HOPT };
    }

    function drawCar(l, ob, idx) {
      var ox = Math.round(objX(l, ob, tNow)), len = ob[1], a = l.y, right = l.v > 0;
      var col = CAR_COLORS[(idx + a) % 4];
      var fx = right ? ox + len - 1 : ox, rx = right ? ox : ox + len - 1;
      if (len > 9) {                                    // truck: cab + trailer
        var cx = right ? ox + len - 4 : ox;
        SR(ox, a, len, 4, "#c9c3d9");
        SR(cx, a, 4, 4, col);
        SR(right ? cx + 2 : cx + 1, a + 1, 1, 2, "#bfe9ff");
      } else {                                          // car
        SR(ox, a, len, 4, col);
        SR(right ? ox + len - 4 : ox + 2, a + 1, 2, 2, "#bfe9ff");
      }
      SR(ox + 1, a, 2, 1, "#101214"); SR(ox + len - 3, a, 2, 1, "#101214");
      SR(ox + 1, a + 3, 2, 1, "#101214"); SR(ox + len - 3, a + 3, 2, 1, "#101214");
      SR(fx, a, 1, 1, "#fff3b0"); SR(fx, a + 3, 1, 1, "#fff3b0");
      SR(rx, a, 1, 1, "#ff4d6d"); SR(rx, a + 3, 1, 1, "#ff4d6d");
    }

    function drawLog(l, ob) {
      var ox = Math.round(objX(l, ob, tNow)), len = ob[1], a = l.y;
      SR(ox, a, len, 4, "#8b5a3c");
      SR(ox, a, len, 1, "#a8744d");
      SR(ox, a + 3, len, 1, "#6b4229");
      for (var j = 4; j < len - 2; j += 5) SR(ox + j, a + 1, 1, 2, "#6b4229");
      SR(ox, a + 1, 1, 2, "#c99a6b"); SR(ox + len - 1, a + 1, 1, 2, "#6b4229");
    }

    function drawFrog(f) {
      var ox = Math.round(f.x) - 2, oy = Math.round(f.y), leg = "#2fd070";
      SR(ox + 1, oy, 3, 3, "#7dffa8");                  // body and head
      SR(ox + 1, oy, 1, 1, "#ffffff"); SR(ox + 3, oy, 1, 1, "#ffffff");   // eyes
      if (f.hop) {                                      // legs stretched
        SR(ox, oy + 1, 1, 1, leg); SR(ox + 4, oy + 1, 1, 1, leg);
        SR(ox, oy + 3, 1, 2, leg); SR(ox + 4, oy + 3, 1, 2, leg); SR(ox + 2, oy + 3, 1, 1, leg);
      } else {                                          // legs tucked
        SR(ox, oy + 1, 1, 1, leg); SR(ox + 4, oy + 1, 1, 1, leg);
        SR(ox, oy + 3, 2, 1, leg); SR(ox + 3, oy + 3, 2, 1, leg);
      }
    }

    var tNow = 0;
    function drawScreen(t) {
      var i, j, l, k;
      tNow = t;
      ctx.save();
      ctx.beginPath(); ctx.rect(SX, SY, SW, SH); ctx.clip();

      // grass everywhere, then road and river on top
      SR(0, 0, SW, SH, "#2f8f55");
      var tufts = [[6, 30], [30, 29], [58, 30], [86, 29], [112, 30], [14, 12], [47, 13], [80, 12], [105, 13], [20, 0], [75, 1], [100, 0]];
      for (i = 0; i < tufts.length; i++) SR(tufts[i][0], tufts[i][1], 1, 1, "#44b36c");

      SR(0, 14, SW, 15, "#3a4a4c");
      SR(0, 28, SW, 1, "#9aa5a6"); SR(0, 14, SW, 1, "#2b393b");
      for (j = 18; j <= 23; j += 5) for (i = 0; i < SW; i += 8) SR(i, j, 4, 1, "#c9c3d9");

      for (k = 5; k <= 6; k++) {
        l = LANE[k];
        SR(0, l.y, SW, 5, k === 5 ? "#2a74c2" : "#2f7fd0");
        for (j = 0; j < 4; j++) SR(Math.round(mod(j * 37 + l.v * t * 0.6, 150)) - 4, l.y + 4, 3, 1, "#6ab8ff");
      }
      SR(0, 11, SW, 1, "#2a74c2");

      // lily pad where the frog will land at the goal
      var padX = planFor(Math.floor(t / TC)).land[NSTEP];
      SR(padX - 3, 0, 7, 2, "#3ddc84"); SR(padX - 2, 2, 5, 1, "#3ddc84"); SR(padX - 1, 0, 2, 1, "#8dffb8");

      for (k = 5; k <= 6; k++) for (j = 0; j < LANE[k].o.length; j++) drawLog(LANE[k], LANE[k].o[j]);
      for (k = 1; k <= 3; k++) for (j = 0; j < LANE[k].o.length; j++) drawCar(LANE[k], LANE[k].o[j], k * 3 + j);

      var f = frogAt(t);
      drawFrog(f);
      if (f.goal && Math.floor(f.since * 8) % 2 === 0) {   // sparkle when the frog makes it
        for (i = 0; i < 4; i++) {
          var a = f.since * 6 + i * Math.PI / 2;
          SR(Math.round(f.x) + Math.round(Math.cos(a) * 8), 2 + Math.round(Math.sin(a) * 3), 1, 1, "#ffd23f");
        }
      }

      ctx.restore();
      ctx.globalAlpha = 0.07;
      for (var y = SY; y < SY + SH; y += 2) R(SX, y, SW, 1, "#000000");
      ctx.globalAlpha = 0.35;
      R(SX + 3, SY + 2, 6, 1, "#ffffff");
      R(SX + 3, SY + 3, 1, 3, "#ffffff");
      ctx.globalAlpha = 1;
      R(SX, SY, 1, 1, "#1a3739"); R(SX + SW - 1, SY, 1, 1, "#1a3739");
      R(SX, SY + SH - 1, 1, 1, "#1a3739"); R(SX + SW - 1, SY + SH - 1, 1, 1, "#1a3739");
    }

    function drawMonitor(t) {
      var i;
      R(16, 27, 128, 44, "#d6cdb4");
      R(16, 27, 128, 1, "#efe8d2");
      R(16, 27, 1, 44, "#efe8d2");
      R(143, 27, 1, 44, "#b3aa90");
      R(16, 70, 128, 1, "#b3aa90");
      for (i = 0; i < 12; i++) R(24 + i * 3, 29, 2, 1, "#b3aa90");
      R(19, 31, 122, 34, "#8f866c");
      /* chin: speaker grille, badge, buttons, power light */
      for (i = 0; i < 7; i++) R(22 + i * 3, 66, 2, 3, "#9c9378");
      R(116, 66, 3, 3, "#b3aa90");
      R(121, 66, 3, 3, "#b3aa90");
      R(126, 66, 3, 3, "#b3aa90");
      R(134, 67, 3, 2, Math.sin(t * 3) > -0.6 ? "#3ddc84" : "#1e7a4c");
      /* stand */
      R(72, 71, 16, 2, "#b3aa90");
      R(60, 73, 40, 2, "#d6cdb4");
      R(60, 75, 40, 1, "#b3aa90");
    }

    function drawKeyboard() {
      var x;
      R(54, 77, 52, 4, "#4f6b6c");
      R(54, 77, 52, 1, "#8fb0b1");
      for (x = 56; x < 104; x += 3) R(x, 78, 2, 1, "#c9c3d9");
      for (x = 57; x < 103; x += 3) R(x, 79, 2, 1, "#a8c5c6");
      R(110, 77, 5, 4, "#c9c3d9");
      R(110, 77, 5, 1, "#8fb0b1");
      R(112, 77, 1, 2, "#4f6b6c");
    }

    function drawDeskItems(t) {
      R(4, 75, 14, 3, "#4d8dff"); R(7, 75, 5, 1, "#c9c3d9");
      R(5, 72, 14, 3, "#ff4d6d"); R(8, 72, 5, 1, "#c9c3d9");
      R(4, 69, 14, 3, "#ffd23f"); R(7, 69, 5, 1, "#c9c3d9");
      /* coffee mug: black, white and red band, lots of steam */
      R(119, 69, 8, 10, "#101214");
      R(127, 71, 3, 5, "#101214");
      R(128, 72, 1, 3, "#2a5254");
      R(120, 70, 6, 1, "#8b5a3c");
      R(119, 75, 5, 1, "#ffffff");
      R(124, 75, 3, 1, "#ff4d6d");
      for (var m = 0; m < 6; m++) {
        var ph = mod(t * 4 + m * 2, 12);
        ctx.globalAlpha = Math.max(0, (1 - ph / 12) * 0.9);
        R(Math.round(120 + m * 1.2 + Math.sin(ph * 0.7 + m * 1.9) * 1.6), Math.round(68 - ph), 1, 2, "#8fb0b1");
      }
      ctx.globalAlpha = 1;
      drawSprite(ctx, SPRITES.cart, 26, 70, 1);
      drawSprite(ctx, SPRITES.camera, 132, 72, 1);
      R(153, 67, 2, 6, "#1e7a4c");
      R(150, 68, 3, 2, "#3ddc84");
      R(155, 66, 3, 2, "#3ddc84");
      R(151, 64, 2, 3, "#3ddc84");
      R(155, 63, 2, 3, "#1e7a4c");
      R(149, 72, 10, 2, "#d9673a");
      R(150, 74, 8, 5, "#c2562e");
    }

    function draw(t) {
      ctx.globalAlpha = 1;
      R(0, 0, W, H, "#315d5f");
      for (var wx = 0; wx < W; wx += 8) R(wx, 0, 1, 75, "#2a5254");
      drawWindow(t);
      drawPoster();
      drawSign(t);
      ctx.globalAlpha = 0.05;
      R(10, 22, 140, 54, "#4de1ff");
      ctx.globalAlpha = 1;
      drawDeskTop();
      drawMonitor(t);
      drawScreen(t);
      drawDeskItems(t);
      drawKeyboard();
      drawDeskFront();
    }

    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    draw(3.2);
    if (reduce) return;
    var last = 0;
    function frame(ms) {
      if (ms - last >= 66) {
        draw(ms / 1000 + 3.2);
        last = ms;
      }
      window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
  }

  window.Pixel = { PAL: PAL, SPRITES: SPRITES, drawSprite: drawSprite, initIcons: initIcons };
  initIcons();
  startScene();
})();
