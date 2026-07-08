export interface Room {
  id: string;

  playerA: string;
  playerB: string | null;

  avatarA: string | null;
  avatarB: string | null;
  selectedBookA: string | null;
  selectedBookB: string | null;
  currentTurn: "A" | "B" | null;
  currentQuestion: string | null;
  currentAnswer: string | null;
  userNameA: string | null;
  userNameB: string | null;
  playAgainA: boolean ;
  playAgainB: boolean ;
}