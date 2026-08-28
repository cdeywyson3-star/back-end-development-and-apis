import http from "http";
import fs from "fs";
import { WebSocketServer } from "ws";

const PORT = 3001;

const server = http.createServer((req, res) => {
  if (req.url === "/" || req.url.startsWith("/?")) {
    fs.readFile("./public/index.html", (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end("Internal Server Error");
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

const wss = new WebSocketServer({ server });

function broadcast(message) {
  const payload = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send(payload);
  });
}

wss.on("connection", (socket, req) => {
  const username = new URL(req.url, "http://localhost").searchParams.get("username");
  broadcast({ type: "system", text: `${username} joined` });

  socket.on("message", (raw) => {
    const { username, text } = JSON.parse(raw.toString());
    broadcast({ type: "chat", username, text });
  });

  socket.on("close", () => {
    broadcast({ type: "system", text: `${username} left` });
  });
});

server.listen(PORT, () => {
  console.log("Chat server running at http://localhost:3001.");
});