import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CATEGORY_MAP: Record<string, string> = {
  "dining-etiquette": "Dining Etiquette",
  "greetings-gestures": "Greetings & Gestures",
  "religious-sacred-sites": "Religious & Sacred Sites",
  "dress-codes": "Dress Codes",
  "time-punctuality": "Time & Punctuality",
};

interface LessonBlock {
  type: "text" | "question";
  text?: string;
  question?: string;
  options?: string[];
  correctIndex?: number;
  explanation?: string;
}

interface Lesson {
  title: string;
  intro: string;
  content: LessonBlock[];
  summary?: string;
}

interface CountryData {
  country: string;
  categories: {
    category: string;
    lesson: Lesson;
  }[];
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ country: string; category: string }> }
) {
  const { country, category } = await params;

  const categoryName = CATEGORY_MAP[category];
  if (!categoryName) {
    return NextResponse.json(
      { error: "Category not found" },
      { status: 404 }
    );
  }

  const filePath = path.join(process.cwd(), "data", `${country}.json`);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { error: "Country data not found" },
      { status: 404 }
    );
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const countryData = JSON.parse(raw) as CountryData;

  const categoryData = countryData.categories.find(
    (c) => c.category === categoryName
  );

  if (!categoryData) {
    return NextResponse.json(
      { error: "Lesson not found for this category" },
      { status: 404 }
    );
  }

  return NextResponse.json({ lesson: categoryData.lesson });
}