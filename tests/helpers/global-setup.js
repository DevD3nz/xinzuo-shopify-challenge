import { getStoreBaseUrl, loadEnv } from './env.js';

export default async function globalSetup() {
  const env = loadEnv();
  process.env.STORE_BASE_URL = getStoreBaseUrl(env);
}
