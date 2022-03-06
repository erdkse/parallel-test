import { StaticPool } from 'node-worker-threads-pool';

const filePath = './build/src/worker/thread-entry.js';

const pool = new StaticPool({
  size: 4,
  task: filePath,
  workerData: 'workerData!'
});

for (let i = 0; i < 20; i++) {
  (async () => {
    const num = 40 + Math.trunc(10 * Math.random());

    // This will choose one idle worker in the pool
    // to execute your heavy task without blocking
    // the main thread!
    const res = await pool.exec(num);

    console.log(`Fibonacci(${num}) result:`, res);
  })();
}