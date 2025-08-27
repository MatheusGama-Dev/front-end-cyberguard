import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }, // libera para seu frontend (ajuste para produção)
});

io.on("connection", (socket) => {
  console.log("Novo usuário conectado:", socket.id);

  // quando receber mensagem de um cliente
  socket.on("chatMessage", (msg) => {
    // reenvia a todos conectados
    io.emit("chatMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("Usuário saiu:", socket.id);
  });
});

server.listen(3001, () => {
  console.log("Servidor Socket.IO rodando na porta 3001 🚀");
});
