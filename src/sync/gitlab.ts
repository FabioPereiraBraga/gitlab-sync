import axios from 'axios';
import { InsomniaContext } from "../types/insomnia.types";
import { GitlabServiceConfig } from "../types/plugin.type";

export class GitlabService {
  private readonly config: GitlabServiceConfig
  private readonly baseGitlabUrl: string;

  public constructor(readonly context: InsomniaContext, config: GitlabServiceConfig) {
    this.context = context
    this.config = config
    
    this.baseGitlabUrl = `${this.config.api_url}/api/v4/projects/${this.config.id_project}`

    GitlabService.validateConfig(config)
  }

  private authenticate() {
    return axios.create({
      baseURL: `${this.config.api_url}`,
      timeout: this.config.timeout,
      headers: { Authorization: `Bearer ${this.config.token}` },
    })
  }

  public async get(): Promise<any[]> {
    try {
      const listOfFiles = this.config.files.length === 0 ? await this.getJsonFiles() : this.config.files;

      const promises = listOfFiles
          .map(file => this.authenticate()
              .get(`${this.baseGitlabUrl}/repository/files/${file}/raw?ref=${this.config.branch}`))

      const responses = await Promise.all(promises)

      return responses.map(response => response.data)
    } catch (e) {
      throw `Collection query failed for informed project ${this.config.id_project}`
    }
  }

  private async ls() {
    return this.authenticate().get(`${this.baseGitlabUrl}/repository/tree?ref=${this.config.branch}`)
  }

  private async getJsonFiles() {
    const ret = await this.ls()

    const allFiles: Array<{id: string, mode: string, name: string, path: string, type: string}> = ret.data

    const re = /.*\.json$/

    return allFiles
        .map(x => x.name)
        .filter(name => name.match(re))
  }

  private async getUserName(): Promise<string> {
    const ret = await this.authenticate().get(`${this.config.api_url}/api/v4/user`)

    return ret.data.username
  }

  private async createBranch(): Promise<string> {
    const branchName = await this.getUserName()

    await this.authenticate().post(
        `${this.baseGitlabUrl}/repository/branches`,
        { "branch": branchName, "ref": this.config.branch }
    )

    return branchName
  }

  private async commit(content: string, branchName: string): Promise<void> {
    await this.authenticate().post(
        `${this.baseGitlabUrl}/repository/commits`,
        {
          "branch": branchName,
          "commit_message": "More requests!",
          "actions": [{
            "action": "update",
            "file_path": "workspace.json",
            "content": content
          }]
        }
    )
  }

  private async createMergeRequest(branchName: string): Promise<string> {
    const ret = await this.authenticate().post(
        `${this.baseGitlabUrl}/merge_requests`,
        {
          "source_branch": branchName,
          "target_branch": this.config.branch,
          "title": `New requests from ${branchName}`,
          "remove_source_branch": true
        })

    return ret.data.web_url
  }

  public async update(content: string): Promise<string> {
    // TODO: check if branch already exists

    const branchName = await this.createBranch()

    await this.commit(content, branchName)

    return await this.createMergeRequest(branchName)
  }

  public async getLastCommit(): Promise<string> {
    const ret = await this.authenticate()
        .get(`${this.baseGitlabUrl}/repository/commits?ref_name=${this.config.branch}`)

    return ret.data[0].id
  }

  private static validateConfig(config: GitlabServiceConfig) {
    if (config.api_url.length === 0) { throw 'Invalid api_url' }
    if (config.id_project === 0) { throw 'Invalid id_project' }
    if (config.branch.length === 0) { throw 'Invalid branch' }
    if (config.token.length === 0) { throw 'Invalid token' }
  }
}
