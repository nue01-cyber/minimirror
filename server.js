const express = require("express");
const session = require("express-session");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

/* ===== MIDDLEWARE ===== */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "minimirror_super_strong_secret_987654",
    resave: false,
    saveUninitialized: false,
  })
);

/* ===== PASSWORD (CHANGE LATER IF YOU WANT) ===== */
const PASSWORD = "strongpassword123";

/* ===== LOGIN + CHAT PAGE ===== */
app.get("/", (req, res) => {
  if (!req.session.auth) {
    return res.send(`
      <h2>MiniMirror Login</h2>
      <form method="POST" action="/login">
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Enter</button>
      </form>
    `);
  }

  res.send(`
    <h2>MiniMirror Chat</h2>
    <input id="msg" placeholder="Type message" />
    <button onclick="send()">Send</button>
    <ul id="chat"></ul>

    <script src="/socket.io/socket.io.js"></script>
    <script>
      const socket = io();

      function send() {
        const msg = document.getElementById("msg").value;
        if(msg.trim() !== ""){
          socket.emit("chat", msg);
          document.getElementById("msg").value = "";
        }
      }

      socket.on("chat", (m) => {
        const li = document.createElement("li");
        li.innerText = m;
        document.getElementById("chat").appendChild(li);
      });
    </script>
  `);
});

/* ===== LOGIN CHECK ===== */
app.post("/
