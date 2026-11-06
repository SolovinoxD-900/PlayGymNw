import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { BarChart3, BookHeart, Dumbbell, Flame, Home, LogOut, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/inicio", label: "Inicio", icon: Home },
  { to: "/retos", label: "Retos", icon: Dumbbell },
  { to: "/progreso", label: "Progreso", icon: BarChart3 },
  { to: "/racha", label: "Racha", icon: Flame },
  { to: "/bitacora", label: "Bitácora", icon: BookHeart },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-[var(--shadow-soft)]">
        <Dumbbell className="h-5 w-5" />
      </span>
      <span className="font-display text-2xl font-bold text-foreground">
        Play <span className="text-primary">Gym</span>
      </span>
    </Link>
  );
}

export function AppShell() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  async function salir() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }
  return (
    <div className="min-h-screen md:flex">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r bg-card p-5 md:flex">
        <Logo />
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
              activeProps={{ className: "bg-secondary text-secondary-foreground" }}
            >
              <Icon className="h-5 w-5" />
              {label === "Inicio" || label === "Retos" ? label : `Mi ${label.toLowerCase()}`}
            </Link>
          ))}
        </nav>
        <button onClick={salir} className="flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold text-muted-foreground hover:bg-background">
          <LogOut className="h-5 w-5" /> Cerrar sesión
        </button>
      </aside>

      <header className="flex items-center justify-between border-b bg-card px-4 py-3 md:hidden">
        <Logo />
        <button onClick={salir} aria-label="Cerrar sesión" className="rounded-full p-2 text-muted-foreground">
          <LogOut className="h-5 w-5" />
        </button>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-28 pt-6 md:px-8 md:pb-10 md:pt-10">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t bg-card md:hidden">
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center gap-1 py-2 text-[11px] font-semibold text-muted-foreground"
            activeProps={{ className: "text-primary" }}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
      {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export function Cargando() {
  return (
    <div className="grid place-items-center py-20">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-secondary border-t-primary" />
    </div>
  );
}

export function StatCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: typeof Home }) {
  return (
    <div className="card-soft lift p-5">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-sm font-semibold">{label}</span>
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <p className="mt-2 font-display text-3xl font-bold">{value}</p>
    </div>
  );
}
