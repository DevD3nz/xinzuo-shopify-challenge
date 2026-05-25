import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const OUTPUT_DIR = path.join(process.cwd(), 'tests', 'output');
const GUIDE_PATH = path.join(OUTPUT_DIR, 'SCREENSHOT-GUIDE.md');

/** @type {Array<{ step: number, file: string, title: string, narration: string }>} */
const guideSteps = [];

export function resetGuide() {
  guideSteps.length = 0;
}

export async function showGuideBanner(page, { step, title, body }) {
  await page.evaluate(
    ({ step, title, body }) => {
      const existing = document.getElementById('pw-guide-banner');
      if (existing) {
        existing.remove();
      }

      const banner = document.createElement('div');
      banner.id = 'pw-guide-banner';
      banner.setAttribute('data-testid', 'pw-guide-banner');
      banner.innerHTML = `
        <div class="pw-guide-banner__step">Step ${step}</div>
        <div class="pw-guide-banner__title">${title}</div>
        <div class="pw-guide-banner__body">${body}</div>
      `;
      banner.style.cssText = [
        'position: fixed',
        'top: 16px',
        'left: 16px',
        'right: 16px',
        'z-index: 2147483647',
        'padding: 16px 20px',
        'border-radius: 12px',
        'background: rgba(17, 17, 17, 0.94)',
        'color: #fff',
        'font-family: "Segoe UI", system-ui, sans-serif',
        'box-shadow: 0 12px 40px rgba(0,0,0,0.35)',
        'border: 1px solid rgba(197, 165, 114, 0.55)',
        'pointer-events: none',
      ].join(';');

      const style = document.createElement('style');
      style.textContent = `
        #pw-guide-banner .pw-guide-banner__step {
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #c5a572;
          margin-bottom: 6px;
        }
        #pw-guide-banner .pw-guide-banner__title {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 6px;
        }
        #pw-guide-banner .pw-guide-banner__body {
          font-size: 15px;
          line-height: 1.45;
          color: #e8e8ea;
        }
      `;
      document.head.appendChild(style);
      document.body.appendChild(banner);
    },
    { step, title, body }
  );
}

export async function hideGuideBanner(page) {
  await page.evaluate(() => {
    document.getElementById('pw-guide-banner')?.remove();
  });
}

export async function captureGuideStep(page, { step, slug, title, narration, fullPage = false }) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const filename = `${String(step).padStart(2, '0')}-${slug}.png`;
  const filePath = path.join(OUTPUT_DIR, filename);

  await page.screenshot({ path: filePath, fullPage });
  guideSteps.push({ step, file: filename, title, narration });

  return filePath;
}

export function writeGuide({ intro }) {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const lines = [
    '# Bundle Builder — screenshot walkthrough guide',
    '',
    intro,
    '',
    'Use these images as your Loom storyboard (face + screen) or attach them to the submission repo.',
    '',
    '## Steps',
    '',
  ];

  for (const entry of guideSteps) {
    lines.push(`### Step ${entry.step}: ${entry.title}`);
    lines.push('');
    lines.push(`![${entry.title}](./${entry.file})`);
    lines.push('');
    lines.push(`**Say this:** ${entry.narration}`);
    lines.push('');
  }

  lines.push('## Quick commands');
  lines.push('');
  lines.push('```bash');
  lines.push('npm run test:walkthrough   # annotated step screenshots only');
  lines.push('npm run test:screenshots   # before + after + walkthrough → copies root PNGs');
  lines.push('```');
  lines.push('');

  writeFileSync(GUIDE_PATH, lines.join('\n'), 'utf-8');
  return GUIDE_PATH;
}

export function getOutputPath(filename) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  return path.join(OUTPUT_DIR, filename);
}
