const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const https = require("https");
const ffmpeg = require("ffmpeg-static");

const root = path.join(__dirname, "..");
const stillDir = path.join(root, "public", "stills");
const videoDir = path.join(root, "public", "videos");
const workDir = path.join(root, "scripts", "work");
const FONT_B = "C\\:/Windows/Fonts/georgiab.ttf";
const FONT = "C\\:/Windows/Fonts/segoeui.ttf";

const films = [
  {
    file: "nocturne.mp4",
    still: "nocturne.jpg",
    url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=70",
    kicker: "AUTOMOTIVE BRAND FILM",
    title: "Nocturne",
    subtitle: "Night Drive",
    lines: [
      "A night drive cut on percussion.",
      "Whip pans ramp up. Headlights match on the cut.",
      "Tungsten light and teal shadow stay in the grade.",
    ],
    tools: "Premiere Pro   ·   DaVinci Resolve   ·   Sound",
  },
  {
    file: "solaris.mp4",
    still: "solaris.jpg",
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=70",
    kicker: "SHORT FILM AND VFX",
    title: "Solaris",
    subtitle: "Hybrid Short",
    lines: [
      "The picture is locked before the effects begin.",
      "Set extensions sit on tracked plates.",
      "One print look matches grain across every shot.",
    ],
    tools: "After Effects   ·   DaVinci Resolve   ·   Topaz",
  },
  {
    file: "velvet.mp4",
    still: "velvet.jpg",
    url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1400&q=70",
    kicker: "ORIGINAL MUSIC VIDEO",
    title: "Velvet Echo",
    subtitle: "Music Video",
    lines: [
      "Every cut lands on the beat.",
      "Concert angles and studio angles share one reel.",
      "Film weave and halation finish the grade.",
    ],
    tools: "Premiere Pro   ·   DaVinci Resolve   ·   Beat map",
  },
  {
    file: "chronos.mp4",
    still: "chronos.jpg",
    url: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1400&q=70",
    kicker: "WATCH CAMPAIGN",
    title: "Chronos",
    subtitle: "Product Film",
    lines: [
      "High-speed selects on the mechanism.",
      "Metal hits are synced to the picture.",
      "A champagne gold grade on every gear.",
    ],
    tools: "DaVinci Resolve   ·   Premiere Pro   ·   Foley",
  },
  {
    file: "apex.mp4",
    still: "apex.jpg",
    url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1400&q=70",
    kicker: "LAUNCH TRAILER",
    title: "Apex",
    subtitle: "Launch Trailer",
    lines: [
      "A cold open. Then the rise. Then the title.",
      "Hits and risers push each act forward.",
      "Masters ship in widescreen and vertical.",
    ],
    tools: "Premiere Pro   ·   After Effects   ·   Audition",
  },
  {
    file: "nebula.mp4",
    still: "nebula.jpg",
    url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=70",
    kicker: "FASHION SOCIAL CUTS",
    title: "Nebula",
    subtitle: "Social Editorial",
    lines: [
      "One edit becomes three frames.",
      "Landscape master. Square. Vertical reel.",
      "Type cards stay locked to the rhythm.",
    ],
    tools: "Premiere Pro   ·   After Effects   ·   Resolve",
  },
  {
    file: "meridian.mp4",
    still: "meridian.jpg",
    url: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1400&q=70",
    kicker: "DOCUMENTARY INTERVIEW",
    title: "Meridian",
    subtitle: "Interview Film",
    lines: [
      "Dialogue stays clean and close.",
      "J cuts and L cuts keep the thought moving.",
      "The grade leaves the face honest.",
    ],
    tools: "Premiere Pro   ·   Audition   ·   DaVinci Resolve",
  },
  {
    file: "harbor.mp4",
    still: "harbor.jpg",
    url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1400&q=70",
    kicker: "TRAVEL DOCUMENTARY",
    title: "Harbor Light",
    subtitle: "Travel Film",
    lines: [
      "The cut follows movement and music.",
      "A warm print look carries the journey.",
      "A vertical version is ready for social.",
    ],
    tools: "DaVinci Resolve   ·   Premiere Pro   ·   Frame.io",
  },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      resolve(dest);
      return;
    }
    const file = fs.createWriteStream(dest);
    const request = (target) => {
      https
        .get(target, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            res.resume();
            request(new URL(res.headers.location, target).href);
            return;
          }
          if (res.statusCode !== 200) {
            reject(new Error(`${res.statusCode} ${url}`));
            return;
          }
          res.pipe(file);
          file.on("finish", () => file.close(() => resolve(dest)));
        })
        .on("error", reject);
    };
    request(url);
  });
}

function run(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpeg, args, { stdio: "ignore" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited ${code}`));
    });
  });
}

function dt(text, { size, color, x, y, font, border = 0 }) {
  const safe = String(text).replace(/'/g, "").replace(/:/g, " ").replace(/%/g, "");
  return `drawtext=fontfile=${font}:text='${safe}':fontsize=${size}:fontcolor=${color}:borderw=${border}:bordercolor=0x09090B:x=${x}:y=${y}`;
}

async function card({ output, seconds, lines, still }) {
  const filters = [];
  if (still) {
    filters.push(
      "[1:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,eq=brightness=-0.38:saturation=0.72[img]",
      "[0:v][img]overlay=x=0:y=0[bg]",
      "[bg]drawbox=x=0:y=500:w=1280:h=220:color=0x09090B@0.62:t=fill[v]"
    );
  } else {
    filters.push("[0:v]drawbox=x=160:y=470:w=960:h=3:color=0xE5B869@0.9:t=fill[v]");
  }
  filters.push(`[v]${lines.map((line) => dt(line.text, line)).join(",")}[out]`);
  const script = path.join(workDir, `${path.basename(output, ".mp4")}.txt`);
  fs.writeFileSync(script, filters.join(";\n"));
  const args = [
    "-y",
    "-f",
    "lavfi",
    "-i",
    `color=c=0x09090B:s=1280x720:r=24:d=${seconds}`,
  ];
  if (still) args.push("-loop", "1", "-i", still);
  args.push(
    "-filter_complex_script",
    script,
    "-map",
    "[out]",
    "-t",
    String(seconds),
    "-c:v",
    "libx264",
    "-preset",
    "ultrafast",
    "-crf",
    "23",
    "-pix_fmt",
    "yuv420p",
    "-an",
    output
  );
  await run(args);
}

async function concat(parts, output) {
  const list = path.join(workDir, `${path.basename(output, ".mp4")}-list.txt`);
  fs.writeFileSync(list, parts.map((file) => `file '${file.replace(/\\/g, "/")}'`).join("\n"));
  await run([
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    list,
    "-c",
    "copy",
    "-movflags",
    "+faststart",
    output,
  ]);
}

async function renderFilm(film) {
  const dir = path.join(workDir, film.file.replace(".mp4", ""));
  fs.mkdirSync(dir, { recursive: true });
  const still = path.join(stillDir, film.still);
  const parts = [
    {
      name: "01.mp4",
      seconds: 12,
      lines: [
        { text: "TALHA BHATTI", size: 68, color: "0xF4F1EA", x: "(w-text_w)/2", y: "250", font: FONT_B },
        { text: "Video Editor and Colorist", size: 30, color: "0xE5B869", x: "(w-text_w)/2", y: "345", font: FONT },
        { text: "5+ years", size: 26, color: "0xFF4D2D", x: "(w-text_w)/2", y: "400", font: FONT },
      ],
    },
    {
      name: "02.mp4",
      seconds: 12,
      lines: [
        { text: film.kicker, size: 22, color: "0xFF4D2D", x: "(w-text_w)/2", y: "210", font: FONT },
        { text: film.title, size: 76, color: "0xF4F1EA", x: "(w-text_w)/2", y: "270", font: FONT_B },
        { text: film.subtitle, size: 36, color: "0xE5B869", x: "(w-text_w)/2", y: "370", font: FONT_B },
      ],
    },
    ...film.lines.map((line, index) => ({
      name: `1${index}.mp4`,
      seconds: 10,
      still,
      lines: [
        { text: film.title, size: 28, color: "0xE5B869", x: "72", y: "80", font: FONT_B },
        { text: line, size: 34, color: "0xF4F1EA", x: "72", y: "590", font: FONT, border: 2 },
      ],
    })),
    {
      name: "09.mp4",
      seconds: 8,
      lines: [
        { text: "Edited by Talha Bhatti", size: 44, color: "0xF4F1EA", x: "(w-text_w)/2", y: "280", font: FONT_B },
        { text: film.tools, size: 24, color: "0xE5B869", x: "(w-text_w)/2", y: "360", font: FONT },
        { text: "Picture. Color. Finish.", size: 24, color: "0xB5B0A6", x: "(w-text_w)/2", y: "420", font: FONT },
      ],
    },
  ];
  const files = [];
  for (const part of parts) {
    const output = path.join(dir, part.name);
    await card({ output, seconds: part.seconds, lines: part.lines, still: part.still });
    files.push(output);
  }
  await concat(files, path.join(videoDir, film.file));
}

async function renderShowreel() {
  const dir = path.join(workDir, "showreel");
  fs.mkdirSync(dir, { recursive: true });
  const parts = [
    {
      name: "00.mp4",
      seconds: 10,
      lines: [
        { text: "TALHA BHATTI", size: 72, color: "0xF4F1EA", x: "(w-text_w)/2", y: "240", font: FONT_B },
        { text: "Video Editor and Colorist", size: 30, color: "0xE5B869", x: "(w-text_w)/2", y: "340", font: FONT },
        { text: "5+ years of picture color and sound", size: 24, color: "0xFF4D2D", x: "(w-text_w)/2", y: "400", font: FONT },
      ],
    },
    {
      name: "01.mp4",
      seconds: 8,
      lines: [
        { text: "Cutting stories", size: 58, color: "0xF4F1EA", x: "(w-text_w)/2", y: "270", font: FONT_B },
        { text: "frame by frame", size: 58, color: "0xE5B869", x: "(w-text_w)/2", y: "350", font: FONT_B },
      ],
    },
  ];
  films.forEach((film, index) => {
    parts.push({
      name: `p${index}.mp4`,
      seconds: 8,
      still: path.join(stillDir, film.still),
      lines: [
        { text: film.kicker, size: 20, color: "0xFF4D2D", x: "72", y: "500", font: FONT },
        { text: `${film.title} — ${film.subtitle}`, size: 40, color: "0xF4F1EA", x: "72", y: "545", font: FONT_B, border: 2 },
        { text: film.lines[0], size: 26, color: "0xE5B869", x: "72", y: "610", font: FONT, border: 2 },
      ],
    });
  });
  parts.push({
    name: "99.mp4",
    seconds: 10,
    lines: [
      { text: "Talha Bhatti", size: 64, color: "0xF4F1EA", x: "(w-text_w)/2", y: "270", font: FONT_B },
      { text: "Picture. Color. Finish.", size: 30, color: "0xE5B869", x: "(w-text_w)/2", y: "360", font: FONT },
    ],
  });
  const files = [];
  for (const part of parts) {
    const output = path.join(dir, part.name);
    process.stdout.write(`  ${part.name}\n`);
    await card({ output, seconds: part.seconds, lines: part.lines, still: part.still });
    files.push(output);
  }
  await concat(files, path.join(videoDir, "showreel.mp4"));
}

async function main() {
  fs.mkdirSync(stillDir, { recursive: true });
  fs.mkdirSync(videoDir, { recursive: true });
  fs.mkdirSync(workDir, { recursive: true });
  for (const film of films) {
    process.stdout.write(`still ${film.still}\n`);
    await download(film.url, path.join(stillDir, film.still));
  }
  const only = process.argv.find((arg) => arg.startsWith("--only="));
  const selected = only ? films.filter((film) => film.file.startsWith(only.split("=")[1])) : films;
  const ready = (name) => {
    const file = path.join(videoDir, name);
    return fs.existsSync(file) && fs.statSync(file).size > 80000;
  };
  if (!only && !ready("showreel.mp4")) {
    process.stdout.write("\nshowreel\n");
    await renderShowreel();
  }
  for (const film of selected) {
    if (ready(film.file)) {
      process.stdout.write(`skip ${film.file}\n`);
      continue;
    }
    process.stdout.write(`\n${film.file}\n`);
    await renderFilm(film);
  }
  console.log("done");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
