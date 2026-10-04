"use client";

import { InstagramIcon, LinkedinIcon } from "@/components/brand-icons";
import { FolderIcon, PCIcon } from "@/components/folder-icon";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  Film,
  Image as ImageIcon,
  Mail,
  MousePointerClick,
  Send,
  Upload,
  X,
} from "lucide-react";
import { desktopIcons, identity } from "@/data/site";
import { mediaCollections, mediaTotals, type MediaItem } from "@/data/media";

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */

type WindowName = "terminal" | "contact" | "folder" | "portfolio" | "booking" | "settings" | null;

const WindowCtx = createContext<{
  openWindow: (w: Exclude<WindowName, null>, payload?: string) => void;
  closeWindow: () => void;
  open: WindowName;
  payload: string | null;
}>({
  openWindow: () => {},
  closeWindow: () => {},
  open: null,
  payload: null,
});

export const useWindows = () => useContext(WindowCtx);

export function WindowProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<WindowName>(null);
  const [payload, setPayload] = useState<string | null>(null);

  const openWindow = useCallback((w: Exclude<WindowName, null>, p?: string) => {
    setOpen(w);
    setPayload(p ?? null);
  }, []);
  const closeWindow = useCallback(() => setOpen(null), []);

  return (
    <WindowCtx.Provider value={{ openWindow, closeWindow, open, payload }}>
      {children}
    </WindowCtx.Provider>
  );
}

/** Renders the open windows; must sit inside a positioned (relative) container. */
export function WindowLayer() {
  const { open } = useWindows();
  return (
    <>
      {open === "terminal" && <TerminalWindow />}
      {open === "contact" && <ContactWindow />}
      {open === "folder" && <FolderWindow />}
      {open === "portfolio" && <PortfolioWindow />}
      {open === "booking" && <MeetingBooking />}
      {open === "settings" && <SettingsWindow />}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Shared chrome                                                       */
/* ------------------------------------------------------------------ */

function useWindowDrag() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const start = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);
  return {
    offset,
    onPointerDown: (e: React.PointerEvent) => {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      start.current = { px: e.clientX, py: e.clientY, ox: offset.x, oy: offset.y };
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (!start.current) return;
      setOffset({
        x: start.current.ox + (e.clientX - start.current.px),
        y: start.current.oy + (e.clientY - start.current.py),
      });
    },
    onPointerUp: () => {
      start.current = null;
    },
  };
}

function TrafficLights({ onClose, light = false }: { onClose: () => void; light?: boolean }) {
  return (
    <>
      <button
        aria-label="Zavřít okno"
        onClick={onClose}
        className="h-3 w-3 rounded-full bg-[#ff5f57] transition-opacity hover:opacity-70"
      />
      <span className={`h-3 w-3 rounded-full bg-[#febc2e] ${light ? "" : "opacity-90"}`} />
      <span className={`h-3 w-3 rounded-full bg-[#28c840] ${light ? "" : "opacity-90"}`} />
    </>
  );
}

/**
 * Fullscreen overlay shared by all windows. Fixed to the viewport so windows
 * cover the whole screen on desktop and mobile alike; content scrolls inside.
 */
function WindowOverlay({
  children,
  onClose,
  labelledBy,
}: {
  children: ReactNode;
  onClose: () => void;
  labelledBy?: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      className="modal-open-anim fixed inset-0 z-[90] flex items-center justify-center bg-black/25 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <div
        className="relative max-h-full w-full overflow-hidden rounded-2xl border border-black/15 bg-white shadow-[0_40px_120px_rgba(0,0,0,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function WindowTitlebar({
  title,
  accent,
  onClose,
  drag,
}: {
  title: string;
  accent?: string;
  onClose: () => void;
  drag?: Record<string, unknown>;
}) {
  return (
    <div
      className={`flex shrink-0 cursor-grab items-center gap-2 border-b border-black/10 px-4 py-2.5 active:cursor-grabbing ${
        accent ?? "bg-[#f5f5f5]"
      }`}
      {...drag}
    >
      <TrafficLights onClose={onClose} />
      <span className="ml-3 select-none truncate text-xs font-medium text-black/55">{title}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Terminal                                                            */
/* ------------------------------------------------------------------ */

const TERMINAL_BANNER = "daniel-1 shell. Napiš cokoliv o Danielovi, nebo zadej `help`.";

const HELP = `available commands:
  help              this list
  ls                look around
  cat contact.txt   how to reach Daniel
  whoami            existential check
  clear             clean the screen
  exit              close the window
anything else is a question for daniel-1.`;

const LS = `about-me.txt
contact.txt
vizualni-tvorba/
leadership/
it-web/
obsah/`;

const CONTACT = `email:     ${identity.email}
instagram: @d.fraancc
linkedin:  linkedin.com/in/daniel-franc-a7a95a3b9`;

function TerminalWindow() {
  const { closeWindow } = useWindows();
  const drag = useWindowDrag();
  const [lines, setLines] = useState<string[]>([
    "Last login: just now on ttys001",
    TERMINAL_BANNER,
  ]);
  const [value, setValue] = useState("");

  const run = (raw: string) => {
    const cmd = raw.trim();
    const out: string[] = [`visitor@danielfranc ~ % ${cmd}`];
    switch (cmd) {
      case "":
        break;
      case "help":
        out.push(HELP);
        break;
      case "ls":
        out.push(LS);
        break;
      case "cat contact.txt":
        out.push(CONTACT);
        break;
      case "whoami":
        out.push("daniel — 16y IT student & videomaker from Prague");
        break;
      case "clear":
        setLines([]);
        setValue("");
        return;
      case "exit":
        closeWindow();
        return;
      default:
        out.push(`zsh: command not found: ${cmd.split(" ")[0]}`);
        break;
    }
    setLines((l) => [...l, ...out]);
    setValue("");
  };

  return (
    <WindowOverlay onClose={closeWindow} labelledBy="terminal-title">
      <div className="flex h-[min(70dvh,440px)] w-[min(94vw,640px)] flex-col overflow-hidden rounded-2xl border border-black/40 bg-[#1d1e26]/95 font-mono text-[13px] leading-relaxed text-white/85 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-md">
        <div
          className="flex shrink-0 cursor-grab items-center gap-2 border-b border-white/10 bg-[#2a2b33] px-4 py-2.5 active:cursor-grabbing"
          {...drag}
        >
          <TrafficLights onClose={closeWindow} />
          <span id="terminal-title" className="absolute left-1/2 -translate-x-1/2 select-none text-xs font-medium text-white/50">
            visitor@danielfranc — zsh — 80×24
          </span>
        </div>
        <div className="flex-1 space-y-1 overflow-y-auto px-4 py-3">
          {lines.map((line, i) => (
            <p
              key={i}
              className={`whitespace-pre-wrap break-words ${
                i === 0 ? "text-white/35" : "text-white/80"
              }`}
            >
              {line}
            </p>
          ))}
          <form
            className="flex items-baseline gap-0"
            onSubmit={(e) => {
              e.preventDefault();
              run(value);
            }}
          >
            <span className="shrink-0 text-[#4FDE73]">visitor@danielfranc</span>
            <span className="shrink-0 text-white/45">&nbsp;~ %&nbsp;</span>
            <input
              autoFocus
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              aria-label="Terminálový vstup"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="min-w-0 flex-1 border-none bg-transparent font-mono text-[13px] text-white/90 caret-[#4FDE73] outline-none"
            />
          </form>
        </div>
      </div>
    </WindowOverlay>
  );
}

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

function ContactWindow() {
  const { closeWindow } = useWindows();
  const channels = [
    {
      icon: <Mail className="h-5 w-5" aria-hidden="true" />,
      label: "E-mail",
      hint: "Nejspolehlivější cesta pro pracovní nabídky i spolupráci.",
      href: `mailto:${identity.email}`,
    },
    {
      icon: <InstagramIcon className="h-5 w-5" aria-hidden="true" />,
      label: "Instagram",
      hint: "Pohled pod pokličku toho, co a jak zrovna tvořím.",
      href: identity.instagram,
    },
    {
      icon: <LinkedinIcon className="h-5 w-5" aria-hidden="true" />,
      label: "LinkedIn",
      hint: "Kompletní životopis a profesní kontakty.",
      href: identity.linkedin,
    },
  ];

  return (
    <WindowOverlay onClose={closeWindow} labelledBy="contact-title">
      <div className="w-[min(94vw,460px)]">
        <WindowTitlebar title="Kontakt — Daniel Franc" onClose={closeWindow} />
        <div className="max-h-[70dvh] space-y-4 overflow-y-auto p-6">
          <p className="text-sm text-black/55">
            Máš nápad na spolupráci, dotaz k projektu, nebo se chceš jen spojit?
            Vyber si kanál, který ti vyhovuje nejvíce.
          </p>
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="flex items-start gap-3 rounded-xl border border-black/10 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-black/[0.04] hover:shadow-md"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[24%] border border-black/10 bg-white text-black shadow-sm">
                {c.icon}
              </span>
              <span>
                <span className="block text-[15px] font-bold leading-snug">{c.label}</span>
                <span className="mt-0.5 block text-sm leading-snug text-black/55">
                  {c.hint}
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </WindowOverlay>
  );
}

/* ------------------------------------------------------------------ */
/* Skill folder window → opens on the real section content             */
/* ------------------------------------------------------------------ */

function FolderWindow() {
  const { closeWindow, payload } = useWindows();
  const icon = useMemo(
    () => desktopIcons.find((d) => d.type === "skill" && d.target === payload),
    [payload],
  );

  // Auto-scroll: after the open animation, scroll the real page to the skill card.
  // setTimeout (not rAF) — rAF is suspended in occluded/background tabs.
  useEffect(() => {
    if (!icon?.target) return;
    const el = document.getElementById(icon.target);
    if (!el) return;
    const t1 = setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 350);
    const t2 = setTimeout(() => {
      el.classList.remove("skill-flash");
      // force reflow so the animation can re-run
      void el.offsetWidth;
      el.classList.add("skill-flash");
    }, 900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [icon]);

  if (!icon) return null;

  return (
    <WindowOverlay onClose={closeWindow} labelledBy="folder-title">
      <div className="w-[min(94vw,460px)]">
        <WindowTitlebar title={icon.label} onClose={closeWindow} />
        <div className="p-6">
          <div className="flex items-start gap-4">
            <FolderIcon className="h-16 w-16 shrink-0" />
            <div className="min-w-0">
              <p className="text-[15px] font-bold leading-snug">{icon.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-black/55">
                {icon.description ?? "Obsah složky se otevírá v sekci Dovednosti."}
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            {[
              { name: "Koncepty a nápady", date: "průběžně" },
              { name: "Realizované projekty", date: "2025 – 2026" },
              { name: "Výsledky a dopad", date: "sekce níže" },
            ].map((file, i) => (
              <div
                key={file.name}
                className="flex items-center gap-3 rounded-lg border border-black/5 bg-black/[0.02] p-3 animate-[fadeup_0.4s_cubic-bezier(0.22,1,0.36,1)_both]"
                style={{ animationDelay: `${120 + i * 90}ms` }}
              >
                <FolderIcon className="h-7 w-7" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-black/40">{file.date}</p>
                </div>
              </div>
            ))}
          </div>
          <a
            href={`#${icon.target}`}
            className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5"
          >
            <MousePointerClick className="h-4 w-4" aria-hidden="true" />
            Přejít na dovednost
          </a>
        </div>
      </div>
    </WindowOverlay>
  );
}

/* ------------------------------------------------------------------ */
/* Portfolio browser (Creative Portfolio)                              */
/* ------------------------------------------------------------------ */

function formatBytes(n: number): string {
  if (n >= 1024 ** 3) return `${(n / 1024 ** 3).toFixed(1)} GB`;
  if (n >= 1024 ** 2) return `${(n / 1024 ** 2).toFixed(0)} MB`;
  if (n >= 1024) return `${(n / 1024).toFixed(0)} kB`;
  return `${n} B`;
}

/** One media tile; videos mount a lightweight <video preload="metadata"> preview. */
function MediaTile({
  item,
  onOpen,
}: {
  item: MediaItem;
  onOpen: () => void;
}) {
  const ratio =
    item.w && item.h ? { aspectRatio: `${item.w} / ${item.h}` } : { aspectRatio: "4 / 3" };

  return (
    <button
      onClick={onOpen}
      className="group relative block w-full overflow-hidden rounded-xl border border-black/[0.06] bg-black/[0.03] text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent"
      title={item.name}
    >
      <div style={ratio} className="relative w-full overflow-hidden bg-[#eef1f4]">
        {item.kind === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.src}
            alt={item.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <video
            src={`${item.src}#t=0.1`}
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {item.kind === "video" && (
          <span className="pointer-events-none absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
            <Film className="h-2.5 w-2.5" aria-hidden="true" /> video
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 px-2.5 py-2">
        <p className="min-w-0 flex-1 truncate text-[11px] font-medium text-black/70">{item.name}</p>
        {item.bytes ? <span className="shrink-0 text-[10px] tabular-nums text-black/35">{formatBytes(item.bytes)}</span> : null}
      </div>
    </button>
  );
}

/** Lightbox with a real player for videos and full-size images. */
function Lightbox({
  item,
  onClose,
  onPrev,
  onNext,
}: {
  item: MediaItem;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.name}
      className="modal-open-anim fixed inset-0 z-[95] flex flex-col bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex items-center gap-3 px-4 py-3 text-white/80">
        <p className="min-w-0 flex-1 truncate text-sm font-medium">{item.name}</p>
        <button
          onClick={onClose}
          aria-label="Zavřít"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/25"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6" onClick={(e) => e.stopPropagation()}>
        {item.kind === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.src}
            alt={item.name}
            className="modal-open-anim max-h-full max-w-full rounded-lg object-contain shadow-2xl"
          />
        ) : (
          <video
            key={item.src}
            src={item.src}
            controls
            autoPlay
            playsInline
            className="modal-open-anim max-h-full max-w-full rounded-lg shadow-2xl"
          />
        )}
        <button
          onClick={onPrev}
          aria-label="Předchozí"
          className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
        >
          <ChevronLeft className="h-6 w-6" aria-hidden="true" />
        </button>
        <button
          onClick={onNext}
          aria-label="Další"
          className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
        >
          <ChevronRight className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function PortfolioWindow() {
  const { closeWindow } = useWindows();
  const drag = useWindowDrag();
  const [collectionId, setCollectionId] = useState(mediaCollections[0]?.id ?? "grafika");
  const [groupId, setGroupId] = useState<string>("all");
  const [uploads, setUploads] = useState<MediaItem[]>([]);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const collection = mediaCollections.find((c) => c.id === collectionId) ?? mediaCollections[0];
  const groups = collection?.groups ?? [];
  const items: MediaItem[] =
    groupId === "all"
      ? groups.flatMap((g) => g.items)
      : (groups.find((g) => g.id === groupId)?.items ?? []);
  const allItems = [...uploads, ...items];

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const next: MediaItem[] = [];
    Array.from(files).forEach((file) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      if (!isImage && !isVideo) return;
      next.push({
        kind: isImage ? "image" : "video",
        src: URL.createObjectURL(file),
        name: file.name.replace(/\.[^.]+$/, "").replace(/_+/g, " "),
        w: undefined,
        h: undefined,
        bytes: file.size,
      });
    });
    if (next.length) setUploads((prev) => [...next, ...prev]);
  };

  const openLightbox = (i: number) => setLightbox(i);
  const step = (dir: 1 | -1) =>
    setLightbox((cur) =>
      cur === null ? cur : (cur + dir + allItems.length) % allItems.length,
    );

  return (
    <>
      <WindowOverlay onClose={closeWindow} labelledBy="portfolio-title">
      <div className="flex h-[min(86dvh,720px)] w-[min(96vw,980px)] flex-col">
        <div
          className="flex shrink-0 cursor-grab items-center gap-2 border-b border-black/10 bg-gradient-to-r from-red-500/10 to-red-600/10 px-4 py-2.5 active:cursor-grabbing"
          {...drag}
        >
          <TrafficLights onClose={closeWindow} />
          <span id="portfolio-title" className="ml-3 select-none text-xs font-medium text-black/55">
            Creative Portfolio — {collection?.label}
          </span>
          <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-red-500">
            {mediaTotals.image} fotek · {mediaTotals.video} videí
          </span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          {/* Tabs: collections */}
          <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-b border-black/5 px-4 py-2.5">
            {mediaCollections.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setCollectionId(c.id);
                  setGroupId("all");
                }}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-200 ${
                  c.id === collectionId
                    ? "bg-accent text-white shadow-sm"
                    : "bg-black/[0.05] text-black/60 hover:bg-black/10"
                }`}
              >
                {c.label}
              </button>
            ))}
            <span className="ml-auto hidden shrink-0 text-[11px] text-black/35 sm:block">
              {allItems.length} položek
            </span>
          </div>

          <div className="flex min-h-0 flex-1">
            {/* Sidebar: groups */}
            <aside className="hidden w-52 shrink-0 overflow-y-auto border-r border-black/5 p-3 sm:block">
              <button
                onClick={() => setGroupId("all")}
                className={`mb-1 w-full rounded-lg px-3 py-1.5 text-left text-xs font-semibold transition-colors ${
                  groupId === "all" ? "bg-black/[0.07] text-black" : "text-black/55 hover:bg-black/[0.04]"
                }`}
              >
                Vše
              </button>
              {groups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGroupId(g.id)}
                  className={`mb-0.5 w-full truncate rounded-lg px-3 py-1.5 text-left text-xs font-medium transition-colors ${
                    groupId === g.id ? "bg-black/[0.07] text-black" : "text-black/55 hover:bg-black/[0.04]"
                  }`}
                  title={g.label}
                >
                  {g.label}
                </button>
              ))}

              {/* Upload zone lives in the sidebar */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleFiles(e.dataTransfer.files);
                }}
                className={`mt-4 rounded-xl border-2 border-dashed p-3 text-center transition-colors ${
                  dragOver ? "border-red-500 bg-red-50" : "border-black/10 hover:border-black/25"
                }`}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => handleFiles(e.target.files)}
                  className="hidden"
                  id="portfolio-upload"
                />
                <label htmlFor="portfolio-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-5 w-5 text-black/35" aria-hidden="true" />
                  <p className="mt-1 text-[11px] font-medium text-black/55">Přidat fotky / videa</p>
                  <p className="text-[10px] text-black/35">přetáhni nebo vyber</p>
                </label>
              </div>
            </aside>

            {/* Gallery */}
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {allItems.length === 0 ? (
                <div className="flex h-full items-center justify-center text-black/30">
                  <div className="text-center">
                    <ImageIcon className="mx-auto mb-3 h-12 w-12 opacity-50" aria-hidden="true" />
                    <p className="text-sm">Zatím žádná média</p>
                  </div>
                </div>
              ) : (
                <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3">
                  {allItems.map((item, i) => (
                    <MediaTile key={`${item.src}-${i}`} item={item} onOpen={() => openLightbox(i)} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </WindowOverlay>
      {/* Lightbox renders above the window overlay */}
      {lightbox !== null && allItems[lightbox] ? (
        <Lightbox
          item={allItems[lightbox]}
          onClose={() => setLightbox(null)}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
        />
      ) : null}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Settings (Tento počítač)                                            */
/* ------------------------------------------------------------------ */

function SettingsWindow() {
  const { closeWindow } = useWindows();
  const drag = useWindowDrag();

  const rows: Array<{ label: string; value: string }> = [
    { label: "Zařízení", value: "Daniel Franc — Desktop Edition" },
    { label: "Prohlížeč", value: typeof navigator !== "undefined" ? navigator.userAgent.split(") ")[0] + ")" : "—" },
    { label: "Jazyk", value: typeof navigator !== "undefined" ? navigator.language : "cs-CZ" },
    { label: "Verze webu", value: "1.2.0 — desktopové prostředí" },
  ];

  return (
    <WindowOverlay onClose={closeWindow} labelledBy="settings-title">
      <div className="w-[min(94vw,480px)]">
        <WindowTitlebar title="Tento počítač — Nastavení" onClose={closeWindow} drag={drag} />
        <div className="max-h-[70dvh] overflow-y-auto p-5">
          <div className="flex items-center gap-4 rounded-xl border border-black/10 bg-gradient-to-b from-[#f3f7fd] to-[#e9f0fa] p-4">
            <PCIcon className="h-14 w-14 shrink-0" />
            <div className="min-w-0">
              <p className="text-[15px] font-bold leading-snug">daniel-desktop</p>
              <p className="text-xs text-black/50">Portfolio workstation · Praha, Česko</p>
            </div>
          </div>

          <div className="mt-4 divide-y divide-black/5 rounded-xl border border-black/10">
            {rows.map((r) => (
              <div key={r.label} className="flex items-center justify-between gap-4 px-4 py-2.5">
                <span className="text-xs font-medium text-black/45">{r.label}</span>
                <span className="min-w-0 truncate text-xs font-semibold text-black/75">{r.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-black/10 bg-black/[0.02] p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-black/40">Zástupci</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={closeWindow}
                className="rounded-full bg-black/[0.06] px-3 py-1.5 text-xs font-semibold text-black/70 transition-colors hover:bg-black/10"
              >
                Zavřít okno
              </button>
              <a
                href="#praxe"
                onClick={closeWindow}
                className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white transition-all hover:brightness-110"
              >
                Praxe
              </a>
              <a
                href="#dovednosti"
                onClick={closeWindow}
                className="rounded-full bg-black/[0.06] px-3 py-1.5 text-xs font-semibold text-black/70 transition-colors hover:bg-black/10"
              >
                Dovednosti
              </a>
            </div>
          </div>

          <p className="mt-4 text-center text-[10px] text-black/30">
            {identity.name} · {identity.role}
          </p>
        </div>
      </div>
    </WindowOverlay>
  );
}

/* ------------------------------------------------------------------ */
/* Meeting booking                                                     */
/* ------------------------------------------------------------------ */

function MeetingBooking() {
  const { closeWindow } = useWindows();
  const drag = useWindowDrag();
  const today = new Date();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [topic, setTopic] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i + 1);
    return d;
  });

  const times = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <WindowOverlay onClose={closeWindow} labelledBy="booking-title">
      <div className="w-[min(94vw,480px)]">
        <WindowTitlebar
          title={submitted ? "Potvrzeno — Kalendář" : "Nová schůzka — Kalendář"}
          onClose={closeWindow}
          drag={drag}
        />
        <div className="max-h-[76dvh] overflow-y-auto p-6">
          {submitted ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <Send className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-green-800">Schůzka potvrzena</p>
                  <p className="text-sm text-green-700">
                    {date ? `${new Date(date).toLocaleDateString("cs-CZ")} ${time}` : "Termín"} · {name || "Jméno"} — potvrzení pošleme na {email || "tvůj e-mail"}.
                  </p>
                </div>
              </div>
              <button
                onClick={closeWindow}
                className="w-full rounded-lg border border-black/10 bg-black py-3 font-medium text-white transition-colors hover:bg-gray-800"
              >
                Zavřít
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-black/70">Jméno</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-black/10 bg-white/80 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="Tvoje jméno"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-black/70">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-black/10 bg-white/80 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="tvé@email.cz"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-black/70">Datum</label>
                <div className="grid grid-cols-7 gap-1">
                  {days.map((d) => {
                    const iso = d.toISOString().split("T")[0];
                    return (
                      <button
                        key={iso}
                        type="button"
                        onClick={() => setDate(iso)}
                        className={`rounded-lg p-2 text-center text-xs font-medium transition-colors ${
                          date === iso ? "bg-accent text-white" : "bg-white/80 hover:bg-black/5"
                        }`}
                      >
                        <span className="block text-[9px] text-black/40">
                          {d.toLocaleDateString("cs-CZ", { weekday: "short" }).toUpperCase()}
                        </span>
                        <span className="block font-semibold">{d.getDate()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-black/70">Čas</label>
                <div className="flex flex-wrap gap-2">
                  {times.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTime(t)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        time === t ? "bg-accent text-white" : "border border-black/5 bg-white/80 hover:bg-black/5"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-black/70">Téma schůzky</label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                  rows={3}
                  className="w-full resize-none rounded-lg border border-black/10 bg-white/80 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="O čem chceš mluvit?"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-accent py-2.5 font-semibold text-white transition-all hover:-translate-y-0.5 hover:brightness-110"
              >
                Potvrdit schůzku
              </button>
            </form>
          )}
        </div>
      </div>
    </WindowOverlay>
  );
}
