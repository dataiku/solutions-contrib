// The file is not designed to run directly. `cwd` should be project root.
const path = require("path");
const fs = require("fs-extra");
const glob = require("glob");

const TYPE_ROOT = "../dist/types";

const componentsFolder = "../src/components/**/*.vue";

const excludeComponents = [];

const globalComponents = [];

glob(componentsFolder, {}, function (er, files) {
  files.forEach((value) => {
    globalComponents.push(path.parse(value).name);
  });
  generateComponentsType(globalComponents);
});

async function generateComponentsType(globalComponents) {
  const components = {};
  globalComponents.forEach((key) => {
    const entry = `typeof import('quasar-ui-bs')['${key}']`;
    if (key.startsWith("Bs") && !excludeComponents.includes(key)) {
      components[key] = entry;
    }
  });
  const lines = Object.entries({
    ...components,
  })
    .filter(([name]) => {
      return components[name];
    })
    .map(([name, v]) => {
      if (!/^\w+$/.test(name)) {
        name = `'${name}'`;
      }
      return `${name}: ${v}`;
    });
  const code = `// Auto generated component declarations
declare module 'vue' {
  export interface GlobalComponents {
    ${lines.join("\n    ")}
  }
}
export {}
`;

  await fs.writeFile(path.resolve(TYPE_ROOT, "volar.d.ts"), code, "utf-8");
}
