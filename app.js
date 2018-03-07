const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const { OAuthService } = require("./backend/oauth");
const { platformMarkdown } = require("./backend/platformMarkdown");
const { platformGrade } = require("./backend/platformGrade");

var port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname + "/dist")));

// module init
OAuthService.init(app);
platformMarkdown.init(app);
platformGrade.init(app);

app.listen(port, () => {
  console.log("Express server started on port " + port); // eslint-disable-line
});
