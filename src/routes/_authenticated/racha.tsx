import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Trophy } from "lucide-react";
import { Cargando, PageHeader } from "@/components/AppShell";
import { CalendarioMes } from "@/components/CalendarioMes";
import { useResumen } from "@/lib/data";
import { sumarDias } from "@/lib/rachas";

export const Route = createFileRoute("/_authenticated/racha")({
  head: () => ({ meta: [{ title: "Mi racha · Play Gym" }, { name: "description", content: "Tus días consecutivos de actividad." }] }),
  component: Racha,
});

function Racha() {
  const r = useResumen();
  if (r.loading) return <Cargando />;
  const inicio = r.hechoHoy ? r.hoy : sumarDias(r.hoy, -1);
  const tira = Array.from({ length: Math.min(r.actual, 14) }, (_, i) => sumarDias(inicio, -(Math.min(r.actual, 14) - 1 - i)));
  const fechas = r.completados.map((c) => c.fecha);

  return (
    <div className="space-y-6">
      <PageHeader title="Mi racha" subtitle="Completa tu reto cada día para que tu llama siga encendida." />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card-soft bg-hero p-8 text-center">
          <Flame className={`mx-auto h-20 w-20 text-primary ${r.actual > 0 ? "animate-flame" : "opacity-40"}`} />
          <p className="mt-2 font-display text-6xl font-bold">{r.actual}</p>
          <p className="font-semibold text-muted-foreground">{r.actual === 1 ? "día seguido" : "días seguidos"}</p>
          {!r.hechoHoy && (
            <Link to="/retos" className="mt-4 inline-block rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground">
              {r.actual > 0 ? "¡Completa hoy para no perderla!" : "Empieza tu racha hoy"}
            </Link>
          )}
        </div>
        <div className="card-soft p-8 text-center">
          <Trophy className="mx-auto h-20 w-20 text-primary" />
          <p className="mt-2 font-display text-6xl font-bold">{r.record}</p>
          <p className="font-semibold text-muted-foreground">récord personal</p>
        </div>
      </div>
      {tira.length > 0 && (
        <div className="card-soft p-5">
          <h3 className="mb-3 font-semibold">Días consecutivos</h3>
          <div className="flex flex-wrap gap-2">
            {tira.map((f) => (
              <div key={f} className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-xs font-bold text-primary-foreground">
                {Number(f.slice(8))}
              </div>
            ))}
          </div>
        </div>
      )}
      <CalendarioMes fechas={fechas} />
    </div>
  );
}
