const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 3000 });

let players = {};

wss.on("connection", (ws) => {
  const id = Math.random().toString(36).substr(2, 9);
  players[id] = { id, base: null };

  ws.on("message", (msg) => {
    const data = JSON.parse(msg);

    if (data.type === "saveBase") {
      players[id].base = data.base;
    }

    if (data.type === "attack") {
      broadcast({ type: "attack", from: id, target: data.target });
    }
  });

  ws.on("close", () => {
    delete players[id];
  });

  ws.send(JSON.stringify({ type: "welcome", id }));
});

function broadcast(obj) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(obj));
    }
  });
}

console.log("Panda Clash server running on ws://localhost:3000");