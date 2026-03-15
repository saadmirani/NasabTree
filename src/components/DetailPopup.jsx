import React, { useCallback, memo } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Mapping of religious abbreviations to Urdu translations
const abbreviationMap = {
   "R.A": "رضی اللہ تعالیٰ عنہ",
   "R.H": "رحمۃ اللہ علیہ",
   "R.Z": "رضی اللہ عنہا",
   "R.U.A": "رضی اللہ عنہ",
   "P.B.U.H": "صلی اللہ علیہ وسلم",
   "PBUH": "صلی اللہ علیہ وسلم",
   "R.D": "رضی اللہ دعنہ",
};

// Helper function to translate text to Urdu using Google Translate API
const translateToUrdu = async (text) => {
   if (!text || text.trim() === "") return "";
   try {
      // Extract religious abbreviations to translate them
      const abbreviationRegex = /\b(R\.A|R\.H|R\.Z|R\.D|P\.B\.U\.H|PBUH|R\.U\.A|CE|A\.D|B\.C)\b/gi;

      let textToTranslate = text;
      const abbreviationMatches = text.match(abbreviationRegex) || [];
      const abbreviationMap_lower = {};

      // Create case-insensitive map and store abbreviations
      Object.keys(abbreviationMap).forEach(key => {
         abbreviationMap_lower[key.toUpperCase()] = abbreviationMap[key];
      });

      // Replace abbreviations with placeholders
      abbreviationMatches.forEach((abbr, idx) => {
         textToTranslate = textToTranslate.replace(abbr, `[ABBR${idx}]`);
      });

      const response = await fetch(
         `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=en|ur`
      );
      const data = await response.json();

      let translatedText = text;
      if (data.responseStatus === 200 && data.responseData.translatedText) {
         translatedText = data.responseData.translatedText;

         // Restore abbreviations with their Urdu translations
         abbreviationMatches.forEach((abbr, idx) => {
            const urduAbbr = abbreviationMap_lower[abbr.toUpperCase()] || abbr;
            translatedText = translatedText.replace(`[ABBR${idx}]`, urduAbbr);
         });
      }

      return translatedText;
   } catch (error) {
      console.error("Translation error:", error);
      return text; // Fallback to original text on error
   }
};

// Detail Popup Component
export const DetailPopup = memo(function DetailPopup({ data, position, onClose, rootRef, setSection }) {
   const generateAndDownloadShajra = useCallback(async () => {
      if (!rootRef.current || !data.id) return;

      const findNodeById = (node, id) => {
         if (node.data.id === id) return node;
         if (node.children) {
            for (let child of node.children) {
               const found = findNodeById(child, id);
               if (found) return found;
            }
         }
         return null;
      };

      const node = findNodeById(rootRef.current, data.id);
      if (!node) return;

      const chain = [];
      let current = node;
      while (current) {
         chain.unshift(current.data);
         current = current.parent;
      }

      const personUrduName = await translateToUrdu(data.name);
      const urduNames = await Promise.all(
         chain.map(person => translateToUrdu(person.name))
      );

      const htmlContent = `
         <div style="font-family: Arial, sans-serif; padding: 20px; direction: rtl;">
            <div style="text-align: center; margin-bottom: 30px;">
               <h1 style="color: #1e3c72; font-size: 24px; margin: 0; font-weight: bold;">شجرہ نسب</h1>
               <h2 style="color: #2a5298; font-size: 18px; margin: 10px 0; font-weight: 600;">${personUrduName}</h2>
            </div>
            
            <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #2196F3; margin-bottom: 20px;">
               <h3 style="color: #1e3c72; margin-top: 0; font-size: 16px;">سلسلہ نسب (اردو)</h3>
               ${urduNames.map((name, idx) => `
                  <div style="margin: 8px 0; font-size: 14px; line-height: 1.6;">
                     <span style="color: #2196F3; font-weight: bold;">${idx + 1}.</span>
                     <span style="margin-right: 8px;">${name}</span>
                  </div>
               `).join('')}
            </div>
            
            <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50;">
               <h3 style="color: #1e3c72; margin-top: 0; font-size: 16px;">Genealogy (English)</h3>
               ${chain.map((person, idx) => `
                  <div style="margin: 8px 0; font-size: 14px; line-height: 1.6;">
                     <span style="color: #4CAF50; font-weight: bold;">${idx + 1}.</span>
                     <span style="margin-left: 8px;">${person.name}</span>
                  </div>
               `).join('')}
            </div>
         </div>
      `;

      const container = document.createElement('div');
      container.innerHTML = htmlContent;
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '210mm';
      container.style.height = 'auto';
      document.body.appendChild(container);

      try {
         const canvas = await html2canvas(container, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            allowTaint: true
         });

         const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
         });

         const pageWidth = pdf.internal.pageSize.getWidth();
         const pageHeight = pdf.internal.pageSize.getHeight();
         const imgData = canvas.toDataURL('image/png');
         const imgHeight = (canvas.height * pageWidth) / canvas.width;
         let currentHeight = 0;

         while (currentHeight < imgHeight) {
            if (currentHeight > 0) {
               pdf.addPage();
            }
            pdf.addImage(imgData, 'PNG', 0, -currentHeight, pageWidth, imgHeight);
            currentHeight += pageHeight;
         }

         pdf.save(`Shajra_${data.name.replace(/\s+/g, '_')}.pdf`);
      } catch (error) {
         console.error('Error generating PDF:', error);
         alert('Error generating PDF. Please try again.');
      } finally {
         document.body.removeChild(container);
      }
   }, [data, rootRef]);

   return (
      <div
         className="detail-popup"
         onClick={(e) => e.stopPropagation()}
         style={{
            top: '16px',
            right: '16px',
            left: 'auto'
         }}
      >
         <button className="popup-close" onClick={onClose}>×</button>
         <div className="popup-content">
            {/* Main person */}
            <div className="popup-section">
               <div className="person-header">
                  <span className="person-name">{data.name}</span>
                  <span className={`status-bubble ${data.alive ? "alive" : "deceased"}`}></span>
               </div>

               {data.dob && <p><strong>Born:</strong> {data.dob}</p>}
               {data.place && <p><strong>Birth place:</strong> {data.place}</p>}
               {!data.alive && data.dod && <p><strong>Died:</strong> {data.dod}</p>}
               {data.burial && (
                  <p>
                     <strong>Burial:</strong> {data.burial.place}
                     {data.burial.map && (
                        <> | <a href={data.burial.map} target="_blank" rel="noopener noreferrer">View on map</a></>
                     )}
                  </p>
               )}
               {data.about && (
                  <p>
                     <strong>About:</strong> <span className="text-wrap">{data.about}</span>
                     {data.biography && (
                        <>
                           <br />
                           <a
                              href="#"
                              onClick={(e) => {
                                 e.preventDefault();
                                 onClose();
                                 if (setSection) setSection("Biography");
                              }}
                              style={{ color: '#60a5fa', textDecoration: 'none', cursor: 'pointer', marginTop: '4px', display: 'inline-block', fontWeight: '500' }}
                              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                           >
                              Read more
                           </a>
                        </>
                     )}
                  </p>
               )}
            </div>

            {/* Spouse(s) */}
            {data.spouse && (
               <>
                  <div className="popup-divider"></div>
                  {Array.isArray(data.spouse) ? (
                     data.spouse.map((spouse, idx) => (
                        <SpouseSection key={idx} spouse={spouse} personGender={data.gender} setSection={setSection} onClose={onClose} />
                     ))
                  ) : (
                     <SpouseSection spouse={data.spouse} personGender={data.gender} setSection={setSection} onClose={onClose} />
                  )}
               </>
            )}

            {/* Shajra Download Section */}
            <div className="popup-divider"></div>
            <div className="popup-section">
               <button className="shajra-download-btn" onClick={generateAndDownloadShajra}>
                  📥 Generate Shajra (This Person)
               </button>
            </div>
         </div>
      </div>
   );
});

// Spouse Section Component
export const SpouseSection = memo(function SpouseSection({ spouse, personGender, setSection, onClose }) {
   const relation = personGender === "male" ? "D/O" : "S/O";

   return (
      <div className="popup-section">
         <div className="person-header">
            <span className="person-name">Married to {spouse.name}</span>
            <span className={`status-badge ${spouse.alive ? "alive" : "deceased"}`}></span>
         </div>

         {spouse.fname && <p><strong>{relation}</strong> {spouse.fname}</p>}
         {spouse.dob && <p><strong>Born:</strong> {spouse.dob}</p>}
         {spouse.place && <p><strong>Birth place:</strong> {spouse.place}</p>}
         {!spouse.alive && spouse.dod && <p><strong>Died:</strong> {spouse.dod}</p>}
         {spouse.burial && (
            <p>
               <strong>Burial:</strong> {spouse.burial.place}
               {spouse.burial.map && (
                  <> | <a href={spouse.burial.map} target="_blank" rel="noopener noreferrer">View on map</a></>
               )}
            </p>
         )}
         {spouse.about && (
            <p>
               <strong>About:</strong> <span className="text-wrap">{spouse.about}</span>
               {spouse.biography && (
                  <>
                     <br />
                     <a
                        href="#"
                        onClick={(e) => {
                           e.preventDefault();
                           onClose();
                           if (setSection) setSection("Biography");
                        }}
                        style={{ color: '#60a5fa', textDecoration: 'none', cursor: 'pointer', marginTop: '4px', display: 'inline-block', fontWeight: '500' }}
                        onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                     >
                        Read more
                     </a>
                  </>
               )}
            </p>
         )}
      </div>
   );
});
