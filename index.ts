// import Main from './src/main';
// import {FileReaderSync} from './src/fileReaderSync';
// import {FileReaderAsync} from './src/fileReaderAsync';
// import {appConfig} from './src/types/consts';

// const RESOURCE_MAP = {};

// const fileReaderSync = new FileReaderSync();
// const fileReaderAsync = new FileReaderAsync();

// const ROOT_FOLDER = '/Users/erdkse/Projects/Kubeshop/argo-rollouts/manifests';

// // const rootEntry = fileReaderSync.createFileEntry(ROOT_FOLDER);

// const start: Date = new Date();

// if (process.env.SYNC === 'true') {
//     fileReaderSync.readFiles(
//         ROOT_FOLDER,
//         appConfig,
//         RESOURCE_MAP,
//         {},
//         {},
//         {},
//     );
//     console.log(
//         `Completed after ${new Date().getTime() - start.getTime()} seconds`,
//     );
// } else {
//     fileReaderAsync
//         .readFiles(ROOT_FOLDER, appConfig, RESOURCE_MAP, {}, {}, {})
//         .then(() => {
//             console.log(
//                 `Completed after ${
//                     new Date().getTime() - start.getTime()
//                 } seconds`,
//             );
//         })
//         .catch((e) => {
//             console.log('ERROR', e);
//         });
// }

// export {Main};

import {map} from 'async';

const sleep = (time) =>
    new Promise((resolve) => setTimeout(resolve, time * 1000));

(async () => {
    try {
        console.log('Tasks are starting!!');
        const results = await map([1, 2, 3, 4, 5], async (i) => {
            console.info(`Task ${i} started!`);
            const second = Math.floor(Math.random() * 5 + 1);
            await sleep(second);
            console.info(`Task ${i} completed!`);
            return i;
        });
        console.info('results', results);
        console.info('DONE!');
    } catch (e) {
        console.log('ERR', e);
    }
})();
