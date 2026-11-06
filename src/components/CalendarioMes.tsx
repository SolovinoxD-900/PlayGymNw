import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fechaLocal } from "@/lib/rachas";
import { cn } from "@/lib/utils";

const DIAS = ["L", "M", "X", "J", "V", "S", "D"];

export function CalendarioMes({ fechas }: { fechas: string[] }) {
  const [ref, setRef] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const set = new Set(fechas);
  const hoy = fechaLocal();
  const inicio = (ref.getDay() + 6) % 7;
  const diasMes = new Date(ref.getFullYear(), ref.getMonth() + 1, 0).getDate();
  const celdas: (string | null)[] = Array(inicio).fill(null);
  for (let i = 1; i <= diasMes; i++) celdas.push(fechaLocal(new Date(ref.getFullYear(), ref.getMonth(), i)));
  const titulo = ref.toLocaleDateString("es-MX", { month: "long", year: "numeric" });

  return (
    <div className="card-soft p-5">
      <div className="mb-4 flex items-center justify-between">
        <button aria-label="Mes anterior" className="rounded-full p-2 hover:bg-background" onClick={() => setRef(new Date(ref.getFullYear(), ref.getMonth() - 1, 1))}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="text-lg font-semibold capitalize">{titulo}</h3>
        <button aria-label="Mes siguiente" className="rounded-full p-2 hover:bg-background" onClick={() => setRef(new Date(ref.getFullYear(), ref.getMonth() + 1, 1))}>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold text-muted-foreground">
        {DIAS.map((d) => <div key={d}>{d}</div>)}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1.5">
        {celdas.map((f, i) =>
          f ? (
            <div
              key={f}
              title={f}
              className={cn(
                "grid aspect-square place-items-center rounded-xl text-sm font-semibold transition-transform",
                set.has(f) ? "bg-gradient-primary text-primary-foreground scale-100" : "bg-muted text-muted-foreground",
                f === hoy && "ring-2 ring-primary ring-offset-2 ring-offset-card",
              )}
            >
              {set.has(f) ? "✓" : Number(f.slice(8))}
            </div>
          ) : (
            <div key={`v${i}`} />
          ),
        )}
      </div>
    </div>
  );
}
