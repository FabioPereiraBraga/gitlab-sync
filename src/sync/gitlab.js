const axios = require('axios');

class gitlab {
  constructor (context, config) {
    this.context = context
    this.loadConfig(config)
    console.log("Loaded config", this.config)
  }

  authenticate() {
    return axios.create({
      baseURL: `${this.config.api_url}`,
      timeout: this.config.timeout,
      headers: { Authorization: `Bearer ${this.config.token}` },
    });
  }

  async get(){
    try {
      const promises = [];
      this.config.files.forEach(file => {
        promises.push(this.authenticate().get(
          `${this.config.api_url}/api/v4/projects/${this.config.id_project}/repository/files/${file.name}/raw?ref=${this.config.ref}`
        ))
      });
      const responses = await Promise.all(promises);
      return responses.map(response => response.data);
    }catch (e) {
      throw `Collection query failed for informed project ${this.config.id_project}`
    }
  }



  async update(content) {

   try{
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
   }catch(e){
     throw `Collection commit failed for the project ${this.config.id_project}`
   }

   
  }

  
  loadConfig(config) {
    
    this.config = config;
    
    if( typeof(config.token) !== "string" || config.token == "" ){
      throw "Invalid token";
    }

    if(typeof(config.timeout) !== "number" || config.timeout == "") {
       this.config.timeout = 5000;
    }

}
}

module.exports = gitlab
