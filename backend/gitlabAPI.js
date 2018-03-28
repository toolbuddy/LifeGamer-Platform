const config = require("../config/config");
const request = require("request");

class gitlabAPI {
  checkAdmin(token) {
    return new Promise((resolve, reject) => {
      let url = `${config.hostname}/gitlab/api/v4/user?access_token=${token}`;
      request.get(url, (error, rsp, body) => {
        if (error) reject(error);
        let result = JSON.parse(body);
        if (result.is_admin) resolve("true");
        else resolve("false");
      });
    });
  }
  getProjectID(userID, projectname, token) {
    return new Promise((resolve, reject) => {
      let url = `${
        config.hostname
      }/gitlab/api/v4/users/${userID}/projects?search=${projectname}&access_token=${token}`;
      request.get(url, (error, rsp, body) => {
        if (error) reject(error);
        let result = JSON.parse(body);
        resolve(result[0].id);
      });
    });
  }
  getPipeline(projectID, token) {
    return new Promise((resolve, reject) => {
      let url = `${
        config.hostname
      }/gitlab/api/v4/projects/${projectID}/pipelines?access_token=${token}`;
      request.get(url, (error, rsp, body) => {
        if (error) reject(error);
        let result = Array.from(JSON.parse(body));
        resolve(result);
      });
    });
  }
  getPipelineJob(projectID, pipelineID, token) {
    return new Promise((resolve, reject) => {
      let url = `${
        config.hostname
      }/gitlab/api/v4/projects/${projectID}/pipelines/${pipelineID}/jobs?access_token=${token}`;
      request.get(url, (error, rsp, body) => {
        if (error) reject(error);
        let result = JSON.parse(body);
        resolve(result);
      });
    });
  }
  getBranch(projectID, token) {
    return new Promise((resolve, reject) => {
      let url = `${
        config.hostname
      }/gitlab/api/v4/projects/${projectID}/repository/branches?access_token=${token}`;
      let branches = new Array();
      request.get(url, (error, rsp, body) => {
        if (error) reject(error);
        let result = Array.from(JSON.parse(body));
        console.log("result: " + result);
        console.log("typeof result: " + typeof result);
        result.forEach(item => {
          branches.push(item.name);
        });
        console.log("branch: " + branches);
        resolve(branches);
      });
    });
  }
  getCommits(projectID, refName, token, page) {
    return new Promise((resolve, reject) => {
      let url = `${
        config.hostname
      }/gitlab/api/v4/projects/${projectID}/repository/commits?page=${page}&ref_name=${refName}&access_token=${token}`;
      request.get(url, (error, rsp, body) => {
        if (error) reject(error);
        let result = JSON.parse(body);
        resolve(result);
      });
    });
  }
  postPipeline(projectID, refName, token) {
    return new Promise((resolve, reject) => {
      let url = `${
        config.hostname
      }/gitlab/api/v4/projects/${projectID}/pipeline?ref=${refName}&access_token=${token}`;
      console.log(`post pipeline url: ${url}`);
      request.post(url, (error, rsp, body) => {
        if (error) reject(error);
        resolve(JSON.parse(body));
      });
    });
  }
}

module.exports = {
  gitlabAPI: new gitlabAPI()
};
