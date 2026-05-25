#!/usr/bin/env node
import { copyFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outputDir = path.join(root, 'tests', 'output');

function copyIfExists(sourceName, destName) {
  const source = path.join(outputDir, sourceName);
  const dest = path.join(root, destName);
  if (!existsSync(source)) {
    return false;
  }
  copyFileSync(source, dest);
  console.log(`Copied ${source} -> ${dest}`);
  return true;
}

copyIfExists('before.png', 'before.png');

if (!copyIfExists('after.png', 'after.png')) {
  copyIfExists('03-sticky-summary.png', 'after.png');
}

const guide = path.join(outputDir, 'SCREENSHOT-GUIDE.md');
if (existsSync(guide)) {
  console.log(`Guide: ${guide}`);
}
