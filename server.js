const express = require("express");
const session = require("express-session");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "minimirror_strong_secret_123",
    resave: false,
    saveUninitialized: false
  })
);

const PASSWORD = "strongpassword123";

app.get("/", (req, res) => {
  if (!req.session.auth) {
    return res.send(`
      <h2>MiniMirror Login</h2>
      <form method="POST" action="/login">
        <input type="password" name="password" placeholder="Password" />
        <button type="submit">Enter</button>
      </form>
    `);
  }

  res.send(`
    <h2>MiniMirror Chat</h2>
    <input id="msg" placeholder="Type message"/>
    <button onclick="send()">Send</button>
    <ul id="chat"></ul>

    <script src="/socket.io/socket.io.js"></script>
    <script>
      const socket = io();
      function send(){
        const msg = document.getElementById("msg").value;
        socket.emit("chat", msg);
        document.getElementById("msg").value="";
      }
      socket.on("chat", m=>{
        const li=document.createElement("li");
        li.innerText=m;
        document.getElementById("chat").appendChild(li);
      });
    </script>
  `);
});

app.post("/login", (req, res) => {
  if (req.body.password === PASSWORD) {
    req.session.auth = true;
    res.redirect("/");
  } else {
    res.send("Wrong password");
  }
});

io.on("connection", socket => {
  socket.on("chat", msg => {
    io.emit("chat", msg);
  });
});

server.listen(3000, () => {
  console.log("MiniMirror running");
});
