import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { chmod, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const mediaRestore = join(root, "scripts/production-media-restore-drill.sh");
const backupScript = join(root, "scripts/production-backup.sh");
const fakeGpgRestore = `#!/usr/bin/env bash\nset -euo pipefail\nfor last in "$@"; do :; done\ncat -- "$last"\n`;

async function makeExecutable(path: string, body: string) {
  await writeFile(path, body, { mode: 0o700 });
  await chmod(path, 0o700);
}

async function makeMediaArchive(work: string, options: { empty?: boolean; corruptManifest?: boolean; fileCount?: number; byteCount?: number } = {}) {
  const source = join(work, "source");
  await mkdir(source);
  if (!options.empty) await writeFile(join(source, "sample.bin"), "synthetic-media");
  const files = options.empty ? [] : ["./sample.bin"];
  let manifest = files.length ? execFileSync("sha256sum", files, { cwd: source, encoding: "utf8" }) : "";
  if (options.corruptManifest) manifest = manifest.replace(/^[a-f0-9]{64}/, "0".repeat(64));
  await writeFile(join(source, "MEDIA-MANIFEST.sha256"), manifest);
  const size = options.empty ? 0 : Buffer.byteLength("synthetic-media");
  const count = options.fileCount ?? files.length;
  const bytes = options.byteCount ?? size;
  await writeFile(join(source, "MEDIA-METADATA.txt"), `file_count=${count}\nbyte_count=${bytes}\n`);
  const archive = join(work, "media.tar.gz");
  execFileSync("tar", ["-czf", archive, "-C", source, "."]);
  return archive;
}

function runBash(script: string, env: NodeJS.ProcessEnv) {
  return spawnSync("bash", [script], { encoding: "utf8", env, timeout: 15_000 });
}

async function runMediaRestore(options: { empty?: boolean; corruptManifest?: boolean; fileCount?: number; byteCount?: number } = {}) {
  const work = await mkdtemp(join(tmpdir(), "rakmyat-media-drill-test-"));
  try {
    const bin = join(work, "bin");
    const target = join(work, "restore-target");
    await mkdir(bin);
    await mkdir(target);
    await makeExecutable(join(bin, "gpg"), fakeGpgRestore);
    const archive = await makeMediaArchive(work, options);
    const result = runBash(mediaRestore, {
      ...process.env,
      PATH: `${bin}:${process.env.PATH ?? ""}`,
      MEDIA_BACKUP_FILE: archive,
      MEDIA_DRILL_DIRECTORY: target,
    });
    return { result, target, cleanup: () => rm(work, { recursive: true, force: true }) };
  } catch (error) {
    await rm(work, { recursive: true, force: true });
    throw error;
  }
}

test("media restore drill accepts valid populated and empty archives", async (t) => {
  await t.test("populated archive", async () => {
    const { result, target, cleanup } = await runMediaRestore();
    try {
      assert.equal(result.status, 0, result.stderr);
      assert.equal(await readFile(join(target, "sample.bin"), "utf8"), "synthetic-media");
    } finally { await cleanup(); }
  });
  await t.test("empty archive", async () => {
    const { result, cleanup } = await runMediaRestore({ empty: true });
    try {
      assert.equal(result.status, 0, result.stderr);
      assert.match(result.stdout, /0 files, 0 bytes/);
    } finally { await cleanup(); }
  });
});

test("media restore drill rejects corrupt hashes and mismatched file/byte counts", async (t) => {
  await t.test("corrupt manifest", async () => {
    const { result, cleanup } = await runMediaRestore({ corruptManifest: true });
    try { assert.notEqual(result.status, 0); } finally { await cleanup(); }
  });
  await t.test("file count mismatch", async () => {
    const { result, cleanup } = await runMediaRestore({ fileCount: 2 });
    try {
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /Manifest file count mismatch/);
    } finally { await cleanup(); }
  });
  await t.test("byte count mismatch", async () => {
    const { result, cleanup } = await runMediaRestore({ byteCount: 1 });
    try {
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /Manifest byte count mismatch/);
    } finally { await cleanup(); }
  });
});

test("backup failure preserves the encrypted partial artifact as .FAILED", async () => {
  const work = await mkdtemp(join(tmpdir(), "rakmyat-backup-failure-test-"));
  try {
    const bin = join(work, "bin");
    const destination = join(work, "backups");
    const media = join(work, "uploads");
    await Promise.all([mkdir(bin), mkdir(destination), mkdir(media)]);
    await writeFile(join(media, "sample.bin"), "synthetic-media");
    await makeExecutable(join(bin, "date"), "#!/usr/bin/env bash\nprintf '20300101T000000Z\\n'\n");
    await makeExecutable(join(bin, "docker"), `#!/usr/bin/env bash
set -euo pipefail
case "$*" in
  *"pg_dump --format=custom"*) printf 'synthetic custom archive\\n' ;;
  *"pg_restore --list"*) cat >/dev/null; exit 17 ;;
  *) echo 'unexpected docker shim invocation' >&2; exit 91 ;;
esac
`);
    await makeExecutable(join(bin, "gpg"), `#!/usr/bin/env bash
set -euo pipefail
if [[ " $* " == *" --list-secret-keys "* ]]; then printf 'sec synthetic-test-key\\n'; exit 0; fi
if [[ " $* " == *" --encrypt "* ]]; then
  output=""
  while (($#)); do if [[ "$1" == --output ]]; then output="$2"; shift 2; else shift; fi; done
  cat >"$output"
  exit 0
fi
if [[ " $* " == *" --decrypt "* ]]; then for last in "$@"; do :; done; cat -- "$last"; exit 0; fi
exit 92
`);
    const result = runBash(backupScript, {
      ...process.env,
      PATH: `${bin}:${process.env.PATH ?? ""}`,
      BACKUP_GPG_RECIPIENT: "test@example.invalid",
      BACKUP_DESTINATION: destination,
      MEDIA_ROOT: media,
    });
    assert.notEqual(result.status, 0);
    const failedDb = join(destination, "rakmyat-20300101T000000Z.db.dump.gpg.FAILED");
    assert.equal((await readFile(failedDb, "utf8")).trim(), "synthetic custom archive");
    assert.deepEqual(await readdir(destination), ["rakmyat-20300101T000000Z.db.dump.gpg.FAILED"]);
  } finally {
    await rm(work, { recursive: true, force: true });
  }
});
