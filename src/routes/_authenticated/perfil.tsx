import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Cargando, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePerfil, useResumen, useUser } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/perfil")({
  head: () => ({ meta: [{ title: "Mi perfil · Play Gym" }, { name: "description", content: "Tu información y configuración." }] }),
  component: Perfil,
});

function Perfil() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const user = useUser();
  const perfil = usePerfil();
  const r = useResumen();
  const [nombre, setNombre] = useState("");
  const [nivel, setNivel] = useState("principiante");
  const [saving, setSaving] = useState(false);
  const [pwd, setPwd] = useState({ actual: "", nueva: "" });
  const [savingPwd, setSavingPwd] = useState(false);

  useEffect(() => {
    if (perfil.data) {
      setNombre(perfil.data.nombre);
      setNivel(perfil.data.nivel);
    }
  }, [perfil.data]);

  if (perfil.isLoading || user.isLoading) return <Cargando />;

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    const n = nombre.trim();
    if (n.length < 2 || n.length > 60) return toast.error("El nombre debe tener entre 2 y 60 caracteres");
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ nombre: n, nivel }).eq("id", user.data!.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["perfil"] });
    toast.success("Perfil actualizado");
  }

  async function cambiarPwd(e: React.FormEvent) {
    e.preventDefault();
    if (pwd.nueva.length < 6) return toast.error("La nueva contraseña debe tener mínimo 6 caracteres");
    setSavingPwd(true);
    const { error } = await supabase.auth.updateUser({ password: pwd.nueva, current_password: pwd.actual } as never);
    setSavingPwd(false);
    if (error) return toast.error(error.message);
    setPwd({ actual: "", nueva: "" });
    toast.success("Contraseña actualizada");
  }

  async function salir() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const inicial = (perfil.data?.nombre || "P").charAt(0).toUpperCase();
  return (
    <div className="space-y-6">
      <PageHeader title="Mi perfil" />
      <div className="card-soft flex items-center gap-4 bg-hero p-6">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-primary font-display text-2xl font-bold text-primary-foreground">{inicial}</div>
        <div>
          <p className="text-xl font-bold">{perfil.data?.nombre}</p>
          <p className="text-sm text-muted-foreground">{user.data?.email}</p>
          <p className="text-xs text-muted-foreground">
            Miembro desde {perfil.data && new Date(perfil.data.created_at).toLocaleDateString("es-MX", { month: "long", year: "numeric" })} · {r.total} retos
          </p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <form onSubmit={guardar} className="card-soft space-y-4 p-6">
          <h2 className="text-lg font-semibold">Información</h2>
          <div className="space-y-1.5"><Label htmlFor="nombre">Nombre</Label><Input id="nombre" value={nombre} maxLength={60} onChange={(e) => setNombre(e.target.value)} className="rounded-xl" /></div>
          <div className="space-y-1.5">
            <Label>Nivel</Label>
            <Select value={nivel} onValueChange={setNivel}>
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="principiante">Principiante</SelectItem>
                <SelectItem value="intermedio">Intermedio</SelectItem>
                <SelectItem value="avanzado">Avanzado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={saving} className="rounded-full font-bold">{saving && <Loader2 className="animate-spin" />}Guardar</Button>
        </form>
        <form onSubmit={cambiarPwd} className="card-soft space-y-4 p-6">
          <h2 className="text-lg font-semibold">Cambiar contraseña</h2>
          <div className="space-y-1.5"><Label htmlFor="pa">Contraseña actual</Label><Input id="pa" type="password" value={pwd.actual} onChange={(e) => setPwd({ ...pwd, actual: e.target.value })} className="rounded-xl" /></div>
          <div className="space-y-1.5"><Label htmlFor="pn">Nueva contraseña</Label><Input id="pn" type="password" value={pwd.nueva} onChange={(e) => setPwd({ ...pwd, nueva: e.target.value })} className="rounded-xl" /></div>
          <Button type="submit" variant="outline" disabled={savingPwd} className="rounded-full font-bold">{savingPwd && <Loader2 className="animate-spin" />}Actualizar contraseña</Button>
        </form>
      </div>
      <Button variant="outline" onClick={salir} className="rounded-full"><LogOut />Cerrar sesión</Button>
    </div>
  );
}
