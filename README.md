# gitlab-sync

Plugin for Insomnia to synchronize collections with a gitLab repository.

# Overview 

This plugin allows users to synchronize collections with a gitlab repository

# Installation

1. `git clone` this repo


2. `cd` into the cloned directory


3. Execute ths script `install.sh`, if you have installed Insomnia in a custom folder
modify the script accordingly.

4. Disable Insomnia's SSL verification: Preferences -> General -> Request / Response -> **uncheck** "Validate certificates"

# Configure

1. Create a personal access token to your GitLab account.
   
These permissions are required: `api`, `read_user`, `read_api` and `read_repository`.
   
   ![image](https://user-images.githubusercontent.com/10922392/117333905-cd115480-ae6f-11eb-8b54-689252846e8b.png)

2. Go to Insomnia, click on Insomnia Main Menu, and click on "GitLab - Settings":
   
  ![image](https://user-images.githubusercontent.com/10922392/117336023-267a8300-ae72-11eb-8982-efecdd532818.png)

   **Fill the following fields**

   ```
    {
        "token": "<The gitlab personal access token you created>",
    }
   ```
   
   ![image](https://user-images.githubusercontent.com/10922392/117334413-5aed3f80-ae70-11eb-89ac-5c69998b24d4.png)

# Usage

## Retrieving the collections

* Click on "GitLab - Pull Collection" to retrieve the collections from the repo configured in the settings above.
  
## Sending back your changes

* Request developer access on the repo you're fetching the collections from
* Click on "GitLab - Push Collection" to send updates made to the project collection informed in the settings
  
# Development

`types` stolen from here: https://github.com/PoOwAa/insomnia-plugin-snippet-sync

## How to build

- $ npm run build-ts

## How to "deploy"

- build it
- run `install.sh`
- In Insomnia: Tools -> Reload Plugins
