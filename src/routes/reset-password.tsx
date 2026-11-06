import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nueva contraseña · Play Gym" },
      { name: "description", content: "Crea una nueva contraseña para tu cuenta de Play Gym." },
      { property: "og:title", content: "Nueva contraseña · Play Gym" },
      { property: "og:description", content: "Restablece tu contraseña." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Reset,
});

function Reset() {
  const navigate = useNavigate();
  const [p, setP] = useState("");
  const [p2, setP2] = useState("");
  const [loading, setLoading] = useState(false);

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (p.length < 6) return toast.error("Mínimo 6 caracteres");
    if (p !== p2) return toast.error("Las contraseñas no coinciden");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: p });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Contraseña actualizada");
    navigate({ to: "/inicio" });
  }

  return (
    <div className="grid min-h-screen place-items-center bg-hero px-4">
      <form onSubmit={guardar} className="card-soft w-full max-w-md space-y-4 p-6">
        <div className="flex justify-center"><Logo /></div>
        <h1 className="text-center text-2xl font-bold">Crea tu nueva contraseña</h1>
        <div className="space-y-1.5"><Label htmlFor="p">Nueva contraseña</Label><Input id="p" type="password" value={p} onChange={(e) => setP(e.target.value)} className="h-11 rounded-xl" /></div>
        <div className="space-y-1.5"><Label htmlFor="p2">Confirmar</Label><Input id="p2" type="password" value={p2} onChange={(e) => setP2(e.target.value)} className="h-11 rounded-xl" /></div>
        <Button type="submit" disabled={loading} className="h-11 w-full rounded-full font-bold">{loading && <Loader2 className="animate-spin" />}Guardar</Button>
      </form>
    </div>
  );
}
