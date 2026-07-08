import { useState } from "react";
import "./AvatarSelectionScreen.css";
import "./HomeScreen.css"
import {avatars} from "../data/avatars";
import arrowImage from "../assets/image 19.png"
interface AvatarSelectionScreenProps {
  userName: string | null;
  onSelectAvatar: (avatar: string) => void;
    onNextRight: () => void;
    onNextLeft: () => void;
}

export default function AvatarSelectionScreen({
    userName,
  onSelectAvatar,
  onNextRight,
  onNextLeft,
}: AvatarSelectionScreenProps) {
        const [selectedAvatar, setSelectedAvatar] =
  useState(avatars[0]);
  return (
    
    <div className="avatar-screen">
        <h1 className="title-banner">Choose Avatar</h1>
        <img
            src={selectedAvatar.image}
            alt={selectedAvatar.id}
            className="selected-avatar"
        />


      <h2> {userName}</h2>
        <div className="avatar-grid">
        {avatars.map((avatar) => (
            <img
            key={avatar.id}
            src={avatar.image}
            alt={avatar.id}
            className="avatar-option"
            onClick={() => {setSelectedAvatar(avatar);
            }}
            />
        ))}
        </div>
            <img
                src={arrowImage}
                alt="Next"
                className='next-arrow'
                onClick={() => {
                    onSelectAvatar(selectedAvatar.id);
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