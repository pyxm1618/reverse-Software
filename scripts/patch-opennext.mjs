import fs from 'node:fs';
import path from 'node:path';

const targetFile = path.resolve(
  process.cwd(),
  'node_modules/@opennextjs/cloudflare/dist/cli/build/patches/plugins/load-manifest.js'
);

if (fs.existsSync(targetFile)) {
  let content = fs.readFileSync(targetFile, 'utf8');
  let changed = false;

  const oldGlob = '**/{*-manifest,required-server-files,prefetch-hints}.json';
  const newGlob = '**/{*-manifest,required-server-files,prefetch-hints,preview-props}.json';
  if (content.includes(oldGlob)) {
    content = content.replace(oldGlob, newGlob);
    changed = true;
  }

  const oldFallback = 'p.endsWith("prefetch-hints")';
  const newFallback = 'p.endsWith("prefetch-hints") || p.endsWith("preview-props")';
  if (content.includes(oldFallback) && !content.includes(newFallback)) {
    content = content.replace(oldFallback, newFallback);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log('[patch-opennext] Applied compatibility patch for Next.js 16 preview-props manifest.');
  }
}
