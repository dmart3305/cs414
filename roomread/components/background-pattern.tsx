"use client";

import {
  Landmark,
  Utensils,
  Wine,
  Coffee,
  Church,
} from "lucide-react";

export function BackgroundPattern({ country }: { country: string }) {
  const iconsByCountry = {
    france: [Landmark, Wine, Utensils, Coffee, Church],
  };

  const ICONS = iconsByCountry[country as keyof typeof iconsByCountry];

  if (!ICONS) return null;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <div className="grid grid-cols-6 gap-20 rotate-[-25deg] scale-150 opacity-10">
        {Array.from({ length: 60 }).map((_, i) => {
          const Icon = ICONS[i % ICONS.length];
          return <Icon key={i} className="w-10 h-10 text-muted-foreground" />;
        })}
      </div>
    </div>
  );
}
