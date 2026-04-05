"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "@vnedyalk0v/react19-simple-maps";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ProgressRow {
  country_slug: string;
  category_slug: string;
  lesson_slug: string;
  completed_at: string;
}

type Tier = "gold" | "silver" | "bronze" | "none";

interface TooltipState {
  name: string;
  tier: Tier;
  x: number;
  y: number;
}

// ── Constants ─────────────────────────────────────────────────────────────────

// Country slug → ISO-3166-1 alpha-3 code.
// Extend this map as new countries are added to the app.
const SLUG_TO_ISO3: Record<string, string> = {
  france: "FRA",
  germany: "DEU",
  japan: "JPN",
  china: "CHN",
  brazil: "BRA",
  india: "IND",
  mexico: "MEX",
  italy: "ITA",
  spain: "ESP",
  "south-korea": "KOR",
  australia: "AUS",
  "united-states": "USA",
  canada: "CAN",
  "united-kingdom": "GBR",
  argentina: "ARG",
  egypt: "EGY",
  nigeria: "NGA",
  morocco: "MAR",
  "saudi-arabia": "SAU",
  russia: "RUS",
};

// Total number of distinct categories a country can have (from france.json we
// can see there are 5). Adjust if the schema changes.
const TOTAL_CATEGORIES = 5;

// Tier color palette — aligned with the app's design tokens.
// Gold  → --accent (#D4A853)
// Silver → a cool neutral silver
// Bronze → a warm copper tone
const TIER_COLORS: Record<Tier, string> = {
  gold: "#D4A853",   // --accent
  silver: "#A8B5C2",
  bronze: "#C07A45",
  none: "#D6D3CE",   // neutral geography fill
};

const TIER_HOVER_COLORS: Record<Tier, string> = {
  gold: "#BC8E3A",
  silver: "#8A98A6",
  bronze: "#A5623A",
  none: "#B8B5B0",
};

const TIER_LABELS: Record<Tier, string> = {
  gold: "Gold (Advanced)",
  silver: "Silver (Intermediate)",
  bronze: "Bronze (Beginner)",
  none: "Not started",
};

// Natural-Earth topojson hosted on the official unpkg CDN (small, fast)
const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// ── Helpers ───────────────────────────────────────────────────────────────────

const fetcher = (url: string) =>
  fetch(url).then((res) => res.json()).then((d) => d.progress as ProgressRow[]);

/**
 * Derives per-country tiers from the flat lesson_progress rows.
 *
 * Bronze  → 1+ completed lesson for the country
 * Silver  → 3+ distinct completed categories for the country
 * Gold    → all TOTAL_CATEGORIES distinct categories completed
 */
function computeTiers(rows: ProgressRow[]): Record<string, Tier> {
  const byCountry: Record<string, Set<string>> = {};

  for (const row of rows) {
    if (!byCountry[row.country_slug]) {
      byCountry[row.country_slug] = new Set();
    }
    byCountry[row.country_slug].add(row.category_slug);
  }

  const tiers: Record<string, Tier> = {};
  for (const [slug, categories] of Object.entries(byCountry)) {
    const count = categories.size;
    if (count >= TOTAL_CATEGORIES) {
      tiers[slug] = "gold";
    } else if (count >= 3) {
      tiers[slug] = "silver";
    } else {
      tiers[slug] = "bronze";
    }
  }
  return tiers;
}

// world-atlas uses numeric ISO-3166-1 codes inside the topojson.
// We need alpha-3 → numeric lookup. We keep a minimal map of the countries
// already in the app plus common ones so the feature works correctly without
// a heavy external dependency.
const ISO3_TO_NUMERIC: Record<string, string> = {
  FRA: "250",
  DEU: "276",
  JPN: "392",
  CHN: "156",
  BRA: "076",
  IND: "356",
  MEX: "484",
  ITA: "380",
  ESP: "724",
  KOR: "410",
  AUS: "036",
  USA: "840",
  CAN: "124",
  GBR: "826",
  ARG: "032",
  EGY: "818",
  NGA: "566",
  MAR: "504",
  SAU: "682",
  RUS: "643",
};

// ── Component ─────────────────────────────────────────────────────────────────

export function WorldMap() {
  const { data: rows, isLoading } = useSWR<ProgressRow[]>(
    "/api/progress",
    fetcher
  );

  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const tiersBySlug = rows ? computeTiers(rows) : {};

  // Build a numeric-code → tier lookup that the Geography renderer can use.
  const tiersByNumeric: Record<string, Tier> = {};
  for (const [slug, tier] of Object.entries(tiersBySlug)) {
    const iso3 = SLUG_TO_ISO3[slug];
    if (iso3) {
      const numeric = ISO3_TO_NUMERIC[iso3];
      if (numeric) tiersByNumeric[numeric] = tier;
    }
  }

  return (
    <section className="px-6 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Your World Progress
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Countries you&apos;ve explored are highlighted by achievement tier.
          </p>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-5">
          {(["bronze", "silver", "gold"] as const).map((tier) => (
            <div key={tier} className="flex items-center gap-1.5">
              <span
                className="inline-block w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: TIER_COLORS[tier] }}
              />
              <span className="text-xs text-muted-foreground capitalize">
                {tier}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Map card */}
      <div
        className="relative rounded-xl border border-border overflow-hidden"
        style={{ background: "var(--card)" }}
      >
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-card/80">
            <span className="text-sm text-muted-foreground animate-pulse">
              Loading progress…
            </span>
          </div>
        )}

        <ComposableMap
          projection="geoNaturalEarth1"
          style={{ width: "100%", height: "auto" }}
          projectionConfig={{ scale: 155 }}
        >
          <ZoomableGroup zoom={1}>
            <Geographies geography={GEO_URL}>
              {({ geographies }: { geographies: any[] }) =>
                geographies.map((geo) => {
                  // world-atlas stores the numeric code under id
                  const numericId = String(geo.id);
                  const tier: Tier = tiersByNumeric[numericId] ?? "none";
                  const fill = TIER_COLORS[tier];
                  const hoverFill = TIER_HOVER_COLORS[tier];

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fill}
                      stroke="var(--background)"
                      strokeWidth={0.4}
                      style={{
                        default: { fill, outline: "none" },
                        hover: { fill: hoverFill, outline: "none", cursor: tier !== "none" ? "pointer" : "default" },
                        pressed: { fill: hoverFill, outline: "none" },
                      }}
                      onMouseEnter={(evt: React.MouseEvent) => {
                        const name: string =
                          geo.properties?.name ?? "Unknown";
                        setTooltip({
                          name,
                          tier,
                          x: evt.clientX,
                          y: evt.clientY,
                        });
                      }}
                      onMouseMove={(evt: React.MouseEvent) => {
                        setTooltip((prev) =>
                          prev
                            ? { ...prev, x: evt.clientX, y: evt.clientY }
                            : null
                        );
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Mobile legend */}
        <div className="flex sm:hidden items-center justify-center gap-5 px-4 pb-4 pt-1">
          {(["bronze", "silver", "gold"] as const).map((tier) => (
            <div key={tier} className="flex items-center gap-1.5">
              <span
                className="inline-block w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: TIER_COLORS[tier] }}
              />
              <span className="text-xs text-muted-foreground capitalize">
                {tier}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip — rendered in a portal-like fixed div */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none px-3 py-2 rounded-lg shadow-lg border border-border text-sm"
          style={{
            left: tooltip.x + 12,
            top: tooltip.y - 40,
            background: "var(--card)",
            color: "var(--card-foreground)",
          }}
        >
          <p className="font-medium leading-tight">{tooltip.name}</p>
          <p
            className="text-xs leading-tight mt-0.5"
            style={{
              color:
                tooltip.tier === "none"
                  ? "var(--muted-foreground)"
                  : TIER_COLORS[tooltip.tier],
            }}
          >
            {TIER_LABELS[tooltip.tier]}
          </p>
        </div>
      )}
    </section>
  );
}
