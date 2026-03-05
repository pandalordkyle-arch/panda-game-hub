const socket = new WebSocket("ws://localhost:3000");
let playerId = null;

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "welcome") {
    playerId = data.id;
  }

  if (data.type === "attack") {
    handleAttack(data.from, data.target);
  }
};

function saveBase() {
  const baseData = tiles.map(t => t.type);
  socket.send(JSON.stringify({ type: "saveBase", base: baseData }));
}