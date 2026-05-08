import app from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { setIO } from "./utils/socket.js";

const port = process.env.PORT || 5000;
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL, credentials: true }
});
setIO(io);

io.on("connection", (socket) => {
  socket.emit("system", { message: "Connected to live railway updates" });
});

server.listen(port, () => console.log(`Server running on ${port}`));
