"use client";

import { Award, Briefcase, Home, Mail, User } from "lucide-react";
import { hero, identity, navLinks } from "@/data/site";
import { useNow } from "@/lib/use-now";
import {
  CalendarCard,
  CalendarWidget,
  ClockCard,
  ClockWidget,
  DesktopIcons,
  DockBar,
  DockWidget,
  MenuBar,
  MusicCard,
  MusicWidget,
  PhotoCard,
  PhotoWidget,
  WeatherCard,
  WeatherWidget,
} from "@/components/widgets";

/* ------------------------------------------------------------------ */
/* Hero (desktop, centered behind widgets)                             */
/* ------------------------------------------------------------------ */

function HeroCenter() {
  return (
    /*
     * The Creative Portfolio folder owns the exact center of the desktop, so
     * the hero copy sits right underneath it — clear of the widget rows on the
     * left, the icon column on the right and the dock at the bottom.
     */
    <div className="pointer-events-none absolute inset-x-0 top-[calc(50%+110px)] flex justify-center px-6">
      <div className="max-w-4xl text-center">
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
/* Mobile desktop — the same OS, rearranged for a phone viewport       */
/* ------------------------------------------------------------------ */

/**
 * Mobile is not a different website: it is the same desktop environment
 * (wallpaper, menu bar, hero, folder icons, clock, calendar, music player,
 * weather, dock and every window) laid out so it fits the phone viewport.
 * Nothing is hidden — elements are scaled and repositioned instead.
 */
function MobileDesktop() {
  return (
    <div className="relative z-0 min-h-[100dvh] w-full overflow-hidden bg-white md:hidden">
      <Wallpaper />

      <div className="relative z-10 flex min-h-[100dvh] w-full flex-col px-3 pb-4 pt-9">
        <MenuBar />

        {/* Desktop hero, scaled down */}
        <div className="w-full text-center">
          <h1 className="text-[26px] font-extrabold leading-[1.08] tracking-tight">
            <span className="hero-line hero-line-1">{hero.line1}</span>
            <br />
            <span className="hero-line hero-line-2">
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
            </span>
          </h1>
          <p className="hero-line hero-line-3 mx-auto mt-3 max-w-md text-[13px] leading-relaxed text-black/55">
            {hero.description}
          </p>
        </div>

        {/* Desktop icons: Creative Portfolio centered, locked folders below */}
        <div className="mt-5 w-full">
          <DesktopIcons variant="mobile" />
        </div>

        {/* Desktop widgets, scaled */}
        <div className="mt-5 grid w-full grid-cols-3 gap-3">
          <ClockCard className="aspect-square w-full" />
          <CalendarCard className="aspect-square w-full" />
          <PhotoCard className="aspect-square w-full" />
        </div>

        <div className="mt-3 w-full">
          <MusicCard className="h-auto w-full" />
        </div>

        <div className="mt-3 w-full">
          <WeatherCard className="w-full" />
        </div>

        {/* Dock */}
        <div className="mt-auto w-full pt-4">
          <DockBar />
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
    <>
      {/**
       * Page structure:
       * 1) Desktop (md and up) — the OS-style hero with wallpaper, pinned to the
       *    top of the viewport while the white content area scrolls over it.
       * 2) Mobile — the exact same desktop environment, rearranged for a phone
       *    viewport so nothing is hidden and everything stays tappable.
       * 3) Every informational section below lives on one continuous white
       *    background, so the wallpaper never shows through again.
       */}
      <div className="relative z-0 hidden h-[100dvh] w-full overflow-hidden bg-white md:sticky md:top-0 md:block md:min-h-0">
        <Wallpaper />
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

      <MobileDesktop />
    </>
  );
}
