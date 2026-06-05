import { defineConfig } from 'astro/config';

// ════════════════════════════════════════════════════════════
//  CONFIGURACIÓN GITHUB PAGES — REPO DE PROYECTO
//  ────────────────────────────────────────────────────────────
//  Cambiá estos dos valores por los tuyos ANTES de publicar:
//
//    site: 'https://TU_USUARIO.github.io'   ← tu usuario de GitHub
//    base: '/NOMBRE_DEL_REPO'               ← ej: '/blog'
//
//  El sitio quedará en:  https://TU_USUARIO.github.io/NOMBRE_DEL_REPO
// ════════════════════════════════════════════════════════════
export default defineConfig({
  site: 'https://s0mm3rs.github.io',
  base: '/blog',
  trailingSlash: 'ignore',
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true,
    },
  },
});
