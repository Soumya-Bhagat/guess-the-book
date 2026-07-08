import { useEffect, useState } from "react";
import { socket } from "./services/socket";
import HomeScreen from "./screens/HomeScreen";
import AvatarSelectionScreen from "./screens/AvatarSelectionScreen";
import BookSelectionScreen from "./screens/BookSelectionScreen";
import GameScreen from "./screens/GameScreen";
import type { Screen } from "./types/Screen";
import backgroundImage from "./assets/Group 11.png";
import "./App.css";
import GameResultModal from "./screens/GameResultModal";
import WaitingScreen from "./screens/WaitingScreen";

function App() {
  const [roomId, setRoomId] = useState("");
  const [isRoomReady, setIsRoomReady] = useState(false);
  const [playerRole, setPlayerRole] = useState<"A" | "B" | null>(null);
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [currentTurn, setCurrentTurn] =
  useState<"A" | "B" | null>(null);
  const [waitingForOpponent, setWaitingForOpponent] =
  useState(false);
  const [currentQuestion, setCurrentQuestion] =
  useState<string | null>(null);
  const [currentAnswer, setCurrentAnswer] =
  useState<string | null>(null);
  const [gameResult, setGameResult] =
  useState<"won" | "lost" | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [opponentUserName, setOpponentUserName] = useState<string | null>(null);
  const [yourAvatar, setYourAvatar] = useState<string | null>(null);
  const [opponentAvatar, setOpponentAvatar] = useState<string | null>(null);
  useEffect(() => {
    socket.on("room-created", ({ roomId, playerRole }) => {
      setRoomId(roomId);
      setPlayerRole(playerRole);
    });

    socket.on("player-joined", ({ roomId, playerRole }) => {
      setRoomId(roomId);
      setPlayerRole(playerRole);
    });

    socket.on("room-ready", () => {
      setIsRoomReady(true);
    });

    socket.on("error-message", (message) => {
      console.log(message);
    });

  socket.on("avatars-ready", ({
    yourAvatar,
    opponentAvatar,
  }) => {
    setYourAvatar(yourAvatar);
    setOpponentAvatar(opponentAvatar);
  });

  socket.on("books-ready", ({
    currentTurn,
    yourUserName,
    opponentUserName,
  }) => {
    setCurrentTurn(currentTurn);
    setUserName(yourUserName);
    setOpponentUserName(opponentUserName);
    setScreen("game");
  });

    socket.on("question-asked", ({ question }) => {
      setCurrentQuestion(question);
    });

    socket.on("question-answered", ({ answer }) => {
      setCurrentAnswer(answer);
    });
    socket.on("turn-completed", ({ currentTurn }) => {
      setCurrentTurn(currentTurn);
      setCurrentQuestion(null);
      setCurrentAnswer(null);
    });

    socket.on("game-won", () => {
      setGameResult("won");
    });

    socket.on("game-lost", () => {
      setGameResult("lost");
    });

    socket.on("play-again-status", ({
      playAgainA,
      playAgainB,
    }) => {
      console.log(
        "Rematch:",
        playAgainA,
        playAgainB
      );
});
   socket.on("play-again-start", () => {
      setWaitingForOpponent(false);

      setGameResult(null);

      setSelectedBookId(null);

      setCurrentTurn(null);
      setCurrentQuestion(null);
      setCurrentAnswer(null);

      setYourAvatar(null);
      setOpponentAvatar(null);

      setScreen("avatar-selection");
});

    return () => {
      socket.off("room-created");
      socket.off("player-joined");
      socket.off("room-ready");
      socket.off("error-message");
    };
  }, []);
  if (screen === "avatar-selection") {
    return       (
    <div
    id="app-container"
    style={{
      backgroundImage: `url(${backgroundImage})`,
    }}>
    <AvatarSelectionScreen userName={userName} onSelectAvatar={(avatar) => socket.emit("select-avatar", { roomId, avatar })} 
    onNextRight={()=> setScreen("book-selection")} onNextLeft={()=> setScreen("home")} /> </div>); 
  }

  if (screen === "book-selection") {
    return(
            <div
    id="app-container"
    style={{
      backgroundImage: `url(${backgroundImage})`,
    }}
  >
<BookSelectionScreen
  selectedBookId={selectedBookId}
  onSelectBook={(bookId) => {
    setSelectedBookId(bookId);
  }}
  onNextRight={() => {
  if (!selectedBookId) return;

  socket.emit("select-book", {
    roomId,
    bookId: selectedBookId,
  });
  setScreen("waiting");
  }}
 onNextLeft={() => setScreen("avatar-selection")} /> </div>);
  }

  if (screen === "game") {
    return (
            <div
        id="app-container"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
      {gameResult && (
    <GameResultModal
      result={gameResult}
      yourAvatar={yourAvatar}
     onPlayAgain={() => {
     setWaitingForOpponent(true);
      setScreen("waiting");
     socket.emit("play-again", {
    roomId,
    });
    }}
      onClose={() => {
        setGameResult(null);
      }}
    />
  )}

    <GameScreen
      playerRole={playerRole}
      yourUsername={userName || ""}
      opponentUsername={opponentUserName || ""}
      yourAvatar={yourAvatar}
      opponentAvatar={opponentAvatar}
      selectedBookId={selectedBookId}
      currentTurn={currentTurn}
      currentQuestion={currentQuestion}
      onAskQuestion={(question) => {
        socket.emit("ask-question", {
          roomId,
          question,
        });
      }}
      currentAnswer={currentAnswer}
      onAnswerQuestion={(answer) => {
       socket.emit("answer-question", {
          roomId,
          answer,
        });
      }}
      onCompleteTurn={() => {
        socket.emit("complete-turn", {
          roomId,
        });
      }}
      onGuessBook={(bookId) => {
        socket.emit("guess-book", {
          roomId,
          bookId,
        });
      }}
    />
      </div>
    );
  }
    if (screen === "waiting" || waitingForOpponent) {
    return (
      <div
        id="app-container"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <WaitingScreen
          message="Waiting for opponent..."
        />
      </div>
    );
  }
  return (
      <div
    id="app-container"
    style={{
      backgroundImage: `url(${backgroundImage})`,
    }}
  >
    <HomeScreen
      roomId={roomId}
      playerRole={playerRole}
      isRoomReady={isRoomReady}
      onCreateRoom={() => socket.emit("create-room")}
      onJoinRoom={() => {
        const roomId = prompt("Room ID");

        if (roomId) {
          socket.emit("join-room", roomId);
        }
      }}
      currentUserName={userName}
      onNext={(userName) => {
        setUserName(userName);
        socket.emit("set-username", { roomId, userName });
        setScreen("avatar-selection");
      }}
    />
  </div>
  );
}

export default App;