import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Clock,
  Feather,
  ImagePlus,
  Loader2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { type Reto, useCompletarReto } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import { fechaLocal } from "@/lib/rachas";

export function celebrar() {
  const colors = ["#E88EBA", "#F4B6CD", "#F8C8DC", "#FFFFFF"];
  confetti({
    particleCount: 140,
    spread: 80,
    origin: { y: 0.6 },
    colors,
  });
}

function normalizarNombreArchivo(nombre: string) {
  return nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_\.]/g, "-")
    .toLowerCase();
}

export function RetoCard({
  reto,
  hecho,
  compacto,
}: {
  reto: Reto;
  hecho: boolean;
  compacto?: boolean;
}) {
  const [suave, setSuave] = useState(false);
  const [foto, setFoto] = useState<File | null>(null);
  const [vistaPrevia, setVistaPrevia] = useState<string | null>(null);
  const completar = useCompletarReto();

  useEffect(() => {
    if (!foto) {
      setVistaPrevia(null);
      return;
    }

    const url = URL.createObjectURL(foto);
    setVistaPrevia(url);

    return () => URL.revokeObjectURL(url);
  }, [foto]);

  function seleccionarFoto(file: File | undefined) {
    if (!file) return;

    const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];
    const tipo = file.type;

    if (!tiposPermitidos.includes(tipo)) {
      toast.error("Selecciona una imagen JPG, PNG o WEBP.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La fotografía no debe superar los 5 MB.");
      return;
    }

    setFoto(file);
  }

  async function onCompletar() {
    if (!foto) {
      toast.error("Debes adjuntar una fotografía como evidencia.");
      return;
    }

    let evidenciaPath: string | null = null;

    try {
      const { data, error: authError } = await supabase.auth.getUser();

      if (authError) throw authError;
      if (!data.user) throw new Error("Tu sesión no es válida.");

      const extensiones: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
      };

      const extension = extensiones[foto.type] ?? "jpg";
      const nombreBase = normalizarNombreArchivo(foto.name.replace(/\.[^/.]+$/, ""));
      const ruta = `${data.user.id}/${fechaLocal()}-${reto.id}-${nombreBase}-${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("evidencias-retos")
        .upload(ruta, foto, {
          contentType: foto.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      evidenciaPath = ruta;

      await completar.mutateAsync({
        retoId: reto.id,
        suave,
        evidenciaPath: ruta,
      });

      celebrar();
      toast.success("¡Reto completado! Tu racha sigue creciendo 🔥");
      setFoto(null);
    } catch (error) {
      if (evidenciaPath) {
        await supabase.storage.from("evidencias-retos").remove([evidenciaPath]);
      }

      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo completar el reto."
      );
    }
  }

  return (
    <div className="card-soft overflow-hidden">
      <div className="bg-hero p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className="rounded-full bg-card px-3 py-1 text-primary">
            Reto del día
          </span>
          <span className="rounded-full bg-card px-3 py-1">
            {reto.categoria}
          </span>
          <span className="rounded-full bg-card px-3 py-1">
            {reto.dificultad}
          </span>
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
              <p className="mt-1 text-sm leading-relaxed">
                {suave ? reto.version_suave : reto.instrucciones}
              </p>
            </div>

            {!hecho && (
              <label className="flex items-center gap-3 rounded-2xl bg-muted p-3 text-sm">
                <Switch checked={suave} onCheckedChange={setSuave} />
                <Feather className="h-4 w-4 text-primary" />
                Usar versión más suave
              </label>
            )}
          </>
        )}

        {hecho ? (
          <div className="flex items-center gap-2 rounded-2xl bg-secondary p-4 font-semibold text-secondary-foreground">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            ¡Completado hoy! Vuelve mañana por un nuevo reto.
          </div>
        ) : (
          <>
            <div className="space-y-3 rounded-2xl bg-muted p-4">
              <div>
                <h3 className="font-semibold">Fotografía de evidencia</h3>
                <p className="text-sm text-muted-foreground">
                  Adjunta una fotografía para registrar tu reto. Es obligatoria.
                  No necesitas mostrar tu rostro.
                </p>
              </div>

              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-full border border-primary p-3 text-sm font-semibold text-primary hover:bg-background">
                <ImagePlus className="h-5 w-5" />
                Seleccionar fotografía
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  disabled={completar.isPending}
                  onChange={(event) =>
                    seleccionarFoto(event.target.files?.[0])
                  }
                />
              </label>

              {foto && (
                <div className="space-y-2">
                  {vistaPrevia && (
                    <img
                      src={vistaPrevia}
                      alt="Vista previa de la evidencia"
                      className="max-h-56 w-full rounded-xl object-contain"
                    />
                  )}
                  <p className="break-all text-xs text-muted-foreground">
                    Fotografía seleccionada: {foto.name}
                  </p>
                  <button
                    type="button"
                    className="text-sm font-semibold text-primary underline"
                    disabled={completar.isPending}
                    onClick={() => setFoto(null)}
                  >
                    Quitar fotografía
                  </button>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Formatos: JPG, PNG o WEBP. Máximo 5 MB.
              </p>
            </div>

            <Button
              size="lg"
              className="w-full rounded-full text-base font-bold shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.02]"
              onClick={onCompletar}
              disabled={completar.isPending || !foto}
            >
              {completar.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Sparkles />
              )}
              {completar.isPending
                ? "Subiendo evidencia..."
                : "Marcar como completado"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}