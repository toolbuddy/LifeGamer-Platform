const config = require("../config/config");
const { DBModule } = require("./dbmodule");
const { gitlabAPI } = require("./gitlabAPI");
const request = require("request");

class platformGrade {
  init(app) {
    app.get("/commits", async (req, res) => {
      res.set("Content-Type", "application/json");
      let userID = req.query.userID;
      let token = req.query.token;
      let projectName = config.projectName;
      /* get project ID */
      let projectID = await gitlabAPI.getProjectID(userID, projectName, token);
      console.log('projectID: ' + projectID);
      /* get branch */
      let branch = await gitlabAPI.getBranch(projectID, token);
      console.log('branch: ' + branch);
      /* get commit */
      let data = {};
      let commits = null;
      branch.forEach((item) => {
        commits = gitlabAPI.getCommits(projectID, item, token);
        data[item] = commits;
      }).then(() => {res.end(data)});
    });
  }
}

module.exports = {
  platformGrade: new platformGrade()
};
