import { StorageAdapter } from './storage.interface.js';
import { logger } from '../../utils/logger.js';

/**
 * Placeholder for Phase 4 — swap driver via STORAGE_DRIVER=s3
 */
export class S3StorageAdapter extends StorageAdapter {
  constructor() {
    super();
    logger.warn('S3StorageAdapter is not implemented yet. Use STORAGE_DRIVER=local.');
  }

  async save() {
    throw new Error('S3 storage not implemented. Set STORAGE_DRIVER=local.');
  }

  async get() {
    throw new Error('S3 storage not implemented.');
  }

  async delete() {
    throw new Error('S3 storage not implemented.');
  }

  async exists() {
    return false;
  }

  getPublicUrl(key) {
    return key;
  }
}
