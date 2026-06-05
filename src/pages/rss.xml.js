import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const articulos = await getCollection('articulos', ({ data }) => !data.borrador);
  return rss({
    title: 'Ángel Perdomo — Notas técnicas',
    description: 'Ciberseguridad, redes e infraestructura.',
    site: context.site,
    items: articulos
      .sort((a, b) => b.data.fecha.valueOf() - a.data.fecha.valueOf())
      .map((art) => ({
        title: art.data.titulo,
        description: art.data.descripcion,
        pubDate: art.data.fecha,
        link: `${import.meta.env.BASE_URL.replace(/\/$/, '')}/articulos/${art.slug}/`,
      })),
  });
}
