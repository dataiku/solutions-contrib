import execa from "execa";
import fs from "node:fs";
import https from "https";
import dotenv from "dotenv";

dotenv.config();

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

async function getShortCutStories() {
  const tag = await getLastTag();
  const commitMessages = await getReleaseCommitMessages(tag);
  const refs = await getReleaseRefs(tag);
  const stories = getAllStories(commitMessages, refs);
  return stories;
}

async function getStoryDetails(storyId) {
  return new Promise(async (resolve, reject) => {
    const options = {
      hostname: "api.app.shortcut.com",
      path: `/api/v3/stories/${storyId}`,
      headers: {
        "Content-Type": "application/json",
        "Shortcut-Token": process.env.SHORTCUT_TOKEN,
      },
    };
    let data = "";

    const req = https.request(options, (res) => {
      res.on("data", (chunk) => (data += chunk));
      res.on("error", (e) => reject(e));
      res.on("end", () => {
        data = JSON.parse(data);
        resolve(data);
      });
    });
    req.end();
  });
}

async function getStoriesData(storyIds) {
  return Promise.all(storyIds.map((value) => getStoryDetails(value))).then(
    (values) => {
      return values.map((story) => {
        return {
          link: story.app_url,
          name: story.name,
          type: story.story_type,
        };
      });
    }
  );
}

async function getChangelogEntryFromData() {
  const stories = await getShortCutStories();
  const storiesData = await getStoriesData(stories);
  let changlogEntry = "";
  for (const story of storiesData) {
    let entry = `- ${story.name}\n\n`;
    if (story.type) {
      entry += `\t - type: ${story.type}\n`;
    }
    if (story.link) {
      entry += `\t - link : [${story.link}](${story.link})\n`;
    }
    changlogEntry += entry;
    changlogEntry += `\n\n`;
  }

  return changlogEntry;
}

async function preprendReleaseNotes(releaseVersion, changeLogPath) {
  const releaseNotes = await getChangelogEntryFromData();
  const entry = `## Release ${releaseVersion}\n\n${releaseNotes}\n\n`;
  const contents = fs.readFileSync(changeLogPath);
  fs.writeFileSync(changeLogPath, entry + contents, (err) => {
    if (err) throw err;
  });
}

export { preprendReleaseNotes };
