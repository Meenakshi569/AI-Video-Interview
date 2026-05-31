import fs from 'fs/promises';
import path from 'path';
import { StorageAdapter } from './storage.interface.js';
import { env } from '../../config/env.js';
import { logger } from '../../utils/logger.js';

export class LocalStorageAdapter extends StorageAdapter {
  constructor(basePath = env.storageLocalPath) {
    super();
    this.basePath = path.resolve(basePath);
  }

  async ensureDir() {
    await fs.mkdir(this.basePath, { recursive: true });
  }

  resolvePath(key) {
    const safeKey = key.replace(/\.\./g, '').replace(/^\/+/, '');
    return path.join(this.basePath, safeKey);
  }

  async save(key, buffer) {
    await this.ensureDir();
    const filePath = this.resolvePath(key);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, buffer);
    logger.info(`Storage [local] saved: ${key}`);
    return { key, driver: 'local' };
  }

  async get(key) {
    const filePath = this.resolvePath(key);
    return fs.readFile(filePath);
  }

  async delete(key) {
    const filePath = this.resolvePath(key);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
  }

  async exists(key) {
    try {
      await fs.access(this.resolvePath(key));
      return true;
    } catch {
      return false;
    }
  }

  getPublicUrl(key) {
    return `/api/media/${encodeURIComponent(key)}`;
  }
}
