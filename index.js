const express = require("express");
const log = require("./lib/logger");
const package = require("./package.json");
const settings = require("./config/settings.json");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");
//const helmet = require("helmet");
const compression = require("compression");
const { EventEmitter } = require("events");
var events = new EventEmitter();

const { faker } = require("@faker-js/faker");

setInterval(() => {
  var data = {
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    altitude: faker.number.int({ min: 0, max: 1200 }),
  };
  events.emit("location", data);
}, 10000);

const app = express();
const server = http.createServer(app);
const io = new Server(server);
//app.use(helmet());
app.use(compression());

const apps = fs.readdirSync("./apps");
var appsCollection = [];
var appInfos = [];

log.play("Apps", "Importing apps...");
apps.forEach((appFolder) => {
  const file = require(`./apps/${appFolder}/index.js`);
  file.start(events, io);
  appsCollection.push(file);
  log.info("Apps", `Loaded ${file.app.name}`);
  file.app.endpoint = `/${file.app.name}/`;
  appInfos.push(file.app);
  log.info(
    "Apps",
    `   Endpoint: ${file.app.endpoint}, ${path.join(
      __dirname,
      "/apps",
      appFolder,
      "/public"
    )}`
  );
  app.use(
    file.app.endpoint,
    express.static(path.join(__dirname, "/apps", appFolder, "/public"))
  );
});

app.use(express.static(path.join(__dirname, "/app")));

app.get("/api/apps", (req, res) => {
  res.send(appInfos);
});

io.use((socket, next) => {
  next();

  socket.on("disconnect", () => {
    // not triggered
  });
});

server.listen(80, () => {
  console.log("listening on *:80");
});
