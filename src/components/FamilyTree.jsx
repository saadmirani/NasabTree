import React from "react";
import "../styles/tree.css";

function TreeNode({ node }) {
   return (
      <li>
         <div className="node-item">
            <span className={`node-name ${node.gender || "unknown"}`}>{node.name}</span>
         </div>
         {node.children && node.children.length > 0 && (
            <ul>
               {node.children.map((child) => (
                  <TreeNode key={child.id || child.name} node={child} />
               ))}
            </ul>
         )}
      </li>
   );
}

export default function FamilyTree({ data }) {
   if (!data) return <div className="family-tree-empty">No tree data available.</div>;

   return (
      <div className="family-tree">
         <ul>
            <TreeNode node={data} />
         </ul>
      </div>
   );
}
