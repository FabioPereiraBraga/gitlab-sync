import { GitlabService } from './sync/gitlab.js'
import { InsomniaContext, InsomniaWorkspaceActionModel } from "./types/insomnia.types"
import { GitlabServiceConfig } from "./types/plugin.type"

const gitlabSyncConfigKey = 'gitlab-sync:config'
const gitlabSyncLastCommitKey = 'gitlab-sync:lastCommit'
const defaultConfig = '{"api_url": "", "token": "", "id_project": 0, "files": ["workspace.json"], "branch": "master"}'

async function fetchOrSetConfig(context: InsomniaContext): Promise<GitlabServiceConfig> {
  try {
    return await loadConfig(context)
  } catch (e) {
    await context.store.setItem(gitlabSyncConfigKey, defaultConfig)

    return await loadConfig(context)
  }
}

async function loadConfig(context: InsomniaContext): Promise<GitlabServiceConfig> {
  let configStorage = await context.store.getItem(gitlabSyncConfigKey)

  if (configStorage === null) { throw new Error('Unable to fetch config') }

  try {
    const cfg: GitlabServiceConfig = JSON.parse(configStorage)

    cfg.api_url = cfg.api_url.replace(/\/\s*$/, "")

    return cfg
  } catch (e) {
    await context.app.alert("Invalid JSON!", "Error: " + e.message)

    throw e
  }
}

async function loadProvider(context: InsomniaContext): Promise<GitlabService> {
  return new GitlabService(context, await loadConfig(context))
}

module.exports.workspaceActions = [
  {
    label: 'GitLab - Settings',
    icon: 'fa-cogs',
    action: async (context: InsomniaContext, models: InsomniaWorkspaceActionModel) => {
      try {
        const currentConfig = await fetchOrSetConfig(context);

        const config = await context.app.prompt(
            'GitLab - Settings', {
              label: 'JSON string',
              defaultValue: JSON.stringify(currentConfig),
              submitName: 'Save',
              cancelable: true,
            });

        await context.store.setItem(gitlabSyncConfigKey, config)
      } catch (e) {
        await context.app.alert(e.message)
      }
    },
  },
  {
    label: 'GitLab - Check for updates',
    icon: 'fa-cogs',
    action: async (context: InsomniaContext, models: InsomniaWorkspaceActionModel) => {
      const previousLastCommitFetched = await context.store.getItem(gitlabSyncLastCommitKey)

      const provider = await loadProvider(context)

      const repoLastCommit = await provider.getLastCommit()

      if (repoLastCommit === previousLastCommitFetched) {
        await context.app.alert('Collections are up to date', 'The repo has not been updated since the last pull')
      } else {
        await context.app.alert('Collections are outdated', 'The repo has been updated')
      }
    },
  },
  {
    label: 'GitLab - Pull Collections',
    icon: 'fa-download',
    action: async (context: InsomniaContext, models: InsomniaWorkspaceActionModel) => {
      try {
        const provider = await loadProvider(context)

        for (let file of await provider.get()) {
          await context.data.import.raw( JSON.stringify(file) )
        }

        await context.store.setItem(gitlabSyncLastCommitKey, await provider.getLastCommit())

        await context.app.alert('GitLab - Pull Collection', 'Process concluded')
      } catch (e) {
        await context.app.alert('Collection query error for the project', e.message)
      }
    },
  },
  {
    label: 'GitLab - Push Collections',
    icon: 'fa-upload',
    action: async (context: InsomniaContext, models: InsomniaWorkspaceActionModel) => {
      try {
        const data = await context.data.export.insomnia({ includePrivate: false, format: 'json' });

        const content = JSON.stringify(JSON.parse(data), null, 2)

        const provider = await loadProvider(context)

        const mergeRequestURL = await provider.update(content)

        await context.app.alert('GitLab - Push Collection', `See your PR: ${mergeRequestURL}`)
      } catch (e) {
        await context.app.alert('Collection update error for the project', e.message)
      }
    },
  }
];
