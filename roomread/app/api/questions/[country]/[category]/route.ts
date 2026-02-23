import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Map category slugs to the category names
const CATEGORY_MAP: Record<string, string> = {
  "dining-etiquette": "Dining Etiquette",
  "greetings-gestures": "Greetings & Gestures",
  "communication-styles": "Communication Styles",
  "religious-sacred-sites": "Religious & Sacred Sites",
  "dress-codes": "Dress Codes",
  "time-punctuality": "Time & Punctuality",
};

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
  const allQuestions = JSON.parse(raw) as {
    country: string;
    category: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];

  const filtered = allQuestions.filter((q) => q.category === categoryName);

  // Error message
  if (filtered.length === 0) {
    return NextResponse.json(
      { error: "No questions found for this category" },
      { status: 404 }
    );
  }

  return NextResponse.json({ questions: filtered });
}
