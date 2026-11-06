import { createFileRoute, Link } from "@tanstack/react-router";
import { BookHeart, Flame, Sparkles, TrendingUp } from "lucide-react";
import { Logo } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero-playgym.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Play Gym · Retos diarios para moverte con alegría" },
      { name: "description", content: "Completa un reto de actividad física cada día, cuida tu racha y escribe tu bitácora personal." },
      { property: "og:title", content: "Play Gym · Retos diarios para moverte con alegría" },
      { property: "og:description", content: "Retos diarios, rachas de constancia y bitácora personal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: Sparkles, t: "Un reto nuevo cada día", d: "Actividades para todas las capacidades, con versión suave." },
  { icon: Flame, t: "Rachas que motivan", d: "Suma días seguidos y supera tu récord personal." },
  { icon: BookHeart, t: "Tu bitácora privada", d: "Escribe cómo te sentiste con preguntas que te guían." },
  { icon: TrendingUp, t: "Progreso visual", d: "Gráficas semanales, mensuales y calendario." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-hero">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Logo />
        <Button asChild variant="outline" className="rounded-full">
          <Link to="/auth">Entrar</Link>
        </Button>
      </header>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-10 md:grid-cols-2 md:py-16">
        <div>
          <span className="rounded-full bg-card px-4 py-1.5 text-sm font-bold text-primary">Tu gym de bolsillo 💗</span>
          <h1 className="mt-5 text-5xl font-bold leading-tight md:text-6xl">
            Muévete un poquito <span className="text-primary">cada día</span>
          </h1>
          <p className="mt-4 max-w-md text-lg text-muted-foreground">
            Retos diarios sencillos, rachas que te motivan y un espacio para escribir cómo te sientes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full px-8 text-base font-bold shadow-[var(--shadow-glow)]">
              <Link to="/auth">Crear mi cuenta gratis</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 text-base">
              <Link to="/auth">Ya tengo cuenta</Link>
            </Button>
          </div>
        </div>
        <img src={hero} alt="Mancuernas, tapete de yoga y tenis en tonos rosas" className="w-full rounded-[2.5rem] shadow-[var(--shadow-glow)]" width={1024} height={1024} />
      </section>
      <section className="mx-auto grid max-w-6xl gap-4 px-5 pb-20 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, t, d }) => (
          <div key={t} className="card-soft lift p-6">
            <Icon className="h-8 w-8 text-primary" />
            <h3 className="mt-3 text-lg font-semibold">{t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
