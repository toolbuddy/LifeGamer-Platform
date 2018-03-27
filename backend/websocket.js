const fs = require("fs");
const shell = require("shelljs");
const config = require("../config/config");
const { gitlabAPI } = require("./gitlabAPI");
const { DBModule } = require("./dbmodule");
var socketsPool = {};

class websocket {
  WebSocketInit(socketIO) {
    socketIO.on("connection", client => {
      console.log(`one client connected: ${client}`);
      client.on("client commit", async data => {
        socketsPool[data.Ttoken] = client;
        console.log(data.Ttoken);
        /* write config data, let game engine read */
        await this.writeConfig(data.user, data.sha, data.Ttoken);
        this.copyData(`/tmp/${data.user}`, "hmkrl", "hmkrl.com", "/tmp/");
        await this.newCommit(data);
      });
    });
  }
  appInit(app) {
    /* handle post request from game engine */
    app.post("/game", (req, res) => {
      let level = req.body.level;
      let token = req.body.token;
      let data = req.body.data;
      console.log(level);
      console.log(token);
      this.sendData(token, `level ${level}`, data);
      res.end();
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
      /* save data into database */
      await DBModule.insertCommitTable(rsp.id, data.user, data.sha);
      resolve("true");
    });
  }
  sendData(clientID, method, data) {
    socketsPool[clientID].emit(method, data);
    console.log(`${method} send`);
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
  /* copy config data to another server */
  copyData(filename, user, server, path) {
    let shellCommand = `scp ${filename} ${user}@${server}:${path}`;
    console.log(`shell command: ${shellCommand}`);
    if (shell.exec(shellCommand).code !== 0) {
      shell.echo("Error: scp failed");
      shell.exit(1);
    }
  }
}
module.exports = {
  websocket: new websocket()
};
