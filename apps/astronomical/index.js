var SunCalc = require("suncalc");

var date = new Date();
var lastLocation = {};

module.exports = {
  start: async function (sensors, io) {
    sensors.on("location", async (location) => {
      location = {
        latitude: 48.0508715,
        longitude: -1.5045438,
        altitude: 45,
      };
      lastLocation = location;
      generate(location, io);
    });
    io.on("connection", (socket) => {
      console.log("a user connected");
      socket.on("changeDate", (newDate) => {
        date = new Date(newDate);
        console.log(date);
        generate(lastLocation, io);
      });
    });
  },
  stop: async function () {},
};

async function generate(location, io) {
  var sunTimes = await SunCalc.getTimes(
    date,
    location.latitude,
    location.longitude,
    location.altitude
  );
  sunTimes.date = date;
  var moonTimes = await SunCalc.getMoonTimes(
    date,
    location.latitude,
    location.longitude
  );
  var moonPhase = await SunCalc.getMoonIllumination(date);

  io.emit("location", location);
  io.emit("sunTimes", sunTimes);
  io.emit("moonTimes", moonTimes);
  io.emit("moonPhase", moonPhase);
}

module.exports.app = {
  name: "Astronomical",
  icon: {
    colors: { primary: "from-amber-600", secondary: "to-orange-600" },
    svg: '<svg xmlns="http://www.w3.org/2000/svg" fill="white" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z"/></svg>',
  },
  pageFolder: "public",
};
