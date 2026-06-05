---
titulo: "Entendemos cómo funcionan nuestras llamadas de WhatsApp y sus mecanismos de seguridad?"
descripcion: "Cifrado de extremo a extremo, metadatos, IP pública y la opción que WhatsApp te da para protegerte. Resultados de analizar el tráfico con Wireshark."
fecha: 2026-06-05
tags: ["whatsapp", "privacidad", "redes", "wireshark", "metadatos"]
linkedin: "https://www.linkedin.com/in/angelmartinperdomo/"
destacado: true
---

Siempre supe que el audio de las llamadas de WhatsApp va cifrado de punta a punta. Lo que no tenía claro era qué pasaba con todo lo demás, así que agarré Wireshark y me puse a mirar el tráfico de mis propias llamadas. Spoiler: el cifrado funciona, pero hay información que viaja por fuera.

Casi todos pensamos: "WhatsApp tiene cifrado de extremo a extremo, entonces mi llamada es 100% privada". Y es verdad… a medias.

Hay que separar los tantos; una cosa es el **contenido** (audio, imagen) —eso sí está blindado— pero por otro lado tenemos los **metadatos** (datos de cómo y desde dónde te conectás). El cifrado protege lo primero. Lo segundo es otra historia.

## ¿Por qué es de esta forma? (sin tecnicismos)

Para que dos teléfonos se manden audio directamente entre ellos (que es lo más rápido y da mejor calidad), cada uno necesita saber "la dirección" del otro en internet. Esa dirección es la **IP pública**.

Es como mandar una carta: si querés que llegue directo, necesitás la dirección del destinatario, y él la tuya para contestarte. En una llamada directa, los dos extremos se "ven" la IP mutuamente. No hay forma de evitarlo si la conexión es directa: es la dirección a la que viaja el audio.

A esta conexión directa se la llama **P2P** (punto a punto). Es el modo que utiliza WhatsApp cuando se puede, y no es exclusivo de WhatsApp —lo usan otras apps, prácticamente todo lo que transmite voz o video en tiempo real.

La alternativa es que la llamada pase por un **servidor intermedio** que reenvía el audio (se llama relay). Ahí los extremos no se ven la IP entre sí (solo ven la del servidor), pero la llamada da un pequeño rodeo y pierde un poco de calidad.

## ¿Qué se puede saber con tu IP… y qué no?

Acá es donde no hay que dejarse llevar por las películas.

**Lo que NO se puede:**

- Escuchar tu llamada. Imposible. El audio está cifrado de punta a punta, pase por donde pase.
- Saber tu dirección exacta. La IP no te pone un pin en tu casa.
- "Hackearte" con solo tener tu IP. La IP no es una contraseña ni una llave. Por sí sola no le abre nada a nadie.

**Lo que SÍ se puede:**

- Saber tu proveedor de internet (Antel, por ejemplo) y si te estás conectando desde una red fija residencial o desde datos móviles.
- Inferir que estás conectado desde tu casa en ese momento.
- Una ubicación aproximada y muchas veces imprecisa.

## ¿Qué hay de la geolocalización en Uruguay?

Acá quiero detenerme para no caer en el alarmismo, porque se dice muchas veces "te pueden geolocalizar por la IP" como si fuera magia, y en nuestro contexto no es para tanto.

Uruguay es un país chico. La mayoría de las conexiones salen por Antel, y los rangos de direcciones no están separados por localidad. Cuando alguien mete una IP uruguaya en servicios de "geolocalización por IP", lo más probable es que le devuelva algo genérico como "Uruguay, Montevideo", aunque la persona esté en Minas, Maldonado o donde sea. Hay pocos nodos posibles.

Por lo cual, conocer la IP pública de alguien no es una herramienta para saber dónde vive. Para la mayoría de las personas, esto no representa un riesgo real.

Pero el problema de la IP no es tanto que te ubiquen en el mapa. Es que esa metadata que se filtra puede usarse para **perfilar y correlacionar**. Que alguien sepa tu proveedor, tu tipo de conexión, y que estás en casa en tal momento, no suena dramático hasta que se combina con otros datos. La IP rara vez es peligrosa sola, pero puede cobrar cierto riesgo si se usa como pieza que se cruza con otra información.

## ¿Cuándo importa de verdad?

Para la mayoría de nosotros, llamando a la familia y a los amigos, esto es más una curiosidad técnica que un riesgo real.

Pero el escenario cambia si sos periodista, activista, hablás con desconocidos por trabajo o estás en una situación delicada. En contextos de alto riesgo, la IP puede ser el primer dato que usa un atacante para algo más serio. La propia Meta menciona que las llamadas pueden ser un vector de ataques sofisticados (llegaron a citar el caso del spyware Pegasus), y que conseguir la IP del objetivo es parte de eso.

No es para asustarse. Es para dimensionar: para casi todos, irrelevante; para algunos perfiles, muy relevante.

## ¿Y se puede hacer algo al respecto?

Lo bueno es que WhatsApp nos da el control, y mucha gente no conoce que la opción existe.

**La opción "Proteger dirección IP en las llamadas"**: está en Ajustes → Privacidad → Avanzado. Cuando se activa, todas las llamadas pasan por los servidores de WhatsApp (modo relay) en vez de ir directas. Resultado: la otra persona ya no ve tu IP. El costo es una leve bajada en la calidad, imperceptible para la mayoría de los casos. En nosotros está ver si nos preocupa la calidad o la privacidad.

**Un dato curioso**: en datos móviles ya estás más protegido. Por cómo funcionan las redes celulares (comparten una misma salida entre muchísimos clientes), tu teléfono en datos móviles es prácticamente inalcanzable de forma directa. Así que, sin tocar nada, una llamada por datos tiende a no exponer tu IP de la misma forma que una por WiFi de tu casa.

## Para cerrar

El cifrado de WhatsApp protege muy bien lo que decimos. Eso está fuera de discusión y es una gran noticia. Pero la privacidad es más que el contenido —también es la metadata, esos datos sobre nuestra conexión que se filtran sin que nadie escuche una palabra de la charla.

La idea de esta publicación no es asustar (ya vimos que para la mayoría no hay mucho de qué preocuparse, y menos en Uruguay) sino entender cómo funciona lo que usamos todos los días. Entenderlo nos permite decidir, saber que la opción existe y que en nosotros está la decisión de mantenernos un poco más seguros.

Para los que les interese, en estos días estaré publicando el detalle técnico de cómo realicé estas pruebas y un hallazgo sobre las redes móviles que la documentación oficial no menciona.
