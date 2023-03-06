import execa from "execa";
import fs from "node:fs";

const SHORTCUT_STORY_LINK = "https://app.shortcut.com/dataiku/story/";

function extractStoryId(str) {
  const match = str.match(/sc-\d+/);
  if (match) {
    const storyId = match[0].slice(3);
    return storyId;
  }
  return null;
}

async function getLastTag() {
  const { stdout, stderr } = await execa("git", [
    "describe",
    "--tags",
    "--abbrev=0",
  ]);
  if (stderr) {
    throw new Error("Could not get latest tag");
  }
  return stdout.trim();
}

async function getReleaseCommitMessages(latestTag) {
  const { stdout, stderr } = await execa("git", [
    "log",
    `${latestTag}..HEAD`,
    '--pretty=format:"%s"',
  ]);
  if (stderr) {
    throw new Error("Could not retrieve commit messages");
  }
  const commitMessages = stdout.trim().split("\n");
  return commitMessages;
}

async function getReleaseRefs(latestTag) {
  const { stdout, stderr } = await execa("git", [
    "log",
    `${latestTag}..HEAD`,
    "--pretty=%D",
  ]);
  if (stderr) {
    throw new Error("Could not retrieve refs");
  }
  const refs = stdout.trim().split("\n");
  return refs;
}

function getAllStories(commitMessages, refs) {
  const stories = [...commitMessages, ...refs]
    .map((value) => {
      return extractStoryId(value);
    })
    .filter((value) => value);

  return [...new Set(stories)];
}

async function getShortCutStoriesLinks() {
  const tag = await getLastTag();
  const commitMessages = await getReleaseCommitMessages(tag);
  const refs = await getReleaseRefs(tag);
  const stories = getAllStories(commitMessages, refs);
  return stories.map((value) => `${SHORTCUT_STORY_LINK}${value}`);
}

async function preprendReleaseNotes(releaseVersion, changeLogPath) {
  const releaseNotes = await getShortCutStoriesLinks();
  const releaseNotesStr = releaseNotes
    .map((value) => `[${value}](${value})`)
    .join("\n");
  const entry = `## ${releaseVersion}\n\n${releaseNotesStr}\n\n`;
  const contents = fs.readFileSync(changeLogPath);
  fs.writeFileSync(changeLogPath, entry + contents, (err) => {
    if (err) throw err;
  });
}

export { preprendReleaseNotes };
