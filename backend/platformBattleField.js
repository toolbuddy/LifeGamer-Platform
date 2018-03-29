const shell = require("shelljs");
const fs = require("fs");
const config = require("../config/config");
const { gitlabAPI } = require("./gitlabAPI");
const { DBModule } = require("./dbmodule");

class platformBattleField {
  init(app) {
    app.get("/register_status", async (req, res) => {
      res.set("Content-Type", "application/json");
      let studentID = req.query.studentID;
      let status = await this.getRegister(studentID);
      res.end(JSON.stringify(status));
    });
    app.get("/register", async (req, res) => {
      res.set("Content-Type", "application/json");
      let studentID = req.query.studentID;
      let success =
        (await this.setRegister(studentID)) === "true" ? "success" : "failed";
      res.end(JSON.stringify(success));
    });
    app.get("/artifact", async (req, res) => {
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
      this.getArtifact(studentID, projectID, jobID, token, filename);
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
      fs.exists(`/tmp/${studentID}`, exists => {
        if (!exists) shell.exec(`mkdir /tmp/${studentID}`);
      });
      /* wget artifact file */
      shell.exec(
        `wget '${
          config.hostname
        }/gitlab/api/v4/projects/${projectID}/jobs/${jobID}/artifacts/player?access_token=${token}' -O ${filename} -P /tmp/${studentID}/`
      );
      resolve("true");
    });
  }
}

module.exports = {
  platformBattleField: new platformBattleField()
};
