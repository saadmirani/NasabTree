import React, { useState, useCallback } from "react";
import {
   Container,
   Typography,
   Box,
   Autocomplete,
   TextField,
} from "@mui/material";
import "../styles/biography.css";

export default function Biography() {
   const [selectedPerson, setSelectedPerson] = useState(null);

   const biographies = [
      "Hazrat Miran Bhik R.H (Urdu)",
      "Hazrat Miran Syed Hakeem Rahman Bakhsh (Urdu)",
      "Hazrat Bibi Malihan Urf Maalo Sahiba (Urdu)",
   ];

   const handlePersonChange = useCallback((event, value) => {
      setSelectedPerson(value);
   }, []);

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

         <Container maxWidth="lg" sx={{ py: 2 }}>
            <Box className="biography-container">
               {/* Search Section */}

               {/* Search & Selection Combined */}
               <Box className="search-selection-wrapper">
                  <Autocomplete
                     options={biographies}
                     value={selectedPerson}
                     onChange={handlePersonChange}
                     renderInput={(params) => (
                        <TextField
                           {...params}
                           placeholder="Search biography..."
                           variant="outlined"
                           size="small"
                        />
                     )}
                     fullWidth
                     sx={{ maxWidth: 400 }}
                  />
               </Box>

               {/* Content Display Area */}
               {selectedPerson && (
                  <Box className="content-area">
                     <Box className="biography-content">
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                           {selectedPerson}
                        </Typography>
                        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                           Biography content will be implemented here...
                        </Typography>
                     </Box>
                  </Box>
               )}

               {/* No Selection Message */}
               {!selectedPerson && (
                  <Box className="no-selection-message">
                     <Typography variant="body2" sx={{ color: "#999" }}>
                        Select a biography from the list to view details.
                     </Typography>
                  </Box>
               )}
            </Box>
         </Container>
      </>
   );
}
