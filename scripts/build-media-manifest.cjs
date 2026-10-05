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
  { dir: "grafika", id: "grafika", label: "Graphic Design" },
  { dir: "photos", id: "fotky", label: "Photography" },
  { dir: "videos", id: "videa", label: "Video" },
];

/*
 * Professional naming table.
 * Folder names never reach the UI: every group is labelled with the same
 * `Category / Project` convention, and every media item carries the clean
 * project label instead of its camera/file name.
 */
const NAMING = {
  "grafika/CZ.NIC/Co-je-to-Echo-Chamber": { group: "CZ.NIC / Social Campaign", item: "Echo Chamber" },
  "grafika/CZ.NIC/Den-bezpecnejsiho-internetu": { group: "CZ.NIC / Awareness", item: "Safer Internet Day" },
  "grafika/CZ.NIC/Skryta-tvar": { group: "CZ.NIC / Art Direction", item: "Hidden Face" },
  "fotky/Debata-Tucek-x-Jirout": { group: "Events / Debate Tu\u010dek x Jirout", item: "Debate \u2014 Tu\u010dek x Jirout" },
  "fotky/Fotbal-Repy-Stodulky": { group: "Sports / Football", item: "Football \u2014 Stod\u016flky" },
  "fotky/Hackathon": { group: "Events / Hackathons", item: "Hackathon" },
  "fotky/Maker-Faire": { group: "Events / Maker Faire", item: "Maker Faire" },
  "fotky/Trask": { group: "Surfaces / Textures", item: "Textures" },
  "fotky/Volnocas/madarsko": { group: "Travel / Hungary", item: "Hungary" },
  "fotky/Volnocas/metrorave": { group: "Events / Metro Rave", item: "Metro Rave" },
  "fotky/Volnocas/Praha": { group: "Travel / Prague", item: "Prague" },
  "fotky/Volnocas/Snezka": { group: "Travel / S\u011bn\u011b\u017eka", item: "Sn\u011b\u017eka" },
  "fotky/Volnocas/Turecko": { group: "Travel / Turkey", item: "Turkey" },
  "fotky/Volt/Den-Evropy": { group: "Volt Czechia / Events", item: "Europe Day" },
  "fotky/Volt/headshoty": { group: "Volt Czechia / Headshots", item: "Headshots" },
  "fotky/Volt/Petice-pro-dzban": { group: "Volt Czechia / Campaign", item: "Petition Campaign" },
  "fotky/ze-strechy-zahrada": { group: "Surfaces / Roof Garden", item: "Roof Garden" },
  "videa/CZ.NIC": { group: "CZ.NIC / Video", item: "CZ.NIC" },
  "videa/Konferencni-sal-ruby-hall": { group: "Events / Conference Hall", item: "Conference Hall" },
  "videa/metro-rave": { group: "Events / Metro Rave", item: "Metro Rave" },
  "videa/MultiVerbo": { group: "MultiVerbo / Brand Film", item: "MultiVerbo" },
  "videa/Praha-Sobe": { group: "Praha Sob\u011b / Campaign", item: "Praha Sob\u011b" },
  "videa/Tanecni-Onder": { group: "Events / Dance Studio", item: "Dance Studio" },
  "videa/volno-casovy": { group: "Personal / Free Time", item: "Free Time" },
  "videa/Volt": { group: "Volt Czechia / Campaign", item: "Volt Czechia" },
};

function displayLabel(collectionId, dirParts, collectionLabel) {
  const id = dirParts.map(slugify).join("/");
  const named = NAMING[`${collectionId}/${id}`];
  if (named) return named;
  return { group: collectionLabel, item: collectionLabel };
}

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

/**
 * Destination name for a source file: the URL-safe slug of its file name.
 * Existing files are never renamed or overwritten — large videos are
 * post-processed in place by scripts/compress.cjs, so the manifest run must
 * stay purely additive (delete the copy first to force a refresh).
 * Collisions inside one run get a numeric suffix.
 */
function uniqueDir(dir, name, taken) {
  if (!taken.has(name)) return name;
  const ext = path.extname(name);
  const base = path.basename(name, ext);
  let i = 2;
  let candidate = `${base}-${i}${ext}`;
  while (taken.has(candidate)) {
    i += 1;
    candidate = `${base}-${i}${ext}`;
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

/** `name` stays a technical detail; `label` is the only string shown in the UI. */

function copyFile(src, destDir, relParts, collection, taken) {
  const name = slugify(path.basename(src));
  fs.mkdirSync(destDir, { recursive: true });
  const size = fs.statSync(src).size;
  let namesInDir = taken.get(destDir);
  if (!namesInDir) {
    namesInDir = new Set();
    taken.set(destDir, namesInDir);
  }
  const finalName = uniqueDir(destDir, name, namesInDir);
  const dest = path.join(destDir, finalName);
  namesInDir.add(finalName);
  if (!fs.existsSync(dest)) {
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
    item.bytes = size;
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

  // Wallpaper — additive like the media copies: an existing public/photobg.jpeg
  // is kept (delete it to pull a fresh copy from Downloads).
  if (fs.existsSync(WALLPAPER_SRC)) {
    if (fs.existsSync(WALLPAPER_OUT)) {
      console.log("wallpaper photobg.jpeg kept (delete it to re-copy)");
    } else {
      fs.copyFileSync(WALLPAPER_SRC, WALLPAPER_OUT);
      const dims = imageDimensions(WALLPAPER_SRC);
      console.log(`wallpaper photobg.jpeg copied${dims ? ` (${dims.w}x${dims.h})` : ""}`);
    }
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
  lines.push("  /** Administrativní název souboru — v UI se nikdy nezobrazuje */");
  lines.push("  name: string;");
  lines.push("  /** Profesní název zobrazený na kartě (místo názvu souboru) */");
  lines.push("  label?: string;");
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
    const taken = new Map();

    for (const file of files) {
      const rel = path.relative(srcDir, file).split(/[\\/]/);
      const dirParts = rel.slice(0, -1);
      const destDir = path.join(OUT_DIR, collection.dir, ...dirParts.map(slugify));
      const item = copyFile(file, destDir, dirParts, collection, taken);
      if (!item) continue;
      const groupId = dirParts.map(slugify).join("/") || "ostatni";
      const naming = dirParts.length
        ? displayLabel(collection.id, dirParts, collection.label)
        : { group: collection.label, item: collection.label };
      const groupLabel = naming.group || prettifyGroupLabel(dirParts);
      item.label = naming.item || groupLabel;
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
        lines.push(`          { kind: "${item.kind}", src: ${JSON.stringify(item.src)}, name: ${JSON.stringify(item.name)}, label: ${JSON.stringify(item.label ?? g.label)}${dims}${bytes} },`);
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
