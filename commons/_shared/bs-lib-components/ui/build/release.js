import minimist from "minimist";
import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import semver from "semver";
import enquirer from "enquirer";
import execa from "execa";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { preprendReleaseNotes } from "./get-release-stories.js";

dotenv.config();

const { prompt } = enquirer;
const currentVersion = createRequire(import.meta.url)(
  "../package.json"
).version;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const changeLogPath = path.resolve(__dirname, "../../../../../CHANGELOG.md");

const docsBuildSourceDir = path.resolve(__dirname, "../dev/dist/spa");
const docsBuildSourcePattern = `${docsBuildSourceDir}/`;
const destDocsBuildDir = `${process.env.HOST_GROUP}@${process.env.HOST_NAME}:${process.env.HOST_DIR}`;

const args = minimist(process.argv.slice(2));
const preId = args.preid || semver.prerelease(currentVersion)?.[0];
const isDryRun = args.dry;

const versionIncrements = ["patch", "minor", "major"];

const inc = (i) => semver.inc(currentVersion, i, preId);

const step = (msg) => console.log(chalk.cyan(msg));

const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: "inherit", ...opts });

const dryRun = (bin, args, opts = {}) =>
  console.log(chalk.blue(`[dryrun] ${bin} ${args.join(" ")}`), opts);
const runIfNotDry = isDryRun ? dryRun : run;

async function main() {
  let targetVersion = args._[0];

  if (!targetVersion) {
    const { release } = await prompt({
      type: "select",
      name: "release",
      message: "Select release type",
      choices: versionIncrements
        .map((i) => `${i} (${inc(i)})`)
        .concat(["custom"]),
    });

    if (release === "custom") {
      const result = await prompt({
        type: "input",
        name: "version",
        message: "Input custom version",
        initial: currentVersion,
      });

      targetVersion = result.version;
    } else {
      targetVersion = release.match(/\((.*)\)/)[1];
    }
  }

  if (!semver.valid(targetVersion)) {
    throw new Error(`invalid target version: ${targetVersion}`);
  }

  const { yes: confirmRelease } = await prompt({
    type: "confirm",
    name: "yes",
    message: `Releasing v${targetVersion}. Confirm?`,
  });

  if (!confirmRelease) {
    return;
  }

  step("\nUpdating dependencies...");
  updateVersions(targetVersion);

  step("\nBuilding the package...");
  if (!isDryRun) {
    await run("yarn", ["build"]);
  } else {
    console.log(`(skipped)`);
  }

  // step("\nPublishing documentation");
  // if (!isDryRun) {
  //   await run("yarn", ["build:docs"]);
  //   await runIfNotDry("rsync", [
  //     "-aP",
  //     "--delete",
  //     docsBuildSourcePattern,
  //     destDocsBuildDir,
  //   ]);
  // } else {
  //   console.log(`(skipped)`);
  // }

  step("\nCreating Release Notes");
  if (!isDryRun) {
    await preprendReleaseNotes(targetVersion, changeLogPath);
  }

  const { stdout } = await run("git", ["diff"], { stdio: "pipe" });

  if (stdout) {
    step("\nCommitting changes...");
    await runIfNotDry("git", ["add", "-A"]);
    await runIfNotDry("git", ["commit", "-m", `release: v${targetVersion}`]);
  } else {
    console.log("No changes to commit.");
  }

  step("\nPushing to GitHub...");
  await runIfNotDry("git", ["tag", `v${targetVersion}`]);
  await runIfNotDry("git", ["push", "origin", `refs/tags/v${targetVersion}`]);
  await runIfNotDry("git", ["push"]);

  if (isDryRun) {
    console.log(`\nDry run finished - run git diff to see package changes.`);
  }
}

function updateVersions(version) {
  updatePackage(path.resolve(__dirname, ".."), version);
}

function updatePackage(pkgRoot, version) {
  const pkgPath = path.resolve(pkgRoot, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  pkg.version = version;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
}

main().catch((err) => {
  updateVersions(currentVersion);
  console.error(err);
});
