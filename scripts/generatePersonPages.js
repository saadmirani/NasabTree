/**
 * Static Site Generator for genealogical data
 * Generates individual HTML pages for each person in the family trees
 * Runs during build process to create pre-rendered pages for better SEO
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Function to flatten all people from genealogical tree
function flattenPeople(person, familyName, people = []) {
   if (!person || !person.name) return people;

   people.push({
      id: person.id,
      name: person.name,
      fname: person.fname,
      familyName: familyName,
      dob: person.dob,
      dod: person.dod,
      place: person.place,
      burial: person.burial,
      about: person.about,
      gender: person.gender,
      alive: person.alive,
      biography: person.biography,
      spouse: person.spouse,
      children: person.children ? person.children.length : 0,
   });

   if (person.children && Array.isArray(person.children)) {
      person.children.forEach((child) =>
         flattenPeople(child, familyName, people)
      );
   }

   return people;
}

// Generate HTML for a person
function generatePersonHTML(person, familyData) {
   const spouseInfo = person.spouse
      ? Array.isArray(person.spouse)
         ? person.spouse.map((s) => s.name).join(", ")
         : person.spouse.name
      : "Not known";

   const childrenList = person.children > 0 ? `${person.children} child(ren)` : "No children";

   const personSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: person.name,
      birthDate: person.dob,
      deathDate: person.dod,
      gender: person.gender === "male" ? "Male" : "Female",
      description: person.about || `Member of ${person.familyName} genealogical family tree`,
   };

   if (person.fname) {
      personSchema.parent = {
         "@type": "Person",
         name: person.fname,
         relationship: "Father",
      };
   }

   if (person.place) {
      personSchema.birthPlace = person.place;
   }

   if (person.burial && person.burial.place) {
      personSchema.deathPlace = person.burial.place;
   }

   const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${person.name} - ${person.familyName} Family Tree | Aal-e-Miran</title>
    <meta name="description" content="Genealogical information for ${person.name}. Father: ${person.fname || "Not known"}. Born: ${person.dob || "Not known"}. ${person.dod ? `Died: ${person.dod}.` : ""} ${person.children > 0 ? `${childrenList}.` : ""} ${person.about ? person.about : ""}">
    <meta name="keywords" content="${person.name}, genealogy, ${person.familyName}, family tree, ${person.fname || ""}">
    <meta property="og:title" content="${person.name} - ${person.familyName}">
    <meta property="og:description" content="Genealogical information for ${person.name}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://bazmesaadaat.org/people/${person.id}">
    <link rel="canonical" href="https://bazmesaadaat.org/people/${person.id}">
    <script type="application/ld+json">
    ${JSON.stringify(personSchema, null, 2)}
    </script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
        .container { max-width: 900px; margin: 0 auto; padding: 20px; }
        .header { background: white; border-radius: 8px; padding: 30px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header h1 { color: #1e3c72; margin-bottom: 10px; }
        .header .family { color: #666; font-size: 0.95em; }
        .info-section { background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .info-section h2 { color: #1e3c72; margin-bottom: 15px; font-size: 1.2em; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px; }
        .info-row { display: flex; margin-bottom: 10px; }
        .info-label { font-weight: 600; min-width: 120px; color: #555; }
        .info-value { flex: 1; color: #333; }
        .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.85em; font-weight: 600; }
        .status.alive { background: #d4edda; color: #155724; }
        .status.deceased { background: #f8d7da; color: #721c24; }
        .back-link { display: inline-block; padding: 10px 20px; background: #1e3c72; color: white; text-decoration: none; border-radius: 4px; margin-bottom: 20px; }
        .back-link:hover { background: #2a5298; }
        .footer { text-align: center; color: #666; padding: 20px; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <a href="../#${person.familyName.toLowerCase()}" class="back-link">← Back to ${person.familyName}</a>
        
        <div class="header">
            <h1>${person.name}</h1>
            <div class="family">Family: ${person.familyName}</div>
            <div style="margin-top: 10px;">
                <span class="status ${person.alive ? "alive" : "deceased"}">
                    ${person.alive ? "Living" : "Deceased"}
                </span>
                ${person.gender ? `<span style="margin-left: 10px; color: ${person.gender === "male" ? "#2196f3" : "#e91e63"};">♦ ${person.gender.charAt(0).toUpperCase() + person.gender.slice(1)}</span>` : ""}
            </div>
        </div>

        <div class="info-section">
            <h2>Biographical Information</h2>
            ${person.fname ? `<div class="info-row"><div class="info-label">Father:</div><div class="info-value">${person.fname}</div></div>` : ""}
            ${person.dob ? `<div class="info-row"><div class="info-label">Born:</div><div class="info-value">${person.dob}</div></div>` : ""}
            ${person.place ? `<div class="info-row"><div class="info-label">Birth Place:</div><div class="info-value">${person.place}</div></div>` : ""}
            ${person.dod ? `<div class="info-row"><div class="info-label">Died:</div><div class="info-value">${person.dod}</div></div>` : ""}
            ${person.burial && person.burial.place ? `<div class="info-row"><div class="info-label">Burial Place:</div><div class="info-value">${person.burial.place}</div></div>` : ""}
            ${person.about ? `<div class="info-row"><div class="info-label">About:</div><div class="info-value">${person.about}</div></div>` : ""}
        </div>

        ${person.children > 0
         ? `<div class="info-section">
                <h2>Family</h2>
                <div class="info-row"><div class="info-label">Children:</div><div class="info-value">${childrenList}</div></div>
            </div>`
         : ""
      }

        ${person.spouse
         ? `<div class="info-section">
                <h2>Spouse</h2>
                <div class="info-row"><div class="info-label">Married to:</div><div class="info-value">${spouseInfo}</div></div>
            </div>`
         : ""
      }

        <div class="info-section">
            <h2>View Full Tree</h2>
            <p>To view the complete genealogical tree and explore all family connections, visit the interactive <a href="../#${person.familyName.toLowerCase()}" style="color: #1e3c72; text-decoration: underline;">${person.familyName} Family Tree</a>.</p>
        </div>

        <div class="footer">
            <p>This page is part of the Aal-e-Miran genealogical database. For more information, visit <a href="https://bazmesaadaat.org" style="color: #1e3c72;">bazmesaadaat.org</a></p>
        </div>
    </div>

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://bazmesaadaat.org/" },
            { "@type": "ListItem", "position": 2, "name": "${person.familyName}", "item": "https://bazmesaadaat.org/#${person.familyName.toLowerCase()}" },
            { "@type": "ListItem", "position": 3, "name": "${person.name}" }
        ]
    }
    </script>
</body>
</html>`;

   return html;
}

// Main function to generate all person pages
export async function generatePersonPages() {
   const dataDir = path.join(__dirname, "../src/data");
   const outputDir = path.join(__dirname, "../dist/people");

   // Create output directory if it doesn't exist
   if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
   }

   const families = [
      { file: "miranbigha.json", name: "Qasba Miran Bigha" },
      { file: "deora.json", name: "Qasba Deora" },
      { file: "bikopur.json", name: "Qasba Bikopur" },
      { file: "simla.json", name: "Qasba Simla" },
      { file: "ahmadpur.json", name: "Qasba Ahmadpur" },
      { file: "kharbaiyya.json", name: "Qasba Kharbaiyya" },
   ];

   let totalPages = 0;

   for (const family of families) {
      try {
         const filePath = path.join(dataDir, family.file);
         const rawData = fs.readFileSync(filePath, "utf-8");
         const familyData = JSON.parse(rawData);

         // Flatten all people
         const allPeople = flattenPeople(familyData, family.name);

         // Generate HTML for each person
         for (const person of allPeople) {
            const html = generatePersonHTML(person, family);
            const personFile = path.join(outputDir, `${person.id}.html`);
            fs.writeFileSync(personFile, html, "utf-8");
            totalPages++;
         }

         console.log(`✓ Generated ${allPeople.length} pages for ${family.name}`);
      } catch (error) {
         console.error(`✗ Error processing ${family.file}:`, error.message);
      }
   }

   console.log(`\n✓ Total pages generated: ${totalPages}`);
   return totalPages;
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
   generatePersonPages().catch(console.error);
}
