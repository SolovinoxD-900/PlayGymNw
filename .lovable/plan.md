# Play Gym – Plan

Una app de bienestar con cuentas reales, retos diarios, rachas automáticas, bitácora privada y panel de progreso. Todo el sitio usa una paleta rosa pastel.

## Backend (Lovable Cloud)
- Registro con nombre, correo y contraseña. Inicio y cierre de sesión. Recuperación de contraseña con página `/reset-password`.
- Tablas, cada una visible solo para su dueño:
  - **perfiles**: nombre, avatar opcional, nivel preferido y fecha de alta. Se crea solo al registrarse.
  - **retos**: catálogo de unos 30 retos sembrados al inicio (caminar, estiramientos, movilidad, baile, aire libre, respiración, día de descanso activo…), cada uno con nombre, descripción, instrucciones, minutos, dificultad, categoría y una versión más suave.
  - **retos_completados**: usuario, reto, fecha y nota. La base de datos impide completar más de un reto por usuario y día.
  - **bitacora**: usuario, fecha, texto y respuestas a las preguntas guía. Se puede crear, editar y borrar.
- Reto del día: se elige igual para todos según la fecha, rotando el catálogo.
- Rachas: se calculan a partir de los días completados. La racha actual sigue viva si el último día completado fue hoy o ayer. El récord es la serie consecutiva más larga. Por eso nunca se desincronizan.

## Páginas (menú lateral en escritorio, barra inferior en móvil)
1. **Landing pública** (`/`) y **Acceso** (`/auth`), con pestañas para entrar, registrarse y recuperar contraseña.
2. **Inicio** (`/inicio`): saludo con el nombre, reto del día, racha, resumen semanal, frase motivacional, indicador de hoy y acceso rápido a la bitácora.
3. **Retos diarios** (`/retos`): tarjeta grande del reto de hoy con el botón "Completar" (se bloquea después de completarlo), opción de versión suave, aviso de que descansar está bien y los próximos retos.
4. **Mi progreso** (`/progreso`): totales, días activos, racha actual y máxima, gráficas semanal y mensual (recharts), calendario de cumplimiento e historial.
5. **Mi racha** (`/racha`): racha actual con una llama animada, récord, calendario mensual con los días marcados y la tira de días consecutivos.
6. **Mi bitácora** (`/bitacora`): editor amplio con la fecha automática, preguntas guía que se pueden desplegar, historial filtrable por fecha, y edición y borrado con confirmación.
7. **Mi perfil** (`/perfil`): editar nombre y nivel, cambiar contraseña y cerrar sesión.

## Experiencia
- Animación de felicitación (confeti) al completar un reto.
- Notificaciones de éxito y error, indicadores de carga, estados vacíos amables y formularios validados.
- Tipografía Fredoka para títulos y Nunito para texto, bordes redondeados, sombras suaves e iconos de lucide.

## Detalles técnicos
- TanStack Start con rutas protegidas bajo `_authenticated`. Los datos se leen con TanStack Query y se invalidan al completar un reto, así todo se actualiza solo.
- Restricción única en (user_id, fecha) y RLS con `auth.uid()` en todas las tablas de usuario. El catálogo de retos es de solo lectura para usuarios autenticados.
- Las fechas usan el día local del usuario.
- Tests de la lógica de rachas: días consecutivos, día omitido y cálculo del récord.
