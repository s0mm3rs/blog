---
titulo: "¿Alguna vez necesitaron instalar CrowdStrike en un sistema operativo no soportado oficialmente?"
descripcion: "POC de instalación de Falcon Sensor sobre Arch Linux, una distribución fuera de la lista oficial de compatibilidad de CrowdStrike."
fecha: 2026-05-30
tags: ["crowdstrike", "linux", "arch", "endpoint", "seguridad"]
linkedin: "https://www.linkedin.com/in/angelmartinperdomo/"
destacado: false
---

En la realidad de algunos entornos empresariales nos encontramos con equipos que, por distintos motivos, utilizan distribuciones Linux fuera de la lista oficial de compatibilidad de CrowdStrike.

En mi caso, necesitaba instalar Falcon Sensor sobre **Arch Linux**.

Arch tiene una particularidad importante: no está basada en otra distribución, utiliza un modelo Rolling Release y no cuenta con soporte oficial por parte de CrowdStrike.

Eso implica un disclaimer importante: **esto no cuenta con soporte oficial de la marca**. Por lo tanto, no existe garantía de que todas las funcionalidades del sensor operen exactamente igual que en una distribución soportada.

Aun así, me pareció interesante compartir la experiencia y la POC, ya que puede ser útil para otros que se enfrenten a una situación similar y prefieran contar con cierta cobertura de seguridad antes que dejar el equipo completamente desprotegido.

## Investigación inicial

Lo primero que hice fue consultar la IA de soporte de CrowdStrike.

La respuesta indicaba que el sensor posiblemente funcionaría bajo dos escenarios:

- **Funcionamiento en User Mode**, siempre que el kernel cumpliera determinados requisitos.
- **Ejecución en Reduced Functionality Mode (RFM)** si no se cumplían ciertas capacidades necesarias.

Después de eso, tocaba resolver otra pregunta: ¿cómo instalar un paquete pensado para otra distribución en Arch Linux?

Investigando encontré [este foro en AUR](https://aur.archlinux.org/packages/falcon-sensor) que me dio la base — toman el paquete oficial, extraen su contenido y lo reempaquetan para Arch.

Ya que no íbamos a redistribuir el paquete, decidí evitar el reempaquetado y trabajar directamente sobre los archivos originales.

Revisando los instaladores disponibles en la consola de CrowdStrike noté que los paquetes de Ubuntu y Debian tenían exactamente el mismo checksum. Eso me llevó a asumir que el contenido no estaba fuertemente atado a una distribución específica.

Con esa hipótesis tomé una máquina virtual con Arch Linux y comencé las pruebas.

## Instalación de Falcon Sensor en Arch Linux

### 1. Instalar las herramientas necesarias

```bash
sudo pacman -S base-devel
```

`base-devel` se utiliza para extraer el contenido del paquete.

### 2. Crear directorio de trabajo

```bash
mkdir falcon
cd falcon
```

### 3. Extraer el paquete .deb

```bash
bsdtar -xf ../falcon-sensor_7.37.0-19004_amd64.deb
```

### 4. Extraer los datos internos

```bash
tar -xf data.tar.*
```

### 5. Copiar los archivos a sus ubicaciones correspondientes

```bash
sudo cp -r opt/* /opt/
sudo cp -r etc/* /etc/
sudo cp -r lib/* /lib/
```

### 6. Habilitar el servicio

```bash
sudo systemctl enable falcon-sensor
```

### 7. Configurar el Customer ID

```bash
sudo /opt/CrowdStrike/falconctl -s --cid=<TU_CID>
```

### 8. Iniciar el sensor

```bash
sudo systemctl start falcon-sensor
sudo systemctl status falcon-sensor
```

### 9. Verificación

Finalmente, el sensor reportó correctamente en la consola y quedó funcionando en **User Mode**.

Esto confirma que, al menos para esta versión y este entorno de pruebas, Falcon Sensor puede ejecutarse sobre Arch Linux aun sin soporte oficial.

## Conclusión

¿Lo recomendaría para producción? Depende de la realidad de cada organización.

Para la mayoría, lo más prudente sería usar una distribución de Linux oficialmente soportada por CrowdStrike.

En casos donde la organización tiene requisitos de conformidad flexibles y la necesidad de proteger estos activos, implementar el sensor en distribuciones no soportadas podría ser una opción viable.
