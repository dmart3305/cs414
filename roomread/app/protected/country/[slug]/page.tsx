import { Suspense } from "react";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard-header";
import { CountryCategories } from "@/components/country-categories";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const COUNTRIES: Record<
  string,
  { name: string; region: string; flag: string; description: string }
> = {
  france: {
    name: "France",
    region: "Europe",
    flag: "\u{1F1EB}\u{1F1F7}",
    description:
      "Discover the art of French dining etiquette, the importance of greetings with a bisou, and navigating formal vs. informal address.",
  },
  japan: {
    name: "Japan",
    region: "East Asia",
    flag: "\u{1F1EF}\u{1F1F5}",
    description:
      "Master the art of bowing, chopstick etiquette, and the importance of removing shoes before entering homes.",
  },
  morocco: {
    name: "Morocco",
    region: "North Africa",
    flag: "\u{1F1F2}\u{1F1E6}",
    description:
      "Learn about mint tea hospitality, haggling in souks, and respectful dress codes for visiting mosques.",
  },
  brazil: {
    name: "Brazil",
    region: "South America",
    flag: "\u{1F1E7}\u{1F1F7}",
    description:
      "Understand personal space norms, greeting customs, and the cultural significance of meal times.",
  },
  india: {
    name: "India",
    region: "South Asia",
    flag: "\u{1F1EE}\u{1F1F3}",
    description:
      "Navigate namaste greetings, dining with your right hand, and respectful temple visit practices.",
  },
  germany: {
    name: "Germany",
    region: "Central Europe",
    flag: "\u{1F1E9}\u{1F1EA}",
    description:
      "Discover punctuality expectations, formal address customs, and the importance of recycling etiquette.",
  },
  thailand: {
    name: "Thailand",
    region: "Southeast Asia",
    flag: "\u{1F1F9}\u{1F1ED}",
    description:
      "Learn about the wai greeting, respect for the monarchy, and the significance of the head and feet.",
  },
};

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
        <Link
          href="/protected"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all countries
        </Link>

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

        <section>
          <h2 className="text-xl font-bold text-foreground tracking-tight mb-5">
            {"Explore etiquette in " + country.name}
          </h2>
          <Suspense fallback={<div className="text-muted-foreground">Loading categories...</div>}>
            <CountryCategories slug={slug} />
          </Suspense>
        </section>
      </main>
    </div>
  );
}
