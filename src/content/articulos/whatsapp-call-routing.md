---
titulo: "Cómo enruta WhatsApp las llamadas: P2P vs relay según el NAT del peer"
descripcion: "Validé con capturas Wireshark/RVI cuándo una llamada de WhatsApp va directa entre pares y cuándo pasa por la infraestructura de Meta. La variable clave es el tipo de NAT."
fecha: 2026-01-20
tags: ["redes", "wireshark", "nat", "whatsapp"]
linkedin: "https://www.linkedin.com/in/tu-perfil/"
destacado: true
---

Hay una creencia extendida de que las llamadas de WhatsApp son siempre P2P de punta a punta. La realidad es más matizada: **el enrutamiento depende del tipo de NAT de cada extremo**. Hice una serie de capturas con Wireshark y RVI (Remote Virtual Interface en iOS) para confirmarlo empíricamente.

## El setup de captura

Para capturar tráfico de un iPhone sin jailbreak se puede usar RVI, que expone una interfaz virtual en macOS espejando el tráfico del dispositivo:

```bash
# Obtener el UDID del dispositivo conectado por USB
idevice_id -l

# Crear la interfaz RVI
rvictl -s <UDID>

# Capturar con tcpdump sobre la interfaz rvi0
sudo tcpdump -i rvi0 -w whatsapp_call.pcap
```

Después abrís el `.pcap` en Wireshark y filtrás por el tráfico relevante. Las llamadas usan principalmente UDP con STUN para el establecimiento.

## Los dos escenarios

El comportamiento se bifurca según cómo esté detrás de NAT el otro extremo:

### Peer en WiFi residencial → P2P directo

Cuando ambos extremos tienen un NAT "amigable" (full cone o restricted cone, típico de un router doméstico), el handshake STUN logra abrir un canal directo. El tráfico de medios fluye **directamente entre las IPs públicas de ambos peers**, sin intermediario. Latencia mínima y sin pasar por servidores de Meta para el audio.

### Peer detrás de CGNAT → relay vía Meta

Acá está lo interesante. Cuando uno de los extremos está detrás de **CGNAT** (Carrier-Grade NAT, lo habitual en datos móviles y en muchos ISP que ya no dan IPv4 pública), el traversal directo falla. En ese caso el tráfico se enruta a través de la **infraestructura relay de Meta**: ambos extremos hablan con un servidor intermedio que reenvía los paquetes.

En la captura esto se ve claro: en vez de tráfico hacia la IP pública del contacto, aparecen flujos hacia rangos de Meta/Facebook.

## Por qué importa

Esto tiene implicancias concretas:

- **Privacidad de IP**: en P2P directo, tu IP pública queda expuesta al otro extremo (relevante para investigaciones, OSINT, o al revés, para entender tu propia exposición).
- **Latencia y calidad**: el relay agrega un salto. Si notás peor calidad en datos móviles, el CGNAT del carrier puede ser la causa.
- **Análisis forense**: saber distinguir un flujo directo de uno relay ayuda a interpretar capturas en una investigación.

La conclusión práctica: **no asumas P2P**. El tipo de NAT de cada extremo decide el camino, y el CGNAT —cada vez más común— fuerza el relay.

---

> Si te interesa el detalle de los filtros de Wireshark que usé para distinguir los flujos, escribime y armo un follow-up.
