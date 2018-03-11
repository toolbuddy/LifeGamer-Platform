var socketsPool = {};

class websocket {
  init(socketIO) {
    socketIO.on("connection", client => {
      client.on("addClient", clientID => {
        socketsPool[clientID] = client;
        console.log(socketsPool);
        /* Test socket */
        this.sendData(clientID, "server receive~");
        console.log('send');
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
