const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')

const { OAuthService } = require('./backend/oauth')
const { platformJudge, platformMarkdown, platformStatus, platformData } = require('./backend/platform/platformBackend')
const { databaseAPI, gameDatabaseAPI } = require('./backend/API')
const { gameModule, gameWebsocket } = require('./backend/gameModule/gameModule')
const config = require('./config/setting')

console.log(config)

var port = process.env.PORT || 3000
var websocketPort = 9487

const app = express()

app.use(bodyParser.json())
app.use(express.static(path.resolve(__dirname + "/dist")))

const _platformJudge = new platformJudge()
const _platformMarkdown = new platformMarkdown()
const _platformStatus = new platformStatus()
const _platformData = new platformData()

// module init
OAuthService.init(app);

(async ()=> {
  const con = await databaseAPI.createConnect("localhost", process.env.DB_USER, process.env.DB_PASSWORD, config.db_database)
  const gamedatabaseCon = await gameDatabaseAPI.createConnect("localhost", process.env.DB_USER, process.env.DB_PASSWORD, config.gameModule)
  _platformJudge.init(app, con, config)
  _platformMarkdown.init(app, con, config)
  _platformStatus.init(app, con, config)
  _platformData.init(app, config)
  if (gameModule) gameModule.init(app, gamedatabaseCon, config)
  if (gameWebsocket) gameWebsocket.init(app, gamedatabaseCon, websocketPort)
})()

app.listen (port, () => {
  console.log("Express server started on port " + port) // eslint-disable-line
})
