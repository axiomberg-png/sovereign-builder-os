import { Worker } from 'worker_threads';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workerPath = path.resolve(__dirname, '../workers/scrubberWorker.js');

export function scrubPII(payload) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(workerPath);
    worker.postMessage(payload);
    worker.on('message', (sanitizedPayload) => {
      worker.terminate();
      resolve(sanitizedPayload);
    });
    worker.on('error', (err) => {
      worker.terminate();
      reject(err);
    });
  });
}
