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

The commons library is versionned using git tags, each project will depend on a certain version of the commons library that can be updated or downgraded. 

[bs_project_manager.py](commons/scripts/bs_projects_manager.py) script is provided to help update the commons library of a project, create a new webapp project from the default template or pull an existing project with its corresponding commons library.


1. **Usage of *bs_projects_manager.py* script**

Put the script at the root directory where you will clone your webapp porjects and use the [requirements.txt](commons/scripts/requirements.txt) file to install the dependencies needed to run the script. 

It is advised to use a python virtual environment to run the script, you can either setup up one locally on your projects folder or use conda or pyenv virtualenv to manage your venvs and python versions. 


- **Create a new project**

Each webapp project has its own git repository, when starting a new project you must provide the script with a newly created git repo (the repo should not contain any branches or refs). The script will pull a default "Hello world template" and the latest available version of the commons lib, and then create a main branch and push a first commit to the repo.

Usage : 

`python3 bs_project_manager.py -r "YOUR REPO SSH URL"`

- **Pull an existing project**

If you are joining the development of an already existing project, when providing the git repo url to the script it will pull the project and read in the commons current version from the *"/project/deps.json"* file and pull the corresponding commons lib.
You can then navigate the project as you like (checkout to another branch, create a new one, commit your changes ...)

Usage : 

`python3 bs_project_manager.py -r "YOUR REPO SSH URL"`

- **Update the commons lib**

If you need to update the commons lib version in your project, you can run 

`python3 bs_project_manager.py -p "PATH TO THE PROJECT FOLDER" -u -t "TAG OF THE COMMONS LIB"`

The t argument is optional, when it is not provided the latest version of commons will be pulled.

2. **Starting the webapp locally**

Once you created a new project or joined an existing project, you can start it locally by running in the project folder:

- `pnpm install` : This will install you the JS packages needed for the project (Vue, Quasar, axios ...).
- `pnpm run dev` : This will run the node server 

You should create a virtual env for the project where you can install the requirements.txt of the project , then you can start the backend of your project

- `python3 backend.py` : This will run the flask server, use a virtual environement to start your backend and install the python dependencies. (run this in another window of your terminal)

Once you run these three commands the project will be served in the url : http://127.0.0.1:5000/fetch/bs_init








   




