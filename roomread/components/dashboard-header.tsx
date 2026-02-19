"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Globe, LogOut } from "lucide-react";

export function DashboardHeader({
  userEmail,
  displayName,
}: {
  userEmail: string;
  displayName: string | null;
}) {
  const router = useRouter();

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
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {displayName || userEmail}
          </span>
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
