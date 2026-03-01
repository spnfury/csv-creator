import { writeFileSync, readdirSync, readFileSync } from 'fs';
import { resolve } from 'path';

const BASE_URL = 'https://csvcreator.com';
const LOCALES_DIR = resolve('src/locales');
const PUBLIC_DIR = resolve('public');
const DEFAULT_LANGUAGE = 'es';

const getSupportedLanguages = () => {
    return readdirSync(LOCALES_DIR)
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''));
};

const loadTranslations = (lang) => {
    const filePath = resolve(LOCALES_DIR, `${lang}.json`);
    return JSON.parse(readFileSync(filePath, 'utf-8'));
};

const generateSitemap = () => {
    const supportedLanguages = getSupportedLanguages();
    const pages = [];
    const now = new Date().toISOString();

    const allTranslations = supportedLanguages.reduce((acc, lang) => {
        acc[lang] = loadTranslations(lang);
        return acc;
    }, {});

    const toolKeys = Object.keys(allTranslations[DEFAULT_LANGUAGE].tools);

    // Home pages
    supportedLanguages.forEach(lang => {
        const path = lang === DEFAULT_LANGUAGE ? '' : `/${lang}`;
        pages.push({
            loc: `${BASE_URL}${path}`,
            lastmod: now,
            changefreq: 'daily',
            priority: 1.0,
        });
    });

    // Tool pages
    toolKeys.forEach(key => {
        supportedLanguages.forEach(lang => {
            const slug = allTranslations[lang]?.tools[key]?.slug;
            if (slug) {
                const path = lang === DEFAULT_LANGUAGE ? `/${slug}` : `/${lang}/${slug}`;
                pages.push({
                    loc: `${BASE_URL}${path}`,
                    lastmod: now,
                    changefreq: 'weekly',
                    priority: 0.8,
                });
            }
        });
    });

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${pages
        .map(
            page => `
    <url>
        <loc>${page.loc}</loc>
        <lastmod>${page.lastmod}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>`
        )
        .join('')}
</urlset>`;

    writeFileSync(resolve(PUBLIC_DIR, 'sitemap.xml'), sitemapContent.trim());
    console.log('Sitemap generated successfully with real URLs!');
};

try {
    generateSitemap();
} catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
}