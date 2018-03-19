const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const { OAuthService } = require("./backend/oauth");
const { platformMarkdown } = require("./backend/platformMarkdown");
const { platformCommit } = require("./backend/platformCommit");
const { platformStatus } = require("./backend/platformStatus");
const { platformPipelines } = require("./backend/platformPipelines");
const { websocket } = require("./backend/websocket");

var port = process.env.PORT || 3000;

const app = express();

/* for websocket */
const server = require("http").Server(app);
const socketIO = require("socket.io")(server);

app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname + "/dist")));

// module init
OAuthService.init(app);
platformMarkdown.init(app);
platformCommit.init(app);
platformPipelines.init(app);
platformStatus.init(app);
websocket.WebSocketInit(socketIO);
websocket.appInit(app);

server.listen(port, () => {
  console.log("Express server started on port " + port); // eslint-disable-line
});
