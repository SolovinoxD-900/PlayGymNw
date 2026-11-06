import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarCheck, CalendarDays, Flame, Trophy } from "lucide-react";
import { Cargando, PageHeader, StatCard } from "@/components/AppShell";
import { CalendarioMes } from "@/components/CalendarioMes";
import { useResumen } from "@/lib/data";
import { parseFecha, sumarDias } from "@/lib/rachas";

export const Route = createFileRoute("/_authenticated/progreso")({
  head: () => ({ meta: [{ title: "Mi progreso · Play Gym" }, { name: "description", content: "Estadísticas y evolución de tu actividad." }] }),
  component: Progreso,
});

function Grafica({ titulo, data }: { titulo: string; data: { n: string; v: number }[] }) {
  return (
    <div className="card-soft p-5">
      <h3 className="mb-4 font-semibold">{titulo}</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="n" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} width={28} />
            <Tooltip cursor={{ fill: "var(--muted)" }} contentStyle={{ borderRadius: 12, border: "1px solid var(--border)" }} />
            <Bar dataKey="v" name="Retos" fill="var(--primary)" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Progreso() {
  const r = useResumen();
  if (r.loading) return <Cargando />;
  const set = new Set(r.completados.map((c) => c.fecha));
  const semanal = Array.from({ length: 7 }, (_, i) => {
    const f = sumarDias(r.hoy, i - 6);
    return { n: parseFecha(f).toLocaleDateString("es-MX", { weekday: "short" }), v: set.has(f) ? 1 : 0 };
  });
  const hoyD = parseFecha(r.hoy);
  const mensual = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(hoyD.getFullYear(), hoyD.getMonth() - (5 - i), 1);
    const pref = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return { n: d.toLocaleDateString("es-MX", { month: "short" }), v: r.completados.filter((c) => c.fecha.startsWith(pref)).length };
  });
  const porId = new Map(r.retos.map((x) => [x.id, x]));

  return (
    <div className="space-y-6">
      <PageHeader title="Mi progreso" subtitle="Así va tu evolución. ¡Cada reto suma!" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Retos completados" value={r.total} icon={CalendarCheck} />
        <StatCard label="Días activos" value={r.diasActivos} icon={CalendarDays} />
        <StatCard label="Racha actual" value={r.actual} icon={Flame} />
        <StatCard label="Racha máxima" value={r.record} icon={Trophy} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Grafica titulo="Últimos 7 días" data={semanal} />
        <Grafica titulo="Últimos 6 meses" data={mensual} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <CalendarioMes fechas={[...set]} />
        <div className="card-soft p-5">
          <h3 className="mb-3 font-semibold">Historial de actividades</h3>
          {r.completados.length === 0 ? (
            <p className="py-10 text-center text-muted-foreground">Aún no completas retos. ¡Tu primera actividad te espera! 💪</p>
          ) : (
            <ul className="max-h-80 space-y-2 overflow-auto pr-1">
              {r.completados.map((c) => (
                <li key={c.id} className="flex items-center justify-between rounded-2xl bg-muted px-4 py-3 text-sm">
                  <span className="font-semibold">{porId.get(c.reto_id)?.nombre ?? "Reto"}{c.version_suave && " · suave"}</span>
                  <span className="text-muted-foreground">{parseFecha(c.fecha).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
