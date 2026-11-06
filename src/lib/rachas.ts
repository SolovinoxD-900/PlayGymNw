// Fechas locales en formato YYYY-MM-DD
export function fechaLocal(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseFecha(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function sumarDias(s: string, n: number): string {
  const d = parseFecha(s);
  d.setDate(d.getDate() + n);
  return fechaLocal(d);
}

function diaNumero(s: string): number {
  const [y, m, d] = s.split("-").map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 86400000);
}

/** Índice del reto del día: igual para todos según la fecha. */
export function indiceRetoDelDia(fecha: string, total: number): number {
  if (total <= 0) return 0;
  return ((diaNumero(fecha) % total) + total) % total;
}

/** Calcula racha actual y récord a partir de las fechas completadas. */
export function calcularRachas(fechas: string[], hoy: string) {
  const unicos = Array.from(new Set(fechas)).sort();
  let record = 0;
  let corrida = 0;
  let prev: number | null = null;
  for (const f of unicos) {
    const n = diaNumero(f);
    corrida = prev !== null && n === prev + 1 ? corrida + 1 : 1;
    record = Math.max(record, corrida);
    prev = n;
  }
  let actual = 0;
  const set = new Set(unicos);
  let cursor = set.has(hoy) ? hoy : sumarDias(hoy, -1);
  while (set.has(cursor)) {
    actual++;
    cursor = sumarDias(cursor, -1);
  }
  return { actual, record, diasActivos: unicos.length };
}
