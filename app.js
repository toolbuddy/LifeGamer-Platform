const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const { OAuthService } = require("./oauth");
const { DBModule } = require("./dbmodule");

var port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname + "/dist")));

// module init
OAuthService.init(app);
DBModule.init(app);

app.listen(port, () => {
  console.log("Express server started on port " + port); // eslint-disable-line
});
