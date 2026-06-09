import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import {
  readSavedArticleIds,
  saveArticles,
} from "../src/stateStore.js";

const createTemporaryDataPath = async () => {
  const directory = await fs.mkdtemp(
    path.join(os.tmpdir(), "cafe-alarm-state-"),
  );

  return {
    directory,
    dataPath: path.join(directory, "articles.json"),
  };
};

test("readSavedArticleIds treats a missing file as the first run", async () => {
  const { directory, dataPath } = await createTemporaryDataPath();

  try {
    assert.deepEqual(await readSavedArticleIds(dataPath), {
      isFirstRun: true,
      articleIds: [],
    });
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});

test("saveArticles saves articles that can be read as article IDs", async () => {
  const { directory, dataPath } = await createTemporaryDataPath();
  const articles = [
    { articleId: 101, subject: "First article" },
    { articleId: 102, subject: "Second article" },
  ];

  try {
    await saveArticles(dataPath, articles);

    assert.deepEqual(await readSavedArticleIds(dataPath), {
      isFirstRun: false,
      articleIds: [101, 102],
    });
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});

test("readSavedArticleIds rejects invalid JSON", async () => {
  const { directory, dataPath } = await createTemporaryDataPath();

  try {
    await fs.writeFile(dataPath, "{ invalid json", "utf-8");

    await assert.rejects(readSavedArticleIds(dataPath), SyntaxError);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});

test("readSavedArticleIds rejects saved data that is not an array", async () => {
  const { directory, dataPath } = await createTemporaryDataPath();

  try {
    await fs.writeFile(dataPath, JSON.stringify({ articleId: 101 }), "utf-8");

    await assert.rejects(
      readSavedArticleIds(dataPath),
      /data|array|게시글|배열/i,
    );
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});
