/* Lu's Dev Corner: fills the blog and project lists from data.js. No libraries. */
(function () {
  "use strict";

  var POSTS = (window.POSTS || []).slice().sort(function (a, b) {
    return a.date < b.date ? 1 : -1;
  });
  var PROJECTS = window.PROJECTS || [];

  /* tiny helper: el("div", "class-name", "text") */
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  /* a video player: videoFigure("videos/demo.mp4", "caption", "videos/demo.jpg") */
  function videoFigure(src, caption, poster) {
    var fig = el("figure", "post-video");
    var v = el("video");
    v.src = src;
    v.controls = true;
    v.preload = "metadata";
    v.setAttribute("playsinline", "");
    if (poster) v.poster = poster;
    fig.appendChild(v);
    if (caption) fig.appendChild(el("figcaption", "", caption));
    return fig;
  }

  function icon(name, scale) {
    var c = el("canvas", "icon");
    c.setAttribute("data-sprite", name);
    c.setAttribute("data-scale", String(scale || 3));
    c.setAttribute("aria-hidden", "true");
    return c;
  }

  function niceDate(iso) {
    var p = iso.split("-");
    var d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]));
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
  }

  function windowBox(title) {
    var box = el("article", "window");
    var bar = el("div", "titlebar");
    bar.appendChild(el("span", "", title));
    bar.appendChild(el("span", "btns", "_ x"));
    box.appendChild(bar);
    var body = el("div", "window-body");
    box.appendChild(body);
    return { box: box, body: body };
  }

  function bar(progress) {
    var b = el("div", "bar");
    b.setAttribute("role", "img");
    b.setAttribute("aria-label", progress + " percent complete");
    var filled = Math.round(progress / 10);
    for (var i = 0; i < 10; i++) b.appendChild(el("i", i < filled ? "on" : ""));
    return b;
  }

  /* ---------- blog page ---------- */
  var postList = document.getElementById("post-list");
  if (postList) {
    var tagBox = document.getElementById("tag-filter");
    var current = "all";

    var tags = [];
    POSTS.forEach(function (p) {
      (p.tags || []).forEach(function (t) { if (tags.indexOf(t) < 0) tags.push(t); });
    });

    var renderPosts = function () {
      postList.innerHTML = "";
      var shown = POSTS.filter(function (p) { return current === "all" || (p.tags || []).indexOf(current) >= 0; });
      if (!shown.length) postList.appendChild(el("p", "empty", "No log entries yet."));
      shown.forEach(function (p) {
        var n = POSTS.length - POSTS.indexOf(p);
        var w = windowBox("log_" + String(n).padStart(3, "0") + ".txt");
        w.box.classList.add("post");
        w.body.appendChild(el("h2", "", p.title));
        var meta = el("p", "meta", niceDate(p.date) + "  ");
        (p.tags || []).forEach(function (t) { meta.appendChild(el("span", "tag", "#" + t)); });
        w.body.appendChild(meta);
        p.body.forEach(function (part) {
          if (typeof part === "string") {
            w.body.appendChild(el("p", "", part));
          } else if (part.image) {
            var fig = el("figure", "post-image");
            var im = el("img");
            im.src = part.image;
            im.alt = part.alt || part.caption || "";
            im.loading = "lazy";
            fig.appendChild(im);
            if (part.caption) fig.appendChild(el("figcaption", "", part.caption));
            w.body.appendChild(fig);
          } else if (part.video) {
            w.body.appendChild(videoFigure(part.video, part.caption, part.poster));
          } else if (part.code) {
            var pre = el("pre");
            pre.appendChild(el("code", "", part.code));
            w.body.appendChild(pre);
          }
        });
        postList.appendChild(w.box);
      });
    };

    var renderChips = function () {
      tagBox.innerHTML = "";
      ["all"].concat(tags).forEach(function (t) {
        var b = el("button", "chip", t);
        b.type = "button";
        b.setAttribute("aria-pressed", t === current ? "true" : "false");
        b.addEventListener("click", function () {
          current = t;
          renderChips();
          renderPosts();
        });
        tagBox.appendChild(b);
      });
    };

    renderChips();
    renderPosts();
  }

  /* ---------- projects page ---------- */
  var grid = document.getElementById("project-grid");
  if (grid) {
    var statBox = document.getElementById("project-stats");
    var filterBox = document.getElementById("status-filter");
    var statuses = ["building", "idea", "paused", "shipped"];
    var active = "all";

    ["all"].concat(statuses).forEach(function (s) {
      var count = s === "all" ? PROJECTS.length : PROJECTS.filter(function (p) { return p.status === s; }).length;
      if (s !== "all") {
        var stat = el("span");
        stat.appendChild(el("b", "", String(count)));
        stat.appendChild(document.createTextNode(s));
        statBox.appendChild(stat);
      }
    });

    var renderProjects = function () {
      grid.innerHTML = "";
      var shown = PROJECTS.filter(function (p) { return active === "all" || p.status === active; });
      if (!shown.length) grid.appendChild(el("p", "empty", "Nothing here yet."));
      shown.forEach(function (p) {
        var w = windowBox(p.name.toLowerCase().replace(/[^a-z0-9]+/g, "_") + ".proj");
        var head = el("div", "card-head");
        head.appendChild(el("h3", "", p.name));
        head.appendChild(el("span", "pill s-" + p.status, p.status));
        w.body.appendChild(head);
        w.body.appendChild(el("p", "", p.blurb));
        if (p.video) w.body.appendChild(videoFigure(p.video, p.videoCaption, p.poster));
        w.body.appendChild(bar(p.progress || 0));
        w.body.appendChild(el("p", "small", (p.progress || 0) + "%  /  updated " + niceDate(p.updated)));
        if (p.tags && p.tags.length) {
          var tg = el("p", "small");
          p.tags.forEach(function (t) { tg.appendChild(el("span", "tag", "#" + t)); });
          w.body.appendChild(tg);
        }
        if (p.links && p.links.length) {
          var ln = el("p", "links");
          p.links.forEach(function (l) {
            var a = el("a", "", l.label);
            a.href = l.url;
            a.target = "_blank";
            a.rel = "noopener";
            ln.appendChild(a);
          });
          w.body.appendChild(ln);
        }
        if (p.log && p.log.length) {
          var d = el("details");
          d.appendChild(el("summary", "", "Dev log (" + p.log.length + ")"));
          var ul = el("ul", "log");
          p.log.forEach(function (entry) {
            var li = el("li");
            li.appendChild(el("time", "", entry.date));
            li.appendChild(document.createTextNode(entry.note));
            ul.appendChild(li);
          });
          d.appendChild(ul);
          w.body.appendChild(d);
        }
        grid.appendChild(w.box);
      });
    };

    var renderFilter = function () {
      filterBox.innerHTML = "";
      ["all"].concat(statuses).forEach(function (s) {
        var b = el("button", "chip", s);
        b.type = "button";
        b.setAttribute("aria-pressed", s === active ? "true" : "false");
        b.addEventListener("click", function () {
          active = s;
          renderFilter();
          renderProjects();
        });
        filterBox.appendChild(b);
      });
    };

    renderFilter();
    renderProjects();
  }

  /* ---------- home page teasers ---------- */
  var latest = document.getElementById("latest-posts");
  if (latest) {
    POSTS.slice(0, 2).forEach(function (p) {
      var item = el("div");
      var h = el("h3");
      var a = el("a", "", p.title);
      a.href = "blog.html";
      h.appendChild(a);
      item.appendChild(h);
      item.appendChild(el("p", "meta", niceDate(p.date)));
      item.appendChild(el("p", "", p.body[0]));
      latest.appendChild(item);
    });
    if (!POSTS.length) latest.appendChild(el("p", "empty", "No log entries yet."));
  }

  var now = document.getElementById("now-building");
  if (now) {
    var building = PROJECTS.filter(function (p) { return p.status === "building"; }).slice(0, 3);
    building.forEach(function (p) {
      var item = el("div");
      var h = el("h3");
      var a = el("a", "", p.name);
      a.href = "projects.html";
      h.appendChild(a);
      item.appendChild(h);
      item.appendChild(bar(p.progress || 0));
      item.appendChild(el("p", "", p.blurb));
      now.appendChild(item);
    });
    if (!building.length) now.appendChild(el("p", "empty", "Nothing in progress right now."));
  }

  if (window.Pixel) window.Pixel.initIcons();
})();
