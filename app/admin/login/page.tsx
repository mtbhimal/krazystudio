import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import LoginForm from "./login-form";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-ink flex items-center justify-center px-6 text-paper">
          <Loader2 className="animate-spin" size={24} />
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}