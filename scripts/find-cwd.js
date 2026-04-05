import { readdirSync, statSync } from 'fs';
import { resolve } from 'path';

console.log('CWD:', process.cwd());
console.log('__dirname:', import.meta.dirname ?? 'N/A');

function listDir(dir, depth = 0) {
  if (depth > 3) return;
  try {
    const entries = readdirSync(dir);
    for (const e of entries) {
      const full = resolve(dir, e);
      let isDir = false;
      try { isDir = statSync(full).isDirectory(); } catch {}
      console.log('  '.repeat(depth) + (isDir ? '[D] ' : '[F] ') + e);
      if (isDir && depth < 2) listDir(full, depth + 1);
    }
  } catch (err) {
    console.log('  '.repeat(depth) + 'ERROR:', err.message);
  }
}

listDir(process.cwd());
