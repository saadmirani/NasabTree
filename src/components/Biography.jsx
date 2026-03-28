import React from "react";
import { Container, Typography, Box } from "@mui/material";
import "../styles/biography.css";

export default function Biography() {
   const biographies = [
      {
         name: "Hazrat Miran Bhik R.H",
         slug: "miran-bhik",
         description: "A revered spiritual guide and founder of the Saadat-e-Bihar spiritual lineage"
      },
      {
         name: "Hazrat Rahman Bakhsh Qadri",
         slug: "rahman-bakhsh-qadri",
         description: "A renowned Sufi saint and spiritual master known for his wisdom and teachings"
      },
      {
         name: "Hazrat Bibi Malihan (Maalo Sahiba)",
         slug: "bibi-malihan",
         description: "A prominent spiritual figure in the Saadat lineage, revered for her spiritual contributions"
      },
   ];

   const handleBiographyClick = (slug) => {
      window.location.href = `https://www.bazmesaadaat.org/biography/${slug}`;
   };

   return (
      <>
         <Box className="biography-hero">
            <Box className="biography-hero-content">
               <Typography variant="h1" className="biography-hero-title">
                  Sawaneh Hayaat | <span className="biography-urdu-title">سوانح حیات</span>
               </Typography>
               <Typography className="biography-hero-subtitle">
                  Exploring the Lives and Legacies of Notable Figures
               </Typography>
               <Typography className="biography-hero-tagline">
                  Discover the biographical narratives and spiritual contributions of our revered ancestors
               </Typography>
            </Box>
         </Box>

         <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box className="biography-list-container">
               <Box className="biographies-grid">
                  {biographies.map((bio) => (
                     <Box
                        key={bio.slug}
                        className="biography-item"
                        onClick={() => handleBiographyClick(bio.slug)}
                     >
                        <Typography className="biography-name" variant="h6">
                           {bio.name}
                        </Typography>
                        <Typography className="biography-description" variant="body2">
                           {bio.description}
                        </Typography>
                        <Typography className="read-more">
                           Read Full Biography →
                        </Typography>
                     </Box>
                  ))}
               </Box>
            </Box>
         </Container>
      </>
   );
}
