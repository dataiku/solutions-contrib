import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const log = console.log;

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

log(__dirname);

const execAsync = promisify(exec);

const repoUrl = "https://github.com/dataiku/solutions-ui-components.git";
const repoFolder = path.resolve(__dirname, "../tmp");

const solutionsPackageName = "quasar-ui-bs";
const depsJsonPath = "../deps.json";

const depsJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, depsJsonPath), "utf-8")
);

const tag = depsJson[solutionsPackageName];

const deleteRepoFolder = async () => {
  try {
    log("\x1b[33m%s\x1b[0m", "Deleting old solutions-ui folder"); // Yellow color
    await fs.promises.rm(repoFolder, { recursive: true });
    log("\x1b[32m%s\x1b[0m", "Existing repo folder deleted successfully"); // Green color
  } catch (err) {
    // Ignore errors if the folder doesn't exist
    if (err.code !== "ENOENT") {
      log("\x1b[31m%s\x1b[0m", "Error deleting repo folder"); // Red color
    }
  }
};

const getLatestTag = () => {
  const gitCommand = `git ls-remote --tags --exit-code --refs ${repoUrl} | sed -E 's/^[[:xdigit:]]+[[:space:]]+refs\\/tags\\/(.+)/\\1/g' | sort --version-sort | tail -n1`
  log("\x1b[32m%s\x1b[0m", `Get latest tag for repo ${repoUrl}`); // Green color
  return execAsync(gitCommand);
};

const cloneRepo = () => {
  if (tag == "latest") {
    getLatestTag()
    .then(
      (stdout, _) => stdout["stdout"]
    )
    .then(
      (latestTag) => {
        const gitCloneCommand = `git clone --depth 1 --branch ${latestTag.trim()} ${repoUrl} ${repoFolder}`;
        log("\x1b[32m%s\x1b[0m", `Cloning into repo ${repoUrl} with tag ${latestTag}`); // Green color
        return execAsync(gitCloneCommand);
      }
    );
  }
  else {
    const gitCloneCommand = `git clone --depth 1 --branch ${tag} ${repoUrl} ${repoFolder}`;
    log("\x1b[32m%s\x1b[0m", `Cloning into repo ${repoUrl} with tag ${tag}`); // Green color
    return execAsync(gitCloneCommand);
  }
};

deleteRepoFolder()
  .then(cloneRepo)
  .then(() => log("\x1b[32m%s\x1b[0m", "UI components setup completed")); // Green color
