const gitlab = require('./sync/gitlab.js');


var provider;


async function loadConfig(context) {
  const configStorage = await context.store.getItem('gitlab-sync:config');
  
    // Prompt for the configuration
    try {
      var config = await context.app.prompt(
      'GitLab - Settings', {
        label: 'JSON string',
        defaultValue: configStorage || '{"api_url": "", "token": "", "id_project": "", "name_file": "", "ref": ""}',
        submitName: 'Save',
        cancelable: true,
      }
      );
    } catch (e) { return false }
  

    await context.store.setItem('gitlab-sync:config', config);
  
    return true;
 
}

function loadProvider(context){
  let configStorage = context.store.getItem('gitlab-sync:config') 
  


  configStorage.then( (value)=>{
    var configObject = JSON.parse(value);
    console.log("Loaded config", value)
    provider = new gitlab(context, configObject);
  }, ( err )=>{
    context.app.alert("Invalid JSON!", "Error: " + e.message);
    return false;
  });

 
  return true
}


module.exports.workspaceActions = [
  {
    label: 'GitLab - Settings',
    icon: 'fa-cogs',
    action: async (context, models) => {
      await loadConfig(context, true);
    },
  },
  {
    label: 'GitLab - Pull Collection',
    icon: 'fa-search',
    action: async (context, models) => {
      loadProvider(context)

      try{
        const file = await provider.get();
        const content = JSON.stringify(file);
        await context.data.import.raw(content);
        await context.app.alert( 'GitLab - Pull Collection', 'Process concluded' );
      } catch (e) {
        await context.app.alert( `Collection query error for the project`, e.message );
        return;
      }
    },
  },
  {
    label: 'GitLab - Push Collection',
    icon: 'fa-pencil-square-o',
    action: async (context, models) => {

      loadProvider(context)

      const data = await context.data.export.insomnia({
        includePrivate: false,
        format: 'json',
        workspace: models.workspace
      });
      const content = JSON.stringify(JSON.parse(data), null, 2);

      try {
          provider.update(content);
          await context.app.alert( 'GitLab - Push Collection', 'Process concluded' );
      } catch (e) {
        await context.app.alert( `Collection update error for the project,`, e.message );
        return;
      }
    },
  }
];
