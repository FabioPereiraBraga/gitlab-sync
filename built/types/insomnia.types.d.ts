import { InsomniaWorkspace } from './workspace.type';
import { InsomniaRequestGroup } from './request-group.type';
import { InsomniaBaseModel } from './basemodel.type';
export interface InsomniaWorkspaceActionModel {
    workspace: InsomniaWorkspace;
    requestGroup: InsomniaRequestGroup;
    requests: Request[];
}
interface InsomniaContextStoreFunctions {
    hasItem(key: string): Promise<boolean>;
    setItem(key: string, value: string): Promise<void>;
    getItem(key: string): Promise<string | null>;
    removeItem(key: string): Promise<void>;
    clear(): Promise<void>;
    all(): Promise<Array<{
        key: string;
        value: string;
    }>>;
}
interface InsomniaPromptOptions {
    label?: string;
    defaultValue?: string;
    submitName?: string;
    cancelable?: boolean;
}
export interface InsomniaAppContext {
    alert(title: string, message?: string): Promise<void>;
    prompt(title: string, options?: InsomniaPromptOptions): Promise<string>;
    getPath(name: 'desktop'): string;
    showSaveDialog(options?: {
        defaultPath?: string;
    }): Promise<string | null>;
}
interface InsomniaContextDataImport {
    uri(uri: string, options?: {
        workspaceId?: string;
    }): Promise<void>;
    raw(text: string, options?: {
        workspaceId?: string;
    }): Promise<void>;
}
interface InsomniaContextDataExport {
    insomnia(options: {
        includePrivate?: boolean;
        format?: 'json' | 'yaml';
    }): Promise<string>;
    har(options: {
        includePrivate?: boolean;
    }): Promise<string>;
}
interface InsomniaContextData {
    import: InsomniaContextDataImport;
    export: InsomniaContextDataExport;
}
export interface InsomniaContext {
    store: InsomniaContextStoreFunctions;
    app: InsomniaAppContext;
    data: InsomniaContextData;
}
export interface InsomniaContextDataExportResult {
    resources: InsomniaBaseModel[];
    __export_date: Date;
    __export_format: number;
    __export_source: string;
    _type: string;
}
export {};
