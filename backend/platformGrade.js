const config = require("../config/config");
const { DBModule } = require("./dbmodule");
const { gitlabAPI } = require("./gitlabAPI");
const request = require("request");

class platformGrade {
  init(app) {
    app.get("/commits", async (req, res, next) => {
      /* using async need reject handler, so using try and catch */
      try {
        res.set("Content-Type", "application/json");
        let userID = req.query.userID;
        let token = req.query.token;
        let projectName = config.projectName;
        /* get project ID */
        let projectID = await gitlabAPI.getProjectID(
          userID,
          projectName,
          token
        );
        /* get branch */
        let branch = await gitlabAPI.getBranch(projectID, token);
        /* get commit */
        let data = {};
        for (var i = 0; i < branch.length; i++) {
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
        console.log(data);
        res.end(JSON.stringify(data));
      } catch (e) {
        next(e);
      }
    });
  }
}

module.exports = {
  platformGrade: new platformGrade()
};
