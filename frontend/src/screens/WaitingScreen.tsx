import wizardImage from "../assets/image 21.png";
import "./WaitingScreen.css";

interface WaitingScreenProps {
  message: string;
}

export default function WaitingScreen({
  message,
}: WaitingScreenProps) {
  return (
    <div className="waiting-screen">
      <img
        src={wizardImage}
        alt="Waiting"
        className="waiting-avatar"
      />

      <h1 className="waiting-text">
        {message}
      </h1>
    </div>
  );
}