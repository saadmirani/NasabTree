import React, { useState, useMemo } from "react";
import { Container, Typography, Box } from "@mui/material";
import "../styles/biography.css";

export default function Biography() {
   const [searchTerm, setSearchTerm] = useState("");

   const biographies = [
      {
         name: "Hazrat Miran Bhik R.H",
         slug: "miran-bhik",
      },
      {
         name: "Hazrat Rahman Bakhsh Qadri",
         slug: "rahman-bakhsh-qadri",
      },
      {
         name: "Hazrat Bibi Malihan (Maalo Sahiba)",
         slug: "bibi-malihan",
      },
   ];

   const filteredBiographies = useMemo(() => {
      if (!searchTerm.trim()) return biographies;
      return biographies.filter(bio =>
         bio.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
   }, [searchTerm]);

   const handleBiographyClick = (slug) => {
      window.location.href = `https://www.bazmesaadaat.org/biography/${slug}`;
   };

   return (
      <div className="biography-container">
         <section className="biography-hero">
            <div className="biography-hero-content">
               <h1>
                  Sawaneh Hayaat |{" "}
                  <span className="biography-urdu-title">سوانح حیات</span>
               </h1>
               <p className="subtitle">Biographies of Revered Sufi Saints</p>
               <p className="tagline">
                  Click on any name to read the full biography
               </p>
            </div>
         </section>

         <section className="biography-section">
            <Container maxWidth="lg" sx={{ py: 4 }}>
               <Box className="biography-list-container">
                  <Box className="biography-search-container">
                     <input
                        type="text"
                        placeholder="Search biographies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="biography-search-input"
                     />
                  </Box>

                  <Box className="biography-table">
                     <Box className="biography-table-header">
                        <Typography className="biography-table-cell biography-table-title">
                           Saint Name
                        </Typography>
                     </Box>

                     <Box className="biography-table-body">
                        {filteredBiographies.length > 0 ? (
                           filteredBiographies.map((bio, index) => (
                              <Box
                                 key={bio.slug}
                                 className={`biography-table-row ${index % 2 === 0 ? "even" : "odd"
                                    }`}
                                 onClick={() => handleBiographyClick(bio.slug)}
                              >
                                 <Typography className="biography-table-cell biography-name-cell">
                                    {bio.name}
                                 </Typography>
                              </Box>
                           ))
                        ) : (
                           <Box className="no-results">
                              <Typography>No biographies found</Typography>
                           </Box>
                        )}
                     </Box>
                  </Box>
               </Box>
            </Container>
         </section>
      </div>
   );
}
