const config = require("../config/config");
const { gitlabAPI } = require("./gitlabAPI");
const { DBModule } = require("./dbmodule");

class platformPipelines {
  init(app) {
    app.get("/pipelinejobs", async (req, res) => {
      res.set("Content-Type", "application/json");
      let userID = req.query.userID;
      let token = req.query.token;
      /* get project ID */
      let projectID = await gitlabAPI.getProjectID(
        userID,
        config.projectName,
        token
      );
      /* get pipelines and jobs */
      let pipelinejobs = await this.getPipelineJobs(projectID, token);
      res.end(JSON.stringify(pipelinejobs));
    });
    app.get("/commitTable", async (req, res) => {
      res.set("Content-Type", "application/json");
      let user = req.query.user;
      let commitTable = await this.getCommitTable(user);
      res.send(JSON.stringify(commitTable));
    });
  }
  getCommitTable(user) {
    return new Promise(async resolve => {
      let commitTable = await DBModule.getCommitTable(user);
      resolve(commitTable);
    });
  }
  getPipelineJobs(projectID, token) {
    return new Promise(async resolve => {
      let pipelines = await gitlabAPI.getPipelines(projectID, token);
      for (let i = 0; i < pipelines.length; i++) {
        pipelines[i].jobs = await gitlabAPI.getPipelineJob(
          projectID,
          pipelines[i].id,
          token
        );
      }
      resolve(pipelines);
    });
  }
}

module.exports = {
  platformPipelines: new platformPipelines()
};
