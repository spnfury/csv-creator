const es = require('./src/locales/es.json');
const en = require('./src/locales/en.json');
const fr = require('./src/locales/fr.json');
const th = require('./src/locales/th.json');
const vi = require('./src/locales/vi.json');

const langs = { es, en, fr, th, vi };
const defaultLang = 'es';
const siteUrl = 'https://csvcreator.com';
const toolKeys = Object.keys(es.tools);
const today = new Date().toISOString().split('T')[0];

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

// Home page
xml += '  <url>\n';
xml += `    <loc>${siteUrl}</loc>\n`;
xml += `    <lastmod>${today}</lastmod>\n`;
xml += '    <changefreq>weekly</changefreq>\n';
xml += '    <priority>1.0</priority>\n';
Object.keys(langs).forEach(lang => {
  const href = lang === defaultLang ? siteUrl : `${siteUrl}/${lang}`;
  xml += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}" />\n`;
});
xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}" />\n`;
xml += '  </url>\n';

// Non-default language home pages
Object.keys(langs).forEach(lang => {
  if (lang === defaultLang) return;
  xml += '  <url>\n';
  xml += `    <loc>${siteUrl}/${lang}</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += '    <changefreq>weekly</changefreq>\n';
  xml += '    <priority>0.9</priority>\n';
  Object.keys(langs).forEach(l => {
    const href = l === defaultLang ? siteUrl : `${siteUrl}/${l}`;
    xml += `    <xhtml:link rel="alternate" hreflang="${l}" href="${href}" />\n`;
  });
  xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}" />\n`;
  xml += '  </url>\n';
});

// Tool pages
toolKeys.forEach(toolKey => {
  Object.keys(langs).forEach(lang => {
    const slug = langs[lang]?.tools?.[toolKey]?.slug;
    if (!slug) return;
    const loc = lang === defaultLang ? `${siteUrl}/${slug}` : `${siteUrl}/${lang}/${slug}`;
    xml += '  <url>\n';
    xml += `    <loc>${loc}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '    <changefreq>monthly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    Object.keys(langs).forEach(l => {
      const lSlug = langs[l]?.tools?.[toolKey]?.slug;
      if (!lSlug) return;
      const href = l === defaultLang ? `${siteUrl}/${lSlug}` : `${siteUrl}/${l}/${lSlug}`;
      xml += `    <xhtml:link rel="alternate" hreflang="${l}" href="${href}" />\n`;
    });
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/${langs[defaultLang].tools[toolKey].slug}" />\n`;
    xml += '  </url>\n';
  });
});

// Legal pages
['privacy-policy', 'terms-of-service'].forEach(page => {
  xml += '  <url>\n';
  xml += `    <loc>${siteUrl}/${page}</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += '    <changefreq>yearly</changefreq>\n';
  xml += '    <priority>0.3</priority>\n';
  xml += '  </url>\n';
});

xml += '</urlset>';

require('fs').writeFileSync('./public/sitemap.xml', xml);
console.log(`Sitemap generated with ${toolKeys.length} tools x ${Object.keys(langs).length} languages + home pages`);
