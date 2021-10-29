const gitlab = require('./sync/gitlab.js');


var provider;


const gitlabSyncConfigKey = 'gitlab-sync:config'
const gitlabSyncLastCommitKey = 'gitlab-sync:lastCommit'

async function loadConfig(context, models) {
  const configStorage = await context.store.getItem(gitlabSyncConfigKey);
  console.log("models", models)

  // Prompt for the configuration
  try {
    var config = await context.app.prompt(
      'GitLab - Settings', {
        label: 'JSON string',
        defaultValue: configStorage || '{"api_url": "", "token": "", "id_project": "", "dir_name": "", "ref": ""}',
        submitName: 'Save',
        cancelable: true,
      }
    );
  } catch (e) {
    return false
  }


  await context.store.setItem(gitlabSyncConfigKey, config);

  return true;

}

async function resetSettings(context) {
  await context.store.removeItem(gitlabSyncConfigKey);
  await context.store.removeItem(gitlabSyncLastCommitKey);
  return true;
}

async function loadProvider(context, models) {
  let configStorage = await context.store.getItem(gitlabSyncConfigKey)

  if (configStorage === null) { throw new Error('Unable to fetch config') }
  try {
    var configObject = JSON.parse(configStorage);
    // const collectionName = models.workspace.name
    return new gitlab(context, configObject, models);
  }
  catch (e){
    context.app.alert("Invalid JSON!", "Error: " + e.message);
    throw e
  };
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
    provider.update(content, messageCommit);

    await context.app.alert('GitLab - Push Collection', 'Process concluded');

  } catch (e) {
    await context.app.alert(`Collection update error for the project,`, e.message);
    return;
  }


  return true;

}



module.exports.workspaceActions = [{
    label: 'GitLab - Reset Settings',
    icon: 'fa-cogs',
    action: async (context, models) => {
      await resetSettings(context, true);
    },
  },
  {
    label: 'GitLab - Settings',
    icon: 'fa-cogs',
    action: async (context, models) => {
      await loadConfig(context, models);
    },
  },
  {
    label: 'GitLab - Pull Collections',
    icon: 'fa-download',
    action: async (context, models) => {


      try {
        const provider = await loadProvider(context, models)
        const lastCommit = await provider.getLastCommit()
        if (lastCommit === context.store.getItem(gitlabSyncLastCommitKey)){
          await context.app.alert('GitLab - Pull Collections', 'No new changes, process aborted.');
          return
        }
        for (let file of await provider.get()) {
          await context.data.import.raw(JSON.stringify(file))
        }
        await context.store.setItem(gitlabSyncLastCommitKey, await provider.getLastCommit())
        await context.app.alert('GitLab - Pull Collections', 'Process concluded');
      } catch (e) {
        await context.app.alert(`Collections query error for the project`, e.message);
        return;
      }
    },
  },
  {
    label: 'GitLab - Push Collection',
    icon: 'fa-upload',
    action: async (context, models) => {
      try {
        const message = 'Update insomnia collections';
        var messageCommit = await context.app.prompt(
          'GitLab - Commit Message', {
            label: 'Commit Message',
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
        const content = JSON.stringify(JSON.parse(data), null, 2)
        const provider = await loadProvider(context, models);
        const mergeRequestURL = await provider.update(content);
        const alertMessage = mergeRequestURL ? `See your MR: ${mergeRequestURL}` : `MR already exists`
        await context.app.alert('GitLab - Push Collection', `Changes have been pushed successfully. ${alertMessage}`)
      } catch (e) {
        await context.app.alert('Collection update error for the project', e.message)
      }
    }
  }
]
