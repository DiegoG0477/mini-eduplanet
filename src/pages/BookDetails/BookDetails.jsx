import React from 'react';
import './BookDetails.css';

const BookDetails = ({ book, buyMethod, purchased }) => {
  return (
    <div className="book-details">
      <img src={book.image} alt={book.name} />
      <h3>{book.name}</h3>
      <p>ID: {book.id}</p>
      <p>Precio: ${book.price}</p>

      {
        purchased ? (
          <p>Comprado</p>
        ) : <button onClick={() => buyMethod(book.id)}>Comprar</button>
      }
      
    </div>
  );
};

export default BookDetails;
