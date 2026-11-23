export const CONTACT_EMAIL = "tb166314@gmail.com";

export const showreel = {
  title: "Talha Bhatti — Editor Showreel",
  client: "Selected Cuts",
  duration: "01:32",
  specs: "Motion Graphic · English · 24fps",
  thumbnail:
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=80",
  videoUrl: "/videos/showreel.mp4",
  description:
    "A cut of brand films, music videos, documentary scenes, and graded masters. Pacing, performance, and picture finish by Talha Bhatti.",
};

export const projects = [
  {
    id: 1,
    title: "Nocturne — Night Drive",
    category: "commercials",
    client: "Automotive Brand Film",
    duration: "01:02",
    specs: "Motion Graphic · English",
    thumbnail:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
    description:
      "Night driving film cut to industrial percussion, with whip-pan speed ramps, match cuts on headlights, and a tungsten-teal grade.",
    tools: ["Premiere Pro", "DaVinci Resolve", "Sound Design"],
    videoUrl: "/videos/nocturne.mp4",
    caseIndex: 0,
  },
  {
    id: 2,
    title: "Solaris — Hybrid Short",
    category: "ai-vfx",
    client: "Short Film / VFX",
    duration: "01:02",
    specs: "Motion Graphic · English",
    thumbnail:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80",
    description:
      "Editorial spine for a sci-fi short: shot selection, set-extension comps, lens-flare passes, and a film-grain finish.",
    tools: ["After Effects", "DaVinci Resolve", "Topaz Video"],
    videoUrl: "/videos/solaris.mp4",
    caseIndex: 1,
  },
  {
    id: 3,
    title: "Velvet Echo — Music Video",
    category: "music",
    client: "Original Music Video",
    duration: "01:02",
    specs: "Motion Graphic · English",
    thumbnail:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80",
    description:
      "Beat-accurate performance cut across concert and studio angles, with 16mm gate weave and halation in the grade.",
    tools: ["Premiere Pro", "DaVinci Resolve", "Beat Mapping"],
    videoUrl: "/videos/velvet.mp4",
    caseIndex: 2,
  },
  {
    id: 4,
    title: "Chronos — Product Film",
    category: "commercials",
    client: "Watch Campaign",
    duration: "01:02",
    specs: "Motion Graphic · English",
    thumbnail:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80",
    description:
      "Macro watch film: high-speed selects, metallic foley hits, and a champagne-gold specular grade on every gear.",
    tools: ["DaVinci Resolve", "Premiere Pro", "Foley Sync"],
    videoUrl: "/videos/chronos.mp4",
    caseIndex: 0,
  },
  {
    id: 5,
    title: "Apex — Launch Trailer",
    category: "trailers",
    client: "Game / Product Launch",
    duration: "01:02",
    specs: "Motion Graphic · English",
    thumbnail:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80",
    description:
      "Three-act trailer structure: cold open, rising hits, title card. Custom risers, braams, and end-card supers.",
    tools: ["Premiere Pro", "After Effects", "Audition"],
    videoUrl: "/videos/apex.mp4",
    caseIndex: 2,
  },
  {
    id: 6,
    title: "Nebula — Social Editorial",
    category: "ai-vfx",
    client: "Fashion Social Cuts",
    duration: "01:02",
    specs: "Motion Graphic · English",
    thumbnail:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
    description:
      "Fashion editorial recut for Reels, Shorts, and a landscape master, with type cards locked to the edit rhythm.",
    tools: ["Premiere Pro", "After Effects", "DaVinci Resolve"],
    videoUrl: "/videos/nebula.mp4",
    caseIndex: 1,
  },
  {
    id: 7,
    title: "Meridian — Interview Film",
    category: "docs",
    client: "Documentary Interview",
    duration: "01:02",
    specs: "Motion Graphic · English",
    thumbnail:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=900&q=80",
    description:
      "Interview cut with clean dialogue, J and L cuts, and a quiet grade that keeps the face honest.",
    tools: ["Premiere Pro", "Audition", "DaVinci Resolve"],
    videoUrl: "/videos/meridian.mp4",
    caseIndex: 2,
  },
  {
    id: 8,
    title: "Harbor Light — Travel Film",
    category: "docs",
    client: "Travel Documentary",
    duration: "01:02",
    specs: "Motion Graphic · English",
    thumbnail:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=80",
    description:
      "Travel piece paced on movement and music, with a warm print look and a vertical cutdown for social.",
    tools: ["DaVinci Resolve", "Premiere Pro", "Frame.io"],
    videoUrl: "/videos/harbor.mp4",
    caseIndex: 0,
  },
];

export const caseStudies = [
  {
    code: "CASE #01 // COMMERCIAL EDIT",
    title: "Nocturne — Night Drive",
    client: "Automotive brand film",
    challenge:
      "Turn a long night-driving shoot into a 60-second spot that feels fast without losing the car or the driver’s performance.",
    solution:
      "Talha built a rhythmic assembly at 138 BPM, ramped only the whip pans, and graded a custom tungsten-gold look so skin and paint both held detail.",
    metrics: ["60s master + 15s cutdown", "Frame-accurate speed ramps", "Rec.709 & social masters"],
    video: projects[0],
  },
  {
    code: "CASE #02 // SHORT FILM FINISH",
    title: "Solaris — Hybrid Short",
    client: "Narrative short",
    challenge:
      "Extend practical sets into sci-fi environments and still keep the cut feeling like one camera, one world.",
    solution:
      "Picture edit first, then tracked plates, AI-assisted extensions, and a single print LUT so VFX shots match the live-action grade.",
    metrics: ["Locked picture before VFX", "Matched grain & halation", "4K ProRes master"],
    video: projects[1],
  },
  {
    code: "CASE #03 // MUSIC VIDEO",
    title: "Velvet Echo — Music Video",
    client: "Music video",
    challenge:
      "Unify arena coverage and studio performance into one song without drifting off the beat or the vocal.",
    solution:
      "Beat-mapped the timeline, cut on transients, and built a film-gate weave plus halation stack in DaVinci so every angle felt like the same reel.",
    metrics: ["On-beat multi-cam", "16mm emulation grade", "YouTube + vertical cuts"],
    video: projects[2],
  },
];

export const stages = [
  {
    tc: "00:00:00:00",
    track: "V1 • INGEST & ASSEMBLY",
    title: "Selects, Sync & Story Spine",
    details:
      "Offload, multi-cam sync, proxies, and a first assembly that finds the story — dialogue, performance, or the product beat.",
    deliverable: "Assembly cut + editor notes",
  },
  {
    tc: "00:15:00:00",
    track: "V2 • RHYTHM & PACE",
    title: "Fine Cut & Picture Lock",
    details:
      "J and L cuts, speed ramps, match action, music edits, and a Frame.io review link so notes land on the exact frame.",
    deliverable: "Fine cut v2 for review",
  },
  {
    tc: "00:30:00:00",
    track: "V3 • VFX & MOTION",
    title: "Titles, Cleanup & Composites",
    details:
      "Lower thirds, kinetic type, screen replacements, beauty cleanup, and shot extensions that stay invisible in the cut.",
    deliverable: "Online picture + title master",
  },
  {
    tc: "00:45:00:00",
    track: "A1–A8 • SOUND",
    title: "Dialogue, Music & Sound Design",
    details:
      "Dialogue cleanup, music licensing placeholders, foley hits, and a mix that sits right for web, social, and broadcast.",
    deliverable: "Stereo mix + stems",
  },
  {
    tc: "01:00:00:00",
    track: "DI • COLOR & DELIVERY",
    title: "DaVinci Grade & Masters",
    details:
      "Primary balance, skin tones, film-print emulation, then exports: ProRes master, H.264 web, and 9:16 cutdowns.",
    deliverable: "Graded master + social versions",
  },
];

export const arsenal = [
  {
    name: "Adobe Premiere Pro",
    role: "Offline edit, multi-cam, music videos, and picture lock",
    pct: 98,
    badge: "CORE",
    icon: "Scissors",
  },
  {
    name: "DaVinci Resolve Studio",
    role: "Node color, film emulation, and finishing",
    pct: 96,
    badge: "COLOR",
    icon: "Aperture",
  },
  {
    name: "After Effects",
    role: "Titles, motion graphics, tracking, and cleanup",
    pct: 93,
    badge: "MOTION",
    icon: "Sparkles",
  },
  {
    name: "Frame.io",
    role: "Frame-accurate client notes and version review",
    pct: 95,
    badge: "REVIEW",
    icon: "Eye",
  },
  {
    name: "Audition & Fairlight",
    role: "Dialogue edit, music beds, and mix prep",
    pct: 90,
    badge: "AUDIO",
    icon: "Volume2",
  },
  {
    name: "Photoshop",
    role: "Thumbnails, title plates, and grade references",
    pct: 88,
    badge: "STILLS",
    icon: "Layers",
  },
  {
    name: "Topaz Video AI",
    role: "Denoise, upscale, and slow-motion retimes",
    pct: 86,
    badge: "NEURAL",
    icon: "Cpu",
  },
  {
    name: "CapCut & Social Masters",
    role: "Fast vertical cutdowns, captions, and Reels exports",
    pct: 92,
    badge: "SOCIAL",
    icon: "Clapperboard",
  },
];

export const services = [
  "Commercial & brand films",
  "Music videos & performance cuts",
  "YouTube, docs & interviews",
  "DaVinci Resolve color grades",
  "Titles, motion & cleanup",
  "Reels, Shorts & cutdowns",
];
