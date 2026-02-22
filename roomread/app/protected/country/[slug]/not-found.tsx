import Link from "next/link";
import { ArrowLeft, Earth } from "lucide-react";

export default function CountryNotFound() {
  return (
    <div className="min-h-svh bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl mb-4">🌍</p>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Country not found
        </h1>
        <p className="text-muted-foreground mb-6">
          {"We don't have a guide for this country yet. Check back soon or explore one of our other countries."}
        </p>
        <Link
          href="/protected"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}