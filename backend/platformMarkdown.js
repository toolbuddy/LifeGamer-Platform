const config = require("../config/config");
const { DBModule } = require("./dbmodule");
const { gitlabAPI } = require("./gitlabAPI");
const request = require("request");

class platformMarkdown {
  init(app) {
    app.get("/db_page", async (req, res) => {
      res.set("Content-Type", "application/json");
      let page = req.query.page;
      let data = await DBModule.getBoardContent(page);
      res.end(data);
    });
    app.post("/db_page", async (req, res) => {
      let page = req.body.page;
      let content = req.body.content;
      let token = req.body.token;
      let isAdmin = await gitlabAPI.checkAdmin(token);
      let flag = null;
      if (isAdmin == "true")
        flag = await DBModule.setBoardContent(page, content);
      else flag = "false";
      res.end(flag);
    });
  }
}

module.exports = {
  platformMarkdown: new platformMarkdown()
};
