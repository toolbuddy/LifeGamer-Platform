const path = require("path");
const express = require("express");

const { OAuthService } = require("./oauth");
const { DBModule } = require("./dbmodule");

var port = process.env.PORT || 3000;

const app = express();

// module init
OAuthService.init(app);
DBModule.init(app);

app.use(express.static(path.resolve(__dirname + "/dist")));

app.listen(port, () => {
  console.log("Express server started on port " + port); // eslint-disable-line
});
