const config = require("../config/config");
const { gitlabAPI } = require("./gitlabAPI");

class platformPipelines {
  init(app) {
    app.get("/pipelinejobs", async (req, res) => {
      console.log(req);
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
