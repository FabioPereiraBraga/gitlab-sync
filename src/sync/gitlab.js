const axios = require('axios');

class gitlab {
  constructor (context, config) {
    this.context = context
    this.loadConfig(config)
    console.log("Loaded config", this.config)
  }



  async get(){
    try {
      const response = await axios.get(
        `${this.config.api_url}/api/v4/projects/${this.config.id_project}/repository/files/${this.config.name_file}/raw?ref=${this.config.ref}&private_token=${this.config.token}`
      );
      return response.data;
    }catch (e) {
      throw `Collection query failed for informed project ${this.config.id_project}`
    }
  }



  async update(content, messageCommit) {

   try{
    await axios.post(

      `${this.config.api_url}/api/v4/projects/${this.config.id_project}/repository/commits?private_token=${this.config.token}`,
      {
        "branch": this.config.ref,
        "commit_message": messageCommit,
        "actions": [
          {
            "action": "update",
            "file_path": this.config.name_file,
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
