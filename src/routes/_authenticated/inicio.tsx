import { createFileRoute, Link } from "@tanstack/react-router";
import { BookHeart, CalendarCheck, Flame, Trophy } from "lucide-react";
import { Cargando, StatCard } from "@/components/AppShell";
import { RetoCard } from "@/components/RetoCard";
import { FRASES, usePerfil, useResumen } from "@/lib/data";
import { indiceRetoDelDia, sumarDias } from "@/lib/rachas";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/inicio")({
  head: () => ({ meta: [{ title: "Inicio · Play Gym" }, { name: "description", content: "Tu resumen diario en Play Gym." }] }),
  component: Inicio,
});

function Inicio() {
  const perfil = usePerfil();
  const r = useResumen();
  if (r.loading || perfil.isLoading) return <Cargando />;
  const frase = FRASES[indiceRetoDelDia(r.hoy, FRASES.length)];
  const set = new Set(r.completados.map((c) => c.fecha));
  const semana = Array.from({ length: 7 }, (_, i) => sumarDias(r.hoy, i - 6));
  const nombre = perfil.data?.nombre?.split(" ")[0] || "amiga";

  return (
    <div className="space-y-6">
      <div className="card-soft bg-hero p-6 md:p-8">
        <p className="text-sm font-bold text-primary">{new Date().toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })}</p>
        <h1 className="mt-1 text-3xl font-bold md:text-4xl">¡Hola, {nombre}! 👋</h1>
        <p className="mt-2 text-lg text-muted-foreground">“{frase}”</p>
        <div className={cn("mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold", r.hechoHoy ? "bg-primary text-primary-foreground" : "bg-card")}>
          <span className={cn("h-2.5 w-2.5 rounded-full", r.hechoHoy ? "bg-primary-foreground" : "bg-primary animate-pulse")} />
          {r.hechoHoy ? "Actividad de hoy completada" : "Aún te espera tu reto de hoy"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Racha actual" value={`${r.actual} 🔥`} icon={Flame} />
        <StatCard label="Récord" value={r.record} icon={Trophy} />
        <StatCard label="Retos completados" value={r.total} icon={CalendarCheck} />
        <StatCard label="Días activos" value={r.diasActivos} icon={CalendarCheck} />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {r.retoHoy ? <RetoCard reto={r.retoHoy} hecho={r.hechoHoy} compacto /> : <p>No hay retos disponibles.</p>}
          <Link to="/retos" className="mt-3 inline-block text-sm font-bold text-primary">Ver instrucciones completas →</Link>
        </div>
        <div className="space-y-6 lg:col-span-2">
          <div className="card-soft p-5">
            <h3 className="font-semibold">Esta semana</h3>
            <div className="mt-3 flex justify-between">
              {semana.map((f) => (
                <div key={f} className="flex flex-col items-center gap-1">
                  <div className={cn("grid h-9 w-9 place-items-center rounded-full text-sm font-bold", set.has(f) ? "bg-gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                    {set.has(f) ? "✓" : ""}
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(f + "T12:00").toLocaleDateString("es-MX", { weekday: "narrow" })}</span>
                </div>
              ))}
            </div>
          </div>
          <Link to="/bitacora" className="card-soft lift flex items-center gap-4 p-5">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary"><BookHeart className="h-6 w-6 text-primary" /></span>
            <div>
              <h3 className="font-semibold">Escribir en mi bitácora</h3>
              <p className="text-sm text-muted-foreground">¿Cómo te sentiste hoy?</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
