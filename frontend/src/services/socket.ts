import { io } from "socket.io-client";

export const socket = io(
  "https://guess-the-book-backend.onrender.com"
);