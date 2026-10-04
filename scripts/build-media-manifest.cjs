/**
 * Builds the portfolio media library:
 *  - copies C:/Users/danik/Documents/portfolio/{grafika,photos,videos} into public/media/
 *    with URL-safe slugified filenames (diacritics, emoji, spaces, parentheses removed)
 *  - reads intrinsic image dimensions (JPEG SOF / PNG IHDR) so the gallery can
 *    reserve correct aspect ratios without stretching
 *  - emits src/data/media.ts — a typed manifest consumed by the portfolio browser
 *
 * Run:  node scripts/build-media-manifest.cjs   (idempotent — re-copies only missing/changed files)
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SOURCE = "C:/Users/danik/Documents/portfolio";
const OUT_DIR = path.join(ROOT, "public", "media");
const MANIFEST = path.join(ROOT, "src", "data", "media.ts");
const WALLPAPER_SRC = "C:/Users/danik/Downloads/photobg.jpeg";
const WALLPAPER_OUT = path.join(ROOT, "public", "photobg.jpeg");

const COLLECTIONS = [
  { dir: "grafika", id: "grafika", label: "Grafika" },
  { dir: "photos", id: "fotky", label: "Fotky" },
  { dir: "videos", id: "videa", label: "Videa" },
];

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const VIDEO_EXT = new Set([".mp4", ".mov", ".webm", ".m4v"]);

/* ---------------------------------------------------------------- */
/* Slug helpers                                                     */
/* ---------------------------------------------------------------- */

function stripDiacritics(s) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const KNOWN_EXT = new Set([...IMAGE_EXT, ...VIDEO_EXT]);

function slugify(name) {
  const rawExt = path.extname(name).toLowerCase();
  const ext = KNOWN_EXT.has(rawExt) ? rawExt : "";
  let base = stripDiacritics(ext ? path.basename(name, path.extname(name)) : name);
  base = base
    .replace(/\((\d+)\)/g, "-$1") // 0923(2) -> 0923-2
    .replace(/[^A-Za-z0-9._-]+/g, "-") // spaces, emoji, quotes, dashes
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 60)
    .replace(/[-.]+$/g, "");
  if (!base) base = "soubor";
  return base + ext;
}

function uniqueDir(dir, name) {
  const ext = path.extname(name);
  const base = path.basename(name, ext);
  let candidate = name;
  let i = 2;
  while (fs.existsSync(path.join(dir, candidate))) {
    candidate = `${base}-${i}${ext}`;
    i += 1;
  }
  return candidate;
}

/* ---------------------------------------------------------------- */
/* Image dimensions                                                 */
/* ---------------------------------------------------------------- */

function jpegDimensions(buf) {
  let i = 2;
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) { i += 1; continue; }
    const marker = buf[i + 1];
    if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd9) || marker === 0x01) {
      i += 2; continue;
    }
    const len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  return null;
}

function pngDimensions(buf) {
  if (buf.length < 24) return null;
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

function imageDimensions(file) {
  try {
    const fd = fs.openSync(file, "r");
    const head = Buffer.alloc(256 * 1024);
    const read = fs.readSync(fd, head, 0, head.length, 0);
    fs.closeSync(fd);
    const buf = head.subarray(0, read);
    if (buf[0] === 0x89 && buf[1] === 0x50) return pngDimensions(buf);
    if (buf[0] === 0xff && buf[1] === 0xd8) return jpegDimensions(buf);
  } catch {
    /* unreadable — leave dims undefined */
  }
  return null;
}

/* ---------------------------------------------------------------- */
/* Walk + copy                                                      */
/* ---------------------------------------------------------------- */

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

function prettifyGroupLabel(parts) {
  return parts.join(" / ");
}

function prettifyItemName(fileName) {
  const ext = path.extname(fileName);
  return path.basename(fileName, ext).replace(/[_]+/g, " ").trim() || fileName;
}

function copyFile(src, destDir, relParts, collection) {
  const name = slugify(path.basename(src));
  fs.mkdirSync(destDir, { recursive: true });
  const finalName = uniqueDir(destDir, name);
  const dest = path.join(destDir, finalName);
  const existing = fs.existsSync(dest);
  if (!existing || fs.statSync(src).size !== fs.statSync(dest).size) {
    fs.copyFileSync(src, dest);
  }
  const ext = path.extname(finalName).toLowerCase();
  const kind = IMAGE_EXT.has(ext) ? "image" : VIDEO_EXT.has(ext) ? "video" : null;
  if (!kind) return null;
  const urlPath = `/media/${collection.dir}/${relParts.map(slugify).join("/")}/${finalName}`;
  const item = {
    kind,
    src: urlPath,
    name: prettifyItemName(path.basename(src)),
  };
  if (kind === "image") {
    const dims = imageDimensions(src);
    if (dims) { item.w = dims.w; item.h = dims.h; }
  } else {
    item.bytes = fs.statSync(src).size;
  }
  return item;
}

/* ---------------------------------------------------------------- */
/* Main                                                             */
/* ---------------------------------------------------------------- */

function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error(`Source folder not found: ${SOURCE}`);
    process.exit(1);
  }

  // Wallpaper
  if (fs.existsSync(WALLPAPER_SRC)) {
    fs.copyFileSync(WALLPAPER_SRC, WALLPAPER_OUT);
    const dims = imageDimensions(WALLPAPER_SRC);
    console.log(`wallpaper photobg.jpeg copied${dims ? ` (${dims.w}x${dims.h})` : ""}`);
  } else {
    console.warn("WARNING: wallpaper photobg.jpeg not found in Downloads");
  }

  const lines = [];
  lines.push("/**");
  lines.push(" * Autogenerováno skriptem scripts/build-media-manifest.cjs — neupravuj ručně.");
  lines.push(" * Manifest medií kreativního portfolia (fotky, grafika, videa).");
  lines.push(" */");
  lines.push("");
  lines.push('export type MediaKind = "image" | "video";');
  lines.push("");
  lines.push("export type MediaItem = {");
  lines.push("  kind: MediaKind;");
  lines.push("  /** URL pod /media/ */");
  lines.push("  src: string;");
  lines.push("  /** Zobrazovaný název souboru */");
  lines.push("  name: string;");
  lines.push("  /** Vnitřní rozměry obrázku (určuje poměr stran v galerii) */");
  lines.push("  w?: number;");
  lines.push("  h?: number;");
  lines.push("  /** Velikost videa v bajtech */");
  lines.push("  bytes?: number;");
  lines.push("};");
  lines.push("");
  lines.push("export type MediaGroup = { id: string; label: string; items: MediaItem[] };");
  lines.push("");
  lines.push("export type MediaCollection = {");
  lines.push('  id: "grafika" | "fotky" | "videa";');
  lines.push("  label: string;");
  lines.push("  groups: MediaGroup[];");
  lines.push("};");
  lines.push("");
  lines.push("export const mediaCollections: MediaCollection[] = [");

  const totals = { image: 0, video: 0, bytes: 0 };

  for (const collection of COLLECTIONS) {
    const srcDir = path.join(SOURCE, collection.dir);
    if (!fs.existsSync(srcDir)) {
      console.warn(`WARNING: missing collection dir ${srcDir}`);
      continue;
    }
    const files = walk(srcDir);
    const groupMap = new Map();

    for (const file of files) {
      const rel = path.relative(srcDir, file).split(/[\\/]/);
      const dirParts = rel.slice(0, -1);
      const destDir = path.join(OUT_DIR, collection.dir, ...dirParts.map(slugify));
      const item = copyFile(file, destDir, dirParts, collection);
      if (!item) continue;
      const groupId = dirParts.map(slugify).join("/") || "ostatni";
      const groupLabel = dirParts.length ? prettifyGroupLabel(dirParts) : collection.label;
      if (!groupMap.has(groupId)) groupMap.set(groupId, { id: groupId, label: groupLabel, items: [] });
      groupMap.get(groupId).items.push(item);
      totals[item.kind] += 1;
      totals.bytes += fs.statSync(file).size;
    }

    const groups = [...groupMap.values()].map((g) => ({
      ...g,
      items: g.items.sort((a, b) => a.name.localeCompare(b.name, "cs", { numeric: true })),
    }));

    lines.push("  {");
    lines.push(`    id: "${collection.id}",`);
    lines.push(`    label: "${collection.label}",`);
    lines.push("    groups: [");
    for (const g of groups) {
      lines.push("      {");
      lines.push(`        id: "${g.id}",`);
      lines.push(`        label: ${JSON.stringify(g.label)},`);
      lines.push("        items: [");
      for (const item of g.items) {
        const dims = item.w && item.h ? `, w: ${item.w}, h: ${item.h}` : "";
        const bytes = item.bytes ? `, bytes: ${item.bytes}` : "";
        lines.push(`          { kind: "${item.kind}", src: ${JSON.stringify(item.src)}, name: ${JSON.stringify(item.name)}${dims}${bytes} },`);
      }
      lines.push("        ],");
      lines.push("      },");
    }
    lines.push("    ],");
    lines.push("  },");
  }

  lines.push("];");
  lines.push("");
  lines.push("export const mediaTotals = { image: " + totals.image + ", video: " + totals.video + " } as const;");
  lines.push("");

  fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
  fs.writeFileSync(MANIFEST, lines.join("\n"), "utf8");

  const gb = (totals.bytes / 1024 ** 3).toFixed(2);
  console.log(`manifest: ${totals.image} images, ${totals.video} videos (${gb} GB) -> ${path.relative(ROOT, MANIFEST)}`);
}

main();
