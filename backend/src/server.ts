import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { rooms } from "./rooms/roomStore.js";
import { generateRoomId } from "./utils/generateRoomId.js";

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
    socket.on("create-room", () => {
    const roomId = generateRoomId();

    rooms.set(roomId, {
        id: roomId,
        playerA: socket.id,
        playerB: null,
        avatarA: null,
        avatarB: null,
        selectedBookA: null,
        selectedBookB: null,
        currentTurn: null,
        currentQuestion: null,
        currentAnswer: null,
        userNameA: null,
        userNameB: null,
        playAgainA: false,
        playAgainB: false,
    });

    socket.join(roomId);

    socket.emit("room-created", {
        roomId,
        playerRole: "A",
    });

    console.log(`Room created: ${roomId}`);
    });

    socket.on("join-room", (roomId: string) => {
  const room = rooms.get(roomId);

  if (!room) {
    socket.emit("error-message", "Room not found");
    return;
  }

  if (room.playerB) {
    socket.emit("error-message", "Room is full");
    return;
  }

  room.playerB = socket.id;

  socket.join(roomId);

  socket.emit("player-joined", {
    roomId,
    playerRole: "B",
  });
  io.to(roomId).emit("room-ready");
});
socket.on("select-avatar", ({ roomId, avatar }) => {
  const room = rooms.get(roomId);

  if (!room) {
    return;
  }

  if (room.playerA === socket.id) {
    room.avatarA = avatar;
  } else if (room.playerB === socket.id) {
    room.avatarB = avatar;
  }
  if (room.avatarA && room.avatarB) {
      io.to(room.playerA).emit("avatars-ready", {
        yourAvatar: room.avatarA,
        opponentAvatar: room.avatarB,
      });
      if (room.playerB) {
        io.to(room.playerB).emit("avatars-ready", {
            yourAvatar: room.avatarB,
            opponentAvatar: room.avatarA,
        });
     }
 }
  console.log(room);
});
socket.on("select-book", ({ roomId, bookId }) => {
  const room = rooms.get(roomId);   
  if (!room) {
    return;
  }
  if (room.playerA === socket.id) {
    room.selectedBookA = bookId;
  } else if (room.playerB === socket.id) {
    room.selectedBookB = bookId;
  }
  if (room.selectedBookA && room.selectedBookB) {
    room.currentTurn = "A";
    io.to(room.playerA).emit("books-ready", {
        currentTurn: room.currentTurn,
        yourUserName: room.userNameA,
        opponentUserName: room.userNameB,
    });
    if (room.playerB) {
    io.to(room.playerB).emit("books-ready", {
        currentTurn: room.currentTurn,
        yourUserName: room.userNameB,
        opponentUserName: room.userNameA,
    });
    }

    }
});

socket.on("ask-question", ({ roomId, question }) => {
  const room = rooms.get(roomId);

  if (!room) {
    return;
  }

  room.currentQuestion = question;

  io.to(roomId).emit("question-asked", {
    question,
  });
});
socket.on("answer-question", ({ roomId, answer }) => {
  const room = rooms.get(roomId);

  if (!room) {
    return;
  }

  room.currentAnswer = answer;
  io.to(roomId).emit("question-answered", {
    answer,
  });
});
socket.on("complete-turn", ({ roomId }) => {
  const room = rooms.get(roomId);

  if (!room) {
    return;
  }

  room.currentQuestion = null;
  room.currentAnswer = null;

  room.currentTurn =
    room.currentTurn === "A" ? "B" : "A";

  io.to(roomId).emit("turn-completed", {
    currentTurn: room.currentTurn,
  });
});
socket.on("guess-book", ({ roomId, bookId }) => {
  const room = rooms.get(roomId);

  if (!room) {
    return;
  }

  let correctBook: string | null = null;

  if (room.playerA === socket.id) {
    correctBook = room.selectedBookB;
  } else if (room.playerB === socket.id) {
    correctBook = room.selectedBookA;
  }

  if (bookId === correctBook) {
    socket.emit("game-won");

    socket.to(roomId).emit("game-lost");
  } else {
    socket.emit("game-lost");

    socket.to(roomId).emit("game-won");
  }
});
socket.on("set-username", ({ roomId, userName }) => {
  const room = rooms.get(roomId);

  if (!room) {
    return;
  }

  if (room.playerA === socket.id) {
    room.userNameA = userName;
  } else if (room.playerB === socket.id) {
    room.userNameB = userName;
  }
  console.log(room);
});
socket.on("play-again", ({ roomId }) => {
  const room = rooms.get(roomId);

  if (!room) {
    return;
  }

  if (room.playerA === socket.id) {
    room.playAgainA = true;
  }

  if (room.playerB === socket.id) {
    room.playAgainB = true;
  }

  io.to(roomId).emit("play-again-status", {
    playAgainA: room.playAgainA,
    playAgainB: room.playAgainB,
  });

  if (room.playAgainA && room.playAgainB) {
    room.avatarA = null;
    room.avatarB = null;

    room.selectedBookA = null;
    room.selectedBookB = null;

    room.currentTurn = null;
    room.currentQuestion = null;
    room.currentAnswer = null;

    room.playAgainA = false;
    room.playAgainB = false;

    io.to(roomId).emit("play-again-start");
  }
});

});


server.listen(3001, () => {
  console.log("Server running on port 3001");
});