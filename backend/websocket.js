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
      let p1 = req.body.p1;
      let p2 = req.body.p2;
      let result = req.body.result;
      console.log(p1);
      console.log(p2);
      console.log(result);
      if (level === "battle") {
        /* for battle field */
        this.ELOcalculate(p1, p2, result);
        /* set attack user attackWho to none */
        DBModule.userAttacktoggle(p1, "none");
      } else {
        /* for judge */
        this.sendData(token, `level ${level}`, data);
      }
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
  /* calculate ELO */
  async ELOcalculate(p1, p2, result) {
    let p1_ELO = await DBModule.getUserELO(p1);
    let p2_ELO = await DBModule.getUserELO(p2);
    /* expected score */
    let expect_p1 = 1 / (1 + 10 ** ((p2_ELO - p1_ELO) / 400));
    let expect_p2 = 1 / (1 + 10 ** ((p1_ELO - p2_ELO) / 400));
    /* new score */
    let K = 32;
    /* draw situation */
    let S_A = null;
    let S_B = null;
    switch (result) {
      case 1:
        S_A = 1;
        S_B = 0;
        break;
      case 2:
        S_A = 0;
        S_B = 1;
        break;
      case 3:
        S_A = 0.5;
        S_B = 0.5;
        break;
    }
    let p1_NewELO = Math.floor(p1_ELO + K * (S_A - expect_p1));
    let p2_NewELO = Math.floor(p2_ELO + K * (S_B - expect_p2));
    /* save ELO */
    await DBModule.setUserELO(p1, p1_NewELO);
    await DBModule.setUserELO(p2, p2_NewELO);
  }
}
module.exports = {
  websocket: new websocket()
};
