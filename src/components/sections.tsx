"use client";

import { InstagramIcon, LinkedinIcon } from "@/components/brand-icons";
import { useState } from "react";
import {
  ChevronDown,
  Clapperboard,
  Code2,
  Heart,
  Mail,
  Scissors,
  Users,
  type LucideIcon,
} from "lucide-react";
import { about, achievements, footer, identity, pillars, portfolio } from "@/data/site";
import { Reveal } from "@/components/Reveal";

/* ------------------------------------------------------------------ */
/* Achievements                                                        */
/* ------------------------------------------------------------------ */

const ACHIEVEMENT_ICONS: Record<string, LucideIcon> = {
  clapperboard: Clapperboard,
  scissors: Scissors,
  users: Users,
  code: Code2,
  heart: Heart,
};

export function AchievementsSection() {
  return (
    <section
      id={achievements.id}
      className="relative z-50 scroll-mt-24 bg-white px-6 py-20"
    >
      <div className="mx-auto max-w-[1060px]">
        <Reveal>
          <h2 className="mb-10 text-3xl font-extrabold tracking-tight">
            {achievements.heading}
          </h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {achievements.items.map((item, i) => {
            const Icon = ACHIEVEMENT_ICONS[item.icon] ?? Clapperboard;
            return (
              <Reveal key={item.title} delay={i * 80}>
                <div
                  id={item.id}
                  className="group flex scroll-mt-32 flex-col rounded-xl border border-black/[0.06] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-black/20"
                >
                  <div className="mb-4 flex h-20 w-full items-center justify-center rounded-xl border border-black/[0.04] bg-black/[0.02]">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-[24%] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_12px_rgba(0,0,0,0.25)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                      style={{ background: item.gradient }}
                    >
                      <Icon
                        className="h-7 w-7 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]"
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <p className="text-[15px] font-bold leading-snug">{item.title}</p>
                  <p className="mt-1 text-sm leading-snug text-black/55">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Pillar stack (sticky superpower windows)                            */
/* ------------------------------------------------------------------ */

function Pillar({ pillar, z }: { pillar: (typeof pillars)[number]; z: number }) {
  return (
    <div
      id={pillar.id}
      className="max-md:static max-md:mt-4 md:sticky z-10 flex h-auto w-full flex-col md:top-24 md:h-[calc(100dvh_-_6rem)]"
      style={{ zIndex: z }}
    >
      <div className="relative h-20 w-full shrink-0">
        <div className="absolute inset-x-0 bottom-[-32px] h-[72px] rounded-t-[30px] bg-[#e5e7eb]" />
        <div
          className="absolute left-0 top-0 h-20 w-[320px] bg-[#e5e7eb]"
          style={{
            clipPath:
              "path(\"M0 80 L0 32 Q0 2 30 2 L198 2 Q226 2 240 20 C254 36 264 40 300 40 L320 40 L320 80 Z\")",
          }}
        />
        <span className="absolute left-12 top-3 flex h-9 items-center text-[13px] font-bold uppercase tracking-[0.08em] text-black/50">
          {pillar.label}
        </span>
      </div>
      <div className="relative -mt-2 flex min-h-0 w-full flex-1 items-start overflow-hidden rounded-t-[28px] max-md:rounded-b-[28px] bg-gradient-to-b from-[#f7f8fa] via-[#f0f2f5] to-[#e7e9ed] shadow-[inset_0_2px_1px_rgba(255,255,255,0.35),0_-4px_16px_rgba(0,0,0,0.03)] md:items-center">
        <div className="mx-auto w-full max-w-[1100px] px-8 py-12 md:max-h-full md:overflow-y-auto md:px-12">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-black/35">
            {pillar.superpower}
          </p>
          <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="mb-4 max-w-md text-2xl font-bold leading-tight md:text-3xl">
                {pillar.heading}
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-black/60">
                {pillar.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {pillar.pills.map((pill) => (
                  <a
                    key={pill.label}
                    href={pill.href}
                    className="whitespace-nowrap rounded-full bg-[#57A4F0] px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#3E8FE4]"
                  >
                    {pill.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="transition-all duration-300 hover:-translate-y-1.5 [&:hover>.note-shadow]:shadow-[0_22px_48px_rgba(0,0,0,0.24)]">
              <div className="note-shadow rounded-[6px] shadow-[0_14px_30px_rgba(0,0,0,0.18)] transition-shadow duration-300">
                <div className="h-7 rounded-t-[6px] border border-b-0 border-[#d9b83a]/40 bg-gradient-to-b from-[#F4DA71] via-[#EACB4E] to-[#DFBA35]" />
                <div className="flex flex-col justify-between rounded-b-[6px] border border-t-0 border-white/60 bg-white/60 p-6 backdrop-blur-xl backdrop-saturate-150">
                  <ul className="space-y-4">
                    {pillar.note.map((item) => (
                      <li key={item.title}>
                        <p className="text-[15px] font-bold leading-snug text-black/85">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-sm leading-snug text-black/55 max-md:hidden">
                          {item.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PillarStack() {
  return (
    <div id="pillar-stack" className="relative bg-[#fafafa]">
      {pillars.map((p, i) => (
        <Pillar key={p.id} pillar={p} z={10 + i} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Portfolio (Praxe)                                                   */
/* ------------------------------------------------------------------ */

export function PortfolioSection() {
  return (
    <section
      id={portfolio.id}
      className="relative z-50 scroll-mt-24 border-t border-black/10 bg-white px-6 py-20"
    >
      <div className="mx-auto max-w-[1060px]">
        <Reveal>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-black/35">
            {portfolio.note}
          </p>
          <h2 className="mb-10 text-3xl font-extrabold tracking-tight">
            {portfolio.heading}
          </h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          {portfolio.items.map((item, i) => (
            <Reveal key={item.name} delay={i * 60}>
              <article
                className="group flex flex-col gap-3 rounded-xl border border-black/10 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-black/20"
              >
                <div className="flex items-baseline gap-3">
                  <div>
                    <span className="text-[15px] font-bold leading-snug">
                      {item.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-black/40">
                      {item.meta}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-black/55">
                  {item.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* About (about-me.txt window)                                         */
/* ------------------------------------------------------------------ */

export function AboutWindow() {
  const [futureOpen, setFutureOpen] = useState(false);
  return (
    /**
     * Dřív / Teď / Budoucnost. The section itself stays transparent so it melts
     * into the continuous white content background around it — the desktop
     * wallpaper must never appear behind this window.
     */
    <section
      id="about"
      className="relative z-50 mx-auto max-w-[1060px] scroll-mt-24 bg-white px-6 py-16"
    >
      <div className="overflow-hidden rounded-xl border border-black/15 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.10)] transition-shadow duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
        <div className="relative flex items-center gap-2 border-b border-black/10 bg-[#f5f5f5] px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57] transition-transform hover:scale-125" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e] transition-transform hover:scale-125" />
          <span className="h-3 w-3 rounded-full bg-[#28c840] transition-transform hover:scale-125" />
          <span className="absolute left-1/2 -translate-x-1/2 select-none text-xs font-medium text-black/55">
            {about.windowTitle}
          </span>
        </div>
        <div className="grid gap-10 p-10 md:grid-cols-2 md:p-14">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-black/40">
              {about.sections[0].label}
            </p>
            <p className="text-sm leading-relaxed text-black/60">
              {about.sections[0].text}
            </p>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-black/40">
              {about.sections[1].label}
            </p>
            <p className="text-sm leading-relaxed text-black/60">
              {about.sections[1].text}
            </p>
            <button
              onClick={() => setFutureOpen((v) => !v)}
              aria-expanded={futureOpen}
              className="mt-8 flex cursor-pointer items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-black/40 transition-colors hover:text-black/70"
            >
              {about.future.label}
              <ChevronDown
                className={`h-3 w-3 transition-transform duration-300 ${
                  futureOpen ? "rotate-180" : ""
                }`}
                strokeWidth={1.6}
                aria-hidden="true"
              />
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-500 ease-out"
              style={{ gridTemplateRows: futureOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="pt-3 text-sm leading-relaxed text-black/60">
                  {about.future.text}
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href="#dovednosti"
                className="rounded-full bg-[#57A4F0] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all duration-300 hover:bg-[#3E8FE4] hover:-translate-y-0.5"
              >
                Dovednosti
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CTA Section                                                         */
/* ------------------------------------------------------------------ */

export function CTASection() {
  return (
    <section
      id="cta"
      className="relative z-50 scroll-mt-24 bg-[#fafafa] px-6 py-20"
    >
      <div className="mx-auto max-w-[1060px]">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white p-8 md:p-12 shadow-[0_18px_50px_rgba(0,0,0,0.06)] transition-shadow duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.10)]">
            {/* Decorative gradient */}
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-red-400/10 to-red-600/5" />
            <div className="absolute -right-10 -top-10 h-20 w-20 rounded-full bg-gradient-to-br from-blue-400/10 to-blue-600/5" />
            <div className="relative">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                Neboj se kontaktovat
              </p>
              <h2 className="mb-4 text-3xl font-extrabold tracking-tight">
                Máte projekt?
              </h2>
              <p className="mb-6 max-w-lg text-base leading-relaxed text-black/55">
                Ať už jde o kreativní spolupráci, videoprodukci, marketing, nový produkt nebo zajímavou příležitost, napište mi.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:${identity.email}`}
                  className="rounded-lg bg-accent px-6 py-3 text-sm font-bold text-white shadow-md transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5"
                >
                  Napsat e-mail
                </a>
                <a
                  href="#portfolio"
                  className="rounded-lg border border-black/10 bg-white px-6 py-3 text-sm font-bold text-black shadow-sm transition-all duration-300 hover:border-black/20 hover:shadow-md hover:-translate-y-0.5"
                >
                  Zobrazit portfolio
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export function Footer() {
  return (
    <>
      <div className="relative z-40 bg-white">
        <footer id="contact" className="relative z-50 border-t border-black/10 px-6 py-16">
          <div className="mx-auto grid max-w-[1060px] gap-10 md:grid-cols-[1fr_auto_auto] md:gap-20">
            <div>
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[24%] border border-black/10 bg-white shadow-md">
                  <span className="font-clepto text-[22px] font-bold leading-none text-black">
                    {identity.initials[0]}
                  </span>
                </div>
                <div>
                  <p className="text-[15px] font-bold leading-snug">{identity.name}.</p>
                  <p className="text-[15px] leading-snug text-black/55">{identity.tagline}</p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2.5">
                <a
                  href={`mailto:${identity.email}`}
                  title="Gmail"
                  aria-label="E-mail"
                  className="flex h-10 w-10 items-center justify-center rounded-[22%] border border-black/10 bg-white text-black shadow-sm transition-transform duration-150 hover:-translate-y-1"
                >
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </a>
                <a
                  href={identity.linkedin}
                  title="LinkedIn"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-[22%] bg-[#0A66C2] text-white shadow-sm transition-transform duration-150 hover:-translate-y-1"
                >
                  <LinkedinIcon className="h-5 w-5" aria-hidden="true" />
                </a>
                <a
                  href={identity.instagram}
                  title="Instagram"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-[22%] bg-gradient-to-b from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white shadow-sm transition-transform duration-150 hover:-translate-y-1"
                >
                  <InstagramIcon className="h-5 w-5" aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2.5 text-sm font-medium">
              {footer.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="group relative inline-flex w-fit items-center gap-1.5"
                  target={link.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                >
                  <span className="text-black/70 transition-colors group-hover:text-black">
                    {link.label}
                  </span>
                  <span
                    className="relative h-4 w-4 overflow-hidden text-black/70 transition-colors group-hover:text-black"
                    aria-hidden="true"
                  >
                    <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out group-hover:translate-x-[150%]">
                      →
                    </span>
                    <span className="absolute inset-0 flex -translate-x-[150%] items-center justify-center transition-transform duration-300 ease-out group-hover:translate-x-0">
                      →
                    </span>
                  </span>
                  <span
                    className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-black transition-transform duration-300 ease-out group-hover:scale-x-100"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
            <div className="flex flex-col items-start gap-4">
              <p className="text-sm text-black/50">© {new Date().getFullYear()}</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
