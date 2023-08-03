const {
  yellow,
  red,
  magenta,
  green,
  bold,
  blue,
  blueBright,
  underline,
} = require("colorette");
const gradient = require("gradient-string");
const figlet = require("figlet");
const { createSpinner } = require("nanospinner");

function print(name, text, figure = " ") {
  console.log(`${figure} [${name}] ${text}`);
}

module.exports = {
  start: async function (appName, version) {
    const promise = new Promise((resolve, reject) => {
      figlet(appName, (err, data) => {
        if (err) {
          reject(
            new Error("Oops!.. Unable to create gradient multiline string")
          );
        }
        resolve(true);

        console.log(gradient.retro.multiline(data));
        console.log(gradient.retro(`Version: ${version}\n`));
      });
    });
    return promise;
  },
  play: function (name, text) {
    print(blue(bold(name)), magenta(text), green("▶"));
  },
  resume: function (name, text) {
    print(blueBright(bold(name)), magenta(text), red("■"));
  },
  focus: function (name, text) {
    print(green(bold(name)), magenta(underline(text)));
  },
  info: function (name, text) {
    print(green(bold(name)), magenta(text));
  },
  warn: function (name, text) {
    print(yellow(bold(name)), yellow(text), yellow("⚠"));
  },
  error: function (name, text) {
    print(red(bold(name)), red(text), red("✘"));
  },
  success: function (name, text) {
    print(green(bold(name)), magenta(text), green("✔"));
  },
  loading: function (name, text) {
    return createSpinner(`[${green(bold(name))}] ${magenta(text)}`).start();
  },
};
