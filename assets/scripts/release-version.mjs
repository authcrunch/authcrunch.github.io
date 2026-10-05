import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const upstream =
  process.env.CADDY_SECURITY_REPOSITORY ||
  "https://github.com/greenpau/caddy-security.git";
const stable = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const metadataFiles = ["VERSION", "package.json", "package-lock.json"];

function git(args, { missing = false } = {}) {
  const result = spawnSync("git", args, {
    cwd: root,
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
    encoding: "utf8",
    timeout: 30_000,
    maxBuffer: 4 * 1024 * 1024,
  });
  if (result.error) throw new Error(`Git operation failed: ${result.error.message}`);
  if (missing && result.status === 1) return null;
  if (result.status !== 0)
    throw new Error(`Git operation failed: ${result.stderr.trim() || args[0]}`);
  return result.stdout.trim();
}

function latest() {
  const refs = git(["ls-remote", "--exit-code", "--refs", "--tags", upstream, "v*"]);
  const versions = refs
    .split("\n")
    .map((line) => line.split(/\s+/)[1]?.replace(/^refs\/tags\/v/, ""))
    .filter((version) => stable.test(version || ""));
  if (!versions.length) throw new Error("caddy-security has no stable vX.Y.Z tag");
  versions.sort((a, b) => {
    const left = a.split(".").map(BigInt);
    const right = b.split(".").map(BigInt);
    for (let i = 0; i < left.length; i++) {
      if (left[i] !== right[i]) return left[i] < right[i] ? -1 : 1;
    }
    return 0;
  });
  return versions.at(-1);
}

function readMetadata() {
  const contents = metadataFiles.map((file) =>
    fs.readFileSync(path.join(root, file), "utf8"),
  );
  const pkg = JSON.parse(contents[1]);
  const lock = JSON.parse(contents[2]);
  if (
    typeof pkg.version !== "string" ||
    typeof lock.version !== "string" ||
    typeof lock.packages?.[""]?.version !== "string"
  )
    throw new Error("package.json and package-lock.json must contain root version metadata");
  return { contents, version: contents[0].trim(), pkg, lock };
}

function check(metadata, tag = "") {
  const { version, pkg, lock } = metadata;
  if (!stable.test(version)) throw new Error("VERSION must contain a stable X.Y.Z version");
  if ([pkg.version, lock.version, lock.packages[""].version].some((v) => v !== version))
    throw new Error("VERSION and both npm root versions differ; run make sync-release-version");
  if (tag && tag !== `v${version}`)
    throw new Error(`Release tag '${tag}' must be 'v${version}'`);
  return version;
}

function sync(metadata, version) {
  metadata.pkg.version = version;
  metadata.lock.version = version;
  metadata.lock.packages[""].version = version;
  const next = [
    `${version}\n`,
    JSON.stringify(metadata.pkg, null, 2) + "\n",
    JSON.stringify(metadata.lock, null, 2) + "\n",
  ];
  // Parse all inputs before writing; dependency versions and integrity stay intact.
  for (let i = 0; i < metadataFiles.length; i++) {
    if (next[i] !== metadata.contents[i])
      fs.writeFileSync(path.join(root, metadataFiles[i]), next[i]);
  }
  check(readMetadata(), `v${version}`);
}

function release() {
  if (git(["rev-parse", "--abbrev-ref", "HEAD"]) !== "main")
    throw new Error("Release requires the main branch");
  if (git(["status", "--porcelain=v1", "--untracked-files=normal"]))
    throw new Error("Git directory is dirty; commit changes first");
  const pushUrls = git(["remote", "get-url", "--push", "--all", "origin"]).split("\n");
  if (pushUrls.length !== 1)
    throw new Error("Release requires exactly one origin push URL");
  git(["ls-files", "--error-unmatch", "--", ...metadataFiles]);
  const metadata = readMetadata();
  const version = latest();
  const tag = `v${version}`;
  if (git(["show-ref", "--verify", "--quiet", `refs/tags/${tag}`], { missing: true }) !== null)
    throw new Error(`Release ${tag} already exists locally`);
  if (git(["ls-remote", "--refs", pushUrls[0], `refs/tags/${tag}`]))
    throw new Error(`Release ${tag} already exists on origin`);

  console.log(`release-version: selected caddy-security ${tag}`);
  sync(metadata, version);
  if (git(["diff", "HEAD", "--", ...metadataFiles])) {
    git(["add", "--", ...metadataFiles]);
    git(["commit", "-m", `released ${tag}`]);
  }
  git(["tag", "-a", tag, "-m", tag]);
  try {
    // One atomic push avoids partial remote publication and unrelated follow-tags.
    git([
      "-c", "push.followTags=false", "push", "--atomic", "origin",
      "HEAD:refs/heads/main", `refs/tags/${tag}`,
    ]);
  } catch (error) {
    throw new Error(
      `${error.message}\nLocal release commit/tag are retained. Resolve the push failure, then retry:\n` +
      `git -c push.followTags=false push --atomic origin HEAD:refs/heads/main refs/tags/${tag}`,
    );
  }
  console.log(`release-version: published ${tag}`);
}

try {
  const [mode = "check", providedTag, ...extra] = process.argv.slice(2);
  const tag = providedTag ?? (mode === "check" ? process.env.RELEASE_TAG || "" : "");
  if (extra.length || (mode !== "check" && tag))
    throw new Error("Usage: node assets/scripts/release-version.mjs latest|sync|check [tag]|release");
  switch (mode) {
    case "latest":
      console.log(latest());
      break;
    case "sync": {
      const metadata = readMetadata();
      const version = latest();
      sync(metadata, version);
      console.log(`release-version: synchronized to caddy-security v${version}`);
      break;
    }
    case "check":
      console.log(`release-version: v${check(readMetadata(), tag)} metadata matches`);
      break;
    case "release":
      release();
      break;
    default:
      throw new Error("Usage: node assets/scripts/release-version.mjs latest|sync|check [tag]|release");
  }
} catch (error) {
  console.error(`release-version: ${error.message}`);
  process.exitCode = 1;
}
