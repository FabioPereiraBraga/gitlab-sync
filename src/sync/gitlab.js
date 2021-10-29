const axios = require('axios');


class gitlab {
  constructor(context, config, models) {
    this.context = context
    this.loadConfig(config)
    this.collectionName = models.workspace.name
    this.filePath = `${this.config.dir_name}/${this.collectionName}.json`
    this.baseGitlabUrl = `${this.config.api_url}/api/v4/projects/${this.config.id_project}`
    console.log("Loaded config", this.config)
  }

  authenticate() {
    return axios.create({
      baseURL: `${this.config.api_url}`,
      timeout: this.config.timeout,
      headers: {
        Authorization: `Bearer ${this.config.token}`
      },
    });
  }


  async get() {
    try {
      const response = await this.authenticate().get(
        `${this.baseGitlabUrl}/repository/tree?ref=${encodeURIComponent(this.config.ref)}&path=${this.config.dir_name}`
      );
      if ( response.data.length === 0 ){
        console.log("Nothing to update")
        return []
      }



      // const allFiles: {
      //   id: string,
      //   mode: string,
      //   name: string,
      //   path: string,
      //   type: string
      // } > = response.data
      // const allFiles = response.data.map(function(obj) {
      //   return {
      //     id: obj.id,
      //     mode: obj.mode,
      //     name: obj.name,
      //     path: obj.path,
      //     type: obj.type
      //   }
      // })
      const jsonRegex = /.*\.json$/
      const jsonFiles = response.data
        .map(x => x.name)
        .filter(name => name.match(jsonRegex))
      if (jsonFiles.length > 0) {
        const absoluteJsonFilesPaths = jsonFiles.map(x => `${this.config.dir_name}/${x}`)
        const promises = absoluteJsonFilesPaths
          .map(file => this.authenticate()
            .get(`${this.baseGitlabUrl}/repository/files/${encodeURIComponent(file)}/raw?ref=${encodeURIComponent(this.config.ref)}`))

        const responses = await Promise.all(promises)

        return responses.map(response => response.data)
      }
      console.log("Pull successful")
    } catch (e) {
      throw `Collection query failed for informed project ${this.config.id_project}`
    }
  }

  async getLastCommit(){
    const ret = await this.authenticate()
      .get(`${this.baseGitlabUrl}/repository/commits?ref_name=${this.config.branch}`)

    return ret.data[0].id
  }

  async getUserName(){
    const ret = await this.authenticate().get(`${this.config.api_url}/api/v4/user`)
    return ret.data.username
  }

  async checkIfBranchExists(branchName) {
    let response = null
    try {
      console.log("branchName", branchName)
      response = await this.authenticate().head(`${this.baseGitlabUrl}/repository/branches/${encodeURIComponent(branchName)}`)
      console.log("Branch exists")
      return true
    } catch (e) {
      if (e.response.status === 404) {
        console.log("Branch does not exist")
        return false
      }
      else{
        await this.context.app.alert('ERROR on branch verification',
          `Check if you have permission.\n ${e.message}`)

        throw e
      }
    }
  }
  async createBranch() {
    const branchName = `insomnia/${await this.getUserName()}`
    const branchExists = await this.checkIfBranchExists(branchName)
    if (!branchExists) {
      try {
        console.log("Creating a new branch")
        await this.authenticate().post(
          `${this.baseGitlabUrl}/repository/branches?branch=${encodeURIComponent(branchName)}&ref=${encodeURIComponent(this.config.ref)}`
        )
      } catch (e) {
        await this.context.app.alert('ERROR on branch creation',
          `Check if you have permission and the branch doesn't already exists.\n ${e.message}`)

        throw e
      }
    }
    return branchName
  }

  async createMergeRequest(branchName){
    let ret
    try {
      ret = await this.authenticate().post(
        `${this.baseGitlabUrl}/merge_requests`, {
          "source_branch": branchName,
          "target_branch": this.config.ref,
          "title": `New request from ${branchName}`,
          "remove_source_branch": true
        })
    } catch (e) {
      if (e.response.status === 409 ){
        return false
      }
      console.log("MR response", e.response)
      await this.context.app.alert('ERROR creating Merge Request', e.message)

      throw e
    }

    return ret.data.web_url
  }

  async checkIfFileExists(branchName){
    let response = null
    try{
      response = await this.authenticate().head(`${this.baseGitlabUrl}/repository/files/${encodeURIComponent(this.filePath)}?ref=${encodeURIComponent(branchName)}`)
      return true
    }
    catch (e){
      return false
    }
  }
  async commit(content, branchName) {
    const fileExists = await this.checkIfFileExists(branchName)
    let action = null
    if (fileExists){
      action = "update"
    }
    else{
      action = "create"
    }
    try {
      await this.authenticate().post(
        `${this.baseGitlabUrl}/repository/commits`, {
          "branch": branchName,
          "commit_message": "More requests!",
          "actions": [{
            "action": action,
            "file_path": this.filePath,
            "content": content
          }]
        }
      )
    } catch (e) {
      await this.context.app.alert('ERROR on commit to branch', e.message)

      throw e
    }
  }

  async update(content) {

    const branchName = await this.createBranch()

    await this.commit(content, branchName)

    return await this.createMergeRequest(branchName)
  }

  async getLastCommit() {
    const ret = await this.authenticate()
      .get(`${this.baseGitlabUrl}/repository/commits?ref_name=${this.config.ref}`)

    return ret.data[0].id
  }


  loadConfig(config) {

    this.config = config;

    if (typeof(config.token) !== "string" || config.token == "") {
      throw "Invalid token";
    }

    if (typeof(config.timeout) !== "number" || config.timeout == "") {
      this.config.timeout = 5000;
    }

  }
}

module.exports = gitlab
