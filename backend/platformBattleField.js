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
}

module.exports = {
  platformBattleField: new platformBattleField()
};
