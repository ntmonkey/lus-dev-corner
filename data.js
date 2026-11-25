/*
  LU'S DEV CORNER: the only file you need to edit to update the blog and project tracker.

  BLOG POSTS
  Add a new object to POSTS. Newest date shows first.
    - date:  "YYYY-MM-DD"
    - tags:  any words you like; the Blog page builds filter buttons from them
    - body:  an array. A string is a paragraph. { code: "..." } is a code block.

  PROJECTS
  Add a new object to PROJECTS.
    - status:   "building", "idea", "paused" or "shipped"
    - progress: 0 to 100 (shown as a 10-block bar)
    - links:    [{ label: "Repo", url: "https://..." }]
    - log:      short dated notes, newest first
    - video:    optional, plays on the card: video: "videos/my-clip.mp4"
                (also videoCaption: "..." and poster: "videos/my-clip.jpg")

  VIDEOS
  Put .mp4 files (H.264, ideally under 15 MB) in the videos folder.
  In a blog post body, add: { video: "videos/my-clip.mp4", caption: "..." }

  The entries below are samples. Replace or delete them.
*/

window.SITE = {
  name: "Lu's Dev Corner",
  tagline: "Notes from making games, writing code, and teaching tiny computers new tricks.",
  ticker: [
    "Welcome to Lu's Dev Corner",
    "Game dev notes from both sides of the industry",
    "Side quests: AI-assisted firmware for tiny Waveshare boards",
    "New log entries as the work happens"
  ]
};

/*
  PHOTOS: the gallery. Put web-sized pictures in images/gallery and list them here.
    - file:    the big picture (shown when you click)
    - thumb:   a smaller copy for the grid
    - w, h:    width and height of the big picture in pixels (so the tiles line up)
    - caption: optional text
  Photos added with the upload box on the Photos page show up in front of these.
*/
window.PHOTOS = [
  { file: "images/gallery/photo-01.jpg", thumb: "images/gallery/photo-01-thumb.jpg", w: 1272, h: 1800, caption: "" },
  { file: "images/gallery/photo-02.jpg", thumb: "images/gallery/photo-02-thumb.jpg", w: 1800, h: 1201, caption: "" },
  { file: "images/gallery/photo-03.jpg", thumb: "images/gallery/photo-03-thumb.jpg", w: 1412, h: 1800, caption: "" },
  { file: "images/gallery/photo-04.jpg", thumb: "images/gallery/photo-04-thumb.jpg", w: 1800, h: 701, caption: "" },
  { file: "images/gallery/photo-05.jpg", thumb: "images/gallery/photo-05-thumb.jpg", w: 1800, h: 797, caption: "" },
  { file: "images/gallery/photo-06.jpg", thumb: "images/gallery/photo-06-thumb.jpg", w: 1800, h: 664, caption: "" },
  { file: "images/gallery/photo-07.jpg", thumb: "images/gallery/photo-07-thumb.jpg", w: 1800, h: 664, caption: "" },
  { file: "images/gallery/photo-08.jpg", thumb: "images/gallery/photo-08-thumb.jpg", w: 1800, h: 1324, caption: "" }
];

window.POSTS = [
  {
    title: "Almost At the End of the Beginning!",
    date: "2026-11-24",
    tags: ["Unity"],
    body: [
      "Firing rays to trigger dialogue.  Creating UI for both healtbar and dialog box with UIToolKit.  Learning How to script the behavior of Dialog Boxes for triggering and display timer.",
      "This part was fun, but a bit tedious.  I can see managing dialogue based on certain states in the game or relationships between characters can get complex quickly.",
      "We're close to the end, but I feel like we have all the pieces to make an NES jrpg or something.  Exciting...",
      "Robot Repair Tutorial",
      { image: "images/dialogueBoxes.png", caption: "Dialogue Boxes!!" },
      "So close to the end with functionality."
    ]
  },
  {
    title: "Unity Mornings",
    date: "2026-11-18",
    tags: ["Unity"],
    body: [
      "Unity Mornings are part of my new protocol to learn using the best hours of the day.  Previously we had completed a Rocket Game Tutorial and we're moving onto a 2D platformer tutorial.",
      "First impressions of Unity is that it's thoughtful and clean.  The goal here is to build the muscle memory that will help us create the velocity needed to transform ideas into working game elements in the shortest time possible.",
      "Maybe it's just years of working with software, but it is nice to be back in something where you have to express your ideas in code and make those connections.  I feel like it also rewires in your brain hoping to reduce our reliance upon searching or AI",

      "Robot Repair Tutorial",
      { image: "images/robotRepairTut.jpg", caption: "Robot Repair Early WIP" },
      "At the tilemap stages and making fabs for later."
    ]
  },
  {
    title: "Booting up the devlog",
    date: "2026-11-16",
    tags: ["meta"],
    body: [
      "This is the first entry. Lu's Dev Corner is where I write about making games, both as a professional and as an indie, and about the side projects that never fit anywhere else.",
      "Expect build notes, things that broke, and things that finally worked. Some of it will be about tiny Waveshare computers and what happens when you let an AI help write the code for them.",
      "(Sample post. Edit it in data.js.)"
    ]
  },
  {
    title: "How this site tracks projects",
    date: "2026-11-15",
    tags: ["meta", "how-to"],
    body: [
      "Every project lives as one entry in data.js. Change the status and progress, add a log line, and the Projects page updates itself.",
      { code: "{\n  name: \"My Game\",\n  status: \"building\",\n  progress: 30,\n  tags: [\"godot\", \"2D\"],\n  blurb: \"One sentence about it.\",\n  links: [{ label: \"Repo\", url: \"https://example.com\" }],\n  log: [{ date: \"2026-11-15\", note: \"First playable.\" }]\n}" },
      "(Sample post. Edit it in data.js.)"
    ]
  }
];

window.PROJECTS = [
  {
    name: "Tiny Waveshare Lab",
    status: "building",
    progress: 20,
    tags: ["hardware", "AI", "firmware"],
    blurb: "Using AI to write programs for tiny Waveshare computers. Prompt goes in, blinking pixels come out.",
    updated: "2026-11-18",
    links: [],
    log: [
      { date: "2026-11-18", note: "Finished the One-Button RSVP Reader: flashes a book's words at up to 800 wpm, all controlled with a single button." },
      { date: "2026-11-16", note: "Tracker created. Real notes go here." }
    ]
  },
  {
    name: "One-Button RSVP Reader",
    status: "shipped",
    progress: 100,
    tags: ["hardware", "AI", "firmware", "reading"],
    blurb: "A speed reader for a tiny Waveshare computer. It flashes the words of a book one at a time (RSVP) at up to 800 wpm, and one button controls everything. Built to help me read more, and to push both the device and me as the reader.",
    updated: "2026-11-18",
    links: [],
    video: "videos/rsvp-reader.mp4",
    poster: "videos/rsvp-reader.jpg",
    videoCaption: "Reading The Adventures of Sherlock Holmes at 800 wpm, controlled with one button.",
    log: [
      { date: "2026-11-18", note: "Shipped. Controls: press once to start/stop, twice for next chapter, three times for previous chapter, hold to change wpm." }
    ]
  },
  {
    name: "This Website",
    status: "building",
    progress: 80,
    tags: ["web", "pixel art"],
    blurb: "The site you are on. Home, About, Blog, Projects and Photos pages are live, with a pixel-art dev room, a tiny lane-crossing game on the monitor, and video support for projects and posts.",
    updated: "2026-11-18",
    links: [],
    log: [
      { date: "2026-11-18", note: "About page filled in with the real story. Added the Photos gallery, a frog game on the monitor, and video support." },
      { date: "2026-11-16", note: "First version of all four pages." }
    ]
  },
  {
    name: "Untitled Indie Game",
    status: "idea",
    progress: 0,
    tags: ["game", "sample"],
    blurb: "A placeholder for the next game idea. Rename it, set a status, and start logging.",
    updated: "2026-11-16",
    links: [],
    log: []
  }
];
