import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  return NextResponse.json({ success: true, progress: data });
}
