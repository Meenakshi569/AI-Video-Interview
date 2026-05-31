import { env } from '../../config/env.js';
import { LocalStorageAdapter } from './local.adapter.js';
import { S3StorageAdapter } from './s3.adapter.js';

let instance = null;

export function getStorage() {
  if (instance) return instance;

  switch (env.storageDriver) {
    case 's3':
    case 'minio':
      instance = new S3StorageAdapter();
      break;
    case 'local':
    default:
      instance = new LocalStorageAdapter();
      break;
  }

  return instance;
}
