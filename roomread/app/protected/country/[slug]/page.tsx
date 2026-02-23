import { Suspense } from "react";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard-header";
import { CountryCategories } from "@/components/country-categories";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// Country Description
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
