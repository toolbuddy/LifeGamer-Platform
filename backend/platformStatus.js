const config = require("../config/config");
const { DBModule } = require("./dbmodule");

class platformStatus {
  init(app) {
    app.get("/db_serverStatus", async (req, res) => {
      res.set("Content-Type", "application/json");
      let status = await DBModule.getServerStatus();
      res.end(JSON.stringify(status));
    });
  }
}

module.exports = {
  platformStatus: new platformStatus()
};
