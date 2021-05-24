# gitlab-sync

Plugin for Insomnia to synchronize collections with a gitLab repository.

# Overview 

This plugin allows users to synchronize collections with a gitlab repository

# Installation

**Insomnia's plugin manager**

Install the insomnia-plugin-gitlab-sync plugin from Preferences > Plugins

**Git**

1. git clone https://github.com/jcavendish/gitlab-sync.git

2. Download libraries
    ```
     cd gitlab-sync
     npm install
    ```
3. Add the directory installed in the insomnia plugins folder.

   ```
   cd ..
   cp -R gitlab-sync  /Users/YOUR-USER/Library/Application\ Support/Insomnia/plugins
   ``` 
   **Note** 
   
   The path of the plugins directory may change according to the distribution of the operating system 

# Configure

1. Create a personal access token to your GitLab account.
   
   Scope Api
   
   ![image](https://user-images.githubusercontent.com/10922392/117333905-cd115480-ae6f-11eb-8b54-689252846e8b.png)

3. Go to Insomnia, click on Insomnia Main Menu, and click on "GitLab - Settings":
   
  ![image](https://user-images.githubusercontent.com/10922392/117336023-267a8300-ae72-11eb-8982-efecdd532818.png)


   **Inform the following parameters**

   ```
    {
        "api_url": "http://url-you-server-gitlab.com", 
        "token": "you-personal-access-token", 
        "id_project": "id-project", 
        "files": [{ "name": "file-name" }, { "name": "file-name" }], 
        "ref": "master"
    }
   ```
   
   ![image](https://user-images.githubusercontent.com/10922392/117334413-5aed3f80-ae70-11eb-89ac-5c69998b24d4.png)

# Usage

* Click on "GitLab - Pull Collection" to search the collections of the project informed in the settings
* Click on "GitLab - Push Collection" 
to send updates made to the project collection informed in the settings
  
# Development

`types` stole from here: https://github.com/PoOwAa/insomnia-plugin-snippet-sync

## "Deploying"

- $ npm run build-ts
- $ rm -fr ~/Library/Application\ Support/Insomnia/plugins/gitlab-sync/
- $ mkdir -p ~/Library/Application\ Support/Insomnia/plugins/gitlab-sync
- $ cp package.json ~/Library/Application\ Support/Insomnia/plugins/gitlab-sync/
- $ cp -R node_modules/ ~/Library/Application\ Support/Insomnia/plugins/gitlab-sync/node_modules
- $ cp -R built ~/Library/Application\ Support/Insomnia/plugins/gitlab-sync/built

Only the 1st and last step are necessary afterwards, assuming there's no new lib dependency added.

