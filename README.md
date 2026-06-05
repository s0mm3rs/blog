# Blog técnico — Astro + GitHub Pages

Blog estático para publicar artículos en Markdown. Tu sitio es la fuente de verdad; LinkedIn queda como canal de distribución (con link de vuelta opcional en cada post).

## Stack
- **Astro** (sitio estático, sin JS en runtime salvo lo mínimo)
- **Content Collections** con frontmatter tipado
- Deploy automático a **GitHub Pages** vía GitHub Actions

---

## Setup inicial (una sola vez)

### 1. Editar la config

Abrí `astro.config.mjs` y cambiá:

```js
site: 'https://TU_USUARIO.github.io',
base: '/NOMBRE_DEL_REPO',   // ej: '/blog'
```

> Como es un **repo de proyecto** (no `usuario.github.io`), el `base` es obligatorio y tiene que coincidir con el nombre del repo.

### 2. Crear el repo y subir

```bash
cd blog
git init
git add .
git commit -m "init blog"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/NOMBRE_DEL_REPO.git
git push -u origin main
```

### 3. Activar GitHub Pages

En el repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Con eso, cada `git push` a `main` dispara el workflow (`.github/workflows/deploy.yml`), buildea y publica. El sitio queda en `https://TU_USUARIO.github.io/NOMBRE_DEL_REPO/`.

---

## Escribir un artículo

1. Copiá `src/content/articulos/_plantilla.md`.
2. Renombralo — **el nombre del archivo es la URL** (ej: `mikrotik-ipsec.md` → `/articulos/mikrotik-ipsec`).
3. Editá el frontmatter y escribí en Markdown.
4. `git add . && git commit -m "nuevo artículo" && git push`.

### Frontmatter

```yaml
---
titulo: "Título del artículo"
descripcion: "Resumen corto para el índice y SEO."
fecha: 2026-01-20          # AAAA-MM-DD, ordena el índice
tags: ["redes", "edr"]
linkedin: "https://..."    # opcional: botón a LinkedIn
destacado: true            # opcional: lo fija arriba
borrador: false            # true = no se publica
---
```

---

## Desarrollo local

```bash
npm install
npm run dev        # http://localhost:4321/NOMBRE_DEL_REPO
npm run build      # genera /dist
npm run preview    # previsualiza el build
```

---

## Estructura

```
src/
├── content/
│   ├── config.ts              # schema/tipos del frontmatter
│   └── articulos/             # ← tus .md van acá
│       ├── whatsapp-call-routing.md
│       └── _plantilla.md
├── layouts/Base.astro         # header, footer, SEO
├── pages/
│   ├── index.astro            # índice de artículos
│   ├── articulos/[slug].astro # render de cada post
│   └── rss.xml.js             # feed RSS
└── styles/global.css          # estética (cambiá colores acá)
```

## Personalizar

- **Colores / fuente**: arriba de `src/styles/global.css` (variables `:root`). El acento es `--accent`.
- **Tu nombre / tagline / links**: en `src/layouts/Base.astro`.

## Nota: sitemap

Se quitó el integration de sitemap para que el build pase sin configurar nada. Si querés `sitemap.xml`, instalá `npm install @astrojs/sitemap`, importalo en `astro.config.mjs` y agregá `integrations: [sitemap()]`. Requiere que `site` sea una URL real, no el placeholder.
