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

   `cd && cd .dataiku && touch config.json`

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

`python3 bs_projects_manager.py -r "YOUR REPO SSH URL"`

- **Pull an existing project**

If you are joining the development of an already existing project, when providing the git repo url to the script it will pull the project and read in the commons current version from the *"/project/deps.json"* file and pull the corresponding commons lib.
You can then navigate the project as you like (checkout to another branch, create a new one, commit your changes ...)

Usage : 

`python3 bs_projects_manager.py -r "YOUR REPO SSH URL"`

- **Update the commons lib**

If you need to update the commons lib version in your project, you can run 

`python3 bs_projects_manager.py -p "PATH TO THE PROJECT FOLDER" -u -t "TAG OF THE COMMONS LIB"`

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

### 2.3. Add the HTML, JS & python backend to instantiate the webapp

Create a standard webapp in the project, start by adding this code to the HTML part of the webapp

```html
<!DOCTYPE html>
<html>
    <head>
    </head>
    <body>
        <div id="app"></div>
    </body>
</html>
```

Then add this code the the js part of the webapp

```js
const backendURL = getWebAppBackendUrl('fetch/prod?URL='+getWebAppBackendUrl(''));


function createScript(data) {
    const script = document.createElement('script');
    script.src = data.path_js;
    script.async = true;
    return script;
}

function createStyle(data) {
    const style = document.createElement( "style" );
    style.innerHTML = data.css;
    return style;
}


window.onload = function() {
        
    $.get(backendURL, function(data, status){
        
        const script = createScript(data);
        const style = createStyle(data);

        document.getElementsByTagName( "head" )[0].appendChild( style );
        
        document.getElementsByTagName( "head" )[0].appendChild(script);
    });
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


### <span style="background-color:white;color:black">Code studios</span>

You can develop and deploy webapps directly using DSS code studios. The code studios will enable you to edit webapps on a VsCode IDE and Hot reload you webapp page. 

To use code studios for business solutions webapps development you need to follow these steps:

## 1. Code studio setup

### 1.1 Code studio template

The design instance provides a template (**bs-infra**) for creating pre-configured code studios, you can use this template to start a new code studio on your project:


![Code Studio Creation](/commons/images/documentation/code_studio_creation.png)

The code studio template enables you to benefit from: 

- Port forwarding you webapp port to DSS to see the changes you make in real time
- Two python environments : **bs_projects_manager** To run the bs_projects_manager.py script for updating commons or creating / pulling a webapp project and **webapps_code_studio** env that comes with flask to run the webapp backend
- Pulling the bs_script_manager.py to your code studio workspace
- Adding typescript to Vscode for intellisense
- Installing NodeJS, npm, yarn, and pnpm by default
- Installing the latest version of git

Once your code studio is created you will have two windows: VS Code and dev.

![Code Studio View](/commons/images/documentation/code_studio_view.png)

### 1.2 Important files and folders

- **The project library**: The equivalent of the project library in your code studio environment is the folder **project-lib-versioned**, this folder can be synched directly with your project library in DSS

- **bs_projects_manager.py**: The script to update and create / pull webapps templates

### 1.3 Code studio configuration

You will have python extensions by default in your code studio for a better python development experience.

For vue files you will need to install **Vetur** (a vue extension for linting and Intellisense)

![Code Studio Vetur](/commons/images/documentation/code_studio_vetur.png)

- **NB**: The support for Volar as an extension is not yet available.

- **Suggestion :** For a better development experience you can change the default vscode color theme to **Dark + (default dark)** or any color theme you prefer to use in VsCode

![Code studio color theme](/commons/images/documentation/code_studio_color_theme.png)

- **Important**: You will need to setup your github username and email in the code studio to be able to commit and with you github identity:

        `git config --global user.email "you@example.com"`

        `git config --global user.name "Your Name"`

### 1.4 Python Code envs

The two python code envs **(bs_projects_manager && webapps_code_studio)** are available in the path ` /opt/dataiku/python-code-envs/` To activate bs_projects_manager for example when using the script to update commons you can run in the integrated terminal of vscode:

`source /opt/dataiku/python-code-envs/bs_projects_manager/bin/activate`

To deactivate a code env run:

`deactivate`

You can activate the webapps_code_studio env in the same way to run the backend of your webapp, you also install additional packages to the webapps_code_studio if needed.


### 1.4 Using the bs_projects_manager.py


The **bs_projects_manager.py** works the same way as in your local env, wih only two differences: 

a. You can't use SSH git repo url to create or pull projects, we will be using **HTTPS**, so to create a new webapp or pull an existing one, as in your local environment, start by activating the bs_projects_manager env and run:

`python3 bs_projects_manager.py -r "YOUR REPO HTTPS URL"`

- The script will pull the project and the commmons library and put them in the folder `project-lib-versioned/python` of your code studio
- The first time you use the script or use git, a prompt will show up to ask you to authenticate with your github account


![Code studio color theme](/commons/images/documentation/code_studio_git_signin.png)

Follow the instructions to sign-in your github account

b. The update command should be done on the **project-lib-versioned/python** folder:

`python3 bs_projects_manager.py -p project-lib-versioned/python -u -t "TAG OF THE COMMONS LIB"`

### 1.5 Running the webapp

Once you pulled your project to  **project-lib-versioned/python** folder, you can open two integrated terminals in vscode on for running the frontend server and one for the backend, you can run the webapp as you do locally:

Navigate to **project-lib-versioned/python/project** and :
- `pnpm install` : This will install you the JS packages needed for the project (Vue, Quasar, axios ...).
- `pnpm run dev` : This will run the node server 


- `python3 backend.py` : This will run the flask server, use the webapps_code_studio environment for running the backend

Once you launched the frontend and backend, you can go the the window dev to see your webapp --> Reload the window if needed 

![Webapp view](/commons/images/documentation/code_studio_webapp_window.png)

### 1.6 Webbapps deployment

Once you finished you webapp or you want to deploy it to you DSS project, you can run `pnpm run build` in the project folder to build the webapp and then sync the changes to DSS:

![Sync files](/commons/images/documentation/sync_files.png)

Once the file are synced add the HTML, JS and python codes to your webapp if it is not done: 

Start by adding this code to the HTML part of the webapp

```html
<!DOCTYPE html>
<html>
    <head>
    </head>
    <body>
        <div id="app"></div>
    </body>
</html>
```

Then add this code the the js part of the webapp

```js
const backendURL = getWebAppBackendUrl('fetch/prod?URL='+getWebAppBackendUrl(''));


function createScript(data) {
    const script = document.createElement('script');
    script.src = data.path_js;
    script.async = true;
    return script;
}

function createStyle(data) {
    const style = document.createElement( "style" );
    style.innerHTML = data.css;
    return style;
}


window.onload = function() {
        
    $.get(backendURL, function(data, status){
        
        const script = createScript(data);
        const style = createStyle(data);

        document.getElementsByTagName( "head" )[0].appendChild( style );
        
        document.getElementsByTagName( "head" )[0].appendChild(script);
    });
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

If you sync changes on a webapp that is running, restart the backend to see them on DSS.


### <span style="background-color:white;color:black">Code studio template explanation</span>

This section explains the building blocks of the code studio template for business solutions webapps development. 

The template is composed of 8 building blocks:

![Code studio template blocks](/commons/images/documentation/code_studio_template_building_blocks.png)

## 1. File synchronization

The Code Studios run separately from DSS, in the Kubernetes cluster. Some files are synchronized between DSS and the Code Studio, you can find more about file synchronization on [File synchronization](https://doc.dataiku.com/dss/latest/code-studios/concepts.html#synchronized-files)

## 2. Kubernetes Parameters

We use the default configuration for the Kubernetes parameters, you can find more about this building block on [Kubernetes parameters](https://doc.dataiku.com/dss/latest/code-studios/code-studio-templates.html#kubernetes-parameters)

## 3. Visual Studio Code

This block adds the VS Code IDE in the Code Studio. Each code env added by an “Add code environment” block is added to VS Code as a debug configuration and is available from the list of interpreters.

It is not usually needed to change any setting of this block.

## 4. Append to Dockerfile

This block allows you to add arbitrary Dockerfile statements to the image. Each instance of this block appends to the Dockerfile of the image that is built. We use this block to: 

- **Install npm, yarn, pnpm and wget**: 

    `RUN yum install -y nodejs npm wget && \
    mkdir -p /usr/local/lib/node_modules && \
    chown dataiku:dataiku -R /usr/local/lib/node_modules && \
    npm install npm@latest -g && \
    npm install pnpm -g && \
    npm install yarn -g`

- **Install the latest version of git**: 

    `RUN yum -y remove git && \ 
    yum -y remove git-* && \
    yum -y install https://packages.endpointdev.com/rhel/7/os/x86_64/endpoint-repo.x86_64.rpm && \
    yum -y install git`

- **Install typescript to the vscode extensions to enable some itellisense features**:

    `RUN cd /opt/dataiku/code-server/lib/vscode/extensions && \
    npm init -y && \
    npm i typescript`

- **Get the bs_projects_manager.py script**: 

    `RUN wget -O /home/dataiku/workspace/bs_projects_manager.py https://raw.githubusercontent.com/dataiku/solutions-contrib/feature/code-studios/commons/scripts/bs_projects_manager.py`

- **Add the .dataiku/bs-config.json file**:

    `USER dataiku`

    `RUN cd ~ && mkdir .dataiku && cd .dataiku && touch bs-config.json`

## 5. Add code environment

The two blocks for adding code environments make 2 python evironments available on the directory **/opt/dataiku/python-code-envs**: One for running the bs_projects_manager.py script and one for running the webapps backend

## 6. Add an Entrypoint: Expose port

We use this block to expose the port on which the webapp is running (**5000**) to DSS, we expose the HTML service so this entrypoint can be consulted through the dev window in the code studio

## 7. Add an Entrypoint: Expose front port

We use this block to expose the node / vite server to serve js code and assets to the webapp without exposing an HTML service.



















   




