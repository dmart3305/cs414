"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";

interface CountryCardProps {
  name: string;
  region: string;
  description: string;
  flag: string;
  image?: string;
}

export function CountryCard({
  name,
  region,
  description,
  flag,
  image,
}: CountryCardProps) {
  const slug = name.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link
      href={`/protected/country/${slug}`}
      className="group relative flex flex-col h-full rounded-xl border border-border bg-card overflow-hidden 
      transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* ================= IMAGE (DIAGONAL) ================= */}
      {image && (
        <div className="absolute inset-0">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Diagonal overlay */}
          <div
            className="absolute inset-0 bg-card"
            style={{
              clipPath: "polygon(0 0, 55% 0, 40% 100%, 0% 100%)",
            }}
          />
        </div>
      )}

      {/* ================= CONTENT ================= */}
      <div className="relative p-5 flex flex-col flex-1">
        <div className="flex items-start gap-4">
          <span className="text-4xl" role="img" aria-label={`${name} flag`}>
            {flag}
          </span>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>

            <div className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{region}</span>
            </div>
          </div>
        </div>

        <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-2 mt-auto">
          {description}
        </p>
      </div>
    </Link>
  );
}