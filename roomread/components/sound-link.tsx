"use client";

import Link from "next/link";
import { useSound } from "@/lib/use-sound";
import { ReactNode } from "react";

export function SoundLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const { play } = useSound();

  return (
    <Link
      href={href}
      onClick={() => play("click")}
      className={className}
    >
      {children}
    </Link>
  );
}