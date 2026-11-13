import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Camera, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const BUCKET = "evidencias-retos";
const MAX_BYTES = 5 * 1024 * 1024;

export function rutaFoto(userId: string) {
  return `${userId}/perfil/foto`;
}

export function FotoPerfil({ userId, inicial }: { userId: string; inicial: string }) {
  const qc = useQueryClient();
  const input = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(false);

  const foto = useQuery({
    queryKey: ["foto-perfil", userId],
    queryFn: async () => {
      const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(rutaFoto(userId), 3600);
      if (error || !data) return null;
      return `${data.signedUrl}&v=${Date.now()}`;
    },
    staleTime: 30 * 60 * 1000,
  });

  async function alElegir(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Elige un archivo de imagen"); return; }
    if (file.size > MAX_BYTES) { toast.error("La imagen debe pesar menos de 5 MB"); return; }
    setSubiendo(true);
    const ruta = rutaFoto(userId);
    await supabase.storage.from(BUCKET).remove([ruta]);
    const { error } = await supabase.storage.from(BUCKET).upload(ruta, file, { contentType: file.type, cacheControl: "0" });
    setSubiendo(false);
    if (error) { toast.error("No se pudo subir la foto: " + error.message); return; }
    await qc.invalidateQueries({ queryKey: ["foto-perfil", userId] });
    toast.success("Foto de perfil actualizada");
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-20 w-20 overflow-hidden rounded-full bg-gradient-primary">
        {foto.data ? (
          <img src={foto.data} alt="Foto de perfil" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center font-display text-3xl font-bold text-primary-foreground">{inicial}</div>
        )}
        {subiendo && <div className="absolute inset-0 grid place-items-center bg-background/60"><Loader2 className="animate-spin" /></div>}
      </div>
      <input ref={input} type="file" accept="image/*" className="hidden" onChange={alElegir} aria-label="Elegir foto de perfil" />
      <Button type="button" size="sm" variant="outline" className="rounded-full" disabled={subiendo} onClick={() => input.current?.click()}>
        <Camera />{foto.data ? "Cambiar foto" : "Subir foto"}
      </Button>
    </div>
  );
}
