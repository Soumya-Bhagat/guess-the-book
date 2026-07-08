import { books } from "../data/books";
import { useState } from "react";
import "./HomeScreen.css";
import "./BookSelectionScreen.css";
import "./GameScreen.css";
import { avatars } from "../data/avatars";

interface GameScreenProps {
  playerRole: "A" | "B" | null;
  yourUsername: string;
  opponentUsername: string;
  yourAvatar: string | null;
  opponentAvatar: string | null;
  selectedBookId: string | null;
  currentTurn: "A" | "B" | null;
  currentQuestion: string | null;
  onAskQuestion: (question: string) => void;
  currentAnswer: string | null;
  onAnswerQuestion: (answer: string) => void;
  onCompleteTurn: () => void;
  onGuessBook: (bookId: string) => void;
}
  
    
export default function GameScreen({
  playerRole,
  yourUsername,
  opponentUsername,
  yourAvatar,
  opponentAvatar,
  selectedBookId,
  currentTurn,
  currentQuestion,
  onAskQuestion,
  currentAnswer,
  onAnswerQuestion,
  onCompleteTurn,
  onGuessBook,
}: GameScreenProps) {
console.log({
  playerRole,
  currentTurn,
  yourUsername,
  opponentUsername,
});
const yourAvatarImage =
  avatars.find((avatar) => avatar.id === yourAvatar)?.image;

const opponentAvatarImage =
  avatars.find((avatar) => avatar.id === opponentAvatar)?.image;
const [eliminatedBooks, setEliminatedBooks] =
  useState<Set<string>>(new Set());
const toggleBook = (bookId: string) => {
  setEliminatedBooks((prev) => {
    const next = new Set(prev);

    if (next.has(bookId)) {
      next.delete(bookId);
    } else {
      next.add(bookId);
    }

    return next;
  });
};
const remainingBooks =
  books.length - eliminatedBooks.size;
const selectedBook = books.find(
  (book) => book.id === selectedBookId
);
const [question, setQuestion] = useState("");
  return (
    <div className="game-screen">
        <div className="game-header">
        <h1 className="title-banner">Your Book</h1>

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
    </div>
        <div className="left-panel">

        {playerRole === currentTurn && (
            <div className="player-name">
            {yourUsername}
            </div>
        )}
        {playerRole !== currentTurn && (
            <div className="player-name">
            {opponentUsername}
            </div>
        )}
        <div className="player-avatar" >
            {playerRole === currentTurn && yourAvatarImage && (
                <img src={yourAvatarImage} alt="Your Avatar" />
            )}
            {playerRole !== currentTurn && opponentAvatarImage && (
                <img src={opponentAvatarImage} alt="Opponent's Avatar" />
            )}
        </div>

        <div className="question-box">

            {playerRole === currentTurn && !currentQuestion && (
            <>
            <input
            className="question-input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            />

            <button
            className="ask-button"
            onClick={() => {
                onAskQuestion(question);
                setQuestion("");
            }}
            >
            Ask
            </button>
            </>
            )}

            {currentQuestion && (
            <div className="question-text">
                {currentQuestion}
            </div>
            )}

            {currentQuestion &&
            currentAnswer &&
            playerRole === currentTurn && (
                <button
                className="done-button"
                onClick={onCompleteTurn}
                >
                Done
                </button>
            )}
        </div>
        </div>
    <div className="right-panel">

    {playerRole !== currentTurn && (
        <div className="player-name">
        {yourUsername}
        </div>
    )}
    {playerRole === currentTurn && (
        <div className="player-name">
        {opponentUsername}
        </div>
    )}

  <div className="player-avatar">
    {playerRole !== currentTurn && yourAvatarImage && (
      <img src={yourAvatarImage} alt="Your Avatar" />
    )}
    {playerRole === currentTurn && opponentAvatarImage && (
      <img src={opponentAvatarImage} alt="Opponent's Avatar" />
    )}
  </div>
    { currentQuestion &&
    currentAnswer && (
        <div
        className={`answer-result ${
            currentAnswer === "Yes" ? "yes" : "no"
        }`}
        >
        {currentAnswer}
        </div>
    )}
  {playerRole !== currentTurn &&
    currentQuestion && !currentAnswer && (
      <>
        <button
          className="answer-button yes"
          onClick={() =>
            onAnswerQuestion("Yes")
          }
        >
          Yes
        </button>

        <button
          className="answer-button no"
          onClick={() =>
            onAnswerQuestion("No")
          }
        >
          No
        </button>
      </>
    )}
</div>
<div className="remaining-counter">
  Remaining Books: {remainingBooks}
</div>
<div className="game-book-grid">
  {books.map((book) => (
    <img
      key={book.id}
      src={book.coverUrl}
      alt={book.title}
      onClick={() => {
        if (
          playerRole === currentTurn &&
          currentAnswer
        ) {
          toggleBook(book.id);
        }
      }}
      className={`game-book ${
        eliminatedBooks.has(book.id)
          ? "eliminated"
          : ""
      } ${
        playerRole !== currentTurn || !currentAnswer
          ? "disabled-book"
          : ""
      }`}
    />
  ))}
</div>
{remainingBooks === 1 && (
  <button
    className="guess-button"
    onClick={() => {
      const remainingBook = books.find(
        (book) => !eliminatedBooks.has(book.id)
      );

      if (remainingBook) {
        onGuessBook(remainingBook.id);
      }
    }}
  >
    I Know The Book!
  </button>
)}
  
    </div>
    
  );
}