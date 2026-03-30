"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Countries that have lessons available with their approximate positions on a simplified world view
const AVAILABLE_COUNTRIES = [
  { slug: "france", name: "France", x: 48, y: 32 },
  { slug: "japan", name: "Japan", x: 82, y: 38 },
  { slug: "morocco", name: "Morocco", x: 45, y: 42 },
  { slug: "brazil", name: "Brazil", x: 32, y: 62 },
  { slug: "india", name: "India", x: 70, y: 45 },
  { slug: "germany", name: "Germany", x: 50, y: 30 },
  { slug: "thailand", name: "Thailand", x: 75, y: 50 },
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
        fill: "#FFD700",
        stroke: "#B8860B",
        label: "Gold",
        glow: "drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))",
      };
    case "intermediate":
      return {
        fill: "#C0C0C0",
        stroke: "#808080",
        label: "Silver",
        glow: "drop-shadow(0 0 8px rgba(192, 192, 192, 0.6))",
      };
    case "beginner":
      return {
        fill: "#CD7F32",
        stroke: "#8B4513",
        label: "Bronze",
        glow: "drop-shadow(0 0 8px rgba(205, 127, 50, 0.6))",
      };
    default:
      return {
        fill: "#3A3A3E",
        stroke: "#2A2A2E",
        label: "Not Started",
        glow: "none",
      };
  }
}

export function WorldMapView() {
  const { data, isLoading } = useSWR("/api/progress", fetcher);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const progress: ProgressItem[] = data?.progress || [];

  useEffect(() => {
    setMapLoaded(true);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* SVG World Map */}
      <svg
        viewBox="0 0 100 70"
        className="w-full h-[400px] md:h-[500px] bg-[#1a1a2e] rounded-xl"
        style={{ filter: mapLoaded ? "none" : "blur(4px)" }}
      >
        {/* Simplified continent outlines */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#2a2a3e" strokeWidth="0.2" />
          </pattern>
        </defs>
        
        {/* Background grid */}
        <rect width="100" height="70" fill="url(#grid)" />
        
        {/* Simplified continents - decorative paths */}
        {/* North America */}
        <path
          d="M 5 15 Q 15 10, 25 15 Q 30 20, 28 30 Q 25 35, 20 38 Q 15 35, 10 30 Q 5 25, 5 15"
          fill="#2A2A3E"
          stroke="#3A3A4E"
          strokeWidth="0.3"
        />
        
        {/* South America */}
        <path
          d="M 25 45 Q 30 42, 35 48 Q 38 55, 35 65 Q 30 68, 28 65 Q 25 58, 25 45"
          fill="#2A2A3E"
          stroke="#3A3A4E"
          strokeWidth="0.3"
        />
        
        {/* Europe */}
        <path
          d="M 42 20 Q 50 18, 55 22 Q 58 25, 55 30 Q 50 32, 45 30 Q 42 28, 42 20"
          fill="#2A2A3E"
          stroke="#3A3A4E"
          strokeWidth="0.3"
        />
        
        {/* Africa */}
        <path
          d="M 42 35 Q 50 32, 58 38 Q 62 48, 55 60 Q 48 65, 42 58 Q 40 48, 42 35"
          fill="#2A2A3E"
          stroke="#3A3A4E"
          strokeWidth="0.3"
        />
        
        {/* Asia */}
        <path
          d="M 55 18 Q 70 15, 85 22 Q 90 30, 85 40 Q 75 45, 65 42 Q 58 38, 55 30 Q 54 24, 55 18"
          fill="#2A2A3E"
          stroke="#3A3A4E"
          strokeWidth="0.3"
        />
        
        {/* Australia */}
        <path
          d="M 78 55 Q 88 52, 92 58 Q 93 65, 88 68 Q 82 68, 78 63 Q 76 58, 78 55"
          fill="#2A2A3E"
          stroke="#3A3A4E"
          strokeWidth="0.3"
        />

        {/* Country markers */}
        {AVAILABLE_COUNTRIES.map((country) => {
          const level = getCountryHighestLevel(country.slug, progress);
          const styles = getLevelStyles(level);
          const isHovered = hoveredCountry === country.slug;

          return (
            <g key={country.slug}>
              {/* Marker */}
              <Link href={`/protected/country/${country.slug}`}>
                <circle
                  cx={country.x}
                  cy={country.y}
                  r={isHovered ? 3.5 : 2.5}
                  fill={styles.fill}
                  stroke={styles.stroke}
                  strokeWidth="0.5"
                  style={{
                    filter: level !== "none" ? styles.glow : "none",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setHoveredCountry(country.slug)}
                  onMouseLeave={() => setHoveredCountry(null)}
                />
              </Link>
              
              {/* Label on hover */}
              {isHovered && (
                <g>
                  <rect
                    x={country.x - 12}
                    y={country.y - 10}
                    width="24"
                    height="6"
                    rx="1"
                    fill="#1a1a2e"
                    fillOpacity="0.9"
                    stroke={styles.stroke}
                    strokeWidth="0.3"
                  />
                  <text
                    x={country.x}
                    y={country.y - 6}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="2.5"
                    fontWeight="500"
                  >
                    {country.name}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-4 md:gap-6">
        <div className="flex items-center gap-2">
          <div
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: "#FFD700", boxShadow: "0 0 8px rgba(255, 215, 0, 0.6)" }}
          />
          <span className="text-sm text-muted-foreground">Gold (Advanced)</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: "#C0C0C0", boxShadow: "0 0 8px rgba(192, 192, 192, 0.6)" }}
          />
          <span className="text-sm text-muted-foreground">Silver (Intermediate)</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: "#CD7F32", boxShadow: "0 0 8px rgba(205, 127, 50, 0.6)" }}
          />
          <span className="text-sm text-muted-foreground">Bronze (Beginner)</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: "#3A3A3E" }}
          />
          <span className="text-sm text-muted-foreground">Not Started</span>
        </div>
      </div>

      {/* Stats summary */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {["advanced", "intermediate", "beginner", "none"].map((level) => {
          const count = AVAILABLE_COUNTRIES.filter(
            (c) => getCountryHighestLevel(c.slug, progress) === level
          ).length;
          const styles = getLevelStyles(level as "none" | "beginner" | "intermediate" | "advanced");
          
          return (
            <div
              key={level}
              className="rounded-lg border border-border bg-card p-4 text-center"
            >
              <div
                className="mx-auto mb-2 h-8 w-8 rounded-full"
                style={{
                  backgroundColor: styles.fill,
                  boxShadow: level !== "none" ? `0 0 12px ${styles.fill}80` : "none",
                }}
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
