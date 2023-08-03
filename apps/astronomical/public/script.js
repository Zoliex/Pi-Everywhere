const { createApp } = Vue;
var socket = io();

var localeFr = {
  days: [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ],
  daysShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
  daysMin: ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
  months: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ],
  monthsShort: [
    "Jan",
    "Fév",
    "Mars",
    "Avr",
    "Mai",
    "Juin",
    "Juil",
    "Août",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  today: "Aujourd'hui",
  clear: "Effacer",
  dateFormat: "dd/MM/yyyy",
  timeFormat: "HH:mm",
  firstDay: 1,
};

var app = createApp({
  data() {
    return {
      astro: {
        date: "??/??/??",
        sun: {
          goldenHour: {
            morning: "??:?? - ??:??",
            evening: "??:?? - ??:??",
          },
          civilTwilight: {
            morning: "??:?? - ??:??",
            evening: "??:?? - ??:??",
          },
          sunRise: "??:??",
          sunSet: "??:??",
          night: {
            begin: "??:??",
            end: "??:??",
          },
        },
        moon: {
          pos: {
            rise: "??:??",
            set: "??:??",
          },
          phase: {
            name: "Nouvelle Lune",
            imgSrc: "assets/moon/newmoon.png",
            illumination: 0,
          },
        },
      },
      location: {
        latitude: "??.?????",
        longitude: "??.?????",
        altitude: "??",
      },
      showDatePicker: false,
    };
  },
  methods: {},
  mounted() {
    var datepicker = document.querySelector(".datepicker");
    undefined;
    datepicker.addEventListener("changeDate", (e) => {
      if (this.showDatePicker) {
        this.showDatePicker = false;
        socket.emit("changeDate", new Date(e.detail.date));
      }
    });
  },
});

const vm = app.mount("#app");

socket.on("sunTimes", function (data) {
  vm.astro.date = moment(data.date).format("DD/MM/YYYY");
  vm.astro.sun = {
    goldenHour: {
      morning: `${moment(data.sunrise).format("HH:mm")} - ${moment(
        data.goldenHourEnd
      ).format("HH:mm")}`,
      evening: `${moment(data.goldenHour).format("HH:mm")} - ${moment(
        data.sunset
      ).format("HH:mm")}`,
    },
    civilTwilight: {
      morning: `${moment(data.dawn).format("HH:mm")} - ${moment(data.sunrise)
        .add(-20, "minutes")
        .format("HH:mm")}`,
      evening: `${moment(data.sunset)
        .add(15, "minutes")
        .format("HH:mm")} - ${moment(data.dusk).format("HH:mm")}`,
    },
    sunRise: moment(data.sunrise).format("HH:mm"),
    sunSet: moment(data.sunset).format("HH:mm"),
    night: {
      begin: moment(data.night).format("HH:mm"),
      end: moment(data.nightEnd).format("HH:mm"),
    },
  };
});
socket.on("moonTimes", function (data) {
  vm.astro.moon.pos = {
    rise: moment(data.rise).format("HH:mm"),
    set: moment(data.set).format("HH:mm"),
  };
});
socket.on("moonPhase", function (data) {
  console.log(data);
  vm.astro.moon.phase.illumination = Math.round(data.fraction * 100);
  if (data.phase >= 0 && data.phase <= 0.125) {
    vm.astro.moon.phase.name = "Nouvelle<br/>Lune";
    vm.astro.moon.phase.imgSrc = "assets/moon/newmoon.png";
  } else if (data.phase > 0.125 && data.phase <= 0.25) {
    vm.astro.moon.phase.name = "Premier<br/>croissant";
    vm.astro.moon.phase.imgSrc = "assets/moon/waxingcrescent.png";
  } else if (data.phase > 0.25 && data.phase <= 0.375) {
    vm.astro.moon.phase.name = "Premier<br/>quartier";
    vm.astro.moon.phase.imgSrc = "assets/moon/firstquarter.png";
  } else if (data.phase > 0.375 && data.phase <= 0.5) {
    vm.astro.moon.phase.name = "Gibbeuse<br/>croissante";
    vm.astro.moon.phase.imgSrc = "assets/moon/waxinggibbous.png";
  } else if (data.phase > 0.5 && data.phase <= 0.625) {
    vm.astro.moon.phase.name = "Pleine<br/>Lune";
    vm.astro.moon.phase.imgSrc = "assets/moon/fullmoon.png";
  } else if (data.phase > 0.625 && data.phase <= 0.75) {
    vm.astro.moon.phase.name = "Gibbeuse<br/>décroissante";
    vm.astro.moon.phase.imgSrc = "assets/moon/waninggibbous.png";
  } else if (data.phase > 0.75 && data.phase <= 0.875) {
    vm.astro.moon.phase.name = "Dernier<br/>quartier";
    vm.astro.moon.phase.imgSrc = "assets/moon/lastquarter.png";
  } else if (data.phase > 0.875 && data.phase <= 1) {
    vm.astro.moon.phase.name = "Dernier<br/>croissant";
    vm.astro.moon.phase.imgSrc = "assets/moon/waningcrescent.png";
  }
});
socket.on("location", function (data) {
  vm.location = data;
});
