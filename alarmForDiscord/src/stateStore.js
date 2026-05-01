import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

export function loadSeenArticleIds(path) {
  try {
    const parsed = JSON.parse(readFileSync(path, 'utf8'));
    if (!Array.isArray(parsed.seenArticleIds)) {
      return new Set();
    }

    return new Set(parsed.seenArticleIds.map(String));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return new Set();
    }

    throw error;
  }
}

export function saveSeenArticleIds(path, seenArticleIds) {
  mkdirSync(dirname(path), { recursive: true });
  const payload = {
    seenArticleIds: [...seenArticleIds],
    updatedAt: new Date().toISOString()
  };

  writeFileSync(path, `${JSON.stringify(payload, null, 2)}\n`);
}
