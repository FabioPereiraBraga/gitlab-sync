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
              .get(`${this.baseGitlabUrl}/repository/files/${file}/raw?ref=${this.config.ref}`))

      const responses = await Promise.all(promises)

      return responses.map(response => response.data)
    } catch (e) {
      throw `Collection query failed for informed project ${this.config.id_project}`
    }
  }

  private async ls() {
    return this.authenticate().get(`${this.baseGitlabUrl}/repository/tree?ref=${this.config.ref}`)
  }

  private async getJsonFiles() {
    const ret = await this.ls()

    const allFiles: Array<{id: string, mode: string, name: string, path: string, type: string}> = ret.data

    const re = /.*\.json$/

    return allFiles
        .map(x => x.name)
        .filter(name => name.match(re))
  }

  public async update(content: string) {
   try {
    await this.authenticate().post(
      `${this.baseGitlabUrl}/repository/commits`,
      {
        "branch": "master",
        "commit_message": "Update collection insomnia",
        "actions": [
          {
            "action": "update",
            "file_path": "comdominio-doc.json",
            "content": content
          }
        ]
      },
    );
   } catch(e) {
     throw `Collection commit failed for the project ${this.config.id_project}`
   }
  }

  public async getLastCommit(): Promise<string> {
    const ret = await this.authenticate()
        .get(`${this.baseGitlabUrl}/repository/commits?ref_name=${this.config.ref}`)

    return ret.data[0].id
  }

  private static validateConfig(config: GitlabServiceConfig) {
    if (config.token.length === 0) { throw 'Invalid token' }
  }
}
