import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

export function loadEnv(cwd = process.cwd()) {
  const envPath = path.join(cwd, '.env');
  if (!existsSync(envPath)) {
    return {};
  }

  return Object.fromEntries(
    readFileSync(envPath, 'utf-8')
      .split(/\r?\n/)
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const index = line.indexOf('=');
        const key = line.slice(0, index).trim();
        const value = line.slice(index + 1).trim().replace(/^["']|["']$/g, '');
        return [key, value];
      })
  );
}

export function getStoreBaseUrl(env = loadEnv()) {
  const raw = env.STORE_BASE_URL || env.SHOPIFY_STORE_URL || '';
  const hostname = raw.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();
  if (!hostname) {
    throw new Error('Missing SHOPIFY_STORE_URL in .env');
  }
  return `https://${hostname}`;
}

export function getStorePassword(env = loadEnv()) {
  return env.STORE_PASSWORD || env.SHOPIFY_STORE_PASSWORD || '';
}
