import React, { useState, useMemo } from "react";
import { Container, Typography, Box } from "@mui/material";
import "../styles/books.css";

export default function Books() {
   const [searchTerm, setSearchTerm] = useState("");

   const books = [
      {
         name: "Kitab-ul-Ansab",
         slug: "kitab-ul-ansab",
         author: "Traditional Islamic Authors"
      },
      {
         name: "Saadat-e-Bihar Chronicles",
         slug: "saadat-e-bihar",
         author: "Historical Scholars"
      },
   ];

   const filteredBooks = useMemo(() => {
      if (!searchTerm.trim()) return books;
      return books.filter(book =>
         book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
   }, [searchTerm]);

   const handleBookClick = (slug) => {
      window.location.href = `https://www.bazmesaadaat.org/books/${slug}`;
   };

   return (
      <div className="books-container">
         <section className="books-hero">
            <div className="books-hero-content">
               <h1>Digital Library</h1>
               <p className="subtitle">Books & Historical Texts</p>
               <p className="tagline">Explore our collection of historical and genealogical works</p>
            </div>
         </section>

         <section className="books-section">
            <Container maxWidth="lg" sx={{ py: 4 }}>
               <Box className="books-list-container">
                  <Box className="books-search-container">
                     <input
                        type="text"
                        placeholder="Search by book name or author..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="books-search-input"
                     />
                  </Box>

                  <Box className="books-table">
                     <Box className="books-table-header">
                        <Typography className="books-table-cell books-table-name">
                           Book Name</Typography>
                        <Typography className="books-table-cell books-table-author">
                           Author
                        </Typography>
                     </Box>

                     <Box className="books-table-body">
                        {filteredBooks.length > 0 ? (
                           filteredBooks.map((book, index) => (
                              <Box
                                 key={book.slug}
                                 className={`books-table-row ${index % 2 === 0 ? 'even' : 'odd'}`}
                                 onClick={() => handleBookClick(book.slug)}
                              >
                                 <Typography className="books-table-cell books-table-name">
                                    {book.name}
                                 </Typography>
                                 <Typography className="books-table-cell books-table-author">
                                    {book.author}
                                 </Typography>
                              </Box>
                           ))
                        ) : (
                           <Box className="no-results">
                              <Typography>No books found</Typography>
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
