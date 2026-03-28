import React from "react";
import { Container, Typography, Box } from "@mui/material";
import "../styles/home.css";

export default function Books() {
   const books = [
      {
         name: "Kitab-ul-Ansab",
         slug: "kitab-ul-ansab",
         description: "Book of Genealogies - A comprehensive record of Islamic family histories and genealogical connections among noble families"
      },
      {
         name: "Saadat-e-Bihar Chronicles",
         slug: "saadat-e-bihar",
         description: "Historical chronicles documenting the spiritual heritage and contributions of the Saadat-e-Bihar community"
      },
   ];

   const handleBookClick = (slug) => {
      window.location.href = `https://www.bazmesaadaat.org/books/${slug}`;
   };

   return (
      <div className="home-container">
         <section className="hero">
            <div className="hero-content">
               <h1>Digital Library</h1>
               <p className="subtitle">Books & Historical Texts</p>
               <p className="tagline">Explore our collection of historical and genealogical works</p>
            </div>
         </section>

         <section className="books-section">
            <Container maxWidth="lg" sx={{ py: 4 }}>
               <Box className="books-list-container">
                  <Box className="books-grid">
                     {books.map((book) => (
                        <Box
                           key={book.slug}
                           className="book-item"
                           onClick={() => handleBookClick(book.slug)}
                        >
                           <Typography className="book-name" variant="h6">
                              {book.name}
                           </Typography>
                           <Typography className="book-description" variant="body2">
                              {book.description}
                           </Typography>
                           <Typography className="read-more">
                              Read Full Text →
                           </Typography>
                        </Box>
                     ))}
                  </Box>
               </Box>
            </Container>
         </section>
      </div>
   );
}
