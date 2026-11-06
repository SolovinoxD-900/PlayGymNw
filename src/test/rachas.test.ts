import { describe, expect, it } from "vitest";
import { calcularRachas, indiceRetoDelDia } from "@/lib/rachas";

describe("rachas", () => {
  it("cuenta días consecutivos hasta hoy", () => {
    expect(calcularRachas(["2026-11-04", "2026-11-05", "2026-11-06"], "2026-11-06").actual).toBe(3);
  });
  it("sigue viva si el último día fue ayer", () => {
    expect(calcularRachas(["2026-11-04", "2026-11-05"], "2026-11-06").actual).toBe(2);
  });
  it("se reinicia si se omite un día", () => {
    expect(calcularRachas(["2026-11-01", "2026-11-02", "2026-11-04"], "2026-11-06").actual).toBe(0);
  });
  it("guarda el récord más largo", () => {
    const r = calcularRachas(["2026-10-01", "2026-10-02", "2026-10-03", "2026-10-04", "2026-11-05", "2026-11-06"], "2026-11-06");
    expect(r.record).toBe(4);
    expect(r.actual).toBe(2);
  });
  it("cruza cambio de mes", () => {
    expect(calcularRachas(["2026-10-31", "2026-11-01"], "2026-11-01").actual).toBe(2);
  });
  it("el reto del día es estable para una fecha", () => {
    expect(indiceRetoDelDia("2026-11-06", 30)).toBe(indiceRetoDelDia("2026-11-06", 30));
    expect(indiceRetoDelDia("2026-11-07", 30)).not.toBe(indiceRetoDelDia("2026-11-06", 30));
  });
});
