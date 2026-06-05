---
titulo: "Plantilla: cómo escribir un artículo nuevo"
descripcion: "Este post es la plantilla de referencia. Copialo, cambiá el frontmatter y escribí en Markdown. Borralo cuando ya no lo necesites."
fecha: 2026-01-10
tags: ["meta"]
borrador: false
---

Este archivo está en `src/content/articulos/`. Para crear un artículo nuevo, copiá este `.md`, renombralo (el nombre del archivo es la URL) y editá el bloque de arriba.

## El frontmatter

El bloque entre `---` define los metadatos:

- **titulo**: el título que se muestra.
- **descripcion**: el resumen del índice y para SEO.
- **fecha**: formato `AAAA-MM-DD`. Ordena el índice.
- **tags**: lista de etiquetas, ej `["redes", "edr"]`.
- **linkedin**: (opcional) link al post original en LinkedIn. Si lo ponés, aparece un botón "Leer / comentar en LinkedIn".
- **destacado**: (opcional) `true` lo fija arriba del todo con un badge.
- **borrador**: `true` para que NO se publique todavía.

## El cuerpo

Debajo del frontmatter escribís en Markdown normal: encabezados con `##`, **negrita**, listas, links, y bloques de código con triple backtick:

```python
print("hola, mundo")
```

Y listo. Cuando hacés `git push`, el sitio se reconstruye y publica solo.
