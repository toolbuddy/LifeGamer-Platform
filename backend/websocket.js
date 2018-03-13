const fs = require("fs");
const config = require("../config/config");
const { gitlabAPI } = require("./gitlabAPI");
var socketsPool = {};

class websocket {
  init(socketIO) {
    socketIO.on("connection", client => {
      client.on("client commit", async data => {
        socketsPool[data.token] = client;
        /* write config data, let game engine read */
        await this.writeConfig(data.user, data.sha);
        /* post request, create pipeline */
        let projectID = await gitlabAPI.getProjectID(
          data.userID,
          config.projectName,
          data.token
        );
        // create a new pipeline
        gitlabAPI.postPipeline(projectID, data.branch, data.token);
        // TODO: get response of postPipeline,
        //       and save pipeline id, user, and sha into db
      });
    });
  }
  sendData(clientID, data) {
    socketsPool[clientID].emit("sendData", data);
  }
  writeConfig(studentID, sha) {
    return new Promise(resolve => {
      let data = `SHA=${sha}`;
      fs.writeFile(`/tmp/${studentID}`, data, err => {
        if (err) console.log(err);
        else {
          console.log("write complete");
        }
      });
    });
  }
}
module.exports = {
  websocket: new websocket()
};
