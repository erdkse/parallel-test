import path from 'path';
import micromatch from 'micromatch';
import fs from 'fs';
import {v4 as uuidv4} from 'uuid';
import {LineCounter, parseAllDocuments} from 'yaml';

import {
    AppConfig,
    FileEntry,
    FileMapType,
    HelmChart,
    HelmChartMapType,
    HelmValuesFile,
    HelmValuesMapType,
    K8sResource,
    ResourceMapType,
} from './types/types';
import {ROOT_FILE_ENTRY} from './types/consts';

export class FileReaderSync {
    public readFiles(
        folder: string,
        appConfig: AppConfig,
        resourceMap: ResourceMapType,
        fileMap: FileMapType,
        helmChartMap: HelmChartMapType,
        helmValuesMap: HelmValuesMapType,
        depth = 1,
    ) {
        const files = fs.readdirSync(folder);
        console.log('files', files);

        const result: string[] = [];

        // if there is no root entry assume this is the root folder (questionable..)
        if (!fileMap[ROOT_FILE_ENTRY]) {
            fileMap[ROOT_FILE_ENTRY] = this.createFileEntry(folder);
        }

        const rootFolder = fileMap[ROOT_FILE_ENTRY].filePath;

        // is this a helm chart folder?
        if (this.isHelmChartFolder(files)) {
            this.processHelmChartFolder(
                folder,
                rootFolder,
                files,
                appConfig,
                resourceMap,
                fileMap,
                helmChartMap,
                helmValuesMap,
                result,
                depth,
            );
        } else {
            files.forEach((file) => {
                const filePath = path.join(folder, file);
                console.log(`Task ${filePath} has started!`);
                const fileEntryPath = filePath.substr(rootFolder.length);
                const fileEntry = this.createFileEntry(fileEntryPath);
                if (this.fileIsExcluded(appConfig, fileEntry)) {
                    fileEntry.isExcluded = true;
                } else if (this.getFileStats(filePath)?.isDirectory()) {
                    if (depth === appConfig.folderReadsMaxDepth) {
                        console.warn(
                            `[readFiles]: Ignored ${filePath} because max depth was reached.`,
                        );
                    } else {
                        fileEntry.children = this.readFiles(
                            filePath,
                            appConfig,
                            resourceMap,
                            fileMap,
                            helmChartMap,
                            helmValuesMap,
                            depth + 1,
                        );
                    }
                } else if (
                    appConfig.fileIncludes.some((e) =>
                        micromatch.isMatch(fileEntry.name, e),
                    )
                ) {
                    try {
                        this.extractK8sResourcesFromFile(
                            filePath,
                            fileMap,
                        ).forEach((resource) => {
                            resourceMap[resource.id] = resource;
                        });
                    } catch (e) {
                        console.warn(
                            `Failed to parse yaml in file ${fileEntry.name}; ${e}`,
                        );
                    }
                }

                fileMap[fileEntry.filePath] = fileEntry;
                result.push(fileEntry.name);
                console.log(`Task ${filePath} has finished!`);
            });
        }
        return result;
    }

    public createFileEntry(fileEntryPath: string) {
        const fileEntry: FileEntry = {
            name: fileEntryPath.substr(fileEntryPath.lastIndexOf(path.sep) + 1),
            filePath: fileEntryPath,
            isExcluded: false,
        };
        return fileEntry;
    }

    public isHelmChartFolder(files: string[]) {
        return (
            files.indexOf('Chart.yaml') !== -1 &&
            files.indexOf('values.yaml') !== -1
        );
    }

    public processHelmChartFolder(
        folder: string,
        rootFolder: string,
        files: string[],
        appConfig: AppConfig,
        resourceMap: ResourceMapType,
        fileMap: FileMapType,
        helmChartMap: HelmChartMapType,
        helmValuesMap: HelmValuesMapType,
        result: string[],
        depth: number,
    ) {
        const helmChart: HelmChart = {
            id: uuidv4(),
            filePath: path.join(folder, 'Chart.yaml').substr(rootFolder.length),
            name: folder.substr(folder.lastIndexOf(path.sep) + 1),
            valueFileIds: [],
        };

        files.forEach((file) => {
            const filePath = path.join(folder, file);
            const fileEntryPath = filePath.substr(rootFolder.length);
            const fileEntry = this.createFileEntry(fileEntryPath);

            if (this.fileIsExcluded(appConfig, fileEntry)) {
                fileEntry.isExcluded = true;
            } else if (this.getFileStats(filePath)?.isDirectory()) {
                if (depth === appConfig.folderReadsMaxDepth) {
                    console.warn(
                        `[readFiles]: Ignored ${filePath} because max depth was reached.`,
                    );
                } else {
                    fileEntry.children = this.readFiles(
                        filePath,
                        appConfig,
                        resourceMap,
                        fileMap,
                        helmChartMap,
                        helmValuesMap,
                        depth + 1,
                    );
                }
            } else if (micromatch.isMatch(file, '*values*.yaml')) {
                const helmValues: HelmValuesFile = {
                    id: uuidv4(),
                    filePath: fileEntryPath,
                    name: file,
                    isSelected: false,
                    helmChartId: helmChart.id,
                };

                helmValuesMap[helmValues.id] = helmValues;
                helmChart.valueFileIds.push(helmValues.id);
            }

            fileMap[fileEntry.filePath] = fileEntry;
            result.push(fileEntry.name);
        });

        helmChartMap[helmChart.id] = helmChart;
    }

    public fileIsExcluded(appConfig: AppConfig, fileEntry: FileEntry) {
        return appConfig.scanExcludes.some((e) =>
            micromatch.isMatch(fileEntry.filePath, e),
        );
    }

    public getFileStats(filePath: string): fs.Stats | undefined {
        try {
            return fs.statSync(filePath);
        } catch (err) {
            if (err instanceof Error) {
                console.warn(`[getFileStats]: ${err.message}`);
            }
        }
        return undefined;
    }

    public extractK8sResourcesFromFile(
        filePath: string,
        fileMap: FileMapType,
    ): K8sResource[] {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const rootEntry = fileMap[ROOT_FILE_ENTRY];
        return this.extractK8sResources(
            fileContent,
            rootEntry ? filePath.substr(rootEntry.filePath.length) : filePath,
        );
    }

    public extractK8sResources(fileContent: string, relativePath: string) {
        const lineCounter: LineCounter = new LineCounter();
        const documents = parseAllDocuments(fileContent, {lineCounter});
        const result: K8sResource[] = [];

        if (documents) {
            let docIndex = 0;
            documents.forEach((doc) => {
                if (doc.errors.length > 0) {
                    console.warn(
                        `Ignoring document ${docIndex} in ${
                            path.parse(relativePath).name
                        } due to ${doc.errors.length} error(s)`,
                    );
                } else {
                    const content = doc.toJS();
                    if (content && content.apiVersion && content.kind) {
                        const text = fileContent.slice(
                            doc.range[0],
                            doc.range[1],
                        );

                        const resource: K8sResource = {
                            name: this.createResourceName(
                                relativePath,
                                content,
                            ),
                            filePath: relativePath,
                            id:
                                (content.metadata && content.metadata.uid) ||
                                uuidv4(),
                            isHighlighted: false,
                            isSelected: false,
                            kind: content.kind,
                            version: content.apiVersion,
                            content,
                            text,
                        };

                        // if this is a single-resource file we can save the parsedDoc and lineCounter
                        if (documents.length === 1) {
                            resource.parsedDoc = doc;
                            resource.lineCounter = lineCounter;
                        } else {
                            // for multi-resource files we just save the range - the parsedDoc and lineCounter will
                            // be created on demand (since they are incorrect in this context)
                            resource.range = {
                                start: doc.range[0],
                                length: doc.range[1] - doc.range[0],
                            };
                        }

                        // set the namespace if available
                        if (content.metadata?.namespace) {
                            resource.namespace = content.metadata.namespace;
                        }

                        result.push(resource);
                    }
                }
                docIndex += 1;
            });
        }
        return result;
    }

    public createResourceName(filePath: string, content: any) {
        // for Kustomizations we return the name of the containing folder ('base', 'staging', etc)
        if (content.kind === 'Kustomization') {
            const ix = filePath.lastIndexOf(path.sep);
            if (ix > 0) {
                return filePath.substr(1, ix - 1);
            }
            return filePath;
        }

        // use metadata name if available
        if (content.metadata?.name) {
            // name could be an object if it's a helm template value...
            if (typeof content.metadata.name !== 'string') {
                return JSON.stringify(content.metadata.name).trim();
            }

            return content.metadata.name;
        }

        // use filename as last resort
        const ix = filePath.lastIndexOf(path.sep);
        if (ix > 0) {
            return filePath.substr(ix + 1);
        }

        return filePath;
    }
}
