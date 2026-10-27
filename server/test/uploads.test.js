import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  ensureUploadsDirectory,
  getUploadsDirectory,
} from "../src/config/uploads.js";

test("uploads use the configured persistent directory", () => {
  const previousDirectory = process.env.UPLOADS_DIR;
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "eduzone-uploads-"));
  const configuredDirectory = path.join(directory, "persistent-uploads");

  try {
    process.env.UPLOADS_DIR = configuredDirectory;
    assert.equal(getUploadsDirectory(), configuredDirectory);

    ensureUploadsDirectory();
    assert.equal(fs.statSync(configuredDirectory).isDirectory(), true);
  } finally {
    if (previousDirectory === undefined) {
      delete process.env.UPLOADS_DIR;
    } else {
      process.env.UPLOADS_DIR = previousDirectory;
    }
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
