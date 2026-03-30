"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
} from "@vnedyalk0v/react19-simple-maps";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const geoUrl = "https://unpkg.com/world-atlas@2/countries-110m.json";

// Country name to slug mapping (matching our available countries)
const COUNTRY_NAME_TO_SLUG: Record<string, string> = {
  France: "france",
  Japan: "japan",
  Morocco: "morocco",
  Brazil: "brazil",
  India: "india",
  Germany: "germany",
  Thailand: "thailand",
};

// Countries with their coordinates for markers [longitude, latitude]
const COUNTRY_MARKERS: { slug: string; name: string; coordinates: [number, number] }[] = [
  { slug: "france", name: "France", coordinates: [2.2137, 46.2276] },
  { slug: "japan", name: "Japan", coordinates: [138.2529, 36.2048] },
  { slug: "morocco", name: "Morocco", coordinates: [-7.0926, 31.7917] },
  { slug: "brazil", name: "Brazil", coordinates: [-51.9253, -14.235] },
  { slug: "india", name: "India", coordinates: [78.9629, 20.5937] },
  { slug: "germany", name: "Germany", coordinates: [10.4515, 51.1657] },
  { slug: "thailand", name: "Thailand", coordinates: [100.9925, 15.870] },
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

function getLevelColor(level: "none" | "beginner" | "intermediate" | "advanced") {
  switch (level) {
    case "advanced":
      return "#FACC15"; // Gold/Yellow
    case "intermediate":
      return "#9CA3AF"; // Silver/Gray
    case "beginner":
      return "#D97706"; // Bronze/Amber
    default:
      return "#E5E7EB"; // Light gray for not started
  }
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
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

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
      <div className="relative w-full rounded-xl overflow-hidden border border-border bg-[#a8c8dc]">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 140,
            center: [0, 30] as [number, number],
          }}
          width={800}
          height={450}
          style={{ width: "100%", height: "auto" }}
        >
          <ZoomableGroup
            center={[0, 30] as [number, number]}
            zoom={1}
            minZoom={1}
            maxZoom={4}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryName = geo.properties.name;
                  const slug = COUNTRY_NAME_TO_SLUG[countryName];
                  const level = slug
                    ? getCountryHighestLevel(slug, progress)
                    : "none";
                  const isAvailable = !!slug;
                  const isHovered = hoveredCountry === slug;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={(evt) => {
                        if (isAvailable) {
                          setHoveredCountry(slug);
                          setTooltipPosition({ x: evt.clientX, y: evt.clientY });
                        }
                      }}
                      onMouseLeave={() => {
                        setHoveredCountry(null);
                      }}
                      onClick={() => {
                        if (isAvailable) {
                          window.location.href = `/protected/country/${slug}`;
                        }
                      }}
                      style={{
                        default: {
                          fill: isAvailable ? getLevelColor(level) : "#F5F5F5",
                          stroke: isAvailable ? "#374151" : "#D1D5DB",
                          strokeWidth: isAvailable ? 0.75 : 0.5,
                          outline: "none",
                          cursor: isAvailable ? "pointer" : "default",
                        },
                        hover: {
                          fill: isAvailable
                            ? level === "none"
                              ? "#0D7377"
                              : getLevelColor(level)
                            : "#F5F5F5",
                          stroke: isAvailable ? "#0D7377" : "#D1D5DB",
                          strokeWidth: isAvailable ? 1.5 : 0.5,
                          outline: "none",
                          cursor: isAvailable ? "pointer" : "default",
                        },
                        pressed: {
                          fill: isAvailable ? "#065a5c" : "#F5F5F5",
                          stroke: "#374151",
                          strokeWidth: 0.75,
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {/* Markers for available countries */}
            {COUNTRY_MARKERS.map((marker) => {
              const level = getCountryHighestLevel(marker.slug, progress);
              const isHovered = hoveredCountry === marker.slug;

              return (
                <Marker
                  key={marker.slug}
                  coordinates={marker.coordinates}
                  onMouseEnter={() => setHoveredCountry(marker.slug)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  onClick={() => {
                    window.location.href = `/protected/country/${marker.slug}`;
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {/* Pulse ring for completed countries */}
                  {level !== "none" && (
                    <circle
                      r={isHovered ? 10 : 8}
                      fill={getLevelColor(level)}
                      opacity={0.3}
                      className="animate-ping"
                    />
                  )}
                  <circle
                    r={isHovered ? 6 : 4}
                    fill={getLevelColor(level)}
                    stroke="#374151"
                    strokeWidth={1}
                  />
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>

        {/* Floating tooltip */}
        {hoveredCountry && (
          <div
            className="fixed z-50 pointer-events-none"
            style={{
              left: tooltipPosition.x + 10,
              top: tooltipPosition.y - 40,
            }}
          >
            <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
              <p className="text-sm font-medium text-foreground">
                {COUNTRY_MARKERS.find((c) => c.slug === hoveredCountry)?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {getLevelStyles(getCountryHighestLevel(hoveredCountry, progress)).label}
              </p>
            </div>
          </div>
        )}
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
          <div className="h-4 w-4 rounded bg-gray-200 border border-gray-300" />
          <span className="text-sm text-muted-foreground">Not Started</span>
        </div>
      </div>

      {/* Stats summary */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {(["advanced", "intermediate", "beginner", "none"] as const).map((level) => {
          const count = COUNTRY_MARKERS.filter(
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
