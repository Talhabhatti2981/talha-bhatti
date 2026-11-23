const fs = require("fs");
const https = require("https");
const zlib = require("zlib");
const path = require("path");

const url =
  "https://github.com/eugeneware/ffmpeg-static/releases/download/b6.1.1/ffmpeg-win32-x64.gz";
const gzPath = path.join(__dirname, "ffmpeg-win32-x64.gz");
const outPath = path.join(
  __dirname,
  "..",
  "node_modules",
  "ffmpeg-static",
  "ffmpeg.exe"
);

function get(target, redirects = 0) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      target,
      { headers: { "User-Agent": "Mozilla/5.0" } },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume();
          if (redirects > 5) {
            reject(new Error("too many redirects"));
            return;
          }
          const next = new URL(res.headers.location, target).href;
          get(next, redirects + 1).then(resolve, reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`status ${res.statusCode}`));
          return;
        }
        resolve(res);
      }
    );
    req.on("error", reject);
  });
}

async function main() {
  console.log("downloading");
  const res = await get(url);
  await new Promise((resolve, reject) => {
    const file = fs.createWriteStream(gzPath);
    let got = 0;
    res.on("data", (chunk) => {
      got += chunk.length;
      if (got % (5 * 1024 * 1024) < chunk.length) {
        console.log(`gz ${(got / 1024 / 1024).toFixed(1)} MB`);
      }
    });
    res.pipe(file);
    file.on("finish", () => file.close(resolve));
    file.on("error", reject);
  });
  const gzSize = fs.statSync(gzPath).size;
  console.log("gz bytes", gzSize);
  await new Promise((resolve, reject) => {
    const input = fs.createReadStream(gzPath);
    const output = fs.createWriteStream(outPath);
    const gunzip = zlib.createGunzip();
    input.pipe(gunzip).pipe(output);
    output.on("finish", resolve);
    output.on("error", reject);
    gunzip.on("error", reject);
  });
  console.log("exe bytes", fs.statSync(outPath).size);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
