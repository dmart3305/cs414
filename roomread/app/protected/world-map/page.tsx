import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard-header";
import { WorldMapView } from "@/components/world-map-view";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function WorldMapPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const displayName = data.user.user_metadata?.display_name || null;

  return (
    <div className="min-h-svh bg-background">
      <DashboardHeader
        userEmail={data.user.email || ""}
        displayName={displayName}
      />

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        {/* Back button */}
        <Link
          href="/protected"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-foreground tracking-tight md:text-4xl">
            Your World Progress
          </h1>
          <p className="mt-2 text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Track your cultural learning journey across the globe. Countries light up as you complete lessons.
          </p>
        </section>

        {/* Legend */}
        <section className="mb-6 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-[#CD7F32]" />
            <span className="text-sm text-muted-foreground">Beginner</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-[#C0C0C0]" />
            <span className="text-sm text-muted-foreground">Intermediate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-[#FFD700]" />
            <span className="text-sm text-muted-foreground">Advanced</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-muted border border-border" />
            <span className="text-sm text-muted-foreground">Not started</span>
          </div>
        </section>

        {/* Map */}
        <section className="rounded-xl border border-border bg-card p-4 md:p-6 overflow-hidden">
          <WorldMapView />
        </section>
      </main>
    </div>
  );
}
