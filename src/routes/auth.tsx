import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Logo } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar · Play Gym" },
      { name: "description", content: "Inicia sesión o crea tu cuenta de Play Gym." },
      { property: "og:title", content: "Entrar · Play Gym" },
      { property: "og:description", content: "Inicia sesión o crea tu cuenta de Play Gym." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

const email = z.string().trim().email("Correo no válido").max(255);
const password = z.string().min(6, "Mínimo 6 caracteres").max(72);
const registro = z.object({ nombre: z.string().trim().min(2, "Escribe tu nombre").max(60), email, password });

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.950 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.730-4.96z"/></svg>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("entrar");
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState({ nombre: "", email: "", password: "" });
  const [enviado, setEnviado] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => data.user && navigate({ to: "/inicio", replace: true }));
    const { data } = supabase.auth.onAuthStateChange((ev, s) => {
      if (ev === "SIGNED_IN" && s) navigate({ to: "/inicio", replace: true });
    });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    const r = z.object({ email, password }).safeParse(f);
    if (!r.success) return toast.error(r.error.issues[0].message);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(r.data);
    setLoading(false);
    if (error) toast.error(error.message === "Invalid login credentials" ? "Correo o contraseña incorrectos" : error.message);
  }

  async function registrar(e: React.FormEvent) {
    e.preventDefault();
    const r = registro.safeParse(f);
    if (!r.success) return toast.error(r.error.issues[0].message);
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: r.data.email,
      password: r.data.password,
      options: { emailRedirectTo: window.location.origin + "/inicio", data: { nombre: r.data.nombre } },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    if (!data.session) setEnviado("Te enviamos un correo para confirmar tu cuenta. Revisa tu bandeja (y spam).");
  }

  async function recuperar(e: React.FormEvent) {
    e.preventDefault();
    const r = email.safeParse(f.email);
    if (!r.success) return toast.error(r.error.issues[0].message);
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(r.data, { redirectTo: window.location.origin + "/reset-password" });
    setLoading(false);
    if (error) return toast.error(error.message);
    setEnviado("Si el correo existe, recibirás un enlace para crear una nueva contraseña.");
  }

  async function google() {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (res.error) toast.error("No se pudo iniciar con Google");
  }

  const campo = (k: keyof typeof f, label: string, type = "text") => (
    <div className="space-y-1.5">
      <Label htmlFor={k}>{label}</Label>
      <Input id={k} type={type} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className="h-11 rounded-xl" />
    </div>
  );
  const boton = (t: string) => (
    <Button type="submit" disabled={loading} className="h-11 w-full rounded-full font-bold">
      {loading && <Loader2 className="animate-spin" />} {t}
    </Button>
  );

  return (
    <div className="grid min-h-screen place-items-center bg-hero px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <div className="card-soft p-6">
          {enviado ? (
            <div className="space-y-4 text-center">
              <p className="text-4xl">💌</p>
              <p className="font-semibold">{enviado}</p>
              <Button variant="outline" className="rounded-full" onClick={() => { setEnviado(null); setTab("entrar"); }}>Volver</Button>
            </div>
          ) : (
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="grid w-full grid-cols-2 rounded-full">
                <TabsTrigger value="entrar" className="rounded-full">Entrar</TabsTrigger>
                <TabsTrigger value="registro" className="rounded-full">Crear cuenta</TabsTrigger>
              </TabsList>
              <TabsContent value="entrar">
                <form onSubmit={entrar} className="mt-4 space-y-4">
                  {campo("email", "Correo electrónico", "email")}
                  {campo("password", "Contraseña", "password")}
                  {boton("Iniciar sesión")}
                  <button type="button" onClick={() => setTab("recuperar")} className="w-full text-center text-sm font-semibold text-primary">¿Olvidaste tu contraseña?</button>
                </form>
              </TabsContent>
              <TabsContent value="registro">
                <form onSubmit={registrar} className="mt-4 space-y-4">
                  {campo("nombre", "Nombre")}
                  {campo("email", "Correo electrónico", "email")}
                  {campo("password", "Contraseña", "password")}
                  {boton("Crear mi cuenta")}
                </form>
              </TabsContent>
              <TabsContent value="recuperar">
                <form onSubmit={recuperar} className="mt-4 space-y-4">
                  <p className="text-sm text-muted-foreground">Escribe tu correo y te enviaremos un enlace.</p>
                  {campo("email", "Correo electrónico", "email")}
                  {boton("Enviar enlace")}
                </form>
              </TabsContent>
              <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border" />o<div className="h-px flex-1 bg-border" /></div>
              <button type="button" onClick={google} className="flex h-11 w-full items-center justify-center gap-[10px] rounded-full border border-[#747775] bg-[#FFFFFF] px-3 text-sm font-medium text-[#1F1F1F]">
                <GoogleIcon /> Continuar con Google
              </button>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
