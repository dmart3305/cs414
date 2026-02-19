import { Globe, Mail } from "lucide-react";
import Link from "next/link";

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-md text-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Globe className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold text-foreground tracking-tight">
            RoomRead
          </span>
        </div>

        <div className="rounded-xl border border-border bg-card p-8">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-7 w-7 text-primary" />
          </div>

          <h1 className="text-2xl font-bold text-card-foreground tracking-tight">
            Check your email
          </h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            {"We've sent you a confirmation link. Please check your email to verify your account before signing in."}
          </p>

          <Link
            href="/auth/login"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
