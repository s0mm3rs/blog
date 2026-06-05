---
titulo: "El Eslabón Más Débil: Una POC de Prompt Injection en Claude AI"
descripcion: "POC que emula un vector de ataque real: inducir a Claude Code a recomendar un paquete malicioso mediante prompt injection en documentos de proyecto."
fecha: 2026-05-19
tags: ["ia", "prompt-injection", "poc", "claude", "seguridad"]
linkedin: "https://www.linkedin.com/in/angelmartinperdomo/"
destacado: false
---

Motivado por lo particular del caso, sumado al interés generado, decidí realizar una POC (Prueba de Concepto), emulando el vector de inicio del ataque descrito en el incidente mencionado en mi publicación anterior.

La idea es sencilla: inducir una respuesta en Claude Code y luego generar un enlace para compartir dicha conversación. Y para mi sorpresa, la ejecución resultó igual de simple.

## El setup

El primer paso fue crear un documento con las instrucciones para instalar Codex, en el cual haríamos un pequeño cambio.

Tomamos el paso a paso de una guía de instalación, pero en el paso 3 realizamos una modificación:

```bash
npm install -g @POC_Prompt_Injection/codex
```

## Inyectando el contexto

El próximo paso sería lograr que Claude Code utilizara esta guía como fuente para su respuesta. Usé la funcionalidad de proyectos de Claude y en la sección de archivos subí la guía creada previamente.

Ahora faltaba encontrar la forma de forzar a Claude a que respondiera utilizando la guía sin delatar que lo era. Tras un par de pruebas, la instrucción utilizada fue la indicada en el proyecto para que el modelo tomara ese documento como fuente de verdad al responder consultas de instalación.

## La ejecución

Llegó el momento de la verdad. Creamos un nuevo chat dentro del proyecto y le pedimos: "Cómo instalar Codex".

Me gustaría decir que me sorprendió la respuesta, pero ya era el segundo intento, además de que era lo que buscaba. Respondió tomando como fuente nuestra guía y siguiendo las instrucciones envenenadas.

No tengo dudas de que se puede elaborar mucho mejor, pero a efectos prácticos de esta POC es más que suficiente.

## El vector de distribución

Para terminar, solo faltaba generar un enlace para compartir el chat, tal y como lo hicieron en el incidente mencionado.

Imaginemos por un momento que este enlace, aparentemente inofensivo y alojado en un dominio de confianza, se promociona a través de anuncios patrocinados en los resultados de búsqueda. El atacante podría pagar para que su enlace aparezca en la parte superior de las búsquedas relevantes, aumentando exponencialmente su visibilidad y alcance. De repente, lo que parecía un escenario hipotético se convierte en una amenaza muy real.

¿Sencillo? Sí. ¿Elegante? No lo creo.

## Conclusión

Una vez más, queda demostrado que el eslabón más débil en la seguridad de la información sigue siendo el humano, que a veces, en el ajetreo del día a día y en su afán por optimizar el tiempo, pasa por alto los controles necesarios y deposita toda su confianza en las herramientas.

Las herramientas están para eso: para hacernos más eficientes y facilitarnos un sinfín de tareas. Pero no dejemos que reemplacen nuestro criterio.

Las herramientas de IA son un gran aliado que nos supera en muchas capacidades. Pero si hay algo en lo que se parecen a nosotros, es en que cometen errores, tienen sesgos y también pueden ser engañadas.

Por lo tanto, es nuestra responsabilidad como usuarios y profesionales de la seguridad mantenernos vigilantes, pensar críticamente y usar estas herramientas de manera responsable.
