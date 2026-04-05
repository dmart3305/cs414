import { readdirSync, statSync, existsSync } from 'fs'
import { join } from 'path'

function listDir(dir, depth = 0) {
  if (depth > 3) return
  try {
    const entries = readdirSync(dir)
    for (const entry of entries) {
      if (entry === 'node_modules' || entry === '.git') continue
      const full = join(dir, entry)
      const stat = statSync(full)
      console.log('  '.repeat(depth) + entry + (stat.isDirectory() ? '/' : ''))
      if (stat.isDirectory() && depth < 3) {
        listDir(full, depth + 1)
      }
    }
  } catch (e) {
    console.log('  '.repeat(depth) + '[error reading ' + dir + ': ' + e.message + ']')
  }
}

console.log('=== Scanning /vercel ===')
listDir('/vercel', 0)
