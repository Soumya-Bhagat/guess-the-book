import { useEffect } from "react";
import { books } from "../data/books";
import "./BookSelectionScreen.css";
import "./HomeScreen.css"
import arrowImage from "../assets/image 19.png"
interface BookSelectionScreenProps {
  selectedBookId: string | null;
  onSelectBook: (bookId: string) => void;
  onNextRight: () => void;
  onNextLeft: () => void;
}

export default function BookSelectionScreen({
  selectedBookId,
  onSelectBook,
  onNextRight,
  onNextLeft,
}: BookSelectionScreenProps) {
    const selectedBook = books.find((book) => book.id === selectedBookId);
    useEffect(() => {
      if (!selectedBookId && books.length > 0) {
      onSelectBook(books[0].id);
    }

}, []);
  return (
    <div className="book-selection-screen">
      <h1 className="title-banner">Choose Your Secret Book</h1>
      {selectedBook && (
        <div>
      <img
        src={selectedBook.coverUrl}
        alt={selectedBook.title}
        className="selected-book"
      />
      <h2>{selectedBook.title}</h2>
      </div>
    )}
    <div className="book-grid">
      {books.map((book) => (
        <img
          key={book.id}
          src={book.coverUrl}
          alt={book.title}
          className={`book-cover ${
            selectedBookId === book.id ? "selected" : ""
          }`}
          onClick={() => onSelectBook(book.id)}
        />
      ))}
    </div>
    <img
        src={arrowImage}
        alt="Next"
        className='next-arrow'
        onClick={() => {
            onNextRight();
            
        }}
    />
    <img
        src={arrowImage}
        alt="Next"
        className='next-arrow-left'
        onClick={() => {
            onNextLeft();
        }}
    />

      
    </div>
  );
}