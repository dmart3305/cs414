import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// XP required per level (cumulative)
// Level 1 = 100 XP, Level 2 = 250 XP, Level 3 = 450 XP, etc.
function calculateLevel(xp: number): { level: number; currentXp: number; xpForNextLevel: number; progress: number } {
  const xpPerLevel = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3250];
  
  let level = 0;
  for (let i = 1; i < xpPerLevel.length; i++) {
    if (xp >= xpPerLevel[i]) {
      level = i;
    } else {
      break;
    }
  }
  
  // If user has maxed out defined levels
  if (level >= xpPerLevel.length - 1) {
    return {
      level,
      currentXp: xp,
      xpForNextLevel: xp,
      progress: 100,
    };
  }
  
  const xpForCurrentLevel = xpPerLevel[level];
  const xpForNextLevel = xpPerLevel[level + 1];
  const xpInCurrentLevel = xp - xpForCurrentLevel;
  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
  const progress = Math.round((xpInCurrentLevel / xpNeededForNextLevel) * 100);
  
  return {
    level,
    currentXp: xp,
    xpForNextLevel,
    progress,
  };
}

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("display_name, xp")
    .eq("id", user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const levelData = calculateLevel(profile?.xp || 0);

  return NextResponse.json({
    displayName: profile?.display_name,
    ...levelData,
  });
}
