const config = require("../config/config");
const request = require("request");

class gitlabAPI {
  checkAdmin(token) {
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
  getPagePipeline(projectID, token, page) {
    return new Promise((resolve, reject) => {
      let url = `${
        config.hostname
      }/gitlab/api/v4/projects/${projectID}/pipelines?page=${page}&access_token=${token}`;
      request.get(url, (error, rsp, body) => {
        if (error) reject(error);
        let result = Array.from(JSON.parse(body));
        resolve(result);
      });
    });
  }
  getPipelines(projectID, token) {
    let pipelines = new Array();
    let pagePipeline = null;
    let page = 1;
    return new Promise(async resolve => {
      while (1) {
        pagePipeline = await this.getPagePipeline(projectID, token, page);
        /* means no existing pipeline */
        if (pagePipeline.length == 0) break;
        pagePipeline.forEach(item => {
          pipelines.push(item);
        });
        page = page + 1;
      }
      resolve(pipelines);
    });
  }
  getPipelineJob(projectID, pipelineID, token) {
    return new Promise((resolve, reject) => {
      let url = `${
        config.hostname
      }/gitlab/api/v4/projects/${projectID}/pipelines/${pipelineID}/jobs?&access_token=${token}`;
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
      }/gitlab/api/v4/projects/${projectID}/pipelines?ref_name=${refName}&access_token=${token}`;
      request.post(url, (error, rsp, body) => {
        if (error) reject(error);
        resolve(rsp);
      });
    });
  }
}

module.exports = {
  gitlabAPI: new gitlabAPI()
};
