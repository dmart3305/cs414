import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard-header";
import { CountryCard } from "@/components/country-card";
import { CategoryCard } from "@/components/category-card";
import {
  HandshakeIcon,
  MessageCircle,
  ShieldCheck,
  Shirt,
  Clock,
  Search,
  Compass,
  BookOpen,
  UtensilsCrossed,
} from "lucide-react";

const FEATURED_COUNTRIES = [
  {
    name: "France",
    region: "Europe",
    description:
      "Placeholder",
    flag: "",
  },
  {
    name: "Placeholder",
    region: "Placeholder",
    description:
      "Placeholder",
    flag: "",
  },
  {
    name: "Placeholder",
    region: "Placeholder",
    description:
      "Placeholder",
    flag: "",
  },
  {
    name: "Placeholder",
    region: "Placeholder",
    description:
      "Placeholder",
    flag: "",
  },
  {
    name: "Placeholder",
    region: "Placeholder",
    description:
      "Placeholder",
    flag: "",
  },
  {
    name: "Placeholder",
    region: "Placeholder",
    description:
      "Placeholder",
    flag: "",
  },
];

const CATEGORIES = [
  {
    title: "Dining Etiquette",
    description: "Table manners, tipping customs, and food-related traditions",
    icon: UtensilsCrossed,
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
    description: "Respectful practices when visiting temples, churches, and mosques",
    icon: ShieldCheck,
    count: 0,
  },
  {
    title: "Dress Codes",
    description: "What to wear and what to avoid in different cultural contexts",
    icon: Shirt,
    count: 0,
  },
  {
    title: "Time & Punctuality",
    description: "Expectations around timeliness and scheduling in different regions",
    icon: Clock,
    count: 0,
  },
];

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const displayName = data.user.user_metadata?.display_name || null;
  const greeting = displayName ? `Welcome back, ${displayName}` : "Welcome back";

  return (
    <div className="min-h-svh bg-background">
      <DashboardHeader
        userEmail={data.user.email || ""}
        displayName={displayName}
      />

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        {/* Hero section */}
        <section className="mb-10">
          <h1 className="text-3xl font-bold text-foreground tracking-tight md:text-4xl text-balance">
            {greeting}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Explore cultural norms and social etiquette to travel with confidence
            and respect.
          </p>

          {/* Search bar */}
          <div className="relative mt-6 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search countries, customs, or topics..."
              className="flex h-12 w-full rounded-xl border border-input bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-colors"
            />
          </div>
        </section>

        {/* Quick stats */}
        <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Compass className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">0</p>
              <p className="text-sm text-muted-foreground">Countries covered</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
              <BookOpen className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">0</p>
              <p className="text-sm text-muted-foreground">Cultural guides</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <HandshakeIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">0</p>
              <p className="text-sm text-muted-foreground">
                Etiquette categories
              </p>
            </div>
          </div>
        </section>

        {/* Featured countries */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-foreground tracking-tight">
              Featured Countries
            </h2>
            <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              View all
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_COUNTRIES.map((country) => (
              <CountryCard key={country.name} {...country} />
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-foreground tracking-tight">
              Explore by Category
            </h2>
          </div>
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
