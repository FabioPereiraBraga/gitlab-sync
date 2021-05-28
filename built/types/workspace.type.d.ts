import { InsomniaBaseModel } from './basemodel.type';
interface InsomniaBaseWorkspace {
    name: string;
    description: string;
}
export declare type InsomniaWorkspace = InsomniaBaseModel & InsomniaBaseWorkspace;
export {};
