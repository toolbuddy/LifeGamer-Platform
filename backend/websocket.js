var socketsPool = {};

class websocket {
  init(socketIO) {
    socketIO.on("connection", client => {
      client.on("addClient", clientID => {
        socketsPool[clientID] = client;
        console.log(socketsPool);
        /* let client know server has received */
        this.sendData(clientID, "server receive~");
        console.log("send");
      });
    });
  }
  sendData(clientID, data) {
    socketsPool[clientID].emit("sendData", data);
  }
}
module.exports = {
  websocket: new websocket()
};
