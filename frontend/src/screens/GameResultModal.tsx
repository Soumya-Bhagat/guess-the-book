import {avatars} from "../data/avatars";
import resultModalImage from "../assets/image 23.png"
import "./GameResultModal.css";
interface GameResultModalProps {
  result: "won" | "lost";
  yourAvatar: string | null;
  onPlayAgain: () => void;
  onClose: () => void;
}

export default function GameResultModal({
  result,
  yourAvatar,
  onPlayAgain,
  onClose,
}: GameResultModalProps) {
    const yourAvatarImage =
      avatars.find((avatar) => avatar.id === yourAvatar)?.image;
  return (
  <div className="result-overlay">
  <div
    className="result-modal"
    style={{
      backgroundImage: `url(${resultModalImage})`,
    }}
  >
    <h1 className="result-title">
      {result === "won" ? "You Win!" : "You Lost!"}
    </h1>

    <img
      src={yourAvatarImage}
      alt="avatar"
      className="result-avatar"
    />

    <div className="result-buttons">
      <button
        className="result-btn"
        onClick={onPlayAgain}
      >
        Play Again
      </button>

      <button
        className="result-btn"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  </div>
</div>
  );
}