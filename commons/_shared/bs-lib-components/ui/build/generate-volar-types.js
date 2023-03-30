// The file is not designed to run directly. `cwd` should be project root.
import fs from "node:fs";
import path from "node:path";
import { glob } from "glob";

const TYPE_ROOT = "../dist/types";

const componentsFolder = "../src/components/**/*.vue";

const excludeComponents = [];

const globalComponents = [];

const componentFiles = await glob(componentsFolder, {});

for (const file of componentFiles) {
  globalComponents.push(path.parse(file).name);
}

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

  await fs.writeFileSync(path.resolve(TYPE_ROOT, "volar.d.ts"), code, "utf-8");
}

generateComponentsType(globalComponents);
