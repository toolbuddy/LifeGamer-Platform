const config = require("./config/config");
const { DBModule } = require("./dbmodule");
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
      let isAdmin = await this.checkAdmin(token);
      let flag = null;
      if (isAdmin == "true")
        flag = await DBModule.setBoardContent(page, content);
      else flag = "false";
      res.end(flag);
    });
  }
  checkAdmin(cookie) {
    return new Promise((resolve, reject) => {
      let url = `${config.hostname}/gitlab/api/v4/user?access_token=${cookie}`;
      request.get(url, (error, rsp, body) => {
        if (error) reject(error);
        let result = JSON.parse(body);
        if (result.is_admin) resolve("true");
        else resolve("false");
      });
    });
  }
}

module.exports = {
  platformMarkdown: new platformMarkdown()
};
