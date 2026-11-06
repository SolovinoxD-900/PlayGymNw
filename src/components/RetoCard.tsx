import { useState } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, Clock, Feather, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { type Reto, useCompletarReto } from "@/lib/data";

export function celebrar() {
  const colors = ["#E88EBA", "#F4B6CD", "#F8C8DC", "#FFFFFF"];
  confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 }, colors });
}

export function RetoCard({ reto, hecho, compacto }: { reto: Reto; hecho: boolean; compacto?: boolean }) {
  const [suave, setSuave] = useState(false);
  const completar = useCompletarReto();

  function onCompletar() {
    completar.mutate(
      { retoId: reto.id, suave },
      {
        onSuccess: () => {
          celebrar();
          toast.success("¡Reto completado! Tu racha sigue creciendo 🔥");
        },
      },
    );
  }

  return (
    <div className="card-soft overflow-hidden">
      <div className="bg-hero p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className="rounded-full bg-card px-3 py-1 text-primary">Reto del día</span>
          <span className="rounded-full bg-card px-3 py-1">{reto.categoria}</span>
          <span className="rounded-full bg-card px-3 py-1">{reto.dificultad}</span>
          <span className="flex items-center gap-1 rounded-full bg-card px-3 py-1">
            <Clock className="h-3 w-3" /> {reto.minutos} min
          </span>
        </div>
        <h2 className="mt-4 text-3xl font-bold">{reto.nombre}</h2>
        <p className="mt-1 text-muted-foreground">{reto.descripcion}</p>
      </div>
      <div className="space-y-4 p-6">
        {!compacto && (
          <>
            <div>
              <h3 className="font-semibold">Instrucciones</h3>
              <p className="mt-1 text-sm leading-relaxed">{suave ? reto.version_suave : reto.instrucciones}</p>
            </div>
            {!hecho && (
              <label className="flex items-center gap-3 rounded-2xl bg-muted p-3 text-sm">
                <Switch checked={suave} onCheckedChange={setSuave} />
                <Feather className="h-4 w-4 text-primary" /> Usar versión más suave
              </label>
            )}
          </>
        )}
        {hecho ? (
          <div className="flex items-center gap-2 rounded-2xl bg-secondary p-4 font-semibold text-secondary-foreground">
            <CheckCircle2 className="h-5 w-5 text-primary" /> ¡Completado hoy! Vuelve mañana por un nuevo reto.
          </div>
        ) : (
          <Button size="lg" className="w-full rounded-full text-base font-bold shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.02]" onClick={onCompletar} disabled={completar.isPending}>
            {completar.isPending ? <Loader2 className="animate-spin" /> : <Sparkles />}
            Marcar como completado
          </Button>
        )}
      </div>
    </div>
  );
}
