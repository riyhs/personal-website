#!/usr/bin/env node

import { writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readdirSync, statSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const SITE_URL = 'https://riyaldi.dev';
const OUTPUT_PATH = join(__dirname, '..', 'public', 'sitemap.xml');

// Static routes (pages that exist in src/routes/)
const staticRoutes = [
    { path: '/', priority: 1.0, changefreq: 'daily' },
    { path: '/about', priority: 0.8, changefreq: 'monthly' },
    { path: '/projects', priority: 0.9, changefreq: 'weekly' },
    { path: '/blog', priority: 0.9, changefreq: 'weekly' },
];

// Function to get all blog posts
function getBlogPosts() {
    const blogDir = join(__dirname, '..', 'src', 'content', 'blog');

    try {
        const files = readdirSync(blogDir);

        return files
            .filter(file => file.endsWith('.mdx'))
            .map(file => {
                const slug = file.replace('.mdx', '');
                const filePath = join(blogDir, file);
                const stats = statSync(filePath);

                return {
                    path: `/blog/${slug}`,
                    priority: 0.7,
                    changefreq: 'monthly',
                    lastmod: stats.mtime.toISOString().split('T')[0],
                };
            });
    } catch (error) {
        console.warn('⚠️  Could not read blog directory:', error.message);
        return [];
    }
}

// Function to generate sitemap XML
function generateSitemap(routes) {
    const currentDate = new Date().toISOString().split('T')[0];

    const urls = routes.map(route => {
        const lastmod = route.lastmod || currentDate;

        return `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

// Main execution
function main() {
    console.log('🗺️  Generating sitemap...');

    // Get blog posts
    const blogPosts = getBlogPosts();
    console.log(`✓ Found ${blogPosts.length} blog post(s)`);

    // Combine all routes
    const allRoutes = [...staticRoutes, ...blogPosts];
    console.log(`✓ Total routes: ${allRoutes.length}`);

    // Generate sitemap
    const sitemap = generateSitemap(allRoutes);

    // Write to file
    writeFileSync(OUTPUT_PATH, sitemap, 'utf-8');
    console.log(`✅ Sitemap generated successfully at: ${OUTPUT_PATH}`);
    console.log(`📍 Total URLs: ${allRoutes.length}`);
    console.log('');
    console.log('Routes included:');
    allRoutes.forEach(route => {
        console.log(`  • ${SITE_URL}${route.path}`);
    });
}

main();
