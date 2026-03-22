"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Globe, LogOut, Star } from "lucide-react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function DashboardHeader({
  userEmail,
  displayName,
}: {
  userEmail: string;
  displayName: string | null;
}) {
  const router = useRouter();
  const { data: stats } = useSWR("/api/user/stats", fetcher);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Globe className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold text-foreground tracking-tight">
            RoomRead
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* User info with level */}
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {displayName || userEmail}
            </span>
            {stats && (
              <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1">
                <Star className="h-3.5 w-3.5 text-primary fill-primary" />
                <span className="text-xs font-semibold text-primary">
                  Lv. {stats.level}
                </span>
              </div>
            )}
          </div>

          {/* Mobile: Just show level badge */}
          <div className="flex sm:hidden items-center gap-2">
            {stats && (
              <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5">
                <Star className="h-3 w-3 text-primary fill-primary" />
                <span className="text-xs font-semibold text-primary">
                  {stats.level}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleSignOut}
            className="flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
