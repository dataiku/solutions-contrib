// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js

const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv");
const fs = require("fs");

function getDotenvVar(varName, relativeDotenvPath) {
  if (!relativeDotenvPath) relativeDotenvPath = "../../../../..";
  try {
    const valPath = path.resolve(__dirname, relativeDotenvPath, ".env");
    const valUnparsed = fs.readFileSync(valPath);
    const valParsed = dotenv.parse(valUnparsed);
    if (valParsed.hasOwnProperty(varName)) {
      return valParsed[varName];
    } else {
      console.error(
        `${varName} environment variable does not exist (in the {root}/.env)`
      );
    }
  } catch (error) {
    console.error(
      `Create a .env file in the root directory of the project containing ${varName} variable`
    );
    console.error(error);
  }
  return undefined;
}

function getTestViews() {
  function readFolder(dir) {
    return fs.existsSync(dir) ? fs.readdirSync(dir) : [];
  }
  function resolveDevFolderPath(relPath) {
    return path.resolve(__dirname, relPath);
  }
  const isVueFile = (fileName) => fileName.slice(-4) === ".vue"; // name.vue

  const testViewsFolder = resolveDevFolderPath("src/test");
  const testViewsFiles = readFolder(testViewsFolder);
  return testViewsFiles.filter(isVueFile);
}

module.exports = function (ctx) {
  return {
    supportTS: true,
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: ["register.js"],

    css: ["app.sass"],

    extras: [
      // 'ionicons-v4',
      // 'mdi-v5',
      // 'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      "roboto-font", // optional, you are not bound to it
      "material-icons", // optional, you are not bound to it
      "material-icons-round",
    ],

    framework: {
      iconSet: "svg-mdi-v6",
      // iconSet: 'material-icons', // Quasar icon set
      // lang: 'en-US', // Quasar language pack

      config: {},

      // Quasar plugins
      plugins: ["Notify"],
      directives:["ClosePopup"]
    },

    // animations: 'all', // --- includes all animations
    animations: ["fadeIn", "fadeOut"],

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    build: {
      vueRouterMode: "history",

      chainWebpack(chain) {
        chain.resolve.alias.merge({
          ui:
            process.env.NODE_ENV === "production"
              ? path.resolve(__dirname, `../dist/quasar-ui-bs.es.js`)
              : path.resolve(__dirname, `../src/index.esm.js`),
        });

        chain.plugin("define-ui").use(webpack.DefinePlugin, [
          {
            __UI_VERSION__: `'${require("../package.json").version}'`,
          },
        ]);
      },
      extendWebpack(cfg) {
        cfg.plugins.push(
          new webpack.DefinePlugin({
            "process.env": {
              FLASK_RUN_PORT: JSON.stringify(
                getDotenvVar("FLASK_RUN_PORT") || 5000
              ),
              TEST_VIEWS: JSON.stringify(getTestViews()),
            },
          })
        );
      },
    },

    devServer: {
      port: 31100,
      open: true, // opens browser window automatically
    },

    ssr: {
      middlewares: [
        ctx.prod ? "compression" : "",
        "render", // keep this as last one
      ],
    },
  };
};
