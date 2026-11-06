import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronDown, Loader2, Pencil, Trash2, X } from "lucide-react";
import { Cargando, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { type Entrada, useBitacora, useEliminarEntrada, useGuardarEntrada } from "@/lib/data";
import { parseFecha } from "@/lib/rachas";

export const Route = createFileRoute("/_authenticated/bitacora")({
  head: () => ({ meta: [{ title: "Mi bitácora · Play Gym" }, { name: "description", content: "Tu diario personal y privado." }] }),
  component: Bitacora,
});

const PREGUNTAS = [
  "¿Cómo me sentí hoy?",
  "¿Qué fue lo que más disfruté?",
  "¿Qué dificultad encontré?",
  "¿Qué aprendí de mí hoy?",
  "¿Qué quiero mejorar mañana?",
];
const MAX = 5000;

function fechaLarga(f: string) {
  return parseFecha(f).toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function Bitacora() {
  const q = useBitacora();
  const guardar = useGuardarEntrada();
  const eliminar = useEliminarEntrada();
  const [editId, setEditId] = useState<string | undefined>();
  const [texto, setTexto] = useState("");
  const [resp, setResp] = useState<Record<string, string>>({});
  const [abiertas, setAbiertas] = useState(false);
  const [filtro, setFiltro] = useState("");

  function limpiar() {
    setEditId(undefined);
    setTexto("");
    setResp({});
  }
  function editar(e: Entrada) {
    setEditId(e.id);
    setTexto(e.contenido);
    setResp(e.respuestas ?? {});
    setAbiertas(Object.values(e.respuestas ?? {}).some(Boolean));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function onGuardar() {
    const limpio = Object.fromEntries(Object.entries(resp).map(([k, v]) => [k, v.trim().slice(0, 1000)]).filter(([, v]) => v));
    if (!texto.trim() && Object.keys(limpio).length === 0) return toast.error("Escribe algo antes de guardar");
    if (texto.length > MAX) return toast.error("La entrada es demasiado larga");
    guardar.mutate({ id: editId, contenido: texto.trim(), respuestas: limpio }, { onSuccess: limpiar });
  }

  const lista = (q.data ?? []).filter((e) => !filtro || e.fecha === filtro);
  const editando = q.data?.find((e) => e.id === editId);

  return (
    <div className="space-y-6">
      <PageHeader title="Mi bitácora" subtitle="Tu espacio privado. Solo tú puedes leerlo." />
      <div className="card-soft p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold capitalize text-primary">{editando ? `Editando: ${fechaLarga(editando.fecha)}` : fechaLarga(new Date().toLocaleDateString("en-CA"))}</p>
          {editId && <button onClick={limpiar} className="flex items-center gap-1 text-sm text-muted-foreground"><X className="h-4 w-4" />Cancelar</button>}
        </div>
        <Textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          maxLength={MAX}
          placeholder="Escribe aquí tu experiencia de hoy..."
          className="mt-3 min-h-44 rounded-2xl bg-muted text-base"
        />
        <button onClick={() => setAbiertas(!abiertas)} className="mt-4 flex items-center gap-2 text-sm font-bold text-primary">
          <ChevronDown className={`h-4 w-4 transition-transform ${abiertas ? "rotate-180" : ""}`} /> Preguntas guía (opcionales)
        </button>
        {abiertas && (
          <div className="mt-3 grid gap-3">
            {PREGUNTAS.map((p) => (
              <div key={p}>
                <label className="text-sm font-semibold">{p}</label>
                <Input maxLength={1000} value={resp[p] ?? ""} onChange={(e) => setResp({ ...resp, [p]: e.target.value })} className="mt-1 rounded-xl" />
              </div>
            ))}
          </div>
        )}
        <Button onClick={onGuardar} disabled={guardar.isPending} className="mt-5 rounded-full px-8 font-bold">
          {guardar.isPending && <Loader2 className="animate-spin" />} {editId ? "Guardar cambios" : "Guardar entrada"}
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Entradas anteriores</h2>
        <div className="flex items-center gap-2">
          <Input type="date" value={filtro} onChange={(e) => setFiltro(e.target.value)} className="w-44 rounded-xl" aria-label="Filtrar por fecha" />
          {filtro && <Button variant="ghost" size="sm" onClick={() => setFiltro("")}>Ver todas</Button>}
        </div>
      </div>

      {q.isLoading ? <Cargando /> : lista.length === 0 ? (
        <div className="card-soft p-10 text-center text-muted-foreground">
          <p className="text-4xl">📖</p>
          <p className="mt-2">{filtro ? "No hay entradas en esa fecha." : "Tu bitácora está vacía. ¡Escribe tu primera entrada!"}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {lista.map((e) => (
            <article key={e.id} className="card-soft p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-bold capitalize text-primary">{fechaLarga(e.fecha)}</p>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" aria-label="Editar" onClick={() => editar(e)}><Pencil className="h-4 w-4" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Eliminar"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar esta entrada?</AlertDialogTitle>
                        <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => { eliminar.mutate(e.id); if (editId === e.id) limpiar(); }}>Eliminar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              {e.contenido && <p className="mt-2 whitespace-pre-wrap">{e.contenido}</p>}
              {Object.entries(e.respuestas ?? {}).map(([p, v]) => (
                <div key={p} className="mt-3 rounded-2xl bg-muted p-3 text-sm">
                  <p className="font-semibold">{p}</p>
                  <p className="text-muted-foreground">{v}</p>
                </div>
              ))}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
