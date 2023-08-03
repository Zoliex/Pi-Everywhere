const { createApp } = Vue;
var socket = io();

var app = createApp({
  data() {
    return {
      apps: null,
    };
  },
  methods: {},
  mounted() {},
});

const vm = app.mount("#app");

axios
  .get("/api/apps")
  .then(function (response) {
    console.log(response.data);
    vm.apps = response.data;
  })
  .catch(function (error) {
    location.reload();
  });
