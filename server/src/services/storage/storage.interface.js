/**
 * Cloud-ready storage contract.
 * Implementations: LocalStorageAdapter (Phase 1), S3StorageAdapter (Phase 4).
 */
export class StorageAdapter {
  async save(key, buffer, options = {}) {
    throw new Error('save() not implemented');
  }

  async get(key) {
    throw new Error('get() not implemented');
  }

  async delete(key) {
    throw new Error('delete() not implemented');
  }

  async exists(key) {
    throw new Error('exists() not implemented');
  }

  getPublicUrl(key) {
    throw new Error('getPublicUrl() not implemented');
  }
}
