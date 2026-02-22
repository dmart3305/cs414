import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard-header";
import { CountryCard } from "@/components/country-card";
import {
  Search,
  Compass,
  BookOpen,
  HandshakeIcon,
} from "lucide-react";

const FEATURED_COUNTRIES = [
  {
    name: "Japan",
    region: "East Asia",
    description:
      "Master the art of bowing, chopstick etiquette, and the importance of removing shoes before entering homes.",
    flag: "\u{1F1EF}\u{1F1F5}",
  },
  {
    name: "Morocco",
    region: "North Africa",
    description:
      "Learn about mint tea hospitality, haggling in souks, and respectful dress codes for visiting mosques.",
    flag: "\u{1F1F2}\u{1F1E6}",
  },
  {
    name: "Brazil",
    region: "South America",
    description:
      "Understand personal space norms, greeting customs, and the cultural significance of meal times.",
    flag: "\u{1F1E7}\u{1F1F7}",
  },
  {
    name: "India",
    region: "South Asia",
    description:
      "Navigate namaste greetings, dining with your right hand, and respectful temple visit practices.",
    flag: "\u{1F1EE}\u{1F1F3}",
  },
  {
    name: "Germany",
    region: "Central Europe",
    description:
      "Discover punctuality expectations, formal address customs, and the importance of recycling etiquette.",
    flag: "\u{1F1E9}\u{1F1EA}",
  },
  {
    name: "Thailand",
    region: "Southeast Asia",
    description:
      "Learn about the wai greeting, respect for the monarchy, and the significance of the head and feet.",
    flag: "\u{1F1F9}\u{1F1ED}",
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
              <p className="text-2xl font-bold text-card-foreground">195</p>
              <p className="text-sm text-muted-foreground">Countries covered</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
              <BookOpen className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">1,200+</p>
              <p className="text-sm text-muted-foreground">Cultural guides</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <HandshakeIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">6</p>
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


      </main>
    </div>
  );
}
