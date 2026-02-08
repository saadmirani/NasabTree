import React, { useEffect, useState } from "react";
import "../styles/graveyards.css";

export default function Graveyards() {
   const graveyards = [
      {
         id: "demoo",
         name: "Demo Graveyard (Sample)",
         description: "A sample 3D model loaded from a CDN to demonstrate the viewer.",
         model: "/models/MiranBighaGraveyard.glb",
      },
      // To add your SketchUp-exported model, export to glTF/.glb, place under
      // `public/models/yourname.glb` and set model to `/models/yourname.glb`.
   ];

   const [selected, setSelected] = useState(graveyards[0]);

   // ensure model-viewer script is available (index.html already loads it, but keep fallback)
   useEffect(() => {
      if (!customElements.get("model-viewer")) {
         const s = document.createElement("script");
         s.type = "module";
         s.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
         document.head.appendChild(s);
         return () => s.remove();
      }
   }, []);

   return (
      <div className="graveyards-container">
         <aside className="graveyard-list">
            <h3>Graveyards</h3>
            <ul>
               {graveyards.map((g) => (
                  <li
                     key={g.id}
                     className={selected.id === g.id ? "active" : ""}
                     onClick={() => setSelected(g)}
                  >
                     {g.name}
                  </li>
               ))}
            </ul>

            <div className="instructions">
               <strong>Add your SketchUp model</strong>
               <ol>
                  <li>Export from SketchUp to glTF/.glb (use exporter or convert via Blender).</li>
                  <li>Place the .glb file in `public/models/` (example: `public/models/mysite.glb`).</li>
                  <li>Add an entry to the `graveyards` array in this component with the model path.</li>
               </ol>
            </div>
         </aside>

         <main className="graveyard-view">
            <h2>{selected.name}</h2>
            <p className="desc">{selected.description}</p>

            <div className="viewer-wrap">
               {selected ? (
                  <model-viewer
                     src={selected.model}
                     alt={selected.name}
                     camera-controls
                     auto-rotate
                     exposure="1"
                     style={{ width: "100%", height: "520px" }}
                  />
               ) : (
                  <div className="placeholder">Select a graveyard to preview its 3D model.</div>
               )}
            </div>
         </main>
      </div>
   );
}
