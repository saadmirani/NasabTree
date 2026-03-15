/**
 * Sitemap Generator for genealogical data
 * Generates comprehensive sitemap.xml including all family pages and individual person pages
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Function to flatten all people
function flattenPeople(person, people = []) {
   if (!person || !person.name) return people;

   people.push({
      id: person.id,
      name: person.name,
   });

   if (person.children && Array.isArray(person.children)) {
      person.children.forEach((child) => flattenPeople(child, people));
   }

   return people;
}

export async function generateSitemap() {
   const dataDir = path.join(__dirname, "../src/data");
   const publicDir = path.join(__dirname, "../public");
   const today = new Date().toISOString().split("T")[0];

   const families = [
      { file: "miranbigha.json", slug: "miranbigha" },
      { file: "deora.json", slug: "deora" },
      { file: "bikopur.json", slug: "bikopur" },
      { file: "simla.json", slug: "simla" },
      { file: "ahmadpur.json", slug: "ahmadpur" },
      { file: "kharbaiyya.json", slug: "kharbaiyya" },
   ];

   let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Home Page -->
  <url>
    <loc>https://bazmesaadaat.org/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- About Us -->
  <url>
    <loc>https://bazmesaadaat.org/#about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Genealogy / Shajra Pages -->
`;

   // Add family pages
   for (const family of families) {
      sitemapContent += `  <url>
    <loc>https://bazmesaadaat.org/#${family.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
`;
   }

   // Add individual person pages
   sitemapContent += `  <!-- Individual Person Pages -->
`;

   for (const family of families) {
      try {
         const filePath = path.join(dataDir, family.file);
         const rawData = fs.readFileSync(filePath, "utf-8");
         const familyData = JSON.parse(rawData);

         const allPeople = flattenPeople(familyData);

         for (const person of allPeople) {
            sitemapContent += `  <url>
    <loc>https://bazmesaadaat.org/people/${person.id}.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>
  
`;
         }

         console.log(`✓ Added ${allPeople.length} person pages for ${family.slug}`);
      } catch (error) {
         console.error(`✗ Error processing ${family.file}:`, error.message);
      }
   }

   sitemapContent += `</urlset>`;

   // Write sitemap to public directory
   const sitemapPath = path.join(publicDir, "sitemap.xml");
   fs.writeFileSync(sitemapPath, sitemapContent, "utf-8");

   console.log(`\n✓ Sitemap generated: ${sitemapPath}`);
   return true;
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
   generateSitemap().catch(console.error);
}
