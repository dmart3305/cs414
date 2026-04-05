import { readFileSync, existsSync } from 'fs';

const files = [
  '/vercel/share/roomread/app/protected/page.tsx',
  '/vercel/share/roomread/components/country-card.tsx',
  '/vercel/share/roomread/components/dashboard-header.tsx',
  '/vercel/share/roomread/components/background-pattern.tsx',
  '/vercel/share/roomread/app/globals.css',
  '/vercel/share/roomread/app/layout.tsx',
  '/vercel/share/roomread/package.json',
];

for (const f of files) {
  if (existsSync(f)) {
    console.log(`\n=== ${f} ===`);
    console.log(readFileSync(f, 'utf8'));
  } else {
    console.log(`\n=== ${f} === NOT FOUND`);
  }
}
