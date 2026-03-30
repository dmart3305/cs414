"use client";

import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "@vnedyalk0v/react19-simple-maps";
import useSWR from "swr";

const geoUrl = "https://unpkg.com/world-atlas@2/countries-110m.json";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Map country slugs to ISO country names used in the geo data
const COUNTRY_NAME_MAP: Record<string, string[]> = {
  france: ["France"],
  japan: ["Japan"],
  morocco: ["Morocco"],
  brazil: ["Brazil"],
  india: ["India"],
  germany: ["Germany"],
  thailand: ["Thailand"],
  italy: ["Italy"],
  spain: ["Spain"],
  mexico: ["Mexico"],
  china: ["China"],
  "united-states": ["United States of America", "United States"],
  "united-kingdom": ["United Kingdom"],
  australia: ["Australia"],
  canada: ["Canada"],
  argentina: ["Argentina"],
  egypt: ["Egypt"],
  "south-korea": ["South Korea", "Korea, South"],
  vietnam: ["Vietnam", "Viet Nam"],
  indonesia: ["Indonesia"],
  turkey: ["Turkey", "Türkiye"],
  greece: ["Greece"],
  portugal: ["Portugal"],
  netherlands: ["Netherlands"],
  sweden: ["Sweden"],
  norway: ["Norway"],
  denmark: ["Denmark"],
  finland: ["Finland"],
  switzerland: ["Switzerland"],
  austria: ["Austria"],
  belgium: ["Belgium"],
  ireland: ["Ireland"],
  "new-zealand": ["New Zealand"],
  singapore: ["Singapore"],
  "south-africa": ["South Africa"],
  kenya: ["Kenya"],
  nigeria: ["Nigeria"],
  peru: ["Peru"],
  colombia: ["Colombia"],
  chile: ["Chile"],
};

// Reverse lookup: geo name -> slug
const GEO_TO_SLUG: Record<string, string> = {};
Object.entries(COUNTRY_NAME_MAP).forEach(([slug, names]) => {
  names.forEach((name) => {
    GEO_TO_SLUG[name] = slug;
  });
});

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

function getLevelColor(level: "none" | "beginner" | "intermediate" | "advanced"): string {
  switch (level) {
    case "advanced":
      return "#FFD700"; // Gold
    case "intermediate":
      return "#C0C0C0"; // Silver
    case "beginner":
      return "#CD7F32"; // Bronze
    default:
      return "#2A2A2E"; // Dark gray for not started
  }
}

export function WorldMapView() {
  const { data, isLoading } = useSWR("/api/progress", fetcher);
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const progress: ProgressItem[] = data?.progress || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px] md:h-[500px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Tooltip */}
      {tooltipContent && (
        <div
          className="absolute z-10 pointer-events-none px-3 py-2 text-sm rounded-lg bg-card border border-border shadow-lg"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: "translate(-50%, -120%)",
          }}
        >
          {tooltipContent}
        </div>
      )}

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 120,
          center: [0, 30] as [number, number],
        }}
        width={800}
        height={500}
        className="w-full h-[400px] md:h-[500px]"
      >
        <ZoomableGroup center={[0, 30] as [number, number]} zoom={1}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const geoName = geo.properties.name;
                const countrySlug = GEO_TO_SLUG[geoName];
                const level = countrySlug
                  ? getCountryHighestLevel(countrySlug, progress)
                  : "none";
                const fillColor = getLevelColor(level);

                const levelLabel =
                  level === "none"
                    ? "Not started"
                    : level.charAt(0).toUpperCase() + level.slice(1);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillColor}
                    stroke="#1A1A1D"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: {
                        outline: "none",
                        fill: countrySlug ? "#0D7377" : "#3A3A3E",
                        cursor: countrySlug ? "pointer" : "default",
                      },
                      pressed: { outline: "none" },
                    }}
                    onMouseEnter={(evt) => {
                      const { clientX, clientY } = evt;
                      const rect = evt.currentTarget
                        .closest("svg")
                        ?.getBoundingClientRect();
                      if (rect) {
                        setTooltipPosition({
                          x: clientX - rect.left,
                          y: clientY - rect.top,
                        });
                      }
                      setTooltipContent(
                        countrySlug
                          ? `${geoName} - ${levelLabel}`
                          : geoName
                      );
                    }}
                    onMouseLeave={() => {
                      setTooltipContent(null);
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
