import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard-header";
import { CategoryCard } from "@/components/category-card";
import {
  Utensils,
  HandshakeIcon,
  MessageCircle,
  ShieldCheck,
  Shirt,
  Clock,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

// Country info
const COUNTRIES: Record<
  string,
  { name: string; region: string; flag: string; description: string }
> = {
  france: {
    name: "France",
    region: "Europe",
    flag: '\uD83C\uDDEB\uD83C\uDDF7',
    description:
      "Discover France, the world's top tourist destination, renowned for its rich history, iconic art, fashion, and cuisine.",
  },
  
};

// Category info
const CATEGORIES = [
  {
    title: "Dining Etiquette",
    description: "Table manners, tipping customs, and food-related traditions",
    icon: Utensils,
    count: 0,
  },
  {
    title: "Greetings & Gestures",
    description: "How to properly greet locals and avoid offensive gestures",
    icon: HandshakeIcon,
    count: 0,
  },
  {
    title: "Communication Styles",
    description: "Verbal and non-verbal communication norms across cultures",
    icon: MessageCircle,
    count: 0,
  },
  {
    title: "Religious & Sacred Sites",
    description:
      "Respectful practices when visiting temples, churches, and mosques",
    icon: ShieldCheck,
    count: 0,
  },
  {
    title: "Dress Codes",
    description:
      "What to wear and what to avoid in different cultural contexts",
    icon: Shirt,
    count: 0,
  },
  {
    title: "Time & Punctuality",
    description:
      "Expectations around timeliness and scheduling in different regions",
    icon: Clock,
    count: 0,
  },
];

export default async function CountryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const { slug } = await params;
  const country = COUNTRIES[slug];

  if (!country) {
    notFound();
  }

  const displayName = data.user.user_metadata?.display_name || null;

  return (
    <div className="min-h-svh bg-background">
      <DashboardHeader
        userEmail={data.user.email || ""}
        displayName={displayName}
      />

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        {/* Back link */}
        <Link
          href="/protected"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all countries
        </Link>

        {/* Country header */}
        <section className="mb-10">
          <div className="flex items-start gap-4">
            <span
              className="text-5xl md:text-6xl"
              role="img"
              aria-label={`${country.name} flag`}
            >
              {country.flag}
            </span>
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight md:text-4xl text-balance">
                {country.name}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {country.region}
              </p>
              <p className="mt-3 text-base text-muted-foreground leading-relaxed max-w-2xl">
                {country.description}
              </p>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section>
          <h2 className="text-xl font-bold text-foreground tracking-tight mb-5">
            {"Explore customs and norms in " + country.name}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {CATEGORIES.map((category) => (
              <CategoryCard key={category.title} {...category} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}