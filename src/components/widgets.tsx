"use client";

import { InstagramIcon, LinkedinIcon } from "@/components/brand-icons";
import { FolderIcon, PCIcon } from "@/components/folder-icon";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Calendar,
  Cloud,
  CloudRain,
  Mail,
  SquareTerminal,
  Sun,
} from "lucide-react";
import { useDraggable } from "@/lib/use-draggable";
import { useNow } from "@/lib/use-now";
import { desktopIcons, identity, music, weather } from "@/data/site";
import { useWindows } from "@/components/windows";

/* ------------------------------------------------------------------ */
/* Shared                                                              */
/* ------------------------------------------------------------------ */

export const glassCardClass =
  "rounded-2xl border border-white/45 bg-white/30 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-2xl backdrop-saturate-150";

function Draggable({
  anchor,
  storageKey,
  children,
  className = "",
}: {
  anchor: { top?: string; left?: string; right?: string; bottom?: string };
  storageKey: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { anchorStyle, dragHandlers } = useDraggable(storageKey, anchor);
  return (
    <div
      {...dragHandlers}
      style={anchorStyle}
      className={`absolute z-20 cursor-grab touch-none select-none active:cursor-grabbing ${className}`}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Menu bar                                                            */
/* ------------------------------------------------------------------ */

export function MenuBar() {
  const now = useNow(30_000);
  const label = now
    ? now.toLocaleString("cs-CZ", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";
  return (
    <div className="absolute inset-x-0 top-0 z-10 flex h-7 items-center justify-between border-b border-black/10 bg-white/70 px-4 text-[11px] font-medium text-black/55 backdrop-blur-md transition-opacity duration-200">
      <div className="flex items-center gap-4">
        <span className="font-semibold text-black/70 hover:text-accent transition-colors duration-200 cursor-default">
          {identity.initials}
        </span>
        <span className="hidden sm:inline text-black/60 hover:text-accent transition-colors duration-200 cursor-default">
          {identity.name}
        </span>
        <span className="hidden text-black/35 sm:inline hover:text-black/50 transition-colors duration-200 cursor-default">
          {identity.role}
        </span>
      </div>
      <span className="min-w-[124px] text-right tabular-nums tracking-wider">{label}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Desktop icons (right column)                                        */
/* ------------------------------------------------------------------ */

export function DesktopIcons({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const { openWindow, open, payload } = useWindows();

  /**
   * One universal interaction model for the whole OS: a single left click
   * (or a single tap on touch) opens the element immediately. No Enter key,
   * no double-click, no selection step in between.
   *
   * Creative Portfolio is the only accessible folder; every other desktop
   * folder answers with the OS "Access Denied" window instead of opening.
   */
  const activate = (icon: (typeof desktopIcons)[number]) => {
    if (icon.type === "portfolio") openWindow("portfolio");
    else if (icon.type === "settings") openWindow("settings");
    else openWindow("accessDenied", icon.label);
  };

  const isLocked = (icon: (typeof desktopIcons)[number]) =>
    icon.type !== "portfolio" && icon.type !== "settings";


  const blockedNow = (icon: (typeof desktopIcons)[number]) =>
    isLocked(icon) && open === "accessDenied" && payload === icon.label;

  /** Icon + caption button shared by the desktop column and the mobile grid. */
  const iconButton = (
    icon: (typeof desktopIcons)[number],
    i: number,
    size: "desktop" | "mobile",
  ) => {
    const blocked = blockedNow(icon);
    const glyph = size === "mobile" ? "h-12 w-12" : "h-14 w-14";
    return (
      <button
        key={`${size}-${icon.label}`}
        type="button"
        draggable={false}
        onClick={() => activate(icon)}
        className={
          "group flex w-full flex-col items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 animate-[cardin_0.4s_cubic-bezier(0.22,1,0.36,1)_both]" +
          (blocked ? " ring-red-400 scale-105" : "")
        }
        style={{ animationDelay: `${i * 70}ms` }}
        title={icon.description ?? icon.label}
      >
        {icon.type === "settings" ? (
          <PCIcon
            className={`${glyph} drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)] transition-all duration-200 group-hover:scale-105 group-active:scale-95`}
          />
        ) : (
          <FolderIcon
            className={`${glyph} drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)] transition-all duration-200 group-hover:scale-105 group-active:scale-95${
              blocked ? " opacity-70" : ""
            }`}
            color={icon.type === "portfolio" ? "red" : "blue"}
          />
        )}
        <span
          className={`block w-full max-w-full text-center font-medium leading-[1.25] backdrop-blur-sm transition-all duration-200 group-hover:text-white group-active:scale-95 ${
            size === "mobile" ? "text-[10px]" : "text-[11px]"
          } ${
            icon.type === "portfolio"
              ? "bg-white/70 text-black/80 group-hover:bg-red-600 group-active:bg-red-500"
              : icon.type === "settings"
              ? "bg-white/70 text-black/80 group-hover:bg-blue-600 group-active:bg-blue-500"
              : "bg-white/70 text-black/80 group-hover:bg-[#0069d9] group-active:bg-[#0059b3]"
          }`}
        >
          {icon.label}
        </span>
      </button>
    );
  };

  if (variant === "mobile") {
    // The mobile desktop keeps the whole OS: the accessible Creative Portfolio
    // folder sits centered, the locked folders follow in a compact grid.
    const primary = desktopIcons.find((icon) => icon.type === "portfolio");
    const rest = desktopIcons.filter((icon) => icon !== primary);
    return (
      <div className="w-full">
        {primary ? (
          <div className="flex w-full justify-center">{iconButton(primary, 0, "mobile")}</div>
        ) : null}
        <div className="mt-2 grid w-full grid-cols-3 gap-x-2 gap-y-3">
          {rest.map((icon, i) => iconButton(icon, i + 1, "mobile"))}
        </div>
      </div>
    );
  }

  return (
    /* absolute, not relative: the icon layer must not consume layout height,
       otherwise it pushes the centered desktop hero out of the viewport. */
    <div className="absolute inset-0">
      {desktopIcons.map((icon, i) => (
        <Draggable
          key={icon.label}
          storageKey={`df-icon-${i}`}
          anchor={icon.center ? { top: "50%", left: "50%" } : { top: `${90 + i * 104}px`, right: "2.5%" }}
        >
          {/* The accessible folder is centered on the desktop, both axes. */}
          <div className={`w-20 ${icon.center ? "-translate-x-1/2 -translate-y-1/2" : ""}`}>
            {iconButton(icon, i, "desktop")}
          </div>
        </Draggable>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Clock (local time)                                                  */
/* ------------------------------------------------------------------ */

/** Clock face. `className` carries the size so mobile can render it smaller. */
export function ClockCard({
  className = "h-[150px] w-[150px]",
}: { className?: string } = {}) {
  const now = useNow(1_000);

  const hands = useMemo(() => {
    if (!now) return null;
    const parts = now
      .toLocaleTimeString("en-GB", {
        timeZone: "Europe/Prague",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .split(":")
      .map(Number);
    const [h, m, s] = parts;
    const point = (angleDeg: number, len: number) => {
      const a = ((angleDeg - 90) * Math.PI) / 180;
      return { x: 50 + len * Math.cos(a), y: 50 + len * Math.sin(a) };
    };
    return {
      hour: point((h % 12) * 30 + m * 0.5, 22),
      minute: point(m * 6 + s * 0.1, 34),
      second: point(s * 6, 34),
    };
  }, [now]);

  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = ((i * 30 - 90) * Math.PI) / 180;
    const inner = i % 3 === 0 ? 4 : 6;
    return {
      x1: 50 + inner * Math.cos(a),
      y1: 50 + inner * Math.sin(a),
      x2: 50 + (48 - (i % 3 === 0 ? 4 : 2)) * Math.cos(a),
      y2: 50 + (48 - (i % 3 === 0 ? 4 : 2)) * Math.sin(a),
      major: i % 3 === 0,
    };
  });

  return (
      <div
        className={`${glassCardClass} flex ${className} items-center justify-center !p-3`}
        title="Místní čas — Praha"
      >
        <div className="relative h-full w-full">
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="rgba(255,255,255,0.45)"
              stroke="rgba(255,255,255,0.6)"
            />
            {ticks.map((t, i) => (
              <line
                key={i}
                x1={t.x1}
                y1={t.y1}
                x2={t.x2}
                y2={t.y2}
                stroke="rgba(0,0,0,0.35)"
                strokeWidth={t.major ? 2.5 : 1.2}
              />
            ))}
            <text
              x="50"
              y="26"
              textAnchor="middle"
              fontSize="8"
              fill="rgba(0,0,0,0.4)"
              fontWeight="600"
            >
              PRAHA
            </text>
            {hands && (
              <>
                <line
                  x1="50"
                  y1="50"
                  x2={hands.hour.x}
                  y2={hands.hour.y}
                  stroke="black"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <line
                  x1="50"
                  y1="50"
                  x2={hands.minute.x}
                  y2={hands.minute.y}
                  stroke="black"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <line
                  x1="50"
                  y1="50"
                  x2={hands.second.x}
                  y2={hands.second.y}
                  stroke="#FF3700"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </>
            )}
            <circle cx="50" cy="50" r="2.4" fill="black" />
          </svg>
        </div>
      </div>
  );
}

export function ClockWidget() {
  return (
    <Draggable storageKey="df-clock" anchor={{ top: "90px", left: "24px" }}>
      <ClockCard />
    </Draggable>
  );
}

/* ------------------------------------------------------------------ */
/* Calendar                                                            */
/* ------------------------------------------------------------------ */

const WEEKDAYS_LETTERS = ["N", "P", "Ú", "S", "Č", "P", "S"];

export function CalendarCard({
  className = "h-[152px] w-[152px]",
}: { className?: string } = {}) {
  const { openWindow } = useWindows();
  const now = useNow(3_600_000);

  if (!now) return null;
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weekdayLong = now
    .toLocaleDateString("cs-CZ", { weekday: "long" })
    .toUpperCase();

  return (
      <button
        onClick={() => openWindow("booking")}
        title="Naplánovat schůzku"
        className={`${glassCardClass} ${className} cursor-pointer !p-3.5 text-left transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]`}
      >
        <p className="text-[9px] font-bold uppercase tracking-[0.06em] text-accent">
          {weekdayLong}
        </p>
        <p className="text-[22px] font-semibold leading-none tracking-tight">{today}</p>
        <div className="mt-1 grid grid-cols-7 gap-x-[3px] gap-y-[1.5px] text-center text-[7.5px] leading-[10px] text-black/50">
          {WEEKDAYS_LETTERS.map((d, i) => (
            <span key={`w${i}`} className="font-semibold text-black/30">
              {d}
            </span>
          ))}
          {Array.from({ length: firstDow }).map((_, i) => (
            <span key={`b${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) =>
            d === today ? (
              <span
                key={d}
                className="mx-auto flex h-[11px] w-[11px] items-center justify-center rounded-full bg-black font-semibold text-white"
              >
                {d}
              </span>
            ) : (
              <span key={d}>{d}</span>
            ),
          )}
        </div>
      </button>
  );
}

export function CalendarWidget() {
  return (
    <Draggable storageKey="df-calendar" anchor={{ top: "90px", left: "194px" }}>
      <CalendarCard />
    </Draggable>
  );
}

/* ------------------------------------------------------------------ */
/* Music player                                                        */
/* ------------------------------------------------------------------ */

function fmt(t: number) {
  if (!isFinite(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MusicCard({
  className = "h-[150px] w-[320px]",
}: { className?: string } = {}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(30);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
    } else {
      void a.play();
    }
  };
  const skip = (d: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Math.min(Math.max(0, a.currentTime + d), a.duration || 0);
  };

  return (
      <div
        onClick={toggle}
        role="button"
        aria-label={playing ? "Pozastavit hudbu" : "Přehrát hudbu"}
        title={playing ? "Pozastavit hudbu" : "Přehrát hudbu"}
        className={`${glassCardClass} ${className} cursor-pointer !p-4 transition-transform duration-200 hover:scale-[1.015] active:scale-[0.985]`}
      >
        <audio
          ref={audioRef}
          src={music.src}
          loop
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 30)}
        />
        <div className="flex gap-3.5">
          <div className="relative">
            <MusicCover />
            {playing && (
              <div className="absolute -bottom-1.5 left-1/2 flex h-4 -translate-x-1/2 items-end gap-[2.5px] rounded-md bg-black/75 px-1.5 py-1">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="eq-bar block w-[2.5px] rounded-full bg-[#FF3700]"
                    style={{ height: "100%", animationDelay: `${i * 0.18}s`, animationDuration: `${0.75 + i * 0.09}s` }}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <p className="truncate text-[13px] font-semibold text-black/85">
              {music.title}
            </p>
            <p className="truncate text-[11px] text-black/45">{music.artist}</p>
            <p className="mt-0.5 text-[10px] font-medium text-black/35">
              {playing ? "Přehrává se — klikni pro pauzu" : "Klikni kamkoliv pro přehrání"}
            </p>
            <div className="mt-1.5 flex items-center gap-5 text-black/70">
              <button
                aria-label="Zpět o 10 sekund"
                onClick={(e) => {
                  e.stopPropagation();
                  skip(-10);
                }}
                className="transition-colors hover:text-black"
              >
                <SkipIcon back />
              </button>
              <button
                aria-label={playing ? "Pauza" : "Přehrát"}
                onClick={(e) => {
                  e.stopPropagation();
                  toggle();
                }}
                className="transition-colors hover:text-black"
              >
                {playing ? <PauseIcon /> : <PlayIcon />}
              </button>
              <button
                aria-label="Vpřed o 10 sekund"
                onClick={(e) => {
                  e.stopPropagation();
                  skip(10);
                }}
                className="transition-colors hover:text-black"
              >
                <SkipIcon />
              </button>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-black/10">
            <div
              className="h-[3px] rounded-full bg-black/55 transition-[width] duration-300"
              style={{ width: `${duration ? (time / duration) * 100 : 0}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[9px] tabular-nums text-black/35">
            <span>{fmt(time)}</span>
            <span>-{fmt(Math.max(0, duration - time))}</span>
          </div>
        </div>
      </div>
  );
}

export function MusicWidget() {
  return (
    <Draggable storageKey="df-music" anchor={{ top: "90px", left: "364px" }}>
      <MusicCard />
    </Draggable>
  );
}

function MusicCover() {
  return (
    <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-lg bg-[#1d1e26] shadow-inner">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={music.cover}
        alt="Krajinaske hudby"
        className="h-full w-full rounded-lg object-cover"
      />
    </div>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M8 5.14v13.72c0 .94 1.02 1.52 1.83 1.04l11.03-6.86a1.22 1.22 0 0 0 0-2.08L9.83 4.1C9.02 3.62 8 4.2 8 5.14Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <rect x="6" y="4" width="4.5" height="16" rx="1.2" />
      <rect x="13.5" y="4" width="4.5" height="16" rx="1.2" />
    </svg>
  );
}

function SkipIcon({ back = false }: { back?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 ${back ? "scale-x-[-1]" : ""}`}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 4V1L7.5 4.5 12 8V5a7 7 0 1 1-7 7H3a9 9 0 1 0 9-9Z" />
      <text
        x="12.6"
        y="15.4"
        textAnchor="middle"
        fontSize="7.4"
        fontWeight="700"
        fill="currentColor"
        stroke="none"
      >
        10
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Weather                                                             */
/* ------------------------------------------------------------------ */

type ForecastDay = { day: string; temp: number; code: number };

const DAY_CS = ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"];

function WeatherIcon({ code, className }: { code: number; className: string }) {
  if (code === 0 || code === 1)
    return <Sun className={`${className} text-[#FFB800]`} aria-hidden="true" />;
  if (code >= 51)
    return <CloudRain className={`${className} text-[#57A4F0]`} aria-hidden="true" />;
  return <Cloud className={`${className} text-[#A8B0B9]`} aria-hidden="true" />;
}

export function WeatherCard({
  className = "w-[320px]",
}: { className?: string } = {}) {
  const [days, setDays] = useState<ForecastDay[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${weather.latitude}` +
      `&longitude=${weather.longitude}&daily=temperature_2m_max,weather_code` +
      `&timezone=${encodeURIComponent(weather.timezone)}&forecast_days=7`;
    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((json) => {
        if (cancelled) return;
        const t: number[] = json.daily.temperature_2m_max;
        const c: number[] = json.daily.weather_code;
        setDays(
          t.slice(0, 7).map((temp, i) => ({
            day: DAY_CS[new Date(json.daily.time[i]).getDay()],
            temp: Math.round(temp),
            code: c[i] ?? 3,
          })),
        );
      })
      .catch(() => {
        if (!cancelled) setDays([...weather.fallback]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const data = days ?? weather.fallback;

  return (
      <div className={`${glassCardClass} ${className} !p-4`}>
        <p className="text-[10px] font-semibold text-black/55">
          {weather.city}
          {!days && <span className="ml-1 text-black/35">(offline data)</span>}
        </p>
        <div className="mt-2.5 grid grid-cols-7 gap-1 text-center">
          {data.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-[8px] font-semibold text-black/40">{d.day}</span>
              <WeatherIcon code={d.code} className="h-4 w-4" />
              <span className="text-[9px] font-medium tabular-nums text-black/55">
                {d.temp}°
              </span>
            </div>
          ))}
        </div>
      </div>
  );
}

export function WeatherWidget() {
  return (
    <Draggable storageKey="df-weather" anchor={{ top: "264px", left: "24px" }}>
      <WeatherCard />
    </Draggable>
  );
}

/* ------------------------------------------------------------------ */
/* Photo + Dock                                                        */
/* ------------------------------------------------------------------ */

export function PhotoCard({
  className = "h-[150px] w-[150px]",
}: { className?: string } = {}) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={identity.portrait}
      alt={identity.portraitAlt}
      draggable={false}
      width={150}
      height={150}
      className={`${className} rounded-2xl border border-white/45 object-cover shadow-[0_8px_32px_rgba(0,0,0,0.12)]`}
    />
  );
}

export function PhotoWidget() {
  return (
    <Draggable storageKey="df-photo" anchor={{ top: "404px", left: "24px" }}>
      <PhotoCard />
    </Draggable>
  );
}

export function DockBar() {
  const { openWindow } = useWindows();
  return (
      <div className={`${glassCardClass} !p-3`}>
        <div className="grid grid-cols-5 gap-1">
          <a
            href={`mailto:${identity.email}`}
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-[24%] border border-black/10 bg-white text-black shadow-sm transition-transform hover:-translate-y-0.5"
            title="E-mail"
            aria-label="E-mail"
          >
            <Mail className="h-5 w-5" aria-hidden="true" />
          </a>
          <a
            href={identity.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-[24%] bg-[#0A66C2] text-white shadow-sm transition-transform hover:-translate-y-0.5"
            title="LinkedIn"
            aria-label="LinkedIn"
          >
            <LinkedinIcon className="h-5 w-5" aria-hidden="true" />
          </a>
          <a
            href={identity.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-[24%] bg-gradient-to-b from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white shadow-sm transition-transform hover:-translate-y-0.5"
            title="Instagram"
            aria-label="Instagram"
          >
            <InstagramIcon className="h-5 w-5" aria-hidden="true" />
          </a>
          <button
            onClick={() => openWindow("terminal")}
            className="flex h-11 w-11 items-center justify-center rounded-[24%] bg-[#1d1e26] text-white shadow-sm transition-transform hover:-translate-y-0.5"
            title="Terminál"
            aria-label="Terminál"
          >
            <SquareTerminal className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            onClick={() => openWindow("booking")}
            className="flex h-11 w-11 items-center justify-center rounded-[24%] border border-black/10 bg-white text-black shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-red-300 active:scale-95"
            title="Kalendář - Naplánovat schůzku"
            aria-label="Kalendář"
          >
            <Calendar className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
  );
}

export function DockWidget() {
  return (
    /* bottom: 24px keeps the dock clear of the bottom-most desktop icon */
    <Draggable storageKey="df-dock" anchor={{ bottom: "24px", right: "48px" }}>
      <DockBar />
    </Draggable>
  );
}