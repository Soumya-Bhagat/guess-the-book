import "./HomeScreen.css";
import arrowImage from "../assets/image 19.png"
import clipboardImage from "../assets/image 22.png"
import { useState } from "react";
import { bgMusic } from "../utils/music";
interface HomeScreenProps {
  roomId: string;
  playerRole: "A" | "B" | null;
  isRoomReady: boolean;
  onCreateRoom: () => void;
  onJoinRoom: () => void;
  currentUserName: string | null;
  onNext: (userName: string) => void;
}

export default function HomeScreen({
  roomId,
  isRoomReady,
  onCreateRoom,
  onJoinRoom,
  currentUserName,
  onNext,
}: HomeScreenProps) {
    const [userName, setUserName] = useState(currentUserName || "");
  return (
    <div className="home-screen">
      <div className="title-banner">
        Guess the book!
       </div>
    <div className="clipboard-container">
          <img
    src={clipboardImage}
    alt="Clipboard"
    className="clipboard-image"
  />

    <div className="clipboard-content">
    <h2>Username</h2>

    <input
        className="username-input"
        placeholder="Enter username"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
    />

    <button className="primary-button" onClick={() => {
        bgMusic.play();
        onCreateRoom();
    }}>
        Create Room
    </button>

    <div className="room-code">
        <span>Room Code</span>
        <strong>{roomId}</strong>
    </div>

  <button className="copy-button"
    onClick={() => navigator.clipboard.writeText(roomId)}
  >
    Copy Room Code
  </button>

    <h2>OR</h2>

    <button className="primary-button" onClick={() => {
        bgMusic.play();
        onJoinRoom();
    }}>
        Join Room
    </button>
    </div>
    </div>
    <img
    src={arrowImage}
    alt="Next"
    className={`next-arrow ${
        isRoomReady ? "active" : "disabled"
    }`}
    onClick={() => {
        if (isRoomReady) {
        onNext(userName);
        }
    }}
    />
    </div>
  );
}