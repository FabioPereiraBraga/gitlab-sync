const gitlab = require('./sync/gitlab.js');

let provider;

async function loadConfig(context) {
  const configStorage = await context.store.getItem('gitlab-sync:config');
  
    // Prompt for the configuration
    try {
      var config = await context.app.prompt(
      'GitLab - Settings', {
        label: 'JSON string',
        defaultValue: configStorage || '{"api_url": "", "token": "", "id_project": "", "files": [{"name":""}], "ref": ""}',
        submitName: 'Save',
        cancelable: true,
      }
      );
    } catch (e) { return false }

    await context.store.setItem('gitlab-sync:config', config);
  
    return true;
}

async function loadProvider(context){
  try {
    let configStorage = await context.store.getItem('gitlab-sync:config') 
  
    const configObject = JSON.parse(configStorage);

    console.log("Loaded config", configStorage)

    provider = new gitlab(context, configObject);
  } catch (e) {
    context.app.alert("Invalid JSON!", "Error: " + e.message);

    return false;
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
    label: 'GitLab - Pull Collection',
    icon: 'fa-download',
    action: async (context, models) => {
      try {
        await loadProvider(context)

        const files = await provider.get();

        for (let file of files) {
          const content = JSON.stringify(file);
          await context.data.import.raw(content, { workspaceId: models.workspace._id });
        }

        await context.app.alert('GitLab - Pull Collection', 'Process concluded');
      } catch (e) {
        await context.app.alert(`Collection query error for the project`, e.message);
      }
    },
  },
  {
    label: 'GitLab - Push Collection',
    icon: 'fa-upload',
    action: async (context, models) => {
      try {
        await loadProvider(context)

        const data = await context.data.export.insomnia({
          includePrivate: false,
          format: 'json',
          workspace: models.workspace
        });

        const content = JSON.stringify(JSON.parse(data), null, 2);

        provider.update(content);

        await context.app.alert('GitLab - Push Collection', 'Process concluded');
      } catch (e) {
        await context.app.alert(`Collection update error for the project,`, e.message);
      }
    },
  }
];
