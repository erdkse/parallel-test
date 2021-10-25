import {Document, LineCounter, ParsedNode, Scalar} from 'yaml';

export type HelmValuesMapType = {
    [id: string]: HelmValuesFile;
};

export type HelmChartMapType = {
    [id: string]: HelmChart;
};

export type FileMapType = {
    [id: string]: FileEntry;
};

export type ResourceMapType = {
    [id: string]: K8sResource;
};

export interface HelmValuesFile {
    id: string;
    filePath: string;
    name: string;
    isSelected: boolean;
    /** the id of the containing helm chart */
    helmChartId: string;
}

export interface HelmChart {
    id: string;
    filePath: string;
    name: string;
    valueFileIds: string[]; // ids of contained Helm value files
}

export interface FileEntry {
    /** the name of the file */
    name: string;
    /** the path of the file relative to the root folder - used as key in the fileMap */
    filePath: string;
    /** if the file/folder is excluded from the navigator */
    isExcluded: boolean;
    /** child file names (for folders) */
    children?: string[];
    /** the timestamp of the last write - for discarding change notifications */
    timestamp?: number;
}

export interface K8sResource {
    /** an internally generated UUID
     * - used for references/lookups in resourceMap */
    id: string;
    /** the path relative to the root folder to the file containing this resource
     * - set to preview://resourceId for internally generated resources
     * - set to unsaved://resourceId for newly created resoruces */
    filePath: string;
    /**
     * name - generated from manifest metadata
     */
    name: string;
    /** k8s resource kind */
    kind: string;
    /** k8s resource version */
    version: string;
    /** k8s namespace is specified (for filtering) */
    namespace?: string;
    /** if highlighted in UI (should probalby move to UI state object) */
    isHighlighted: boolean;
    /** if selected in UI (should probably move to UI state object) */
    isSelected: boolean;
    /** unparsed resource content (for editing) */
    text: string;
    /**  contains parsed yaml resource - used for filtering/finding links/refs, etc */
    content: any;
    /** array of refs (incoming, outgoing and unsatisfied) to and from other resources */
    refs?: ResourceRef[];
    /**  range of this resource in a multidocument file */
    range?: {
        start: number;
        length: number;
    };
    /** result of schema validation */
    validation?: ResourceValidation;

    /** temporary object used for parsing refs */
    parsedDoc?: Document.Parsed<ParsedNode>;
    /** temporary object used for ref positioning */
    lineCounter?: LineCounter;
    /** temporary object used for parsing refs */
    refNodesByPath?: Record<string, RefNode[]>;
}

interface ResourceRef {
    /** the type of ref (see enum) */
    type: ResourceRefType;
    /** the ref value - for example the name of a configmap */
    name: string;
    /** the target resource or file this is referring to (empty for unsatisfied refs) */
    target?: RefTarget;
    /** the position in the document of the refName (undefined for incoming file refs) */
    position?: RefPosition;
}

export enum ResourceRefType {
    Incoming = 'incoming',
    Outgoing = 'outgoing',
    Unsatisfied = 'unsatisfied-outgoing',
}

type RefTarget = RefTargetResource | RefTargetFile;

type RefTargetResource = {
    type: 'resource';
    resourceId?: string;
    resourceKind?: string;
};

type RefTargetFile = {
    type: 'file';
    filePath: string;
};

interface RefPosition {
    line: number;
    column: number;
    length: number;
}

type ResourceValidation = {
    isValid: boolean;
    errors: ResourceValidationError[];
};

type ResourceValidationError = {
    property: string;
    message: string;
};

export type RefNode = {scalar: Scalar; key: string; parentKeyPath: string};

export interface AppConfig {
    /** a list of patterns to exclude when scanning the file system for resources */
    scanExcludes: string[];
    /** a list of patterns to match to against files for including */
    fileIncludes: string[];
    /** maximum recursion depth when reading nested folders */
    folderReadsMaxDepth: number;
    /** the currrent navigator configuration */
    navigators: ObjectNavigator[];
    /** absolute kubeconfig path */
    kubeconfigPath: string;
    /** if the startup modal is visible */
    isStartupModalVisible: boolean;
    settings: {
        theme: Themes; // not used for now
        textSize: TextSizes; // not used for now
        language: Languages; // not used for now
        filterObjectsOnSelection: boolean;
        autoZoomGraphOnSelection: boolean;
        helmPreviewMode: 'template' | 'install';
        loadLastFolderOnStartup: boolean;
    } | null;
    recentFolders: string[];
    newVersion: {
        code: NewVersionCode;
        data: any;
    };
    kubeConfig: KubeConfig;
}

interface ObjectNavigator {
    name: string;
    sections: NavigatorSection[];
}

interface NavigatorSection {
    name: string;
    subsections: NavigatorSubSection[];
}

interface NavigatorSubSection {
    name: string;
    kindSelector: string;
    apiVersionSelector: string;
}

export enum Themes {
    Dark = 'dark',
    Light = 'light',
}

export enum TextSizes {
    Large = 'large',
    Medium = 'medium',
    Small = 'small',
}

export enum Languages {
    English = 'en',
}

export enum NewVersionCode {
    Errored = -2,
    NotAvailable = -1,
    Idle = 0,
    Checking = 1,
    Available = 2,
    Downloading = 3,
    Downloaded = 4,
}

export type KubeConfig = {
    contexts: Array<KubeConfigContext>;
    currentContext: string | undefined;
};

export type KubeConfigContext = {
    cluster: string;
    name: string;
    user: string | null;
    namespace: string | null;
};
