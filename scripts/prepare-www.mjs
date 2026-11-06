/* Copies the web build (game + PWA files) into www/ for Capacitor. */
import { cpSync, mkdirSync, rmSync, existsSync } from "node:fs";

const FILES = ["index.html", "manifest.webmanifest", "sw.js"];
const DIRS = ["icons"];

if (existsSync("www")) rmSync("www", { recursive: true, force: true });
mkdirSync("www", { recursive: true });

for (const f of FILES) {
  cpSync(f, `www/${f}`);
  console.log(`  copied ${f}`);
}
for (const d of DIRS) {
  cpSync(d, `www/${d}`, { recursive: true });
  console.log(`  copied ${d}/`);
}
console.log("www/ ready for Capacitor.");
