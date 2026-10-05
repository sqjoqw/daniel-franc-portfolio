"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Anchor = {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
};

const SNAP_THRESHOLD = 40; // px — below this, snap back to origin
const SNAP_DURATION_MS = 380;

/**
 * Dragging for desktop icons and widgets: the element keeps its CSS anchor
 * (top/left/right/bottom) and we translate it. Position survives reloads
 * via localStorage. A real drag suppresses the following click.
 *
 * Magnetic snap-back: released near where the drag started (or near the
 * original anchor) → the element smoothly animates back via a CSS transition
 * instead of an abrupt reposition.
 */
export function useDraggable(storageKey: string, anchor: Anchor) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [snapping, setSnapping] = useState(false);
  const start = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);
  const preDrag = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragged = useRef(false);
  const snapTimer = useRef<number | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) setOffset(JSON.parse(raw));
      } catch {
        /* ignore */
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [storageKey]);

  const cancelSnap = useCallback(() => {
    if (snapTimer.current !== null) {
      clearTimeout(snapTimer.current);
      snapTimer.current = null;
    }
    setSnapping(false);
  }, []);

  /** Animate `to`-wards using a CSS transition; state settles immediately. */
  const snapBack = useCallback(
    (to: { x: number; y: number }) => {
      if (snapTimer.current !== null) clearTimeout(snapTimer.current);
      setSnapping(true);
      setOffset(to);
      try {
        localStorage.setItem(storageKey, JSON.stringify(to));
      } catch {
        /* ignore */
      }
      snapTimer.current = window.setTimeout(() => {
        snapTimer.current = null;
        setSnapping(false);
      }, SNAP_DURATION_MS);
    },
    [storageKey],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === "touch") return; // touch scroll wins on mobile
      cancelSnap();
      // NOTE: the pointer is *not* captured here. Capturing on pointerdown makes
      // Chromium retarget the following click to this wrapper, so the inner
      // button never receives the single click that must open it immediately.
      preDrag.current = { x: offset.x, y: offset.y };
      start.current = { px: e.clientX, py: e.clientY, ox: offset.x, oy: offset.y };
      dragged.current = false;
    },
    [offset, cancelSnap],
  );

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!start.current) return;
    const dx = e.clientX - start.current.px;
    const dy = e.clientY - start.current.py;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      if (!dragged.current) {
        // Capture only once the gesture is definitely a drag — from here on
        // move events keep coming even when the pointer leaves the element.
        dragged.current = true;
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      }
    } else if (!dragged.current) {
      return; // below the drag threshold: treat as a click/tap
    }
    setOffset({ x: start.current.ox + dx, y: start.current.oy + dy });
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!start.current) return;
      start.current = null;
      if ((e.currentTarget as HTMLElement).hasPointerCapture?.(e.pointerId)) {
        (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
      }

      if (!dragged.current) return; // it was a click, not a drag
      dragged.current = false;

      // Magnetic snap-back: released near where this drag started (or near the
      // original anchor position) → smoothly return instead of staying displaced.
      const fromPre = Math.hypot(offset.x - preDrag.current.x, offset.y - preDrag.current.y);
      const fromOrigin = Math.hypot(offset.x, offset.y);
      if (fromPre < SNAP_THRESHOLD) {
        snapBack(preDrag.current);
      } else if (fromOrigin < SNAP_THRESHOLD) {
        snapBack({ x: 0, y: 0 });
      } else {
        try {
          localStorage.setItem(storageKey, JSON.stringify(offset));
        } catch {
          /* ignore */
        }
      }
    },
    [offset, snapBack, storageKey],
  );

  // Suppress click after a real drag so icons/widgets don't navigate.
  const onClickCapture = useCallback((e: React.MouseEvent) => {
    if (dragged.current) {
      e.preventDefault();
      e.stopPropagation();
      dragged.current = false;
    }
  }, []);

  const anchorStyle: React.CSSProperties = { ...anchor };
  const transform =
    offset.x !== 0 || offset.y !== 0 ? `translate(${offset.x}px, ${offset.y}px)` : undefined;
  if (transform) anchorStyle.transform = transform;
  if (snapping) {
    anchorStyle.transition = `transform ${SNAP_DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
  }

  return {
    anchorStyle,
    dragHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onClickCapture,
    },
  };
}
