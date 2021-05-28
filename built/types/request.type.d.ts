import { InsomniaBaseModel } from './basemodel.type';
export declare type InsomniaRequestAuthentication = Object;
export declare type InsomniaRequestHeader = {
    name: string;
    value: string;
    description?: string;
    disabled?: boolean;
};
export declare type InsomniaRequestParameter = {
    name: string;
    value: string;
    disabled?: boolean;
    id?: string;
    fileName?: string;
};
export declare type InsomniaRequestBodyParameter = {
    name: string;
    value: string;
    description?: string;
    disabled?: boolean;
    multiline?: string;
    id?: string;
    fileName?: string;
    type?: string;
};
export declare type InsomniaRequestBody = {
    mimeType?: string | null;
    text?: string;
    fileName?: string;
    params?: Array<InsomniaRequestBodyParameter>;
};
declare type BaseRequest = {
    url: string;
    name: string;
    description: string;
    method: string;
    body: InsomniaRequestBody;
    parameters: Array<InsomniaRequestParameter>;
    headers: Array<InsomniaRequestHeader>;
    authentication: InsomniaRequestAuthentication;
    metaSortKey: number;
    isPrivate: boolean;
    settingStoreCookies: boolean;
    settingSendCookies: boolean;
    settingDisableRenderRequestBody: boolean;
    settingEncodeUrl: boolean;
    settingRebuildPath: boolean;
    settingFollowRedirects: string;
};
export declare type InsomniaRequest = InsomniaBaseModel & BaseRequest;
export {};
