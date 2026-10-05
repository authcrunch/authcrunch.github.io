import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const script = "assets/scripts/release-version.mjs";
const files = ["VERSION", "package.json", "package-lock.json"];

function fixture(t, tags = ["v1.4.1"]) {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "authcrunch-docs-release-"));
  t.after(() => fs.rmSync(base, { recursive: true, force: true }));
  const repo = path.join(base, "docs with spaces");
  const upstream = path.join(base, "caddy-security");
  const origin = path.join(base, "origin.git");
  const env = { ...process.env };
  for (const key of Object.keys(env)) {
    if (key.startsWith("GIT_") || ["MAKEFLAGS", "MFLAGS", "MAKELEVEL", "RELEASE_TAG"].includes(key))
      delete env[key];
  }
  Object.assign(env, {
    GIT_CONFIG_NOSYSTEM: "1",
    GIT_CONFIG_GLOBAL: os.devNull,
    CADDY_SECURITY_REPOSITORY: upstream,
  });
  function run(args, { cwd = repo, success = true } = {}) {
    const result = spawnSync(args[0], args.slice(1), { cwd, env, encoding: "utf8" });
    assert.equal(result.error, undefined);
    if (success) assert.equal(result.status, 0, result.stdout + result.stderr);
    else assert.notEqual(result.status, 0, "Expected failure: " + args.join(" "));
    return { ...result, output: result.stdout + result.stderr };
  }
  const git = (args, options) => run(["git", ...args], options).stdout.trim();
  const cli = (args, options) => run([process.execPath, script, ...args], options);
  const write = (name, text) => fs.writeFileSync(path.join(repo, name), text);
  const read = (name) => fs.readFileSync(path.join(repo, name), "utf8");
  const json = (name) => JSON.parse(read(name));
  function commit() {
    git(["add", "."]);
    git(["commit", "-m", "test: fixture"]);
  }
  function init(dir) {
    fs.mkdirSync(dir, { recursive: true });
    git(["init", "-b", "main"], { cwd: dir });
    for (const [name, value] of [
      ["user.name", "Release Test"], ["user.email", "release-test@example.test"],
      ["commit.gpgsign", "false"], ["tag.gpgSign", "false"], ["core.hooksPath", os.devNull],
    ]) git(["config", name, value], { cwd: dir });
    git(["commit", "--allow-empty", "-m", "test: initial"], { cwd: dir });
  }
  init(upstream);
  for (const tag of tags) git(["tag", tag], { cwd: upstream });
  init(repo);
  fs.mkdirSync(path.dirname(path.join(repo, script)), { recursive: true });
  fs.copyFileSync(path.join(root, script), path.join(repo, script));
  fs.copyFileSync(path.join(root, "Makefile"), path.join(repo, "Makefile"));
  write(".gitignore", "tmp/\n");
  write("README.md", "Fixture\n");
  write("VERSION", "1.0.50\n");
  write("package.json", JSON.stringify({
    name: "docs", version: "1.0.50", private: true,
    dependencies: { "example-dependency": "2.3.4" },
  }, null, 2) + "\n");
  write("package-lock.json", JSON.stringify({
    name: "docs", version: "1.0.49", lockfileVersion: 3,
    packages: {
      "": { name: "docs", version: "1.0.49", dependencies: { "example-dependency": "2.3.4" } },
      "node_modules/example-dependency": { version: "2.3.4", integrity: "fixture-integrity" },
    },
  }, null, 2) + "\n");
  commit();
  git(["init", "--bare", "-b", "main", origin]);
  git(["remote", "add", "origin", origin]);
  git(["push", "-u", "origin", "main"]);
  function state() {
    return {
      contents: files.map(read), head: git(["rev-parse", "HEAD"]),
      status: git(["status", "--porcelain"]), tags: git(["tag", "--list"]),
      remoteRefs: git(["ls-remote", "--refs", "origin"]),
    };
  }
  function assertVersion(version) {
    assert.equal(read("VERSION"), version + "\n");
    assert.equal(json("package.json").version, version);
    assert.equal(json("package-lock.json").version, version);
    assert.equal(json("package-lock.json").packages[""].version, version);
    cli(["check", "v" + version]);
  }
  return { base, repo, upstream, origin, env, run, git, cli, write, read, json, commit, state, assertVersion };
}

test("latest uses numeric stable tags, ignoring prerelease and malformed tags", (t) => {
  const f = fixture(t, ["v1.9.9", "v1.10.2", "v1.11.0-rc.1", "v01.99.0", "v1.20"]);
  f.git(["tag", "-a", "v1.10.3", "-m", "annotated"], { cwd: f.upstream });
  assert.equal(f.cli(["latest"]).stdout.trim(), "1.10.3");
});

test("latest rejects an upstream with no stable tag", (t) => {
  const f = fixture(t, ["v1.5.0-rc.1", "v01.4.1"]);
  const before = f.state();
  assert.match(f.cli(["sync"], { success: false }).output, /no stable/);
  assert.deepEqual(f.state(), before);
});

test("sync aligns all metadata without altering dependencies and is idempotent", (t) => {
  const f = fixture(t);
  const packageBefore = f.json("package.json");
  const lockBefore = f.json("package-lock.json");
  f.cli(["sync"]);
  f.assertVersion("1.4.1");
  const packageAfter = f.json("package.json");
  const lockAfter = f.json("package-lock.json");
  packageAfter.version = packageBefore.version;
  lockAfter.version = lockBefore.version;
  lockAfter.packages[""].version = lockBefore.packages[""].version;
  assert.deepEqual(packageAfter, packageBefore);
  assert.deepEqual(lockAfter, lockBefore);
  const before = f.state();
  f.cli(["sync"]);
  assert.deepEqual(f.state(), before);
});

test("check detects each mismatched npm root version", (t) => {
  const f = fixture(t);
  f.cli(["sync"]);
  for (const target of ["package.json", "lock-root", "lock-package-root"]) {
    const file = target === "package.json" ? target : "package-lock.json";
    const original = f.read(file);
    const data = JSON.parse(original);
    if (target === "lock-package-root") data.packages[""].version = "1.4.0";
    else data.version = "1.4.0";
    f.write(file, JSON.stringify(data));
    assert.match(f.cli(["check"], { success: false }).output, /versions differ/);
    f.write(file, original);
  }
});

test("check validates the proposed deployment tag", (t) => {
  const f = fixture(t);
  f.cli(["sync"]);
  f.cli(["check", "v1.4.1"]);
  assert.match(f.cli(["check", "v1.0.51"], { success: false }).output, /must be 'v1.4.1'/);
});

test("make checks RELEASE_TAG as environment data without shell evaluation", (t) => {
  const f = fixture(t);
  f.cli(["sync"]);
  f.run(["make", "check-release-version", "RELEASE_TAG=v1.4.1"]);
  f.env.RELEASE_TAG = "v1.4.1";
  f.run(["make", "check-release-version"]);
  const before = f.state();
  f.env.RELEASE_TAG = "v1.4.1$(touch RELEASE_TAG_INJECTION)";
  assert.match(f.run(["make", "check-release-version"], { success: false }).output, /must be 'v1.4.1'/);
  assert.ok(!fs.existsSync(path.join(f.repo, "RELEASE_TAG_INJECTION")));
  assert.deepEqual(f.state(), before);
});

test("check is offline and rejects a malformed VERSION", (t) => {
  const f = fixture(t);
  f.cli(["sync"]);
  f.env.CADDY_SECURITY_REPOSITORY = path.join(f.base, "missing");
  f.cli(["check"]);
  for (const version of ["main", "v1.4.1", "1.4.1-rc.1", "01.4.1"]) {
    f.write("VERSION", version);
    assert.match(f.cli(["check"], { success: false }).output, /stable X.Y.Z/);
  }
});

test("release commits metadata, makes an annotated tag, and pushes only main and that tag", (t) => {
  const f = fixture(t);
  f.git(["config", "push.followTags", "true"]);
  f.git(["tag", "-a", "unrelated-tag", "-m", "unrelated"]);
  const before = f.git(["rev-parse", "HEAD"]);
  f.run(["make", "release"]);
  f.assertVersion("1.4.1");
  const head = f.git(["rev-parse", "HEAD"]);
  assert.notEqual(head, before);
  assert.equal(f.git(["log", "-1", "--format=%s"]), "released v1.4.1");
  assert.equal(f.git(["cat-file", "-t", "v1.4.1"]), "tag");
  assert.equal(f.git(["rev-parse", "v1.4.1^{commit}"]), head);
  assert.deepEqual(f.git(["diff-tree", "--no-commit-id", "--name-only", "-r", head]).split("\n").sort(), [...files].sort());
  assert.equal(f.git(["rev-parse", "refs/heads/main"], { cwd: f.origin }), head);
  assert.equal(f.git(["rev-parse", "v1.4.1^{commit}"], { cwd: f.origin }), head);
  assert.equal(f.git(["tag", "--list"], { cwd: f.origin }), "v1.4.1");
  assert.equal(f.git(["status", "--porcelain"]), "");
});

test("release resolves newer upstream tags even after earlier synchronization", (t) => {
  const f = fixture(t);
  f.cli(["sync"]);
  f.commit();
  f.git(["tag", "v1.4.2"], { cwd: f.upstream });
  f.cli(["release"]);
  f.assertVersion("1.4.2");
  assert.equal(f.git(["tag", "--list"], { cwd: f.origin }), "v1.4.2");
});

test("already aligned metadata tags the existing commit without an empty commit", (t) => {
  const f = fixture(t);
  f.cli(["sync"]);
  f.commit();
  const before = f.git(["rev-parse", "HEAD"]);
  f.cli(["release"]);
  assert.equal(f.git(["rev-parse", "HEAD"]), before);
  assert.equal(f.git(["rev-parse", "v1.4.1^{commit}"]), before);
});

test("release rejects a non-main branch before network or metadata changes", (t) => {
  const f = fixture(t);
  f.git(["switch", "-c", "feature"]);
  f.env.CADDY_SECURITY_REPOSITORY = path.join(f.base, "missing");
  const before = f.state();
  assert.match(f.cli(["release"], { success: false }).output, /main branch/);
  assert.deepEqual(f.state(), before);
});

test("release rejects detached HEAD without writes", (t) => {
  const f = fixture(t);
  f.git(["switch", "--detach"]);
  const before = f.state();
  assert.match(f.cli(["release"], { success: false }).output, /main branch/);
  assert.deepEqual(f.state(), before);
});

test("release rejects unstaged, staged, and untracked changes without writes", (t) => {
  const f = fixture(t);
  for (const kind of ["unstaged", "staged", "untracked"]) {
    const filename = kind === "untracked" ? "new-file.txt" : "README.md";
    f.write(filename, "Changed\n");
    if (kind === "staged") f.git(["add", filename]);
    const before = f.state();
    assert.match(f.cli(["release"], { success: false }).output, /dirty/);
    assert.deepEqual(f.state(), before);
    f.git(["reset", "--hard", "HEAD"]);
    if (kind === "untracked") fs.unlinkSync(path.join(f.repo, filename));
  }
});

test("ignored tmp notes do not prevent a release", (t) => {
  const f = fixture(t);
  fs.mkdirSync(path.join(f.repo, "tmp"));
  f.write("tmp/review.md", "Ignored working notes\n");
  f.cli(["release"]);
  f.assertVersion("1.4.1");
});

test("existing local tag stops release before metadata or commits change", (t) => {
  const f = fixture(t);
  f.git(["tag", "v1.4.1"]);
  const before = f.state();
  assert.match(f.cli(["release"], { success: false }).output, /already exists locally/);
  assert.deepEqual(f.state(), before);
});

test("existing remote tag stops release even when absent locally", (t) => {
  const f = fixture(t);
  f.git(["tag", "v1.4.1"]);
  f.git(["push", "origin", "refs/tags/v1.4.1"]);
  f.git(["tag", "-d", "v1.4.1"]);
  const before = f.state();
  assert.match(f.cli(["release"], { success: false }).output, /already exists on origin/);
  assert.deepEqual(f.state(), before);
});

test("failed upstream lookup has no local-version fallback or writes", (t) => {
  const f = fixture(t);
  f.env.CADDY_SECURITY_REPOSITORY = path.join(f.base, "missing");
  const before = f.state();
  f.cli(["release"], { success: false });
  assert.deepEqual(f.state(), before);
  f.cli(["sync"], { success: false });
  assert.deepEqual(f.state(), before);
});

test("malformed package metadata is rejected before any partial synchronization", (t) => {
  const f = fixture(t);
  f.write("package-lock.json", "{bad-json");
  f.commit();
  const before = f.state();
  f.cli(["release"], { success: false });
  assert.deepEqual(f.state(), before);
  f.cli(["sync"], { success: false });
  assert.deepEqual(f.state(), before);
});

test("missing npm lock root metadata is rejected before writes", (t) => {
  const f = fixture(t);
  const lock = f.json("package-lock.json");
  delete lock.packages[""];
  f.write("package-lock.json", JSON.stringify(lock));
  const before = f.state();
  assert.match(f.cli(["sync"], { success: false }).output, /root version metadata/);
  assert.deepEqual(f.state(), before);
});

test("origin lookup failure stops release before metadata or tag creation", (t) => {
  const f = fixture(t);
  f.git(["remote", "set-url", "origin", path.join(f.base, "missing")]);
  const contents = files.map(f.read), head = f.git(["rev-parse", "HEAD"]);
  f.cli(["release"], { success: false });
  assert.deepEqual(files.map(f.read), contents);
  assert.equal(f.git(["rev-parse", "HEAD"]), head);
  assert.equal(f.git(["tag", "--list"]), "");
});

test("duplicate guard checks the push URL when origin fetches elsewhere", (t) => {
  const f = fixture(t);
  const pushRemote = path.join(f.base, "publish.git");
  f.git(["clone", "--bare", f.origin, pushRemote]);
  f.git(["tag", "v1.4.1"], { cwd: pushRemote });
  f.git(["remote", "set-url", "--push", "origin", pushRemote]);
  const before = f.state();
  assert.match(f.cli(["release"], { success: false }).output, /already exists on origin/);
  assert.deepEqual(f.state(), before);
  assert.equal(f.git(["tag", "--list"], { cwd: pushRemote }), "v1.4.1");
});

test("multiple origin push URLs are rejected before any release writes", (t) => {
  const f = fixture(t);
  f.git(["remote", "set-url", "--add", "--push", "origin", f.origin]);
  f.git(["remote", "set-url", "--add", "--push", "origin", path.join(f.base, "other.git")]);
  const before = f.state();
  assert.match(f.cli(["release"], { success: false }).output, /exactly one origin push URL/);
  assert.deepEqual(f.state(), before);
});

test("atomic push rejection retains local state and publishes neither branch nor tag", (t) => {
  const f = fixture(t);
  const remoteBefore = f.git(["rev-parse", "refs/heads/main"], { cwd: f.origin });
  const hook = path.join(f.origin, "hooks/update");
  // Accept tag updates, reject the branch: atomic push must still publish neither.
  fs.writeFileSync(hook, '#!/bin/sh\n[ "$1" != "refs/heads/main" ]\n', { mode: 0o755 });
  const result = f.cli(["release"], { success: false });
  assert.match(result.output, /Local release commit\/tag are retained/);
  assert.match(result.output, /git -c push.followTags=false push --atomic origin HEAD:refs\/heads\/main refs\/tags\/v1.4.1/);
  f.assertVersion("1.4.1");
  const head = f.git(["rev-parse", "HEAD"]);
  assert.equal(f.git(["rev-parse", "v1.4.1^{commit}"]), head);
  assert.equal(f.git(["rev-parse", "refs/heads/main"], { cwd: f.origin }), remoteBefore);
  assert.equal(f.git(["tag", "--list"], { cwd: f.origin }), "");
  fs.unlinkSync(hook);
  f.git(["-c", "push.followTags=false", "push", "--atomic", "origin", "HEAD:refs/heads/main", "refs/tags/v1.4.1"]);
  assert.equal(f.git(["rev-parse", "refs/heads/main"], { cwd: f.origin }), head);
  assert.equal(f.git(["rev-parse", "v1.4.1^{commit}"], { cwd: f.origin }), head);
});

test("make info leaves metadata unchanged", (t) => {
  const f = fixture(t);
  const before = f.state();
  f.run(["make", "info"]);
  assert.deepEqual(f.state(), before);
});

test("invalid command and extra arguments are rejected without changes", (t) => {
  const f = fixture(t);
  const before = f.state();
  for (const args of [["patch"], ["sync", "1.4.0"], ["release", "v1.4.0"], ["check", "v1.4.1", "extra"]]) {
    assert.match(f.cli(args, { success: false }).output, /Usage:/);
    assert.deepEqual(f.state(), before);
  }
});
