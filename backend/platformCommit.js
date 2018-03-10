const config = require("../config/config");
const { DBModule } = require("./dbmodule");
const { gitlabAPI } = require("./gitlabAPI");
const request = require("request");

class platformCommit {
  init(app) {
    app.get("/commits", async (req, res) => {
      /* using async need reject handler, so using try and catch */
      res.set("Content-Type", "application/json");
      let userID = req.query.userID;
      let token = req.query.token;
      /* get project ID */
      let projectID = await this.getProjectID(userID, token);
      /* get branch */
      let branch = await gitlabAPI.getBranch(projectID, token);
      /* get commit */
      let data = await this.getAllCommits(projectID, branch, token);
      res.end(JSON.stringify(data));
    });
  }
  getProjectID(userID, token) {
    return new Promise(async resolve => {
      let projectID = await gitlabAPI.getProjectID(
        userID,
        config.projectName,
        token
      );
      resolve(projectID);
    });
  }
  getAllCommits(projectID, branch, token) {
    let data = {};
    return new Promise(async resolve => {
      for (let i = 0; i < branch.length; i++) {
        let commits = [];
        let page = 1;
        while (1) {
          let result = await gitlabAPI.getCommits(
            projectID,
            branch[i],
            token,
            page
          );
          if (result.length == 0) break;
          result.forEach(item => {
            commits.push(item);
          });
          page = page + 1;
        }
        data[branch[i]] = commits;
      }
      resolve(data);
    });
  }
}

module.exports = {
  platformCommit: new platformCommit()
};
