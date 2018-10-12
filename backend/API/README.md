# API

## databaseAPI

### createConnect(host, user, passwd, db)

- `host` \<string> server host
- `user` \<string> mysql database username
- `passwd` \<string> mysql database password
- `db` \<string> mysql database name
- returns: \<Connection>
- Usage:
    
    return a connection that connects to server mysql database.

### getMarkdownContent(con, page)
- `con` \<Connection> mysql connection
- `page` \<string> The page name.
- returns: <Promise\<string>>
- Usage:

    ```javascript
    var con = await databaseAPI.createConnect(host, user, passwd, db);
    var announcePage = await databaseAPI.getMarkdownContent(con, 'Announce');
    console.log(announcePage); // string of announce page markdown content.
    ```
    Get the string of page markdown content.

    > now LifeGamer platform only have 'Announce' and 'Resource' markdown page.

### setMarkdownContent(con, page, content)

- `con` \<Connection> mysql connection
- `page` \<string> page name.
- `content` \<string> the markdown content is going to save.
- returns: <Promise\<Object>>
- Usage:

    ```javascript
    var con = await databaseAPI.createConnect(host, user, passwd, db);
    await databaseAPI.setMarkdownContent(con, 'Announce', '## Hello world');
    ```
    Saving markdown content into database.

### getUserGrade(con, user)

- `con` \<Connection> mysql connection
- `user` \<string> username, is almost studentID.
- returns: <Promise\<number>>
- Usage:

    ```javascript
    var con = await databaseAPI.createConnect(host, user, passwd, db);
    var grade = await databaseAPI.getUserGrade(con 'A11122333');
    console.log(grade); // student's grade, number.
    ```
    Getting user's grade from database.

### setUserGrade(con, user, grade)

- `con` \<Connection> mysql connection
- `user` \<string> username, is almost studentID.
- `grade` \<number> the grade is going to update.
- returns: <Promise\<Object>>
- Usage:

    ```javascript
    var con = await databaseAPI.createConnect(host, user, passwd, db);
    await databaseAPI.setUserGrade(con, 'A11122333', 0);
    ```
    Updating user's grade.

### getCommitTable(con, user)

- `con` \<Connection> mysql connection
- `user` \<string> username, is almost studentID.
- returns: <Promise\<Object>>
- Usage:

    ```javascript
    var con = await databaseAPI.createConnect(host, user, passwd, db);
    var commitTable = await databaseAPI.getCommitTable(con, 'A11122333');
    console.log(commitTable); // JSON object about user's records
    ```
    Return a list of user's commit records contain user, pipelineID and commit sha.

    > commit table is used for recording the data about **<span style="color:red;">user, commit sha and pipelineID</span>** because GitLabCI can only create the pipeline that run the <span style="color:red;">**latest code version**</span>, needed to change to certain version that user assigned, so it needs a table to record the pair of pipelineID and commit sha.


### insertCommitTable(con, user, pipelineID, sha)

- `con` \<Connection> mysql connection
- `user` \<string> username, is almost studentID.
- `pipelineID` \<number> pipelineID
- `sha` \<string> commit sha
- returns: <Promise\<Object>>
- Usage:

    ```javascript
    var con = await databaseAPI.createConnect(host, user, passwd, db);
    await databaseAPI.insertCommitTable(con, 'A11122333', 1, sha);
    ```
    Insert a row(user, pipelineID, sha) into commit table.

### getServerStatus(con)

- `con` \<Connection> mysql connection
- returns: <Promise\<string>>
- Usage:

    ```javascript
    var con = await databaseAPI.createConnect(host, user, passwd, db);
    var status = await databaseAPI.getServerStatus(con);
    console.log(status); // on or off
    ```
    Return the server status: `on` or `off`


### toggleServerStatus(con)

- `con` \<Connection> mysql connection
- returns: <Promise\<Object>>
- Usage:

    ```javascript
    var con = await databaseAPI.createConnect(host, user, passwd, db);
    await databaseAPI.toggleServerStatus(con);
    ```
    Toggle server status, on to off and off to on.

## gitlabAPI

:::info
When user login, system will pass an <span style="color:red;">**access token**</span> to the client, and the token is correspond to user's permission. All gitlabAPI operation(get/post request) need one access token.
:::

### getUserData(host, token)

- `token` \<string> user's gitlab access token
- returns: <Promise\<Object>>
- Usage:

    ```javascript
    var userData = await gitlabAPI.getUserData('hmkrl.com', token);
    ```
    Getting user data via gitlab api.

- User data format:
    ```json
    [{
        "id": 1,
        "username": "john_smith",
        "name": "John Smith",
        "state": "active",
        "avatar_url": "http://localhost:3000/uploads/user/avatar/1/cd8.jpeg",
        "web_url": "http://localhost:3000/john_smith"
    }]
    ```
    ###### ref: https://docs.gitlab.com/ee/api/users.html


### getProjectID(host, userID, projectName, token)

- `host` \<string> server host
- `userID` \<number> user's ID
- `projectName` \<string> the project name wonna to search for its ID
- `token` \<string> user's gitlab access token
- returns: <Promise\<number>>
- Usage:

    ```javascript
    var projectID = await gitlabAPI.getProjectID('hmkrl.com', 1, '2018-pd2-Project1', token);
    ```
    Getting project ID with the specific project name owned by the given user.

### getPipelines(host, projectID, page, token)

- `host` \<string> server host
- `projectID` \<number> the project's ID that the project wonna search for.
- `page` \<number> page number, 20 pipelines per page.
- `token` \<string> user's gitlab access token.
- returns: <Promise\<Object>>
- Usage:

    ```javascript
    var pipelines = await gitlabAPI.getPipelines('hmkrl.com', 1, 1, token);
    ```
    Getting GitLabCI pipelines status.

    > **Pipelines**
    > 
    > Group of jobs that get executed in stages, if the job succeed, it'll go on next stage. We use it for auto executing <span style="color:red;">**checking code format/debugging/judging**</span>, and giving grades according to jobs' status of the pipelines.


- Pipelines Response format:

    ```json
    [
      {
        "id": 47,
        "status": "pending",
        "ref": "new-pipeline",
        "sha": "a91957a858320c0e17f3a0eca7cfacbff50ea29a",
        "web_url": "https://example.com/foo/bar/pipelines/47"
      },
      {
        "id": 48,
        "status": "pending",
        "ref": "new-pipeline",
        "sha": "eb94b618fb5865b26e80fdd8ae531b7a63ad851a",
        "web_url": "https://example.com/foo/bar/pipelines/48"
      }
    ]
    ```
    ###### ref: https://docs.gitlab.com/ee/api/pipelines.html

### getPipelineJobs(host, projectID, pipelineID, token)

- `host` \<string> server host
- `projectID` \<number> the project's ID that the project wonna search for.
- `pipelineID` \<number> the pipelines ID that the pipeline wonna search for.
- `token` \<string> user's gitlab access token.
- returns: <Promise\<Object>>
- Usage:

    ```javascript
    var pipelines = await gitlabAPI.getPipelineJobs('hmkrl.com', 1, 1, token);
    ```
    Getting a list of jobs for a pipeline.

- Job list format:
    ```json
    [
      {
        "commit": {
          "author_email": "admin@example.com",
          "author_name": "Administrator",
          "created_at": "2015-12-24T16:51:14.000+01:00",
          "id": "0ff3ae198f8601a285adcf5c0fff204ee6fba5fd",
          "message": "Test the CI integration.",
          "short_id": "0ff3ae19",
          "title": "Test the CI integration."
        },
        "coverage": null,
        "created_at": "2015-12-24T15:51:21.727Z",
        "finished_at": "2015-12-24T17:54:24.921Z",
        "artifacts_expire_at": "2016-01-23T17:54:24.921Z",
        "id": 6,
        "name": "rspec:other",
        "pipeline": {
          "id": 6,
          "ref": "master",
          "sha": "0ff3ae198f8601a285adcf5c0fff204ee6fba5fd",
          "status": "pending"
        },
        "ref": "master",
        "artifacts": [],
        "runner": null,
        "stage": "test",
        "started_at": "2015-12-24T17:54:24.729Z",
        "status": "failed",
        "tag": false,
        "web_url": "https://example.com/foo/bar/-/jobs/6",
        "user": {
          "avatar_url": "http://www.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61?s=80&d=identicon",
          "bio": null,
          "created_at": "2015-12-21T13:14:24.077Z",
          "id": 1,
          "linkedin": "",
          "name": "Administrator",
          "skype": "",
          "state": "active",
          "twitter": "",
          "username": "root",
          "web_url": "http://gitlab.dev/root",
          "website_url": ""
        }
      },
      {
        "commit": {
          "author_email": "admin@example.com",
          "author_name": "Administrator",
          "created_at": "2015-12-24T16:51:14.000+01:00",
          "id": "0ff3ae198f8601a285adcf5c0fff204ee6fba5fd",
          "message": "Test the CI integration.",
          "short_id": "0ff3ae19",
          "title": "Test the CI integration."
        },
        "coverage": null,
        "created_at": "2015-12-24T15:51:21.802Z",
        "artifacts_file": {
          "filename": "artifacts.zip",
          "size": 1000
        },
        "artifacts": [
          {"file_type": "archive", "size": 1000, "filename": "artifacts.zip", "file_format": "zip"},
          {"file_type": "metadata", "size": 186, "filename": "metadata.gz", "file_format": "gzip"},
          {"file_type": "trace", "size": 1500, "filename": "job.log", "file_format": "raw"},
          {"file_type": "junit", "size": 750, "filename": "junit.xml.gz", "file_format": "gzip"}
        ],
        "finished_at": "2015-12-24T17:54:27.895Z",
        "artifacts_expire_at": "2016-01-23T17:54:27.895Z",
        "id": 7,
        "name": "teaspoon",
        "pipeline": {
          "id": 6,
          "ref": "master",
          "sha": "0ff3ae198f8601a285adcf5c0fff204ee6fba5fd",
          "status": "pending"
        },
        "ref": "master",
        "artifacts": [],
        "runner": null,
        "stage": "test",
        "started_at": "2015-12-24T17:54:27.722Z",
        "status": "failed",
        "tag": false,
        "web_url": "https://example.com/foo/bar/-/jobs/7",
        "user": {
          "avatar_url": "http://www.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61?s=80&d=identicon",
          "bio": null,
          "created_at": "2015-12-21T13:14:24.077Z",
          "id": 1,
          "linkedin": "",
          "name": "Administrator",
          "skype": "",
          "state": "active",
          "twitter": "",
          "username": "root",
          "web_url": "http://gitlab.dev/root",
          "website_url": ""
        }
      }
    ]
    ```

    ###### ref: https://docs.gitlab.com/ee/api/jobs.html

### getBranchList(host, projectID, token)

- `host` \<string> server host
- `projectID` \<number> the project's ID that the project wonna search for.
- `token` \<string> user's gitlab access token.
- returns: <Promise\<Object>>
- Usage:

    ```javascript
    var branchList = await gitlabAPI.getBranchList('hmkrl.com', 1, token);
    ```
    getting list of certain project's branches.

- Branch list format:

    ```json
    ['master', 'dev', 'debug']
    ```

### getCommits(host, projectID, branch, page, token)

- `host` \<string> server host
- `projectID` \<number> the project's ID that the project wonna search for.
- `branch` \<string> the branch name.
- `page` \<number> page number, 20 commits per page.
- `token` \<string> user's gitlab access token.
- returns: <Promise\<Object>>
- Usage:

    ```javascript
    var commitList = await gitlabAPI.getCommits('hmkrl.com', 1, 'master', 1, token);
    ```
    Get a list of repository commits in a project with certain branch.

- Commit list format:

    ```json
    [
      {
        "id": "ed899a2f4b50b4370feeea94676502b42383c746",
        "short_id": "ed899a2f4b5",
        "title": "Replace sanitize with escape once",
        "author_name": "Dmitriy Zaporozhets",
        "author_email": "dzaporozhets@sphereconsultinginc.com",
        "authored_date": "2012-09-20T11:50:22+03:00",
        "committer_name": "Administrator",
        "committer_email": "admin@example.com",
        "committed_date": "2012-09-20T11:50:22+03:00",
        "created_at": "2012-09-20T11:50:22+03:00",
        "message": "Replace sanitize with escape once",
        "parent_ids": [
          "6104942438c14ec7bd21c6cd5bd995272b3faff6"
        ]
      },
      {
        "id": "6104942438c14ec7bd21c6cd5bd995272b3faff6",
        "short_id": "6104942438c",
        "title": "Sanitize for network graph",
        "author_name": "randx",
        "author_email": "dmitriy.zaporozhets@gmail.com",
        "committer_name": "Dmitriy",
        "committer_email": "dmitriy.zaporozhets@gmail.com",
        "created_at": "2012-09-20T09:06:12+03:00",
        "message": "Sanitize for network graph",
        "parent_ids": [
          "ae1d9fb46aa2b07ee9836d49862ec4e2c46fbbba"
        ]
      }
    ]
    ```
    ###### ref: https://docs.gitlab.com/ee/api/commits.html

### postPipeline(host, projectID, branch, token)

- `host` \<string> server host
- `projectID` \<number> the project's ID that the project wonna search for.
- `branch` \<string> the branch name.
- `token` \<string> user's gitlab access token.
- returns: <Promise\<Object>>
- Usage:

    ```javascript
    /* important: remember to write config file */
    .....
    await gitlabAPI.postPipeline('hmkrl.com', 1, 'master', token);
    ```
    Creating a new pipeline running judgment.

    > Before creating pipeline, remember to write config file in `/tmp/${username}`, let GitLabCI knows which version to checkout.

- Config file format:

    ```
    SHA=${sha}
    TOKEN=${token}
    ```

    > SHA: commit sha, let CI knows which version
    >
    > TOKEN: user's gitlab access token, let judging system knows who it is.

### getArtifact(host, projectID, jobID, token, target, path)

- `host` \<string> server host
- `projectID` \<number> project ID
- `jobID` \<number> job ID, the artifact file is binding to job
- `token` \<string> user's gitlab access token
- `target` \<string> the file wonna download inside the artifact
- `path` \<string> file path and name
- returns: <Promise\<Object>>
- Usage:

    ```javascript
    await gitlabAPI.getArtifact('hmkrl.com', 1, 1, token, 'testFile', 'test.txt');
    ```

    getting and downloading artifact.