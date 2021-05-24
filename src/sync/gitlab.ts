import axios from 'axios';
import { InsomniaContext } from "../types/insomnia.types";
import { GitlabServiceConfig } from "../types/plugin.type";

export class GitlabService {
  private config: GitlabServiceConfig;

  constructor(readonly context: InsomniaContext, config: GitlabServiceConfig) {
    this.context = context
    this.config = config;

    this.validateConfig(config)

    console.log("Loaded config", this.config)
  }

  authenticate() {
    return axios.create({
      baseURL: `${this.config.api_url}`,
      timeout: this.config.timeout,
      headers: { Authorization: `Bearer ${this.config.token}` },
    });
  }

  async get() {
    try {
      const promises = this.config.files.map(file => {
        return this.authenticate().get(
          `${this.config.api_url}/api/v4/projects/${this.config.id_project}/repository/files/${file}/raw?ref=${this.config.ref}`
        )
      });

      const responses = await Promise.all(promises);

      return responses.map(response => response.data);
    } catch (e) {
      throw `Collection query failed for informed project ${this.config.id_project}`
    }
  }

  async update(content: string) {
   try {
    await this.authenticate().post(
      `${this.config.api_url}/api/v4/projects/${this.config.id_project}/repository/commits`,
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

  validateConfig(config: GitlabServiceConfig) {
    if (config.token === "") { throw "Invalid token"; }
  }
}
