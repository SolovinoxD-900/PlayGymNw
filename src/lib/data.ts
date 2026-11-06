import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { calcularRachas, fechaLocal, indiceRetoDelDia } from "@/lib/rachas";

export type Reto = {
  id: number;
  nombre: string;
  descripcion: string;
  instrucciones: string;
  minutos: number;
  dificultad: string;
  categoria: string;
  version_suave: string;
};
export type Completado = { id: string; reto_id: number; fecha: string; version_suave: boolean; created_at: string };
export type Entrada = {
  id: string;
  fecha: string;
  contenido: string;
  respuestas: Record<string, string>;
  created_at: string;
  updated_at: string;
};

async function uid() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Sesión no válida");
  return data.user.id;
}

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => (await supabase.auth.getUser()).data.user,
  });
}

export function usePerfil() {
  return useQuery({
    queryKey: ["perfil"],
    queryFn: async () => {
      const id = await uid();
      const { data, error } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useRetos() {
  return useQuery({
    queryKey: ["retos"],
    staleTime: Infinity,
    queryFn: async () => {
      const { data, error } = await supabase.from("retos").select("*").order("id");
      if (error) throw error;
      return data as Reto[];
    },
  });
}

export function useCompletados() {
  return useQuery({
    queryKey: ["completados"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("retos_completados")
        .select("id, reto_id, fecha, version_suave, created_at")
        .order("fecha", { ascending: false });
      if (error) throw error;
      return data as Completado[];
    },
  });
}

export function retoParaFecha(retos: Reto[], fecha: string) {
  return retos[indiceRetoDelDia(fecha, retos.length)];
}

export function useResumen() {
  const retos = useRetos();
  const comp = useCompletados();
  const hoy = fechaLocal();
  const lista = comp.data ?? [];
  const rachas = calcularRachas(lista.map((c) => c.fecha), hoy);
  return {
    loading: retos.isLoading || comp.isLoading,
    error: retos.error || comp.error,
    retos: retos.data ?? [],
    completados: lista,
    hoy,
    retoHoy: retos.data?.length ? retoParaFecha(retos.data, hoy) : undefined,
    hechoHoy: lista.some((c) => c.fecha === hoy),
    ...rachas,
    total: lista.length,
  };
}

export function useCompletarReto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ retoId, suave }: { retoId: number; suave: boolean }) => {
      const user_id = await uid();
      const { error } = await supabase
        .from("retos_completados")
        .insert({ user_id, reto_id: retoId, fecha: fechaLocal(), version_suave: suave });
      if (error) {
        if (error.code === "23505") throw new Error("Ya completaste el reto de hoy.");
        throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["completados"] }),
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useBitacora() {
  return useQuery({
    queryKey: ["bitacora"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bitacora")
        .select("*")
        .order("fecha", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Entrada[];
    },
  });
}

export function useGuardarEntrada() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (e: { id?: string; contenido: string; respuestas: Record<string, string> }) => {
      if (e.id) {
        const { error } = await supabase
          .from("bitacora")
          .update({ contenido: e.contenido, respuestas: e.respuestas, updated_at: new Date().toISOString() })
          .eq("id", e.id);
        if (error) throw error;
      } else {
        const user_id = await uid();
        const { error } = await supabase
          .from("bitacora")
          .insert({ user_id, fecha: fechaLocal(), contenido: e.contenido, respuestas: e.respuestas });
        if (error) throw error;
      }
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["bitacora"] });
      toast.success(v.id ? "Entrada actualizada" : "Entrada guardada 💗");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useEliminarEntrada() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("bitacora").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bitacora"] });
      toast.success("Entrada eliminada");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export const FRASES = [
  "Cada paso cuenta. ¡Hoy también!",
  "Tu cuerpo te agradece cada movimiento.",
  "La constancia vence al talento.",
  "Pequeños retos, grandes cambios.",
  "Descansar también es parte del progreso.",
  "Hoy es un gran día para moverte.",
  "No se trata de ser perfecta, sino constante.",
];
