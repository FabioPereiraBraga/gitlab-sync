const gitlab = require('./sync/gitlab.js');

var provider;

function getStoreKey(models) {
  return `gitlab-sync:config:${models.workspace._id}`;
}

async function loadConfig(context, models) {
  const storeKey = getStoreKey(models);

  const configStorage = await context.store.getItem(storeKey);

  // Prompt for the configuration
  try {
    var config = await context.app.prompt(
    'GitLab - Settings', {
      label: 'JSON string',
      defaultValue: (configStorage !== null && configStorage !== 'undefined') ? configStorage : '{"api_url": "", "token": "", "id_project": "", "name_file": "", "ref": ""}',
      submitName: 'Save',
      cancelable: true,
    }
    );
  } catch (e) { return false }

  await context.store.setItem(storeKey, config);

  return true;
}

async function loadProvider(context, models){
  const configStorage = await context.store.getItem(getStoreKey(models));
  const configObject = JSON.parse(configStorage);
  console.log("Loaded config", configStorage);
  provider = new gitlab(context, configObject);
}

async function update(context, models) {
    try {
      const message = 'Update collection insomnia';
      var messageCommit = await context.app.prompt(
      'GitLab - Message Commit', {
        label: 'Message Commit',
        defaultValue: message || '',
        submitName: 'Commit',
        cancelable: true,
      }
      );

      const data = await context.data.export.insomnia({
        includePrivate: false,
        format: 'json',
        workspace: models.workspace
      });

       const content = JSON.stringify(JSON.parse(data), null, 2);

       provider.update(content, messageCommit).then((response)=>{
        console.log(response);
          context.app.alert( 'GitLab - Push Collection', 'Process concluded' );
       }).catch((error) => {
        let errorToJson = error.toJSON();
        context.app.alert( 'GitLab - Push Collection Error', errorToJson.message );
        console.log(errorToJson);
      });

    } catch (e) {
      await context.app.alert( `Collection update error for the project,`, e.message );
      return;
    }

    return true;
}

module.exports.workspaceActions = [
  {
    label: 'GitLab - Settings',
    icon: 'fa-cogs',
    action: async (context, models) => {
      await loadConfig(context, models);
    },
  },
  {
    label: 'GitLab - Pull Collection',
    icon: 'fa-download',
    action: async (context, models) => {
      try{
        await loadProvider(context, models)
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
    icon: 'fa-upload',
    action: async (context, models) => {
      await loadProvider(context, models);
      update(context, models);
    },
  }
];