"use client";

import { InstagramIcon, LinkedinIcon } from "@/components/brand-icons";
import { FolderIcon, PCIcon } from "@/components/folder-icon";
import {
  Award,
  Briefcase,
  Calendar,
  Home,
  Mail,
  SquareTerminal,
  User,
} from "lucide-react";
import { desktopIcons, hero, identity, navLinks } from "@/data/site";
import { useNow } from "@/lib/use-now";
import {
  CalendarWidget,
  ClockWidget,
  DesktopIcons,
  DockWidget,
  MenuBar,
  MusicWidget,
  PhotoWidget,
  WeatherWidget,
  glassCardClass,
} from "@/components/widgets";
import { useWindows } from "@/components/windows";

/* ------------------------------------------------------------------ */
/* Hero (desktop, centered behind widgets)                             */
/* ------------------------------------------------------------------ */

function HeroCenter() {
  return (
    <div className="pointer-events-none flex h-full items-center justify-center px-6">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl 2xl:text-6xl">
          <span className="hero-line hero-line-1">{hero.line1}</span>
          <br />
          <span className="hero-line hero-line-2">
            {hero.line2Pre}
            <a
              href={identity.school.url}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto underline decoration-black/20 decoration-[3px] underline-offset-[6px] transition-colors hover:decoration-black/60"
            >
              {hero.line2Link}
            </a>
            {hero.line2Post}
          </span>
        </h1>
        <p className="hero-line hero-line-3 mx-auto mt-6 max-w-xl text-base leading-relaxed text-black/50">
          {hero.description}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Wallpaper (photo + white veil + animated noise gradient)            */
/* ------------------------------------------------------------------ */

function Wallpaper() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/photobg.jpeg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="wallpaper-veil absolute inset-0" />
      <div className="wallpaper-noise absolute inset-0" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile stack                                                        */
/* ------------------------------------------------------------------ */

function MobileStack() {
  const { openWindow } = useWindows();
  const today = new Date();
  return (
    <div className="flex h-full flex-col px-4 pb-4 pt-4">
      {/* Header card */}
      <div className={`${glassCardClass} !p-4 mb-3`}>
        <h1 className="text-2xl font-extrabold leading-[1.08] tracking-tight">
          {hero.line1}
          <br />
          {hero.line2Pre}
          <a
            href={identity.school.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-black/20 decoration-[3px] underline-offset-[6px] transition-colors hover:decoration-black/60"
          >
            {hero.line2Link}
          </a>
          {hero.line2Post}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-black/55">{hero.description}</p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <button
          onClick={() => openWindow("booking")}
          title="Naplánovat schůzku"
          className={`${glassCardClass} flex h-24 cursor-pointer flex-col justify-center !p-3 text-left transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]`}
        >
          <p className="text-[9px] font-bold uppercase tracking-[0.06em] text-accent">
            {today.toLocaleDateString("cs-CZ", { weekday: "long" })}
          </p>
          <p className="text-2xl font-semibold leading-none tracking-tight">
            {today.getDate()}
          </p>
          <p className="mt-1 text-[10px] text-black/45">Klikni a naplánuj schůzku</p>
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={identity.portrait}
          alt={identity.portraitAlt}
          width={80}
          height={80}
          className="h-24 w-full rounded-xl border border-white/45 object-cover shadow-[0_4px_16px_rgba(0,0,0,0.10)]"
        />
      </div>

      {/* Desktop icons - scrollable row */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-thin">
        {desktopIcons.map((icon) => (
          <button
            key={icon.label}
            onClick={() => {
              if (icon.type === "portfolio") {
                openWindow("portfolio");
              } else if (icon.type === "settings") {
                openWindow("settings");
              } else if (icon.type === "skill" && icon.target) {
                openWindow("folder", icon.target);
              }
            }}
            className="flex-shrink-0 flex w-16 flex-col items-center gap-1 focus:outline-none focus:ring-2 focus:ring-accent rounded-lg transition-transform duration-200 hover:scale-105 active:scale-95"
            title={icon.description ?? icon.label}
          >
            {icon.type === "settings" ? (
              <PCIcon className="h-10 w-10" />
            ) : (
              <FolderIcon
                className="h-10 w-10"
                color={icon.type === "portfolio" ? "red" : "blue"}
              />
            )}
            <span className="block w-16 truncate text-center text-[9px] font-medium text-black/70">
              {icon.label}
            </span>
          </button>
        ))}
      </div>

      {/* Dock */}
      <div className={`${glassCardClass} !p-2 mt-auto`}>
        <div className="grid grid-cols-5 gap-1">
          <a
            href={`mailto:${identity.email}`}
            className="flex items-center justify-center"
            aria-label="E-mail"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-[20%] border border-black/10 bg-white text-black shadow-sm">
              <Mail className="h-4 w-4" aria-hidden="true" />
            </span>
          </a>
          <a
            href={identity.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
            aria-label="LinkedIn"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-[20%] bg-[#0A66C2] text-white shadow-sm">
              <LinkedinIcon className="h-4 w-4" aria-hidden="true" />
            </span>
          </a>
          <a
            href={identity.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
            aria-label="Instagram"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-[20%] bg-gradient-to-b from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white shadow-sm">
              <InstagramIcon className="h-4 w-4" aria-hidden="true" />
            </span>
          </a>
          <button
            onClick={() => openWindow("terminal")}
            className="flex items-center justify-center"
            aria-label="Terminál"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-[20%] bg-[#1d1e26] text-white shadow-sm">
              <SquareTerminal className="h-4 w-4" aria-hidden="true" />
            </span>
          </button>
          <button
            onClick={() => openWindow("booking")}
            className="flex items-center justify-center"
            aria-label="Kalendář"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-[20%] border border-black/10 bg-white text-black shadow-sm">
              <Calendar className="h-4 w-4" aria-hidden="true" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Floating dock nav                                                   */
/* ------------------------------------------------------------------ */

const NAV_STYLES: Record<string, string> = {
  home: "border border-black/10 bg-white text-black hover:bg-[#f3f3f3]",
  work: "text-white bg-gradient-to-b from-[#5FB0FF] to-[#2E7CF6]",
  achievements: "text-white bg-gradient-to-b from-[#C489FB] to-[#8231E8]",
  about: "text-white bg-gradient-to-b from-[#FF7A93] to-[#F92D50]",
  contact: "text-white bg-gradient-to-b from-[#4FDE73] to-[#1FB84A]",
};

const NAV_ICONS: Record<string, React.ReactNode> = {
  home: <Home className="h-1/2 w-1/2" aria-hidden="true" />,
  work: <Briefcase className="h-1/2 w-1/2" aria-hidden="true" />,
  achievements: <Award className="h-1/2 w-1/2" aria-hidden="true" />,
  about: <User className="h-1/2 w-1/2" aria-hidden="true" />,
  contact: <Mail className="h-1/2 w-1/2" aria-hidden="true" />,
};

export function FloatingNav() {
  const today = useNow(3_600_000);
  return (
    <div className="pointer-events-none sticky top-4 z-[60] flex justify-center px-4 py-3 md:-mt-32 md:h-32 md:items-start md:py-0">
      <div className="pointer-events-auto flex items-start gap-2.5 rounded-2xl border border-white/45 bg-white/30 px-3 pb-2 pt-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-2xl backdrop-saturate-150">
        {navLinks.map((link, i) => (
          <div key={link.label} className="flex items-start gap-2.5">
            {i === 1 && <div className="mt-0.5 h-8 w-px self-start bg-black/15" />}
            <div className="relative aspect-square" style={{ width: 40 }}>
              <a
                aria-label={link.label}
                title={link.label}
                href={link.href}
                className={`flex h-full w-full items-center justify-center rounded-[24%] shadow-[0_2px_6px_rgba(0,0,0,0.25)] transition-[filter,background-color] hover:brightness-105 ${
                  NAV_STYLES[link.icon] ?? NAV_STYLES.home
                }`}
              >
                {NAV_ICONS[link.icon] ?? NAV_ICONS.home}
              </a>
            </div>
          </div>
        ))}
        <div className="relative aspect-square" style={{ width: 40 }}>
          <a
            aria-label="Napiš mi e-mail"
            title="Napiš mi"
            href={`mailto:${identity.email}`}
            className="block h-full w-full"
          >
            <span className="flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[24%] border border-black/10 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
              <span className="text-[9px] font-bold uppercase leading-tight text-[#ff3b30]">
                {today ? today.toLocaleDateString("cs-CZ", { weekday: "short" }) : ""}
              </span>
              <span className="text-[20px] font-semibold leading-none text-black">
                {today ? today.getDate() : ""}
              </span>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Desktop screen                                                      */
/* ------------------------------------------------------------------ */

export function Desktop() {
  return (
    /* Main container: pinned to the top of the viewport on desktop so the whole
       desktop (icons + widgets) sits ON the wallpaper, never below it. Sections
       then scroll over it. NOTE: no ancestor may set overflow, otherwise
       position: sticky stops working against the viewport. */
    <div className="relative z-0 mx-auto aspect-[16/9] w-full max-w-[177.78vh] overflow-hidden bg-white md:sticky md:top-0 md:z-0 md:aspect-auto md:h-[100dvh] md:min-h-0 md:max-w-none">
      <Wallpaper />

      {/* Desktop view - hidden on mobile */}
      <div className="hidden h-full w-full overflow-hidden md:block">
        <MenuBar />
        <DesktopIcons />
        <ClockWidget />
        <CalendarWidget />
        <MusicWidget />
        <WeatherWidget />
        <PhotoWidget />
        <DockWidget />
        <HeroCenter />
      </div>

      {/* Mobile stack - visible on mobile */}
      <div className="flex h-full flex-col px-4 pb-6 pt-4 md:hidden">
        <MobileStack />
      </div>
    </div>
  );
}
