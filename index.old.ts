// import {Main} from './src/main';
import { StaticPool } from 'node-worker-threads-pool';
import {FileReaderSync} from './src/fileReaderSync';
import {FileReaderAsync} from './src/fileReaderAsync';
import { appConfig } from './src/types/consts';


const RESOURCE_MAP = {};

const fileReaderSync = new FileReaderSync();
const fileReaderAsync = new FileReaderAsync();

const ROOT_FOLDER = '/Users/erdkse/Projects/Kubeshop/argo-rollouts';

// const rootEntry = fileReaderSync.createFileEntry(ROOT_FOLDER);

const start: Date = new Date();

if (process.env.SYNC === 'true') {
    fileReaderSync.readFiles(ROOT_FOLDER, appConfig, RESOURCE_MAP, {}, {}, {});
    console.log(
        `Completed after ${new Date().getTime() - start.getTime()} seconds`,
    );
} else {
    fileReaderAsync
        .readFiles(ROOT_FOLDER, appConfig, RESOURCE_MAP, {}, {}, {})
        .then(() => {
            console.log(
                `Completed after ${
                    new Date().getTime() - start.getTime()
                } seconds`,
            );
        })
        .catch((e) => {
            console.log('ERROR', e);
        });
}

const pool = new StaticPool({
  size: 4,
  task() {},
  workerData: 'workerData!'
});