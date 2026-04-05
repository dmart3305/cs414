"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PlaneTakeoff } from "lucide-react";

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

    const count = 5 + Math.floor(Math.random() * 4); // 5-8 planes
    setPlanes(generatePlanes(count));
    setVisible(true);

    // Hide after the longest possible animation completes
    timeoutRef.current = setTimeout(() => {
      setVisible(false);
      setPlanes([]);
    }, 2800);

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
          <PlaneTakeoff
            size={48}
            strokeWidth={1.5}
            color="var(--primary)"
            style={{ filter: "drop-shadow(0 2px 6px rgba(13,115,119,0.3))" }}
          />
        </div>
      ))}
    </div>
  );
}
