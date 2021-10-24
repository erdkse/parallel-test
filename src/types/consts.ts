import {AppConfig} from './types';

export const ROOT_FILE_ENTRY = '<root>';

export const appConfig: AppConfig = {
    isStartupModalVisible: false,
    kubeconfigPath: '/Users/erdkse/.kube/config',
    settings: null,
    scanExcludes: [
        'node_modules',
        '**/.git',
        '**/pkg/mod/**',
        '**/.kube',
        '**/*.swp',
    ],
    fileIncludes: ['*.yaml', '*.yml'],
    folderReadsMaxDepth: 10,
    recentFolders: [
        '/Users/erdkse/Projects/Kubeshop/argo-rollouts/manifests',
        '/Users/erdkse/Projects/Kubeshop/argo-rollouts',
        '/Users/erdkse/Projects/Kubeshop/monokle/src/redux/services/__test__',
        '/Users/erdkse/Projects/erdkse/k8s/dev',
        '/Users/erdkse/Projects/erdkse/k8s',
        '/Users/erdkse/Projects/microk8s',
        '/Users/erdkse/Projects/__test__',
        '/Users/erdkse/Projects/__test__/manifests',
        '/Users/erdkse/.kube',
        '/Users/erdkse/Projects/__test__/manifests/argo-rollouts',
    ],
    newVersion: {
        code: -2,
        data: {
            initial: true,
            errorCode: -2,
        },
    },
    navigators: [
        {
            name: 'K8s Resources',
            sections: [
                {
                    name: 'Workloads',
                    subsections: [
                        {
                            name: 'CronJobs',
                            kindSelector: 'CronJob',
                            apiVersionSelector: '**',
                        },
                        {
                            name: 'DaemonSets',
                            kindSelector: 'DaemonSet',
                            apiVersionSelector: '**',
                        },
                        {
                            name: 'Deployments',
                            kindSelector: 'Deployment',
                            apiVersionSelector: '**',
                        },
                        {
                            name: 'Jobs',
                            kindSelector: 'Job',
                            apiVersionSelector: '**',
                        },
                        {
                            name: 'Pods',
                            kindSelector: 'Pod',
                            apiVersionSelector: '**',
                        },
                        {
                            name: 'ReplicaSets',
                            kindSelector: 'ReplicaSet',
                            apiVersionSelector: '**',
                        },
                        {
                            name: 'ReplicationControllers',
                            kindSelector: 'ReplicationController',
                            apiVersionSelector: '**',
                        },
                        {
                            name: 'StatefulSets',
                            kindSelector: 'StatefulSet',
                            apiVersionSelector: '**',
                        },
                    ],
                },
                {
                    name: 'Configuration',
                    subsections: [
                        {
                            name: 'ConfigMaps',
                            kindSelector: 'ConfigMap',
                            apiVersionSelector: '**',
                        },
                        {
                            name: 'Namespaces',
                            kindSelector: 'Namespace',
                            apiVersionSelector: '**',
                        },
                        {
                            name: 'Secrets',
                            kindSelector: 'Secret',
                            apiVersionSelector: '**',
                        },
                    ],
                },
                {
                    name: 'Network',
                    subsections: [
                        {
                            name: 'Endpoints',
                            kindSelector: 'Endpoints',
                            apiVersionSelector: '**',
                        },
                        {
                            name: 'Ingresses',
                            kindSelector: 'Ingress',
                            apiVersionSelector: '**',
                        },
                        {
                            name: 'NetworkPolicies',
                            kindSelector: 'NetworkPolicy',
                            apiVersionSelector: '**',
                        },
                        {
                            name: 'Services',
                            kindSelector: 'Service',
                            apiVersionSelector: '**',
                        },
                    ],
                },
                {
                    name: 'Storage',
                    subsections: [
                        {
                            name: 'PersistentVolumeClaims',
                            kindSelector: 'PersistentVolumeClaim',
                            apiVersionSelector: '**',
                        },
                        {
                            name: 'PersistentVolumes',
                            kindSelector: 'PersistentVolume',
                            apiVersionSelector: '**',
                        },
                    ],
                },
                {
                    name: 'Access Control',
                    subsections: [
                        {
                            name: 'ClusterRoles',
                            kindSelector: 'ClusterRole',
                            apiVersionSelector: '**',
                        },
                        {
                            name: 'ClusterRoleBindings',
                            kindSelector: 'ClusterRoleBinding',
                            apiVersionSelector: '**',
                        },
                        {
                            name: 'Roles',
                            kindSelector: 'Role',
                            apiVersionSelector: '**',
                        },
                        {
                            name: 'RoleBindings',
                            kindSelector: 'RoleBinding',
                            apiVersionSelector: '**',
                        },
                        {
                            name: 'Service Accounts',
                            kindSelector: 'ServiceAccount',
                            apiVersionSelector: '**',
                        },
                    ],
                },
                {
                    name: 'Custom',
                    subsections: [
                        {
                            name: 'Custom Resources',
                            kindSelector: 'CustomResourceDefinition',
                            apiVersionSelector: '**',
                        },
                    ],
                },
            ],
        },
    ],
    kubeConfig: {
        contexts: [],
        currentContext: 'docker-desktop',
    },
};
