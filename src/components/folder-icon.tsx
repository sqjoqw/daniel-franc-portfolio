"use client";

import { useId } from "react";

/**
 * Sdílené ikony pracovní plochy. Zvlášť od widgets/windows, aby je mohly
 * používat obě strany bez kruhového importu.
 */

export function FolderIcon({
  className = "h-14 w-14",
  color,
}: {
  className?: string;
  color?: "blue" | "red";
}) {
  const uid = useId().replace(/:/g, "");
  const gradTop = `fld-t-${uid}`;
  const gradBody = `fld-b-${uid}`;
  const isRed = color === "red";
  const topColor = isRed ? "#FF5F57" : "#9BD2FF";
  const topColorEnd = isRed ? "#DA2A45" : "#63ACFA";
  const bodyColor = isRed ? "#FF3B30" : "#7EC1FF";
  const bodyColorEnd = isRed ? "#BD2230" : "#3D8EF7";
  return (
    <svg viewBox="0 0 56 56" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradBody} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={bodyColor} />
          <stop offset="1" stopColor={bodyColorEnd} />
        </linearGradient>
        <linearGradient id={gradTop} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={topColor} />
          <stop offset="1" stopColor={topColorEnd} />
        </linearGradient>
      </defs>
      <path
        d="M4 14c0-2.2 1.8-4 4-4h13l5 5h22c2.2 0 4 1.8 4 4v27c0 2.2-1.8 4-4 4H8c-2.2 0-4-1.8-4-4V14Z"
        fill={`url(#${gradTop})`}
      />
      <path
        d="M4 20h48v25c0 2.2-1.8 4-4 4H8c-2.2 0-4-1.8-4-4V20Z"
        fill={`url(#${gradBody})`}
      />
      <path d="M4 20h48v2H4z" fill="#fff" opacity="0.35" />
    </svg>
  );
}

/** Ikona „Tento počítač" — stylizovaný desktopový počítač ve stylu ikon složek. */
export function PCIcon({ className = "h-14 w-14" }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const gradScreen = `pc-s-${uid}`;
  const gradBody = `pc-b-${uid}`;
  return (
    <svg viewBox="0 0 56 56" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradBody} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7EC1FF" />
          <stop offset="1" stopColor="#3D8EF7" />
        </linearGradient>
        <linearGradient id={gradScreen} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9BD2FF" />
          <stop offset="1" stopColor="#63ACFA" />
        </linearGradient>
      </defs>
      {/* Monitor */}
      <rect x="4" y="8" width="48" height="32" rx="4" fill={`url(#${gradBody})`} />
      <rect x="7" y="11" width="42" height="26" rx="2.5" fill={`url(#${gradScreen})`} />
      {/* Obrazovka — accent detail */}
      <circle cx="28" cy="24" r="6.5" fill="#fff" opacity="0.9" />
      <circle cx="28" cy="24" r="3.2" fill="#FF3700" />
      {/* Stojan */}
      <rect x="24" y="40" width="8" height="6" rx="1" fill="#3D8EF7" />
      <rect x="16" y="45" width="24" height="4" rx="2" fill="#2F74D6" />
    </svg>
  );
}
