import { GitlabService } from './sync/gitlab.js';
import { InsomniaContext, InsomniaWorkspaceActionModel } from "./types/insomnia.types";

async function loadConfig(context: InsomniaContext) {
  const configStorage = await context.store.getItem('gitlab-sync:config')
  
  // Prompt for the configuration
  try {
    const config = await context.app.prompt(
        'GitLab - Settings', {
          label: 'JSON string',
          defaultValue: configStorage || '{"api_url": "", "token": "", "id_project": "", "files": [], "ref": ""}',
          submitName: 'Save',
          cancelable: true,
        });

    await context.store.setItem('gitlab-sync:config', config)
  } catch (e) {
    await context.app.alert(e.message)
  }
}

async function loadProvider(context: InsomniaContext): Promise<GitlabService> {
  const configStorage = await context.store.getItem('gitlab-sync:config')

  if (configStorage === null) {
    throw Error("Unable to retrieve configStorage")
  }

  let configObject;
  try {
    configObject = JSON.parse(configStorage)
  } catch (error) {
    await context.app.alert("Invalid JSON!", "Error: " + error.message)

    throw error;
  }

  return new GitlabService(context, configObject);
}

module.exports.workspaceActions = [
  {
    label: 'GitLab - Settings',
    icon: 'fa-cogs',
    action: async (context: InsomniaContext, models: InsomniaWorkspaceActionModel) => {
      await loadConfig(context);
    },
  },
  {
    label: 'GitLab - Pull Collection',
    icon: 'fa-download',
    action: async (context: InsomniaContext, models: InsomniaWorkspaceActionModel) => {
      try {
        const provider = await loadProvider(context)

        const files = await provider.get()

        for (let file of files) {
          const content = JSON.stringify(file);
          await context.data.import.raw(content, { workspaceId: models.workspace._id })
        }

        await context.app.alert('GitLab - Pull Collection', 'Process concluded')
      } catch (e) {
        await context.app.alert('Collection query error for the project', e.message)
      }
    },
  },
  {
    label: 'GitLab - Push Collection',
    icon: 'fa-upload',
    action: async (context: InsomniaContext, models: InsomniaWorkspaceActionModel) => {
      try {
        const provider = await loadProvider(context)

        const data = await context.data.export.insomnia({
          includePrivate: false,
          format: 'json',
          // workspace: models.workspace
        });

        const content = JSON.stringify(JSON.parse(data), null, 2)

        await provider.update(content)

        await context.app.alert('GitLab - Push Collection', 'Process concluded')
      } catch (e) {
        await context.app.alert('Collection update error for the project', e.message)
      }
    },
  }
];
