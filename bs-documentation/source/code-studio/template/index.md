# Code studio template

```{admonition} Prerequisites
:class: important

Before you begin, ensure you meet the following requirements:

- Knowledge of [Dataiku Code Studios](https://doc.dataiku.com/dss/latest/code-studios/index.html).
  
- Admin permissions to configure Code Studio templates.
  
- Python 3.7+ with [Cookiecutter 2.3.1+](https://pypi.org/project/cookiecutter/) installed.
  
- For Flask backend, Python 3.6+ and the following packages:
    ```bash
    Flask>=0.9
    git+https://github.com/dataiku/solutions-contrib.git@main#egg=webaiku&subdirectory=bs-infra
    python-dotenv>=0.19.0
    dataiku-api-client
    ```

```


This section walks you through the setup process of a Code Studio template specifically designed for web application development using leading frontend frameworks. Currently, we support [Vue](https://vuejs.org/) and [Angular](https://angular.io/).

:::{topic} Note
_Set up the configuration only once. Once established, the template is available for all Dataiku projects trequiring web application development._
:::

## Importing the template into Dataiku

Follow these steps to import the template:

- Download the [code studio template](https://github.com/dataiku/solutions-contrib/raw/main/code-studio/dss_code_studio_template_infra.zip)

- Navigate to the code studios admin panel and select "Upload a Code Studio Template" option.
- Import the template you've just downloaded.

![Import code studio template](assets/01-import-code-studio-template.png)

- After importing the template, remember to align the provided Cookiecutter and infra37 code environment blocks with the names of your pre-configured code environments for cookiecutter and Flask backend development

![Remap code environments](assets/02-remap-code-envs.png)

With these steps, your Code Studio template is ready for use. This enables you to swiftly initiate web application development in Dataiku projects, leveraging frameworks like Vue and Angular.

## Manual setup

This section explains how to configure a Code Studio template manually. You'll learn how to add and modify the essential building blocks within the template.

- **Create Template**: Click on _+ Create code studio template in the upper right corner. Once created, navigate to the definition panel to manage [building blocks](https://doc.dataiku.com/dss/latest/code-studios/code-studio-templates.html#building-blocks)

- **[File synchronization](https://doc.dataiku.com/dss/latest/code-studios/code-studio-templates.html#file-synchronization)**: Use this block to specify patterns like _node_modules/ , .angular, **pycache**_ that you wish to exclude from the file synchronization between Dataiku instance instance and Code Studio..

- **[Kubernetes Parameters](https://doc.dataiku.com/dss/latest/code-studios/code-studio-templates.html#kubernetes-parameters)**: Configure Kubernetes settings, if applicable.

- **[Visual Studio Code](https://doc.dataiku.com/dss/latest/code-studios/code-studio-templates.html#visual-studio-code)** Add a Visual Studio Code block. Typically, no settings need to be changed here.

- **[Append to Dockerfile](https://doc.dataiku.com/dss/latest/code-studios/code-studio-templates.html#append-to-dockerfile)** Insert this block and include the following Dockerfile content:

  ```
  USER root

  RUN yum install -y nodejs npm wget && \
      mkdir -p /usr/local/lib/node_modules && \
      chown dataiku:dataiku -R /usr/local/lib/node_modules && \
      npm install npm@7 -g && \
      npm install pnpm -g && \
      npm install yarn -g && \
      npm install @angular/cli -g

  # Install or update Git (Example for Red Hat 7)
  RUN yum -y remove git && \
      yum -y remove git-* && \
      yum -y install https://packages.endpointdev.com/rhel/7/os/x86_64/endpoint-repo.x86_64.rpm && \
      yum -y install git

  RUN cd /opt/dataiku/code-server/lib/vscode/extensions && \
      npm init -y && \
      npm i typescript
  ```

  :::{topic} Note
  This Dockerfile block does the following:
  - Installs npm, yarn, pnpm, and the Angular CLI globally.
  - Updates Git to the latest version.
  - Installs TypeScript for enhanced linting and IntelliSense in VS Code.
    :::

- **[Add an Entrypoint for HTML](https://doc.dataiku.com/dss/latest/code-studios/code-studio-templates.html#add-an-entry-point)**: Expose the HTML service to make the frontend accessible from the Code Studio UI when launching your web application client server. Use /$request_uri for the proxied subpath.

  ![Expose Client Port](assets/04-expose-client-port.png)

- **[Add an Entrypoint for Flask](https://doc.dataiku.com/dss/latest/code-studios/code-studio-templates.html#add-an-entry-point)** Add another entry point for your Flask backend. Use /$request_uri for the proxied subpath here as well.

  :::{topic} Note
  _You don't need to expose the html service for this entry point_
  :::

  ![Expose Flask Port](assets/05-expose-flask-port.png)

- **[Code environments](https://doc.dataiku.com/dss/latest/code-studios/code-studio-templates.html#add-a-code-environment)**: Finally, include the previously configured code environments for Cookiecutter and Flask backend development.

## Utilizing the Configured Template 

Once the template is set up, using it is straightforward:

- Navigate to _</> ->_ Code Studios in the top navigation bar.
- Click on _+ New Code Studio in the upper right and choose the template you’ve just configured.
- Start the code studio

![Create New Code Studio](assets/06-add-new-code-studio.png)
