const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const { OAuthService } = require("./backend/oauth");
const { platformMarkdown } = require("./backend/platformMarkdown");
const { platformCommit } = require("./backend/platformCommit");
const { platformStatus } = require("./backend/platformStatus");
const { platformPipelines } = require("./backend/platformPipelines");
const { platformBattleField } = require("./backend/platformBattleField");
const { websocket } = require("./backend/websocket");

const { platformJudge, _platformMarkdown, _platformStatus } = require('./backend/platform/platformBackend');
const { databaseAPI, gameDatabaseAPI } = require('./backend/API/API');
const { gameModule } = require('./backend/gameModule/gameModule')
const config = require('./config/config')[process.env.NODE_ENV];

var port = process.env.PORT || 3000;

const app = express();

/* for websocket */
const server = require("http").Server(app);
const socketIO = require("socket.io")(server);

app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname + "/dist")));

const _platformJudge = new platformJudge();
const __platformMarkdown = new _platformMarkdown()
const __platformStatus = new _platformStatus();

// module init
OAuthService.init(app);
//platformMarkdown.init(app);
//platformCommit.init(app);
//platformPipelines.init(app);
//platformStatus.init(app);
//platformBattleField.init(app);
websocket.WebSocketInit(socketIO);
websocket.appInit(app);

(async ()=> {
  const con = await databaseAPI.createConnect("localhost", process.env.DB_USER, process.env.DB_PASSWORD, config.db_database);
  const conGameDB = await gameDatabaseAPI.createConnect("localhost", process.env.DB_USER, process.env.DB_PASSWORD, config.gameDatabase)
  _platformJudge.init(app, con, config);
  __platformMarkdown.init(app, con, config)
  __platformStatus.init(app, con, config)
  gameModule.init(app, conGameDB, config)
})();

server.listen(port, () => {
  console.log("Express server started on port " + port); // eslint-disable-line
});
