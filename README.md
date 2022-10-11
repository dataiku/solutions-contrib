# solutions-contrib

## WebApps Env Setup 

---

### <span style="background-color:white;color:black">Requirements</span>

**1. Git ssh key setup**

You will need to setup an ssh key for git in order to clone projects and push / pull modifications.

Start by generating a new ssh key following the instructions in this [link](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)

Then add the newly generated key to your github account following the instructions on this [link](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)

**2. Install Vs Code**

[Link to download](https://code.visualstudio.com/download)

**3. Install NodeJS & npm**

You can install Node using *Homebrew (Homebrew is package management system that simplifies the installation of software on macos)* 

To install Homebrew refer to this [link](https://brew.sh/)

Once homebrew installed, run the following command

`brew install node`

Make sure that Node was installed successfully by running 

`node -v`

npm (Node Package Manager) will be installed by default, run `npm -v` to make sure you have npm installed.

**4. Configuration of the .dataiku directory** \

Start by creating the directory ~/.dataiku if you don't have one

`cd && mkdir .dataiku`

   * **Configure the config.json** 

   This step will enable you to configure your default instance in order to use the dataiku package outside of Dataiku.

   Create a config.json file in this directory if you don't have one.

   `cd && cd ./dataiku && touch config.json`

   Put the following configuration in your config.json replace the api_key value with a generated personal API key in Dataiku and put the url instance your projects are running on (exple : https://industry-solutions-design.industries.dataiku-dss.io/)

   
   ```
   {

    "dss_instances": {

        "default": {

            "url": "YOUR INSTANCE URL",

            "api_key": "YOUR GENERATED API KEY",

	    "no_check_certificate": true

        },

    },

    "default_instance": "default"

}  
   ```

   * **Create bs-config.json** 

   Add an empty file bs-config.json in the .dataiku directory `cd && cd ./dataiku && touch ~/.dataiku/bs-config.json` : This file informs the Dev environment that the web app is running on a local machine.

### <span style="background-color:white;color:black">WebApp Projects</span>

Each webapp project will have two main directories **commons** & **project**. 

> Project_name

    > commons
    > project

Commons is a shared library that contains code for the development & production env to work, python usefull functions (dku_utils) and pre-packaged Vue / Quasar components to use in the webapps. 

The commons library is versionned using git tags 



   




