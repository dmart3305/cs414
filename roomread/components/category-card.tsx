import type { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  count: number;
}

export function CategoryCard({
  title,
  description,
  icon: Icon,
  count,
}: CategoryCardProps) {
  return (
    <div className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-card-foreground">{title}</h3>
          <span className="shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
            {count} guides
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
