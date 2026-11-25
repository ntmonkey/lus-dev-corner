/* Photo gallery: the photo list lives in the shared db, the image files in asset storage. */
(function () {
  "use strict";

  /* PHOTOS in data.js are the files in images/gallery; uploads (db + assets) are added in front of them */
  var fixed = (window.PHOTOS || []).map(function (p) { return { file: p.file, thumb: p.thumb, w: p.w, h: p.h, caption: p.caption || "", fixed: true }; });
  var uploaded = [];
  var photos = fixed.slice();
  var current = -1;
  var db = null;
  var assets = null;
  var confirmDelete = false;

  var gallery = document.getElementById("gallery");
  var note = document.getElementById("gallery-note");
  var box = document.getElementById("upload-box");
  var fileInput = document.getElementById("file-input");
  var uploadBtn = document.getElementById("upload-btn");
  var statusEl = document.getElementById("upload-status");
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lb-img");
  var lbCaption = document.getElementById("lb-caption");
  var lbEdit = document.getElementById("lb-edit");
  var lbText = document.getElementById("lb-text");
  var lbDelete = document.getElementById("lb-delete");

  function src(p) { return p.file || "/_blob/" + p.id; }
  function thumb(p) { return p.thumb || src(p); }

  function render() {
    gallery.innerHTML = "";
    photos = uploaded.concat(fixed);
    var rowH = window.innerWidth < 600 ? 130 : 220;
    note.hidden = photos.length > 0;
    if (!photos.length) {
      note.textContent = assets
        ? "No photos yet. Use the upload box above, or list files in data.js."
        : "No photos yet. Check back soon.";
    }
    photos.forEach(function (p, i) {
      var fig = document.createElement("figure");
      fig.className = "shot";
      /* tile shape: follow the photo, but keep very wide or very tall ones from taking over a row (the full picture shows when clicked) */
      var ratio = p.w && p.h ? Math.max(0.7, Math.min(2.1, p.w / p.h)) : 1.5;
      fig.style.flexGrow = String(Math.round(ratio * 100));
      fig.style.flexBasis = Math.round(ratio * rowH) + "px";
      var b = document.createElement("button");
      b.type = "button";
      b.style.aspectRatio = String(ratio);
      b.setAttribute("aria-label", "Open photo " + (i + 1));
      var img = document.createElement("img");
      img.src = thumb(p);
      img.alt = p.caption || "Photo " + (i + 1);
      img.loading = "lazy";
      b.appendChild(img);
      if (p.w && p.h && p.w / p.h >= 2.2) {          /* very wide photos get a panorama badge */
        var badge = document.createElement("span");
        badge.className = "pano-badge";
        badge.title = "Panorama";
        badge.setAttribute("role", "img");
        badge.setAttribute("aria-label", "Panorama");
        var ic = document.createElement("canvas");
        ic.setAttribute("data-sprite", "pano");
        ic.setAttribute("data-scale", "3");
        ic.setAttribute("aria-hidden", "true");
        badge.appendChild(ic);
        b.appendChild(badge);
      }
      b.addEventListener("click", function () { openBox(i); });
      fig.appendChild(b);
      if (p.caption) {
        var cap = document.createElement("figcaption");
        cap.textContent = p.caption;
        fig.appendChild(cap);
      }
      gallery.appendChild(fig);
    });
    if (window.Pixel) window.Pixel.initIcons(gallery);
    if (current >= 0) showCurrent();
  }

  function openBox(i) {
    current = i;
    lb.hidden = false;
    showCurrent();
    document.getElementById("lb-close").focus();
  }
  function closeBox() { lb.hidden = true; current = -1; }
  function showCurrent() {
    if (current >= photos.length) { closeBox(); return; }
    var p = photos[current];
    lbImg.src = src(p);
    lbImg.alt = p.caption || "Photo " + (current + 1);
    lbCaption.textContent = p.caption || "";
    lbEdit.hidden = !assets || !!p.fixed;
    lbText.value = p.caption || "";
    confirmDelete = false;
    lbDelete.textContent = "Delete photo";
  }
  function step(n) {
    if (!photos.length) return;
    current = (current + n + photos.length) % photos.length;
    showCurrent();
  }

  document.getElementById("lb-close").addEventListener("click", closeBox);
  document.getElementById("lb-prev").addEventListener("click", function () { step(-1); });
  document.getElementById("lb-next").addEventListener("click", function () { step(1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeBox(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") closeBox();
    if (e.target === lbText) return;
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  document.getElementById("lb-save").addEventListener("click", function () {
    var p = photos[current];
    if (!p || !db || p.fixed) return;
    db.collection("photos").doc(p.id).update({ caption: lbText.value.trim() }).catch(function () {
      statusEl.textContent = "Could not save the caption.";
    });
  });

  lbDelete.addEventListener("click", function () {
    var p = photos[current];
    if (!p || !db || !assets || p.fixed) return;
    if (!confirmDelete) {
      confirmDelete = true;
      lbDelete.textContent = "Click again to delete";
      return;
    }
    assets.delete(p.id)
      .catch(function () {})
      .then(function () { return db.collection("photos").doc(p.id).delete(); })
      .catch(function () { statusEl.textContent = "Could not delete that photo."; });
  });

  /* shrink big camera files before uploading: longest side 2400px, JPEG */
  function shrink(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        var max = 2400;
        var scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
        var w = Math.round(img.naturalWidth * scale);
        var h = Math.round(img.naturalHeight * scale);
        var c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        c.getContext("2d").drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        c.toBlob(function (blob) {
          if (blob) resolve({ blob: blob, w: w, h: h });
          else reject(new Error("encode failed"));
        }, "image/jpeg", 0.9);
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error("not an image")); };
      img.src = url;
    });
  }

  async function uploadAll() {
    var files = Array.prototype.slice.call(fileInput.files || []);
    if (!files.length) { statusEl.textContent = "Choose one or more photos first."; return; }
    uploadBtn.disabled = true;
    var done = 0;
    for (var i = 0; i < files.length; i++) {
      statusEl.textContent = "Uploading " + (i + 1) + " of " + files.length + "...";
      try {
        var s = await shrink(files[i]);
        var res = await assets.upload(s.blob);
        await db.collection("photos").doc(res.id).set({
          caption: "",
          w: s.w,
          h: s.h,
          createdAt: Date.now()
        });
        done++;
      } catch (e) {
        statusEl.textContent = "Stopped on " + files[i].name + ". " + (e && e.message ? e.message : "");
        uploadBtn.disabled = false;
        return;
      }
    }
    fileInput.value = "";
    statusEl.textContent = "Added " + done + (done === 1 ? " photo." : " photos.");
    uploadBtn.disabled = false;
  }
  uploadBtn.addEventListener("click", uploadAll);

  async function start() {
    render();
    if (!window.claude || !window.claude.use) {
      if (!fixed.length) note.textContent = "The gallery loads on the published site.";
      return;
    }
    db = await window.claude.use("db");
    assets = await window.claude.use("assets");
    if (assets && db) box.hidden = false;
    if (!db) {
      if (!fixed.length) note.textContent = "The gallery could not load right now.";
      return;
    }
    db.collection("photos").orderBy("createdAt", "desc").onSnapshot(function (snap) {
      uploaded = snap.docs.map(function (d) {
        var x = d.data() || {};
        x.id = d.id;
        return x;
      });
      render();
    }, function () {
      if (!fixed.length) {
        note.hidden = false;
        note.textContent = "The gallery could not load right now.";
      }
    });
  }
  window.addEventListener("resize", function () { clearTimeout(window.__galT); window.__galT = setTimeout(render, 200); });
  start();
})();
