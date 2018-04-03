const shell = require("shelljs");
const fs = require("fs");
const childprocess = require("child_process");
const config = require("../config/config");
const { gitlabAPI } = require("./gitlabAPI");
const { DBModule } = require("./dbmodule");

class platformBattleField {
  init(app) {
    /* get user status: registered or unregistered */
    app.get("/register_status", async (req, res) => {
      res.set("Content-Type", "application/json");
      let studentID = req.query.studentID;
      let status = await this.getRegister(studentID);
      res.end(JSON.stringify(status));
    });
    /* user register */
    app.get("/register", async (req, res) => {
      res.set("Content-Type", "application/json");
      let studentID = req.query.studentID;
      let success =
        (await this.setRegister(studentID)) === "true" ? "success" : "failed";
      res.end(JSON.stringify(success));
    });
    /* select code for attack or defend */
    app.get("/artifact", async (req, res) => {
      res.set("Content-Type", "application/json");
      let studentID = req.query.studentID;
      let userID = req.query.userID;
      let token = req.query.token;
      let projectID = await gitlabAPI.getProjectID(
        userID,
        config.projectName,
        token
      );
      let jobID = req.query.jobID;
      let filename = req.query.filename;
      let result = await this.getArtifact(
        studentID,
        projectID,
        jobID,
        token,
        filename
      );
      res.end(JSON.stringify(result));
    });
    /* get battle list */
    app.get("/battle_list", async (req, res) => {
      res.set("Content-Type", "application/json");
      let data = await this.getBattleList();
      res.end(JSON.stringify(data));
    });
    /* batoru (duel. boku no tann, doro) */
    app.get("/battle", async (req, res) => {
      let userAttack = req.query.userAttack;
      let userDefend = req.query.userDefend;
      await this.battle(userAttack, userDefend);
      res.end();
    });
  }
  getRegister(studentID) {
    return new Promise(async resolve => {
      let status = await DBModule.getUserRegisterStatus(studentID);
      resolve(status);
    });
  }
  setRegister(studentID) {
    return new Promise(async resolve => {
      let flag = await DBModule.setUserRegisterStatus(studentID);
      resolve(flag);
    });
  }
  /* function of getting artifact file and setting it as attack/defend code */
  getArtifact(studentID, projectID, jobID, token, filename) {
    return new Promise(resolve => {
      /* check folder exist or not */
      fs.exists(`/tmp/battle_${studentID}`, exists => {
        if (!exists) shell.exec(`mkdir /tmp/battle_${studentID}`);
      });
      /* wget artifact file */
      /* register, need defend and attack code */
      if (filename === "both") {
        let command = `wget '${
          config.hostname
        }/gitlab/api/v4/projects/${projectID}/jobs/${jobID}/artifacts/player?access_token=${token}' -O /tmp/battle_${studentID}/defend && chmod 777 /tmp/battle_${studentID}/defend && cp /tmp/battle_${studentID}/defend /tmp/battle_${studentID}/attack`;
        console.log(command);
        if (shell.exec(command).code !== 0) {
          reject("failed");
        }
      } else {
        let command = `wget '${
          config.hostname
        }/gitlab/api/v4/projects/${projectID}/jobs/${jobID}/artifacts/player?access_token=${token}' -O /tmp/battle_${studentID}/${filename} && chmod 777 /tmp/battle_${studentID}/${filename}`;
        console.log(command);
        if (shell.exec(command).code !== 0) {
          reject("failed");
        }
      }
      resolve("success");
    });
  }
  /* function getting all user data that have registered already */
  getBattleList() {
    return new Promise(async resolve => {
      let data = await DBModule.getBattleList();
      resolve(data);
    });
  }
  /* ask server to call program battling */
  battle(userAttack, userDefend) {
    return new Promise(async (resolve, reject) => {
      /* check folder exist or not */
      fs.exists(`/tmp/battleFile`, exists => {
        if (!exists) shell.exec(`mkdir /tmp/battleFile`);
      });
      /* set data attackWho of user who attack */
      await DBModule.userAttacktoggle(userAttack, userDefend);
      /* copy program to another folder */
      let date = new Date();
      let datetime = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      /* create child process */
      let command = `cp /tmp/battle_${userAttack}/attack /tmp/battleFile/${userAttack}_attack_${datetime} && cp /tmp/battle_${userDefend}/defend /tmp/battleFile/${userDefend}_defend_${datetime} && CR_battle -1 ${userAttack} -2 ${userDefend} /tmp/battleFile/${userAttack}_attack_${datetime} /tmp/battleFile/${userDefend}_defend_${datetime} &> /dev/null`;
      childprocess.exec(command, (err, stdout, stderr) => {
        if (err) {
          console.log(err);
          return;
        }
      });
      resolve("success");
    });
  }
}

module.exports = {
  platformBattleField: new platformBattleField()
};
