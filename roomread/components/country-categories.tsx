"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Utensils,
  HandshakeIcon,
  MessageCircle,
  ShieldCheck,
  Shirt,
  Clock,
  CheckCircle2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const CATEGORIES: {
  title: string;
  slug: string;
  description: string;
  icon: LucideIcon;
  count: number;
}[] = [
  {
    title: "Dining Etiquette",
    slug: "dining-etiquette",
    description: "Table manners, tipping customs, and food-related traditions",
    icon: Utensils,
    count: 45,
  },
  {
    title: "Greetings & Gestures",
    slug: "greetings-gestures",
    description: "How to properly greet locals and avoid offensive gestures",
    icon: HandshakeIcon,
    count: 38,
  },
  {
    title: "Communication Styles",
    slug: "communication-styles",
    description: "Verbal and non-verbal communication norms across cultures",
    icon: MessageCircle,
    count: 32,
  },
  {
    title: "Religious & Sacred Sites",
    slug: "religious-sacred-sites",
    description:
      "Respectful practices when visiting temples, churches, and mosques",
    icon: ShieldCheck,
    count: 28,
  },
  {
    title: "Dress Codes",
    slug: "dress-codes",
    description:
      "What to wear and what to avoid in different cultural contexts",
    icon: Shirt,
    count: 24,
  },
  {
    title: "Time & Punctuality",
    slug: "time-punctuality",
    description:
      "Expectations around timeliness and scheduling in different regions",
    icon: Clock,
    count: 20,
  },
];

export function CountryCategories({ slug }: { slug: string }) {
  const searchParams = useSearchParams();

  // Build completed set from query params like ?completed=dining-etiquette,greetings-gestures
  const completedParam = searchParams.get("completed") || "";
  const completedSet = new Set(
    completedParam ? completedParam.split(",") : []
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {CATEGORIES.map((category) => {
        const isCompleted = completedSet.has(category.slug);
        const Icon = category.icon;

        // Preserve completed params when navigating to quiz
        const quizHref = `/protected/country/${slug}/${category.slug}${
          completedParam ? `?completed=${completedParam}` : ""
        }`;

        return (
          <Link
            key={category.title}
            href={quizHref}
            className={`group flex items-start gap-4 rounded-xl border p-5 transition-all ${
              isCompleted
                ? "border-primary/40 bg-primary/5"
                : "border-border bg-card hover:border-primary/30 hover:shadow-sm"
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                isCompleted
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-card-foreground">
                    {category.title}
                  </h3>
                  {isCompleted && (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  )}
                </div>
                {isCompleted ? (
                  <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    Completed
                  </span>
                ) : (
                  <span className="shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                    {category.count} guides
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {category.description}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
