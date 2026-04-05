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
    top: 8 + Math.random() * 84,
    delay: i * 150 + Math.random() * 100,
    scale: 1.4 + Math.random() * 0.8,
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

    const count = 6 + Math.floor(Math.random() * 4); // 6-9 planes
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
          {/* Plane icon from SVG Repo */}
          <svg
            viewBox="0 0 24 24"
            width="72"
            height="72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M2 11.5H1.5H2ZM15.8737 13.8322C16.0572 13.6258 16.0386 13.3098 15.8322 13.1263C15.6258 12.9428 15.3098 12.9614 15.1263 13.1678L15.8737 13.8322ZM11.5 18L11.8536 18.3535L11.8639 18.3431L11.8737 18.3322L11.5 18ZM10.382 18.5528V19.0528H10.4033L10.4245 19.0509L10.382 18.5528ZM11.3938 13.7812C11.5491 13.5529 11.49 13.2419 11.2616 13.0866C11.0333 12.9313 10.7223 12.9905 10.567 13.2188L11.3938 13.7812ZM11.2995 6.41181L10.8951 6.70589V6.70589L11.2995 6.41181ZM8.80665 7.47883L9.24559 7.2394L8.80665 7.47883ZM4.87907 7.61492L4.41762 7.80745L4.87907 7.61492ZM5.2119 14.7848L5.0262 15.249L5.2119 14.7848ZM8.51673 17.1219L8.10331 16.8407L8.51673 17.1219ZM8.40385 17.3707L8.89522 17.4632L8.40385 17.3707ZM21.2764 14.0528L20.8292 14.2764L21.2764 14.0528ZM20.1056 12.8292L20.8292 14.2764L21.7236 13.8292L21 12.3819L20.1056 12.8292ZM5.3976 14.3205L2.8143 13.2872L2.44291 14.2157L5.0262 15.249L5.3976 14.3205ZM2.5 12.8229V11.5H1.5V12.8229H2.5ZM2.5 11.5V7.99998H1.5V11.5H2.5ZM3 7.49998H3.95617V6.49998H3V7.49998ZM4.41762 7.80745L5.78198 11.0776L6.70488 10.6925L5.34052 7.4224L4.41762 7.80745ZM7.16632 12H18.7639V11H7.16632V12ZM15.1263 13.1678L11.1263 17.6678L11.8737 18.3322L15.8737 13.8322L15.1263 13.1678ZM10.382 18.0528H9.38743V19.0528H10.382V18.0528ZM8.93015 17.4031L11.3938 13.7812L10.567 13.2188L8.10331 16.8407L8.93015 17.4031ZM9.38743 18.0528C9.07074 18.0528 8.83871 17.7634 8.89522 17.4632L7.91249 17.2782C7.7421 18.1831 8.43325 19.0528 9.38743 19.0528V18.0528ZM11.1464 17.6464C10.8691 17.9237 10.8114 17.9723 10.7636 17.9959C10.7279 18.0135 10.6849 18.0251 10.3394 18.0546L10.4245 19.0509C10.6971 19.0277 10.9631 19.0128 11.2069 18.8923C11.4386 18.7777 11.6309 18.5762 11.8536 18.3535L11.1464 17.6464ZM20.382 15H13.5V16H20.382V15ZM9.61997 15H8.92585V16H9.61997V15ZM15.4044 11.2059L11.7039 6.11772L10.8951 6.70589L14.5956 11.7941L15.4044 11.2059ZM10.4908 5.49998H9.68454V6.49998H10.4908V5.49998ZM8.3677 7.71826L10.5611 11.7394L11.4389 11.2606L9.24559 7.2394L8.3677 7.71826ZM9.68454 5.49998C8.54595 5.49998 7.83564 5.49998 7.30498 5.65044C6.75609 5.80573 6.37966 6.10971 6.08706 6.57543L6.93768 7.10788C7.09334 6.85916 7.28251 6.70787 7.58321 6.61944C7.90214 6.52617 8.41937 6.49998 9.68454 6.49998V5.49998ZM6.08706 6.57543C5.85309 6.94929 5.71668 7.37435 5.34052 7.4224L5.46822 8.41448C6.36944 8.29659 6.70888 7.57089 6.93768 7.10788L6.08706 6.57543ZM3.95617 7.49998C4.5979 7.49998 4.78613 7.54643 4.87907 7.61492L5.47239 6.80001C5.14085 6.55784 4.71399 6.49998 3.95617 6.49998V7.49998ZM4.87907 7.61492C4.97083 7.68252 5.10305 7.85718 5.34052 8.41448L6.25898 8.02549C6.04437 7.51562 5.81293 7.04428 5.47239 6.80001L4.87907 7.61492ZM2.5 7.99998C2.5 7.72384 2.72386 7.49998 3 7.49998V6.49998C2.17157 6.49998 1.5 7.17155 1.5 7.99998H2.5ZM1.5 11.5C1.5 11.9862 1.5 12.4004 1.52948 12.7515L2.52584 12.6693C2.5 12.3601 2.5 11.9818 2.5 11.5H1.5ZM2.8143 13.2872C2.63988 13.2183 2.5 13.0512 2.5 12.8229H1.5C1.5 13.4997 1.94617 14.0736 2.44291 14.2157L2.8143 13.2872ZM18.7639 12C19.6092 12 20.3316 12.5166 20.6708 13.2656L21.5652 12.8183C21.0767 11.7599 20.0007 11 18.7639 11V12ZM20.382 16C21.2766 16 22 15.2765 22 14.382H21C21 14.7241 20.7241 15 20.382 15V16ZM22 14.382C22 13.4874 21.2766 12.7639 20.382 12.7639V13.7639C20.7241 13.7639 21 14.0399 21 14.382H22ZM20.382 12.7639H20.1056V13.7639H20.382V12.7639ZM13.5 16H9.61997V15H13.5V16ZM5.78198 11.0776C6.10384 11.8626 6.72972 12 7.16632 12V11C6.9972 11 6.71882 10.9452 6.70488 10.6925L5.78198 11.0776ZM1.52948 12.7515C1.55462 13.0421 1.63516 13.2095 1.70978 13.3015L2.48692 12.6661C2.49073 12.6708 2.50085 12.6886 2.52584 12.6693L1.52948 12.7515Z" fill="var(--primary)" />
            <path d="M10.5 15.5H12.5" stroke="var(--accent)" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </div>
      ))}
    </div>
  );
}
