"use client";

import { InstagramIcon, LinkedinIcon } from "@/components/brand-icons";
import { PCIcon } from "@/components/folder-icon";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Ban,
  ChevronLeft,
  ChevronRight,
  Film,
  FolderLock,
  Image as ImageIcon,
  Mail,
  MousePointerClick,
  Send,
  SquareArrowOutUpRight,
  Upload,
  X,
} from "lucide-react";
import { desktopIcons, identity } from "@/data/site";
import { mediaCollections, mediaTotals, type MediaItem } from "@/data/media";

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */

type WindowName =
  | "terminal"
  | "contact"
  | "portfolio"
  | "booking"
  | "settings"
  | "accessDenied"
  | null;

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
  const closeWindow = useCallback(() => {
    setOpen(null);
    setPayload(null);
  }, []);

  return (
    <WindowCtx.Provider value={{ openWindow, closeWindow, open, payload }}>
      {children}
    </WindowCtx.Provider>
  );
}

/** Renders the open window. Must sit inside the page tree. */
export function WindowLayer() {
  const { open } = useWindows();
  return (
    <>
      {open === "terminal" && <TerminalWindow />}
      {open === "contact" && <ContactWindow />}
      {open === "portfolio" && <PortfolioWindow />}
      {open === "booking" && <MeetingBooking />}
      {open === "settings" && <SettingsWindow />}
      {open === "accessDenied" && <AccessDenied />}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Shared chrome                                                       */
/* ------------------------------------------------------------------ */

/**
 * Every window closes through the same two-step path: requestClose() starts
 * the closing animation, and the window is unmounted right after it ends.
 * Clicking a traffic light, the backdrop or pressing Escape all behave alike.
 */
function useWindowChrome() {
  const { closeWindow } = useWindows();
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!closing) return;
    const t = setTimeout(closeWindow, 190);
    return () => clearTimeout(t);
  }, [closing, closeWindow]);

  const requestClose = useCallback(() => setClosing(true), []);

  return { closing, requestClose };
}

/**
 * Window dragging. The pointer is captured only after the gesture is clearly a
 * drag: capturing on pointerdown would retarget the click away from the
 * traffic-light buttons in the title bar.
 */
function useWindowDrag() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const start = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);
  const dragging = useRef(false);
  return {
    handlers: {
      onPointerDown: (e: React.PointerEvent) => {
        if (e.pointerType === "touch") return;
        if ((e.target as HTMLElement).closest("button, a, input, textarea")) return;
        start.current = { px: e.clientX, py: e.clientY, ox: offset.x, oy: offset.y };
        dragging.current = false;
      },
      onPointerMove: (e: React.PointerEvent) => {
        if (!start.current) return;
        const dx = e.clientX - start.current.px;
        const dy = e.clientY - start.current.py;
        if (!dragging.current) {
          if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
          dragging.current = true;
          (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
        }
        setOffset({ x: start.current.ox + dx, y: start.current.oy + dy });
      },
      onPointerUp: (e: React.PointerEvent) => {
        start.current = null;
        dragging.current = false;
        if ((e.currentTarget as HTMLElement).hasPointerCapture?.(e.pointerId)) {
          (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
        }
      },
    },
    style: { transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` },
  };
}

function TrafficLights({ onClose }: { onClose: () => void }) {
  return (
    <>
      <button
        type="button"
        aria-label="Zavřít okno"
        onClick={onClose}
        className="h-3 w-3 rounded-full bg-[#ff5f57] transition-opacity hover:opacity-70"
      />
      <span className="h-3 w-3 rounded-full bg-[#febc2e] opacity-90" />
      <span className="h-3 w-3 rounded-full bg-[#28c840] opacity-90" />
    </>
  );
}

/**
 * Fullscreen overlay shared by all windows. Fixed to the viewport, so windows
 * always fit the screen on desktop and mobile alike; the window itself owns the
 * width via `size`, and its content stretches to the full window width.
 */
function WindowOverlay({
  children,
  onClose,
  labelledBy,
  ariaLabel,
  closing,
  size = "w-full max-w-3xl",
  panelStyle,
}: {
  children: ReactNode;
  onClose: () => void;
  labelledBy?: string;
  ariaLabel?: string;
  closing: boolean;
  /** Window size — the inner content always fills it completely. */
  size?: string;
  panelStyle?: React.CSSProperties;
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
      className={`fixed inset-0 z-[90] flex items-center justify-center bg-black/30 p-2.5 backdrop-blur-sm sm:p-6 ${
        closing ? "modal-close-anim" : "modal-open-anim"
      }`}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-label={labelledBy ? undefined : ariaLabel}
        style={panelStyle}
        className={`relative flex max-h-[calc(100dvh-1.25rem)] flex-col overflow-hidden rounded-2xl border border-black/15 bg-white shadow-[0_40px_120px_rgba(0,0,0,0.35)] sm:max-h-[calc(100dvh-3rem)] ${size} ${
          closing ? "folder-close-anim" : "folder-open-anim"
        }`}
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
  meta,
}: {
  title: string;
  accent?: string;
  onClose: () => void;
  drag?: Record<string, unknown>;
  meta?: ReactNode;
}) {
  return (
    <div
      className={`flex w-full shrink-0 cursor-grab items-center gap-2 border-b border-black/10 px-4 py-2.5 active:cursor-grabbing ${
        accent ?? "bg-[#f5f5f5]"
      }`}
      {...drag}
    >
      <TrafficLights onClose={onClose} />
      <span className="ml-3 min-w-0 flex-1 select-none truncate text-xs font-medium text-black/55">
        {title}
      </span>
      {meta}
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
  const { closing, requestClose } = useWindowChrome();
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
        requestClose();
        return;
      default:
        out.push(`zsh: command not found: ${cmd.split(" ")[0]}`);
        break;
    }
    setLines((l) => [...l, ...out]);
    setValue("");
  };

  return (
    <WindowOverlay
      onClose={requestClose}
      labelledBy="terminal-title"
      closing={closing}
      size="h-[min(78dvh,560px)] w-full max-w-4xl"
      panelStyle={drag.style}
    >
      <div className="flex h-full w-full flex-col overflow-hidden bg-[#1d1e26]/95 font-mono text-[13px] leading-relaxed text-white/85 backdrop-blur-md">
        <div
          className="relative flex w-full shrink-0 cursor-grab items-center gap-2 border-b border-white/10 bg-[#2a2b33] px-4 py-2.5 active:cursor-grabbing"
          {...drag.handlers}
        >
          <TrafficLights onClose={requestClose} />
          <span
            id="terminal-title"
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 select-none text-xs font-medium text-white/50"
          >
            visitor@danielfranc — zsh — 80×24
          </span>
        </div>
        <div className="w-full flex-1 space-y-1 overflow-y-auto px-4 py-3">
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
            className="flex w-full items-baseline gap-0"
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
  const { closing, requestClose } = useWindowChrome();
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
    <WindowOverlay onClose={requestClose} labelledBy="contact-title" closing={closing}>
      <WindowTitlebar title="Kontakt — Daniel Franc" onClose={requestClose} />
      <div className="w-full flex-1 overflow-y-auto p-5 sm:p-7">
        <p className="max-w-2xl text-sm text-black/55">
          Máš nápad na spolupráci, dotaz k projektu, nebo se chceš jen spojit? Vyber si kanál,
          který ti vyhovuje nejvíce.
        </p>
        <div className="mt-5 grid w-full gap-3 sm:grid-cols-3">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="flex h-full w-full flex-col gap-3 rounded-xl border border-black/10 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-black/[0.03] hover:shadow-md"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[24%] border border-black/10 bg-white text-black shadow-sm">
                {c.icon}
              </span>
              <span className="min-w-0">
                <span className="block text-[15px] font-bold leading-snug">{c.label}</span>
                <span className="mt-0.5 block text-sm leading-snug text-black/55">{c.hint}</span>
              </span>
            </a>
          ))}
        </div>

        {/* Wide footer strip so the window uses its full width */}
        <div className="mt-5 flex w-full flex-wrap items-center gap-3 rounded-xl border border-black/10 bg-black/[0.02] p-4">
          <p className="min-w-0 flex-1 text-xs leading-relaxed text-black/55">
            Píšeš o projektu, stáži nebo spolupráci? Napiš dvě věty o nápadu a přilož termín —
            ozvu se zpravidla do 24 hodin.
          </p>
          <a
            href={`mailto:${identity.email}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-white transition-all hover:-translate-y-0.5 hover:brightness-110"
          >
            <SquareArrowOutUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            Napsat e-mail
          </a>
        </div>
      </div>
    </WindowOverlay>
  );
}

/* ------------------------------------------------------------------ */
/* Creative Portfolio                                                  */
/* ------------------------------------------------------------------ */

/** One media tile; videos mount a lightweight <video preload="metadata"> preview. */
function MediaTile({ item, onOpen }: { item: MediaItem; onOpen: () => void }) {
  const ratio =
    item.w && item.h ? { aspectRatio: `${item.w} / ${item.h}` } : { aspectRatio: "4 / 3" };
  // Never surface raw file names — only the clean professional project label.
  const label = item.label ?? "Creative Work";

  return (
    <button
      onClick={onOpen}
      className="group relative block w-full overflow-hidden rounded-xl border border-black/[0.06] bg-black/[0.03] text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent"
      title={label}
      aria-label={label}
    >
      <div style={ratio} className="relative w-full overflow-hidden bg-[#eef1f4]">
        {item.kind === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.src}
            alt={label}
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
      <div className="flex w-full items-center gap-2 px-2.5 py-2">
        <p className="min-w-0 flex-1 truncate text-[11px] font-medium text-black/70">{label}</p>
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
  const label = item.label ?? "Creative Work";

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
      aria-label={label}
      className="modal-open-anim fixed inset-0 z-[95] flex flex-col bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex w-full items-center gap-3 px-4 py-3 text-white/80">
        <p className="min-w-0 flex-1 truncate text-sm font-medium">{label}</p>
        <button
          onClick={onClose}
          aria-label="Zavřít"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/25"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div
        className="relative flex min-h-0 w-full flex-1 items-center justify-center px-4 pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        {item.kind === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.src}
            alt={label}
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
          className="absolute left-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 sm:left-3 sm:h-11 sm:w-11"
        >
          <ChevronLeft className="h-6 w-6" aria-hidden="true" />
        </button>
        <button
          onClick={onNext}
          aria-label="Další"
          className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 sm:right-3 sm:h-11 sm:w-11"
        >
          <ChevronRight className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function PortfolioWindow() {
  const { closing, requestClose } = useWindowChrome();
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
        name: file.name,
        // Uploads get a clean label too — file names stay hidden.
        label: "New Upload",
        w: undefined,
        h: undefined,
        bytes: file.size,
      });
    });
    if (next.length) setUploads((prev) => [...next, ...prev]);
  };

  const openLightbox = (i: number) => setLightbox(i);
  const step = (dir: 1 | -1) =>
    setLightbox((cur) => (cur === null ? cur : (cur + dir + allItems.length) % allItems.length));

  return (
    <>
      <WindowOverlay
        onClose={requestClose}
        ariaLabel="Creative Portfolio"
        closing={closing}
        size="h-[min(92dvh,860px)] w-full max-w-[1180px]"
        panelStyle={drag.style}
      >
        <div className="flex h-full w-full flex-col">
          <div
            className="relative flex w-full shrink-0 cursor-grab items-center gap-2 border-b border-black/10 bg-gradient-to-r from-red-500/10 to-red-600/10 px-4 py-2.5 active:cursor-grabbing"
            {...drag.handlers}
          >
            <TrafficLights onClose={requestClose} />
            <span
              id="portfolio-title"
              className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 select-none text-xs font-medium text-black/55 sm:block"
            >
              Creative Portfolio — {collection?.label}
            </span>
            <span className="ml-auto shrink-0 text-[10px] font-bold uppercase tracking-wider text-red-500">
              {mediaTotals.image} fotek · {mediaTotals.video} videí
            </span>
          </div>

          <div className="flex min-h-0 w-full flex-1 flex-col">
            {/* Tabs: collections */}
            <div className="flex w-full shrink-0 items-center gap-2 overflow-x-auto border-b border-black/5 px-4 py-2.5">
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
              <span className="ml-auto hidden shrink-0 text-[11px] text-black/35 lg:block">
                {allItems.length} položek
              </span>
            </div>

            <div className="flex min-h-0 w-full flex-1">
              {/* Sidebar: groups */}
              <aside className="hidden w-56 shrink-0 overflow-y-auto border-r border-black/5 p-3 sm:block">
                <button
                  onClick={() => setGroupId("all")}
                  className={`mb-1 w-full rounded-lg px-3 py-1.5 text-left text-xs font-semibold transition-colors ${
                    groupId === "all"
                      ? "bg-black/[0.07] text-black"
                      : "text-black/55 hover:bg-black/[0.04]"
                  }`}
                >
                  All Projects
                </button>
                {groups.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGroupId(g.id)}
                    className={`mb-0.5 w-full truncate rounded-lg px-3 py-1.5 text-left text-xs font-medium transition-colors ${
                      groupId === g.id
                        ? "bg-black/[0.07] text-black"
                        : "text-black/55 hover:bg-black/[0.04]"
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
                    <p className="mt-1 text-[11px] font-medium text-black/55">
                      Přidat fotky / videa
                    </p>
                    <p className="text-[10px] text-black/35">přetáhni nebo vyber</p>
                  </label>
                </div>
              </aside>

              {/* Gallery — fills every remaining pixel of the window */}
              <div className="min-h-0 w-full flex-1 overflow-y-auto p-4">
                {allItems.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-black/30">
                    <div className="text-center">
                      <ImageIcon className="mx-auto mb-3 h-12 w-12 opacity-50" aria-hidden="true" />
                      <p className="text-sm">Zatím žádná média</p>
                    </div>
                  </div>
                ) : (
                  <div className="columns-2 gap-3 sm:columns-3 xl:columns-4 [&>*]:mb-3">
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
  const { closing, requestClose } = useWindowChrome();
  const drag = useWindowDrag();

  const rows: Array<{ label: string; value: string }> = [
    { label: "Zařízení", value: "Daniel Franc — Desktop Edition" },
    {
      label: "Prohlížeč",
      value:
        typeof navigator !== "undefined" ? navigator.userAgent.split(") ")[0] + ")" : "—",
    },
    { label: "Jazyk", value: typeof navigator !== "undefined" ? navigator.language : "cs-CZ" },
    { label: "Verze webu", value: "1.2.0 — desktopové prostředí" },
    { label: "Rozlišení", value: "responsive · desktop i mobil" },
    { label: "Uložiště", value: `${mediaTotals.image} médií · 3 sbírky` },
  ];

  return (
    <WindowOverlay
      onClose={requestClose}
      labelledBy="settings-title"
      closing={closing}
      panelStyle={drag.style}
    >
      <WindowTitlebar title="Tento počítač — Nastavení" onClose={requestClose} drag={drag.handlers} />
      <div className="w-full flex-1 overflow-y-auto p-5">
        <div className="flex w-full items-center gap-4 rounded-xl border border-black/10 bg-gradient-to-b from-[#f3f7fd] to-[#e9f0fa] p-4">
          <PCIcon className="h-14 w-14 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold leading-snug">daniel-desktop</p>
            <p className="text-xs text-black/50">Portfolio workstation · Praha, Česko</p>
          </div>
          <span className="hidden shrink-0 rounded-full border border-green-500/30 bg-green-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-green-700 sm:block">
            online
          </span>
        </div>

        <div className="mt-4 grid w-full gap-px overflow-hidden rounded-xl border border-black/10 bg-black/5 sm:grid-cols-2">
          {rows.map((r) => (
            <div
              key={r.label}
              className="flex w-full items-center justify-between gap-4 bg-white px-4 py-3"
            >
              <span className="text-xs font-medium text-black/45">{r.label}</span>
              <span className="min-w-0 truncate text-xs font-semibold text-black/75">
                {r.value}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 w-full rounded-xl border border-black/10 bg-black/[0.02] p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-black/40">Zástupci</p>
          <div className="mt-2 flex w-full flex-wrap gap-2">
            <button
              onClick={requestClose}
              className="rounded-full bg-black/[0.06] px-3 py-1.5 text-xs font-semibold text-black/70 transition-colors hover:bg-black/10"
            >
              Zavřít okno
            </button>
            <a
              href="#praxe"
              onClick={requestClose}
              className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white transition-all hover:brightness-110"
            >
              Praxe
            </a>
            <a
              href="#dovednosti"
              onClick={requestClose}
              className="rounded-full bg-black/[0.06] px-3 py-1.5 text-xs font-semibold text-black/70 transition-colors hover:bg-black/10"
            >
              Dovednosti
            </a>
            <a
              href="#about"
              onClick={requestClose}
              className="rounded-full bg-black/[0.06] px-3 py-1.5 text-xs font-semibold text-black/70 transition-colors hover:bg-black/10"
            >
              O mně
            </a>
          </div>
        </div>

        <p className="mt-4 w-full text-center text-[10px] text-black/30">
          {identity.name} · {identity.role}
        </p>
      </div>
    </WindowOverlay>
  );
}

/* ------------------------------------------------------------------ */
/* Meeting booking                                                     */
/* ------------------------------------------------------------------ */

function MeetingBooking() {
  const { closing, requestClose } = useWindowChrome();
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

  const fieldClass =
    "w-full rounded-lg border border-black/10 bg-white/80 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

  return (
    <WindowOverlay
      onClose={requestClose}
      labelledBy="booking-title"
      closing={closing}
      panelStyle={drag.style}
    >
      <WindowTitlebar
        title={submitted ? "Potvrzeno — Kalendář" : "Nová schůzka — Kalendář"}
        onClose={requestClose}
        drag={drag.handlers}
      />
      <div className="w-full flex-1 overflow-y-auto p-5 sm:p-7">
        {submitted ? (
          <div className="space-y-4">
            <div className="flex w-full items-center gap-3 rounded-xl border border-green-500/30 bg-green-50 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Send className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-green-800">Schůzka potvrzena</p>
                <p className="text-sm text-green-700">
                  {date ? `${new Date(date).toLocaleDateString("cs-CZ")} ${time}` : "Termín"} ·{" "}
                  {name || "Jméno"} — potvrzení pošleme na {email || "tvůj e-mail"}.
                </p>
              </div>
            </div>
            <button
              onClick={requestClose}
              className="w-full rounded-lg border border-black/10 bg-black py-3 font-medium text-white transition-colors hover:bg-gray-800"
            >
              Zavřít
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid w-full gap-5 md:grid-cols-2">
            <div className="w-full md:col-span-2">
              <p className="text-sm text-black/55">
                Vyber termín, který ti sedí — detaily doladíme e-mailem.
              </p>
            </div>
            <div className="w-full space-y-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-black/70">Jméno</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={fieldClass}
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
                  className={fieldClass}
                  placeholder="tvé@email.cz"
                />
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
                        time === t
                          ? "bg-accent text-white"
                          : "border border-black/5 bg-white/80 hover:bg-black/5"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full space-y-5">
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
                        className={`rounded-lg p-1.5 text-center text-xs font-medium transition-colors sm:p-2 ${
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
                <label className="mb-1 block text-sm font-medium text-black/70">
                  Téma schůzky
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                  rows={3}
                  className={`${fieldClass} resize-none`}
                  placeholder="O čem chceš mluvit?"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-accent py-2.5 font-semibold text-white transition-all hover:-translate-y-0.5 hover:brightness-110 md:col-span-2"
            >
              Potvrdit schůzku
            </button>
          </form>
        )}
      </div>
    </WindowOverlay>
  );
}

/* ------------------------------------------------------------------ */
/* Access Denied — intentional OS dialog for locked folders            */
/* ------------------------------------------------------------------ */

export function AccessDenied() {
  const { payload, openWindow } = useWindows();
  const { closing, requestClose } = useWindowChrome();
  const drag = useWindowDrag();
  const folder = payload ?? "Tato složka";
  // Locked skill folders: the same skills are also listed on the page itself.
  const isSkillFolder = desktopIcons.some(
    (icon) => icon.type === "skill" && icon.label === payload,
  );

  return (
    <WindowOverlay
      onClose={requestClose}
      labelledBy="access-title"
      closing={closing}
      size="w-full max-w-3xl"
      panelStyle={drag.style}
    >
      <WindowTitlebar
        title="Systém — Přístup odepřen"
        accent="bg-gradient-to-r from-red-500/15 to-red-600/10"
        onClose={requestClose}
        drag={drag.handlers}
        meta={
          <span className="ml-auto shrink-0 rounded-full border border-red-500/30 bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600">
            locked
          </span>
        }
      />

      <div className="w-full p-5 sm:p-7">
        <div className="flex w-full items-start gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[24%] bg-gradient-to-b from-[#ff6b6b] to-[#e02424] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_20px_rgba(224,36,36,0.35)]">
            <FolderLock className="h-8 w-8" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-base font-bold leading-snug">Přístup odepřen</p>
            <p className="mt-1 text-sm leading-relaxed text-black/60">
              Složka <span className="font-semibold text-black/75">{folder}</span> je zamčená.
              Obsah je dostupný pouze přes složku Creative Portfolio.
            </p>
          </div>
        </div>

        {/* System-style detail panel filling the full window width */}
        <div className="mt-5 w-full overflow-hidden rounded-xl border border-black/10 bg-black/[0.02] font-mono text-[11px] leading-relaxed text-black/50">
          <div className="flex items-center justify-between gap-3 border-b border-black/5 px-4 py-2">
            <span className="truncate">path</span>
            <span className="min-w-0 truncate text-black/70">~/Desktop/{folder}</span>
          </div>
          <div className="flex items-center justify-between gap-3 border-b border-black/5 px-4 py-2">
            <span className="truncate">status</span>
            <span className="shrink-0 text-red-600">EACCES · read-only</span>
          </div>
          <div className="flex items-center justify-between gap-3 px-4 py-2">
            <span className="truncate">owner</span>
            <span className="min-w-0 truncate text-black/70">daniel — osobní projekty</span>
          </div>
        </div>

        <div className="mt-4 flex w-full flex-col gap-2 sm:flex-row">
          <button
            onClick={() => openWindow("portfolio")}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:brightness-110"
          >
            <MousePointerClick className="h-4 w-4" aria-hidden="true" />
            Otevřít Creative Portfolio
          </button>
          <button
            onClick={requestClose}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-black/10 bg-white py-2.5 text-sm font-semibold text-black/70 transition-colors hover:bg-black/[0.04]"
          >
            <Ban className="h-4 w-4" aria-hidden="true" />
            Zavřít
          </button>
        </div>

        {isSkillFolder ? (
          <p className="mt-3 w-full text-center text-[11px] text-black/45">
            Dovednosti jsou popsané i v sekci{" "}
            <a href="#dovednosti" onClick={requestClose} className="font-semibold text-accent underline">
              Dovednosti a zkušenosti
            </a>{" "}
            níže na stránce.
          </p>
        ) : (
          <p className="mt-3 w-full text-center text-[10px] text-black/30">
            Daniel má ostatní složky zamčené — celý obsah najdeš v Creative Portfolio.
          </p>
        )}
      </div>
    </WindowOverlay>
  );
}
