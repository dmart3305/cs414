"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Globe, LogOut, Star } from "lucide-react";
import useSWR from "swr";
import { useSound } from "@/lib/use-sound";
import { useMusic } from "@/components/music-provider";
import { Volume2, VolumeX } from "lucide-react";

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

  // 🔊 INIT SOUND
  const { play } = useSound();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const xpToNextLevel = stats ? stats.xpForNextLevel - stats.currentXp : 0;

  const { muted, toggleMute } = useMusic();

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
          {/* Desktop User Info */}
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {displayName || userEmail}
            </span>

            {stats && (
              <div className="group relative">
                <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 cursor-help">
                  <Star className="h-3.5 w-3.5 text-primary fill-primary" />
                  <span className="text-xs font-semibold text-primary">
                    Lv. {stats.level}
                  </span>
                </div>

                {/* XP Tooltip */}
                <div className="absolute right-0 top-full mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-foreground">
                        XP Progress
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Total: {stats.currentXp} XP
                      </span>
                    </div>

                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden mb-2">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${stats.progress}%` }}
                      />
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {xpToNextLevel > 0
                        ? `${xpToNextLevel} XP to Level ${stats.level + 1}`
                        : "Max level reached!"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Level Badge */}
          <div className="flex sm:hidden items-center gap-2">
            {stats && (
              <div className="group relative">
                <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 cursor-help">
                  <Star className="h-3 w-3 text-primary fill-primary" />
                  <span className="text-xs font-semibold text-primary">
                    {stats.level}
                  </span>
                </div>

                {/* Mobile Tooltip */}
                <div className="absolute right-0 top-full mt-2 w-44 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="rounded-lg border border-border bg-card p-2.5 shadow-lg">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-medium text-foreground">
                        XP Progress
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {stats.currentXp} XP
                      </span>
                    </div>

                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mb-1.5">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${stats.progress}%` }}
                      />
                    </div>

                    <p className="text-[10px] text-muted-foreground">
                      {xpToNextLevel > 0
                        ? `${xpToNextLevel} XP to Lv. ${stats.level + 1}`
                        : "Max level!"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={toggleMute}
            className="flex h-9 items-center justify-center rounded-lg border border-border px-3 hover:bg-secondary transition-colors"
          >
            {muted ? (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Volume2 className="h-4 w-4 text-primary" />
            )}
          </button>
          {/* 🔊 SIGN OUT BUTTON WITH SOUND */}
          <button
            onClick={async () => {
              play("click");
              await new Promise((r) => setTimeout(r, 120)); // smooth sound before redirect
              handleSignOut();
            }}
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