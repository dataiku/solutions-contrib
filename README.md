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

**3. Install NodeJS & npm & pnpm**

You can install Node using *Homebrew (Homebrew is package management system that simplifies the installation of software on macos)* 

To install Homebrew refer to this [link](https://brew.sh/)

Once homebrew installed, run the following command

`brew install node`

Make sure that Node was installed successfully by running 

`node -v`

npm (Node Package Manager) will be installed by default, run `npm -v` to make sure you have npm installed.

You need to install pnpm after node & npm, you can run this command to do so: 

`npm install -g pnpm`

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

### <span style="background-color:white;color:black">Build and deploy webapps to Dataiku</span>

## 1. Build the webapp

Once you want to deploy the webapp to dss, you will start by building the app locally and pushing the build to the remote github repository.

To build the webapp, run ` pnpm run build` in the project folder.

This will create a **dist** folder that contains a **manifest.json** file mapping the main.js and main.css bundeled files and the assets (fonts, icons...) to their build names and locations, and the **assets** folder that contains all the build files.

Once the webapp is built, you can commit and push the dist folder to the remote git. 

## 2. First deployment to DSS

After building the webapp, you can deploy it to dss in three steps:

### 2.1. Pull the project directory 

You will need to pull the project folder from the git repository of your webapp to the library directory of the DSS project. 

All the folders added to the library directory will be added in the **lib/python** folder. 

To pull the project folder, click on import from Git in the library editor and give it the git repo of your webapp

![Pull project folder](/commons/images/documentation/pull_project_directory.png)

### 2.2. Pull the corresponding commons folder

Next you will need to pull the **commons/python/fetch** folder from the solution-contrib directory. To do so you need to check the tag version of commons in your **project/deps.json** file and pull the **commons/python/fetch** folder from this tag.

![Pull commons folder](/commons/images/documentation/pull_commons.png)

In this example I am pulling the v1.3.5 tag since it is the version on my deps.json.

### 2.3. Add the JS & python backend to instantiate the webapp

Create a standard webapp in the project, start by adding this code to the JS part of the webapp

```js
const backendURL = getWebAppBackendUrl('fetch/bs_init?URL='+getWebAppBackendUrl(''));

window.onload = function() {
    
    var ifrm = document.createElement("iframe");
    ifrm.setAttribute("src", backendURL);
    ifrm.setAttribute("style", "position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;");
    document.body.appendChild(ifrm);
}
```

Then add this code the the python part of the webapp

```py
from flask import Flask
import sys
import os
from commons.python.fetch.fetch_project import fetch_route
from project.src.fetch_api import fetch_api


app.register_blueprint(fetch_route)
app.register_blueprint(fetch_api)
```

NB : The webapps work on container mode and local mode. you can set a special code env for backend execution if you use packages that are not included in the default dss env.

## 3. Updates to a deployed webapp

When you add new features the webapp locally and need to push them to dss, you will need to build the webapp and push it to the updates to the main branch. 

There are two cases when updating a webapp:

### 3.1 deps.json didn't change

In that case you can go to Library of the project and pull the changes from the git repo 

![reset remote head](/commons/images/documentation/reset_from_remote_head.png)

You will need to restart the backend to have the updates

### 3.2 The version of commons changed in deps.json

You start by doing what in (3.1 deps.json didn't change) and then update the folder **python/commons/python/fetch** in the library of the project to the current version of deps.json

![Edit the git reference](/commons/images/documentation/edit_git_ref.png)

![Change tag](/commons/images/documentation/change_tag.png)


## 4. Stable releases

When you need to release the solution or deliver a stable version, it is a best practice to follow the following steps for the webapp deployment:

### 4.1 Push the stable source code and build to the branch stable

You can create a branch named stable in the repo of your webapp if it is not already done and open a pull request from the main branch to the stable branch. Then merge the pull request after a peer review if you prefer to double check the code before the release.

### 4.2 Edit git references in DSS project

You will need to edit the git reference of the **python/project** folder in the library editor to point to the stable branch and edit the git reference of the **python/commons/python/fetch** to point it the the corresponding tag in **deps.json** 









   




