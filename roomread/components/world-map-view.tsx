"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Countries with their approximate positions on the world map image (percentage-based)
const AVAILABLE_COUNTRIES = [
  { slug: "france", name: "France", x: 47, y: 28 },
  { slug: "japan", name: "Japan", x: 85, y: 35 },
  { slug: "morocco", name: "Morocco", x: 44, y: 38 },
  { slug: "brazil", name: "Brazil", x: 30, y: 62 },
  { slug: "india", name: "India", x: 70, y: 42 },
  { slug: "germany", name: "Germany", x: 50, y: 26 },
  { slug: "thailand", name: "Thailand", x: 76, y: 48 },
];

interface ProgressItem {
  country_slug: string;
  category_slug: string;
  lesson_slug: string;
}

function getCountryHighestLevel(
  countrySlug: string,
  progress: ProgressItem[]
): "none" | "beginner" | "intermediate" | "advanced" {
  const countryProgress = progress.filter((p) => p.country_slug === countrySlug);

  if (countryProgress.length === 0) return "none";

  const hasAdvanced = countryProgress.some((p) => p.lesson_slug === "advanced");
  const hasIntermediate = countryProgress.some(
    (p) => p.lesson_slug === "intermediate"
  );
  const hasBeginner = countryProgress.some((p) => p.lesson_slug === "beginner");

  if (hasAdvanced) return "advanced";
  if (hasIntermediate) return "intermediate";
  if (hasBeginner) return "beginner";

  return "none";
}

function getLevelStyles(level: "none" | "beginner" | "intermediate" | "advanced") {
  switch (level) {
    case "advanced":
      return {
        bg: "bg-yellow-400",
        border: "border-yellow-600",
        shadow: "shadow-[0_0_12px_rgba(250,204,21,0.7)]",
        label: "Gold",
      };
    case "intermediate":
      return {
        bg: "bg-gray-300",
        border: "border-gray-400",
        shadow: "shadow-[0_0_12px_rgba(156,163,175,0.7)]",
        label: "Silver",
      };
    case "beginner":
      return {
        bg: "bg-amber-600",
        border: "border-amber-800",
        shadow: "shadow-[0_0_12px_rgba(217,119,6,0.7)]",
        label: "Bronze",
      };
    default:
      return {
        bg: "bg-gray-500",
        border: "border-gray-600",
        shadow: "",
        label: "Not Started",
      };
  }
}

export function WorldMapView() {
  const { data, isLoading } = useSWR("/api/progress", fetcher);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const progress: ProgressItem[] = data?.progress || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* World Map Container */}
      <div className="relative w-full aspect-[1516/768] rounded-xl overflow-hidden border border-border bg-[#a8c8dc]">
        {/* Map Image - tries multiple paths for compatibility */}
        <img
          src="/worldmap/worldmap.png"
          alt="World Map"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            // Fallback to alternate path if primary fails
            const img = e.currentTarget;
            if (img.src.includes("/worldmap/")) {
              img.src = "/images/worldmap.png";
            }
          }}
        />

        {/* Country Markers */}
        {AVAILABLE_COUNTRIES.map((country) => {
          const level = getCountryHighestLevel(country.slug, progress);
          const styles = getLevelStyles(level);
          const isHovered = hoveredCountry === country.slug;

          return (
            <div
              key={country.slug}
              className="absolute"
              style={{
                left: `${country.x}%`,
                top: `${country.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <Link href={`/protected/country/${country.slug}`}>
                <div
                  className={`
                    relative cursor-pointer transition-all duration-200
                    ${isHovered ? "scale-150 z-20" : "scale-100 z-10"}
                  `}
                  onMouseEnter={() => setHoveredCountry(country.slug)}
                  onMouseLeave={() => setHoveredCountry(null)}
                >
                  {/* Pulse animation for countries with progress */}
                  {level !== "none" && (
                    <div
                      className={`absolute inset-0 rounded-full ${styles.bg} animate-ping opacity-40`}
                      style={{ width: "24px", height: "24px", margin: "-4px" }}
                    />
                  )}
                  
                  {/* Marker dot */}
                  <div
                    className={`
                      w-4 h-4 rounded-full border-2
                      ${styles.bg} ${styles.border} ${styles.shadow}
                    `}
                  />

                  {/* Tooltip on hover */}
                  {isHovered && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap">
                      <div className="bg-card border border-border rounded-lg px-3 py-1.5 shadow-lg">
                        <p className="text-sm font-medium text-foreground">
                          {country.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {styles.label}
                        </p>
                      </div>
                      {/* Arrow */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                        <div className="border-4 border-transparent border-t-border" />
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-4 md:gap-6">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-yellow-400 border-2 border-yellow-600 shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
          <span className="text-sm text-muted-foreground">Gold (Advanced)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-gray-300 border-2 border-gray-400 shadow-[0_0_8px_rgba(156,163,175,0.6)]" />
          <span className="text-sm text-muted-foreground">Silver (Intermediate)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-amber-600 border-2 border-amber-800 shadow-[0_0_8px_rgba(217,119,6,0.6)]" />
          <span className="text-sm text-muted-foreground">Bronze (Beginner)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-gray-500 border-2 border-gray-600" />
          <span className="text-sm text-muted-foreground">Not Started</span>
        </div>
      </div>

      {/* Stats summary */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {(["advanced", "intermediate", "beginner", "none"] as const).map((level) => {
          const count = AVAILABLE_COUNTRIES.filter(
            (c) => getCountryHighestLevel(c.slug, progress) === level
          ).length;
          const styles = getLevelStyles(level);

          return (
            <div
              key={level}
              className="rounded-lg border border-border bg-card p-4 text-center"
            >
              <div
                className={`mx-auto mb-2 h-8 w-8 rounded-full border-2 ${styles.bg} ${styles.border} ${styles.shadow}`}
              />
              <div className="text-2xl font-bold text-foreground">{count}</div>
              <div className="text-xs text-muted-foreground capitalize">
                {level === "none" ? "Not Started" : level}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
