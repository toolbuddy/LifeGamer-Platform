const fs = require("fs");
const config = require("../config/config");
const { gitlabAPI } = require("./gitlabAPI");
const { DBModule } = require("./dbmodule");
var socketsPool = {};

class websocket {
  init(socketIO) {
    socketIO.on("connection", client => {
      client.on("client commit", async data => {
        socketsPool[data.token] = client;
        /* write config data, let game engine read */
        await this.writeConfig(data.user, data.sha, data.token);
        await this.newCommit(data);
      });
      client.on("level 1", async datum => {
        this.sendData(datum.token, datum.data);
      });
    });
  }
  newCommit(data) {
    return new Promise(async resolve => {
      /* get project ID */
      let projectID = await gitlabAPI.getProjectID(
        data.userID,
        config.projectName,
        data.token
      );
      // create a new pipeline
      let rsp = await gitlabAPI.postPipeline(
        projectID,
        data.branch,
        data.token
      );
      console.log(`rsp: ${rsp}`);
      console.log(rsp.id);
      /* save data into database */
      await DBModule.insertCommitTable(rsp.id, data.user, data.sha);
      resolve("true");
    });
  }
  sendData(clientID, data) {
    socketsPool[clientID].emit("sendData", data);
  }
  writeConfig(studentID, sha, token) {
    return new Promise(resolve => {
      let data = `SHA=${sha}\nTOKEN=${token}`;
      fs.writeFile(`/tmp/${studentID}`, data, err => {
        if (err) console.log(err);
        else {
          console.log("write complete");
          resolve("true");
        }
      });
    });
  }
}
module.exports = {
  websocket: new websocket()
};
