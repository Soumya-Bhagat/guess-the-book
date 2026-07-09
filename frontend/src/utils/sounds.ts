// src/utils/sounds.ts

export const clickSound = new Audio("/sounds/click.mp3");
export const discardSound = new Audio("/sounds/discard.mp3");

export const playClick = () => {
  clickSound.currentTime = 0;
  clickSound.play();
};

export const playDiscard = () => {
  discardSound.currentTime = 0;
  discardSound.play();
};