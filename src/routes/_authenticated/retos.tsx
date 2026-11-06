import { createFileRoute } from "@tanstack/react-router";
import { Clock, HeartHandshake } from "lucide-react";
import { Cargando, PageHeader } from "@/components/AppShell";
import { RetoCard } from "@/components/RetoCard";
import { retoParaFecha, useResumen } from "@/lib/data";
import { sumarDias } from "@/lib/rachas";

export const Route = createFileRoute("/_authenticated/retos")({
  head: () => ({ meta: [{ title: "Retos diarios · Play Gym" }, { name: "description", content: "Tu reto de actividad física de hoy." }] }),
  component: Retos,
});

function Retos() {
  const r = useResumen();
  if (r.loading) return <Cargando />;
  if (!r.retoHoy) return <p className="card-soft p-6 text-center">Aún no hay retos disponibles.</p>;
  const proximos = [1, 2, 3].map((n) => ({ fecha: sumarDias(r.hoy, n), reto: retoParaFecha(r.retos, sumarDias(r.hoy, n)) }));
  return (
    <div className="space-y-6">
      <PageHeader title="Retos diarios" subtitle="Un reto nuevo cada día. Solo puedes completarlo una vez." />
      <RetoCard reto={r.retoHoy} hecho={r.hechoHoy} />
      <div className="flex items-start gap-3 rounded-3xl bg-secondary p-5 text-secondary-foreground">
        <HeartHandshake className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
        <p className="text-sm">
          Escucha a tu cuerpo. Si hoy necesitas descansar, está bien: usa la versión suave o tómate el día. Volver mañana también es constancia.
        </p>
      </div>
      <div>
        <h2 className="mb-3 text-xl font-semibold">Próximos retos</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {proximos.map(({ fecha, reto }) => (
            <div key={fecha} className="card-soft lift p-5 opacity-90">
              <p className="text-xs font-bold capitalize text-primary">{new Date(fecha + "T12:00").toLocaleDateString("es-MX", { weekday: "long", day: "numeric" })}</p>
              <h3 className="mt-1 font-semibold">{reto.nombre}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{reto.descripcion}</p>
              <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-muted-foreground"><Clock className="h-3 w-3" />{reto.minutos} min · {reto.dificultad}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
