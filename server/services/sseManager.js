const clients = new Set();

function addClient(res)    { clients.add(res); }
function removeClient(res) { clients.delete(res); }
function clientCount()     { return clients.size; }

function broadcast(eventName, data) {
  const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
  clients.forEach(res => {
    try {
      res.write(payload);
    } catch (err) {
      console.error("SSE write error — dropping client:", err.message);
      clients.delete(res);
    }
  });
}

module.exports = { addClient, removeClient, broadcast, clientCount };
