import React from 'react';
import './BookDetails.css';

const BookDetails = ({ book, buyMethod }) => {
  return (
    <div className="book-details">
      <img src={book.image} alt={book.name} />
      <h3>{book.name}</h3>
      <p>ID: {book.id}</p>
      <p>Precio: ${book.price}</p>

      <button onClick={buyMethod}>Comprar</button>
    </div>
  );
};

export default BookDetails;
