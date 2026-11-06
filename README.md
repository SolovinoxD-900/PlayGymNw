# PlayGym

# Prompt: Desarrollo del sitio web "Play Gym"

Objetivo: Crear una plataforma web interactiva enfocada en actividad física, seguimiento de progreso y motivación diaria, con una identidad visual en tonos rosas claros.

# ROL

Actúa como un desarrollador web Full Stack, diseñador UX/UI y especialista en desarrollo de aplicaciones web interactivas. Tu objetivo es diseñar y desarrollar un sitio web funcional, moderno y atractivo llamado **Play Gym**.

# 1. DESCRIPCIÓN GENERAL

Desarrolla una plataforma web llamada **Play Gym**, enfocada en motivar a los usuarios a mantener una rutina de actividad física mediante retos diarios, seguimiento de progreso, rachas de constancia y una bitácora personal.

El sitio debe tener una apariencia juvenil, amigable, dinámica y moderna, con una identidad visual basada principalmente en tonos rosas claros.

# 2. DISEÑO E IDENTIDAD VISUAL

Utiliza una estética moderna, limpia y atractiva.

Paleta de colores:

- Rosa pastel (#F8C8DC).
- Rosa claro (#FCE4EC).
- Rosa suave (#F4B6CD).
- Blanco (#FFFFFF).
- Gris claro (#F5F5F5).
- Rosa intenso (#E88EBA) para botones y elementos destacados.

Características visuales:

- Bordes redondeados.
- Tarjetas con sombras suaves.
- Botones interactivos.
- Iconografía relacionada con el ejercicio y el bienestar.
- Tipografía moderna y legible.
- Animaciones sutiles al interactuar con los elementos.
- Diseño adaptable a computadoras, tabletas y teléfonos móviles.

# 3. MENÚ DE NAVEGACIÓN

Implementa un menú de navegación intuitivo que permita acceder a las siguientes secciones:

1. Inicio: presentación y resumen de la actividad del usuario.
2. Retos diarios: sección donde se muestran los desafíos disponibles.
3. Mi progreso: estadísticas, actividades completadas y evolución.
4. Mi racha: seguimiento de los días consecutivos en los que se completaron retos.
5. Mi bitácora: espacio personal para escribir experiencias.
6. Mi perfil: información y configuración de la cuenta.

El menú debe ser funcional y permitir desplazarse entre todas las secciones.

# 4. REGISTRO E INICIO DE SESIÓN

Implementa un sistema de autenticación de usuarios que permita:

- Crear una cuenta mediante nombre, correo electrónico y contraseña.
- Iniciar y cerrar sesión.
- Recuperar contraseña.
- Guardar la información individual de cada usuario.
- Mantener los datos asociados a su cuenta al cerrar sesión y volver a ingresar.
- Proteger la información personal de cada usuario.

Cada usuario deberá tener un perfil independiente, donde se almacene su progreso, racha, retos y entradas de bitácora.

# 5. SISTEMA DE RETOS DIARIOS

Esta será una de las funciones principales de Play Gym.

Crea una sección de retos diarios que presente al usuario una actividad física diferente cada día.

Cada reto debe incluir:

- Nombre del reto.
- Descripción.
- Instrucciones.
- Duración o tiempo estimado.
- Nivel de dificultad.
- Botón para marcar el reto como completado.

Ejemplos de retos:

- Caminar durante 15 minutos.
- Realizar una sesión suave de estiramientos.
- Practicar ejercicios de movilidad.
- Bailar durante 10 minutos.
- Realizar una actividad recreativa al aire libre.

Incluye actividades adaptables a diferentes capacidades físicas y permite descansar cuando sea necesario.

IMPORTANTE: Cada usuario solamente podrá completar una vez el reto correspondiente a cada fecha.

# 6. SISTEMA DE RACHAS

Implementa un sistema de rachas que motive al usuario a mantener su constancia.

Funcionamiento:

- Cada vez que el usuario complete su reto diario, aumentará su racha.
- Si completa retos en días consecutivos, la racha continuará creciendo.
- Si omite un día, la racha se reiniciará.
- El sistema deberá guardar el récord de la racha más larga.
- Mostrar visualmente los días consecutivos completados.

Incluye:

- Racha actual.
- Récord personal.
- Calendario de actividad.
- Indicador visual de días completados.
- Animación de felicitación al completar un reto.

# 7. BITÁCORA PERSONAL

Crea una sección llamada "Mi bitácora", donde cada usuario pueda registrar su experiencia diaria.

Debe incluir:

- Campo de texto amplio para escribir.
- Fecha automática.
- Botón para guardar la entrada.
- Historial de entradas anteriores.
- Opción para editar o eliminar registros propios.
- Posibilidad de consultar experiencias de días anteriores.

La bitácora debe ser privada y cada entrada deberá guardarse en la cuenta del usuario correspondiente.

Agrega preguntas orientativas opcionales:

- ¿Cómo me sentí hoy?
- ¿Qué fue lo que más disfruté?
- ¿Qué dificultad encontré?
- ¿Qué aprendí de mí hoy?
- ¿Qué quiero mejorar mañana?

# 8. PANEL DE PROGRESO

Desarrolla un apartado visual donde el usuario pueda consultar su evolución.

Incluye:

- Total de retos completados.
- Días activos.
- Racha actual.
- Racha máxima.
- Historial de actividades.
- Gráficas de progreso semanal y mensual.
- Calendario de cumplimiento.

Los datos deben actualizarse automáticamente cada vez que el usuario complete una actividad.

# 9. PÁGINA DE INICIO

Diseña un dashboard de bienvenida que muestre:

- Mensaje personalizado con el nombre del usuario.
- Reto del día.
- Racha actual.
- Resumen de progreso.
- Acceso rápido a la bitácora.
- Mensajes motivacionales.
- Indicador de actividad diaria.

La página debe ser visualmente atractiva y facilitar que el usuario encuentre rápidamente sus actividades.

# 10. BASE DE DATOS Y FUNCIONALIDAD

Implementa una base de datos que permita almacenar de manera persistente:

- Usuarios.
- Información del perfil.
- Retos diarios.
- Retos completados.
- Rachas actuales y máximas.
- Entradas de bitácora.
- Historial de progreso.

Utiliza una solución adecuada para autenticación y almacenamiento de datos, como Supabase o Firebase.

No utilices datos simulados como sustituto de las funciones reales. Si alguna funcionalidad todavía no está conectada, indícalo claramente.

# 11. EXPERIENCIA DE USUARIO

El sitio debe ser intuitivo y fácil de utilizar.

Incluye:

- Mensajes de confirmación.
- Indicadores de carga.
- Notificaciones de éxito y error.
- Validación de formularios.
- Estados vacíos con mensajes amigables.
- Navegación sencilla.
- Diseño responsivo.

# 12. REQUISITOS TÉCNICOS

- Desarrolla una aplicación web funcional.
- Organiza el código de forma limpia y modular.
- Utiliza tecnologías modernas de desarrollo web.
- Implementa autenticación segura.
- Conecta las funciones con una base de datos real.
- Evita errores de navegación y almacenamiento.
- Comprueba que las funciones principales trabajen correctamente.
- Garantiza que los datos de cada usuario permanezcan separados.

# 13. RESULTADO FINAL

Entrega un sitio web completo llamado **Play Gym**, con diseño profesional en tonos rosas claros y todas las funcionalidades descritas.

El resultado debe sentirse como una aplicación real de bienestar y actividad física, no como una simple página informativa.

Prioriza especialmente:

1. El registro e inicio de sesión.
2. El funcionamiento de los retos diarios.
3. El sistema automático de rachas.
4. La bitácora personal con almacenamiento permanente.
5. El seguimiento visual del progreso.

Desarrolla las páginas, componentes, interacciones y conexiones necesarias. No te limites a mostrar una maqueta: implementa las funcionalidades reales y verifica su funcionamiento.
utilizar React para la interfaz y Supabase para la autenticación y almacenamiento de datos. Esto permitirá que Play Gym tenga cuentas individuales y que cada usuario conserve su progreso incluso después de cerrar sesión.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/632e39b0-5b22-4959-8ff1-b3d0fbb17e85).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
