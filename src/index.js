const gitlab = require('./sync/gitlab.js');


var provider;


async function loadConfig(context, forceReprompt) {
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

    // Validate the JSON config
    try {
      var configObject = JSON.parse(config);
    } catch (e) {
      context.app.alert("Invalid JSON!", "Error: " + e.message);
      return false;
    }

    // Check if it is possible to instantiate the provider with the config
    if(!loadProvider(context, configObject)){
      return false;
    }

    await context.store.setItem('gitlab-sync:config', config);
    return configObject;
  
 
}

function loadProvider(context, config){
  console.log("Loaded config", config)
  try {
    provider = new gitlab(context, config);
  } catch (e) {
    context.app.alert('Configuration error', e.message);
  }
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
    label: 'GitLab - Search Collection',
    icon: 'fa-search',
    action: async (context, models) => {
      const config = await context.store.getItem('gitlab-sync:config');
      if (!config) {
        await context.app.alert( 'GitLab - Settings', 'No configuration settings were found.' );
        return;
      }

      try{
        const file = await provider.get();
        const content = JSON.stringify(file);
        await context.data.import.raw(content);
        await context.app.alert( 'GitLab - Search Collection', 'Process concluded' );
      } catch (e) {
        await context.app.alert( `Collection query error for the project ${config.id_project}`, e.message );
        return;
      }
    },
  },
  {
    label: 'GitLab - Update Collection',
    icon: 'fa-pencil-square-o',
    action: async (context, models) => {
      const config = await context.store.getItem('gitlab-sync:config');
      if (!config) {
        await context.app.alert( 'GitLab - Settings', 'No configuration settings were found.' );
        return;
      }

      const data = await context.data.export.insomnia({
        includePrivate: false,
        format: 'json',
      });
      const content = JSON.stringify(JSON.parse(data), null, 2);

      try {
          provider.update(content);
          await context.app.alert( 'GitLab - Update Collection', 'Process concluded' );
      } catch (e) {
        await context.app.alert( `Collection update error for the project, ${config.id_project}`, e.message );
        return;
      }
    },
  }
];
