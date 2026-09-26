"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, CalendarCheck, Image as ImageIcon, Music, Star, LogOut } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/portfolio", label: "Portfolio / Audio", icon: Music },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // The login page manages its own full-screen layout — don't wrap it in the sidebar.
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-ink flex">
      <aside className="w-64 shrink-0 border-r border-white/10 bg-char2 p-6 flex flex-col">
        <p className="font-display text-2xl tracking-wide text-paper mb-8">KMS ADMIN</p>
        <nav className="flex-1 space-y-1">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active ? "bg-violet/20 text-violet" : "text-mist hover:bg-white/5 hover:text-paper"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-mist hover:bg-white/5 hover:text-paper transition-colors"
        >
          <LogOut size={18} /> Log Out
        </button>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
