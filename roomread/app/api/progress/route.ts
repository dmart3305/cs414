import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// XP required per level (cumulative)
function calculateLevel(xp: number): number {
  const xpPerLevel = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3250];
  let level = 0;
  for (let i = 1; i < xpPerLevel.length; i++) {
    if (xp >= xpPerLevel[i]) {
      level = i;
    } else {
      break;
    }
  }
  return level;
}

// GET - Fetch user's lesson progress
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const countrySlug = searchParams.get("country");

  let query = supabase
    .from("lesson_progress")
    .select("country_slug, category_slug, lesson_slug, completed_at")
    .eq("user_id", user.id);

  if (countrySlug) {
    query = query.eq("country_slug", countrySlug);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ progress: data });
}

// POST - Save lesson completion
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { countrySlug, categorySlug, lessonSlug } = body;

  if (!countrySlug || !categorySlug || !lessonSlug) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Check if this lesson was already completed (to avoid granting XP twice)
  const { data: existingProgress } = await supabase
    .from("lesson_progress")
    .select("id")
    .eq("user_id", user.id)
    .eq("country_slug", countrySlug)
    .eq("category_slug", categorySlug)
    .eq("lesson_slug", lessonSlug)
    .single();

  const isNewCompletion = !existingProgress;

  const { data, error } = await supabase
    .from("lesson_progress")
    .upsert(
      {
        user_id: user.id,
        country_slug: countrySlug,
        category_slug: categorySlug,
        lesson_slug: lessonSlug,
        completed_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,country_slug,category_slug,lesson_slug",
      }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Grant XP for new completions only
  // Beginner = 50 XP, Intermediate = 100 XP, Advanced = 150 XP
  let leveledUp = false;
  let newLevel = 0;
  let xpEarned = 0;

  if (isNewCompletion) {
    // Get current XP before incrementing
    const { data: profile } = await supabase
      .from("profiles")
      .select("xp")
      .eq("id", user.id)
      .single();

    const oldXp = profile?.xp || 0;
    const oldLevel = calculateLevel(oldXp);

    xpEarned =
      lessonSlug === "beginner" ? 50 : lessonSlug === "intermediate" ? 100 : 150;

    await supabase.rpc("increment_xp", { user_id: user.id, amount: xpEarned });

    const newXp = oldXp + xpEarned;
    newLevel = calculateLevel(newXp);
    leveledUp = newLevel > oldLevel;
  }

  return NextResponse.json({
    success: true,
    progress: data,
    xpEarned,
    leveledUp,
    newLevel,
  });
}
