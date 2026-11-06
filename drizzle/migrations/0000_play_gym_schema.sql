CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre text NOT NULL DEFAULT '',
  nivel text NOT NULL DEFAULT 'principiante',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nombre', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)));
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.retos (
  id serial PRIMARY KEY,
  nombre text NOT NULL,
  descripcion text NOT NULL,
  instrucciones text NOT NULL,
  minutos int NOT NULL,
  dificultad text NOT NULL,
  categoria text NOT NULL,
  version_suave text NOT NULL
);
GRANT SELECT ON public.retos TO authenticated;
GRANT ALL ON public.retos TO service_role;
ALTER TABLE public.retos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "retos readable" ON public.retos FOR SELECT TO authenticated USING (true);

CREATE TABLE public.retos_completados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  reto_id int NOT NULL REFERENCES public.retos(id),
  fecha date NOT NULL,
  version_suave boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, fecha)
);
GRANT SELECT, INSERT, DELETE ON public.retos_completados TO authenticated;
GRANT ALL ON public.retos_completados TO service_role;
ALTER TABLE public.retos_completados ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own done select" ON public.retos_completados FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own done insert" ON public.retos_completados FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.bitacora (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  fecha date NOT NULL DEFAULT current_date,
  contenido text NOT NULL DEFAULT '',
  respuestas jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bitacora TO authenticated;
GRANT ALL ON public.bitacora TO service_role;
ALTER TABLE public.bitacora ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own log select" ON public.bitacora FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own log insert" ON public.bitacora FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own log update" ON public.bitacora FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own log delete" ON public.bitacora FOR DELETE TO authenticated USING (auth.uid() = user_id);

INSERT INTO public.retos (nombre, descripcion, instrucciones, minutos, dificultad, categoria, version_suave) VALUES
('Caminata energizante','Sal a caminar y despeja la mente.','Camina a ritmo cómodo. Mantén la espalda recta y respira profundo. Aumenta el paso en los últimos 5 minutos.',15,'Fácil','Cardio','Camina 8 minutos dentro de casa o en el pasillo.'),
('Estiramiento suave','Una sesión para soltar tensiones.','Estira cuello, hombros, espalda, cadera y piernas. Mantén cada postura 30 segundos sin rebotar.',10,'Fácil','Flexibilidad','Haz los estiramientos sentado en una silla.'),
('Movilidad articular','Despierta todas tus articulaciones.','Haz 10 círculos con tobillos, rodillas, cadera, hombros, muñecas y cuello, en ambas direcciones.',8,'Fácil','Movilidad','Hazlo sentado, solo con la parte superior del cuerpo.'),
('Fiesta de baile','Pon tu música favorita y muévete.','Elige 3 canciones animadas y baila sin parar. No importa cómo, ¡solo disfruta!',10,'Fácil','Cardio','Baila una sola canción o muévete sentado.'),
('Aventura al aire libre','Haz una actividad recreativa afuera.','Sal a un parque: juega con una pelota, anda en bici o explora a pie.',20,'Media','Recreación','Siéntate al aire libre 10 minutos y haz respiraciones.'),
('Respiración consciente','Calma tu cuerpo con la respiración.','Inhala 4 segundos, sostén 4, exhala 6. Repite durante todo el tiempo con los ojos cerrados.',5,'Fácil','Bienestar','Hazlo 2 minutos.'),
('Sentadillas felices','Fortalece tus piernas.','Haz 3 series de 12 sentadillas con descanso de 1 minuto. Baja como si te sentaras en una silla.',10,'Media','Fuerza','Sentadillas a una silla: siéntate y levántate 8 veces.'),
('Plancha retadora','Activa tu abdomen.','Haz 4 planchas de 20-30 segundos, descansando 30 segundos entre cada una.',6,'Media','Fuerza','Plancha con rodillas apoyadas o contra la pared.'),
('Yoga para empezar','Una secuencia de yoga básica.','Postura de montaña, perro boca abajo, gato-vaca, niño y guerrero I. 1 minuto en cada una.',12,'Fácil','Flexibilidad','Solo gato-vaca y postura del niño.'),
('Escaleras activas','Sube y baja escaleras.','Sube y baja un tramo de escaleras 8 veces a tu ritmo. Usa el barandal si lo necesitas.',10,'Media','Cardio','Sube un escalón y baja, 20 veces.'),
('Día de descanso activo','Descansar también es entrenar.','Haz una caminata muy ligera o estiramientos suaves, y bebe mucha agua hoy.',10,'Fácil','Descanso','Descansa y estira 3 minutos.'),
('Saltos de tijera','Eleva tu ritmo cardíaco.','Haz 4 rondas de 30 segundos de saltos de tijera con 30 segundos de descanso.',6,'Media','Cardio','Abre y cierra brazos y piernas sin saltar.'),
('Fuerza de brazos','Tonifica brazos y hombros.','3 series de 10 lagartijas (puedes apoyar rodillas) y 15 círculos de brazos.',10,'Media','Fuerza','Lagartijas contra la pared, 10 repeticiones.'),
('Equilibrio zen','Mejora tu balance.','Párate en un pie 30 segundos, cambia. Repite 4 veces por lado. Luego camina en línea recta.',8,'Fácil','Movilidad','Hazlo apoyándote en una silla.'),
('Paseo con música','Camina con tu playlist favorita.','Camina al ritmo de la música durante todo el tiempo. Cambia de ritmo con cada canción.',20,'Fácil','Cardio','Camina 10 minutos.'),
('Circuito en casa','Un mini circuito completo.','3 rondas: 10 sentadillas, 10 lagartijas, 20 segundos de plancha, 20 saltos de tijera.',15,'Difícil','Fuerza','2 rondas con versiones apoyadas.'),
('Estiramiento nocturno','Prepárate para dormir mejor.','Antes de dormir: estira piernas, espalda y cuello en la cama. Respira lento.',8,'Fácil','Flexibilidad','Solo respiraciones lentas y estirar brazos.'),
('Juego activo','Juega como cuando eras niño.','Salta la cuerda, juega con la pelota, avioncito o cualquier juego que te haga moverte.',15,'Media','Recreación','Lanza y atrapa una pelota sentado.'),
('Zancadas al paso','Trabaja piernas y glúteos.','3 series de 10 zancadas por pierna. Mantén la rodilla delantera sobre el tobillo.',10,'Media','Fuerza','Zancadas cortas sujetándote de una silla.'),
('Bailoterapia latina','Salsa, cumbia o merengue.','Pon música latina y sigue pasos básicos durante todo el tiempo.',15,'Media','Cardio','Mueve caderas y brazos durante 2 canciones.'),
('Pausa activa','Rompe el sedentarismo.','Cada hora de hoy levántate y muévete 2 minutos. Completa al menos 5 pausas.',10,'Fácil','Bienestar','Haz 3 pausas.'),
('Movilidad de espalda','Cuida tu columna.','Gato-vaca 10 veces, torsiones sentado 10 por lado, rodillas al pecho 1 minuto.',8,'Fácil','Movilidad','Solo torsiones sentado.'),
('Trote suave','Un trote ligero y constante.','Trota a ritmo conversacional. Alterna 2 minutos trotando y 1 caminando.',20,'Difícil','Cardio','Caminata rápida de 15 minutos.'),
('Abdomen amable','Fortalece tu centro.','3 series: 10 abdominales cortos, 10 elevaciones de piernas, 20 segundos de puente.',10,'Media','Fuerza','Solo el puente de glúteos, 3 veces 20 segundos.'),
('Naturaleza y calma','Conecta con lo verde.','Camina en un parque observando árboles y sonidos. Sin celular.',20,'Fácil','Recreación','Observa por la ventana y respira 5 minutos.'),
('Burpees valientes','Un reto intenso y corto.','5 rondas de 6 burpees con 45 segundos de descanso.',8,'Difícil','Cardio','Burpees sin salto ni lagartija.'),
('Estiramiento de cadera','Libera la cadera.','Postura de mariposa, paloma y estocada baja. 1 minuto por lado cada una.',10,'Fácil','Flexibilidad','Mariposa sentado 2 minutos.'),
('Sombra de boxeo','Golpea el aire con energía.','Rondas de 1 minuto lanzando golpes rectos y ganchos, descanso de 30 segundos. 6 rondas.',10,'Media','Cardio','Hazlo sentado, 3 rondas.'),
('Gratitud en movimiento','Mueve tu cuerpo y agradece.','Camina despacio y piensa en 5 cosas que agradeces de tu cuerpo.',10,'Fácil','Bienestar','Siéntate y nómbralas respirando.'),
('Reto de constancia','Combina lo mejor de la semana.','5 min caminata, 5 min estiramiento, 5 min baile y 2 min respiración.',17,'Media','Bienestar','Elige solo dos partes.');