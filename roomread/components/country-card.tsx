import { MapPin } from "lucide-react";

interface CountryCardProps {
  name: string;
  region: string;
  description: string;
  flag: string;
}

export function CountryCard({
  name,
  region,
  description,
  flag,
}: CountryCardProps) {
  return (
    <div className="group flex flex-col rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer">
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
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-2">
        {description}
      </p>
    </div>
  );
}
