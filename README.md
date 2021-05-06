# gitlab-sync
plugin para o insomnia

# Overview 

This plugin allows users to synchronize collections with a gitlab repository

# Installation

**Gerenciador plugin insomnia**

Install the insomna-plugin-gitlab-sync plugin from Preferences > Plugins

**Git**

1. git clone https://github.com/FabioPereiraBraga/gitlab-sync.git
2. Download the used libraries
    ```
     cd gitlab-sync
     npm install
    ```
3. Add the directory installed in the insomnia plugins folder.

   ```
   cp gitlab-sync  /home/you-user/.config/Insomnia/plugins
   ``` 
   **Note** 
   
   The path of the plugins directory may change according to the distribution of the operating system 

# Configure

1. Create a personal access token to your GitLab account.
   
   Scope Api
   
   ![image](https://user-images.githubusercontent.com/10922392/117333905-cd115480-ae6f-11eb-8b54-689252846e8b.png)

3. Go to Insomnia, click on Insomnia Main Menu, and click on "GitLab - Settings":
   
   ![image](https://user-images.githubusercontent.com/10922392/117334191-1366b380-ae70-11eb-8720-38c45fb9069f.png)

   **Inform the following parameters**

   ```
    {
        "api_url": "http://url-you-server-gitlab.com", 
        "token": "you-personal-access-token", 
        "id_project": "id-project", 
        "name_file": "name-file", 
        "ref": "master"
    }
   ```
   
   ![image](https://user-images.githubusercontent.com/10922392/117334413-5aed3f80-ae70-11eb-89ac-5c69998b24d4.png)

# Usage

* Click on "GitLab - Pull Collection" to search the collections of the project informed in the settings
* Click on "GitLab - Push Collection" 
to send updates made to the project collection informed in the settings


