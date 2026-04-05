"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Plane {
  id: number;
  top: number;        // % from top
  delay: number;      // ms
  scale: number;
  speed: number;      // ms duration
  flip: boolean;      // mirror so it faces travel direction
}

function generatePlanes(count: number): Plane[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    top: 10 + Math.random() * 80,
    delay: i * 180 + Math.random() * 120,
    scale: 0.7 + Math.random() * 0.7,
    speed: 900 + Math.random() * 500,
    flip: false,
  }));
}

export function PlaneTransition() {
  const pathname = usePathname();
  const [planes, setPlanes] = useState<Plane[]>([]);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    // Skip the very first render (initial page load)
    if (prevPath.current === null) {
      prevPath.current = pathname;
      return;
    }
    // Only animate on actual route changes
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const count = 3 + Math.floor(Math.random() * 3); // 3-5 planes
    setPlanes(generatePlanes(count));
    setVisible(true);

    // Hide after the longest possible animation completes
    timeoutRef.current = setTimeout(() => {
      setVisible(false);
      setPlanes([]);
    }, 2200);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pathname]);

  if (!visible || planes.length === 0) return null;

  return (
    <div
      className="plane-transition-overlay"
      aria-hidden="true"
    >
      {planes.map((plane) => (
        <div
          key={plane.id}
          className="plane-icon"
          style={{
            top: `${plane.top}%`,
            animationDelay: `${plane.delay}ms`,
            animationDuration: `${plane.speed}ms`,
            transform: `scale(${plane.scale})`,
          }}
        >
          {/* SVG plane facing right */}
          <svg
            viewBox="0 0 64 64"
            width="48"
            height="48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Body */}
            <path
              d="M4 32 C4 28, 28 20, 44 20 L58 26 C60 27, 60 29, 58 30 L44 30 C44 30, 36 42, 28 42 L20 42 C18 42, 18 40, 20 39 L28 36 L4 36 Z"
              fill="var(--primary)"
              opacity="0.9"
            />
            {/* Wing */}
            <path
              d="M24 30 L44 20 L48 24 L28 36 Z"
              fill="var(--accent)"
              opacity="0.85"
            />
            {/* Tail fin */}
            <path
              d="M4 32 L4 26 L12 28 L12 32 Z"
              fill="var(--accent)"
              opacity="0.85"
            />
            {/* Window */}
            <circle cx="38" cy="26" r="2.5" fill="var(--primary-foreground)" opacity="0.7" />
          </svg>
        </div>
      ))}
    </div>
  );
}
