import { InsomniaContext } from "../types/insomnia.types";
import { GitlabServiceConfig } from "../types/plugin.type";
export declare class GitlabService {
    readonly context: InsomniaContext;
    private readonly config;
    private readonly baseGitlabUrl;
    constructor(context: InsomniaContext, config: GitlabServiceConfig);
    private authenticate;
    get(): Promise<any[]>;
    private ls;
    private getJsonFiles;
    private getUserName;
    private createBranch;
    private commit;
    private createMergeRequest;
    update(content: string): Promise<string>;
    getLastCommit(): Promise<string>;
    private static validateConfig;
}
