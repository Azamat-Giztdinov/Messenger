const express = require("express");
const { Server } = require("socket.io");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const authRouter = require("./routers/authRouter");
const { sessionMiddleware, wrap, corsConfig } = require("./controllers/serverController");
const { authorizeUser } = require("./controllers/socketController");
const server = require("http").createServer(app);
require("dotenv").config();
const io = new Server(server, {
  cors: corsConfig,
});

app.use(helmet());
app.use(
  cors(corsConfig)
);
app.use(express.json());
app.use(sessionMiddleware);
app.use("/auth", authRouter);

io.use(wrap(sessionMiddleware));
io.use(authorizeUser);
io.on("connect", socket => {
  console.log("UsetId: ",socket.user.userid);
  console.log("Username: ",socket.user.username);
});

server.listen(5000, () => {
  console.log("Server listening on port 5000");
});