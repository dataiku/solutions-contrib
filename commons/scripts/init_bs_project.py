import argparse
import uuid
import logging
import os
import git
import shutil
from enum import Enum
import requests
import zipfile
import io
import json



logger = logging.getLogger(__name__)

def unique_filename():
    return str(uuid.uuid4())

def format_str(name : str):
    return name.lower().strip()

def get_members(zip,filters=["commons","project"]):
    parts = []
    # get all the path prefixes
    for name in zip.namelist():
        # only check files (not directories)
        if not name.endswith('/'):
            # keep list of path elements (minus filename)
            parts.append(name.split('/')[:-1])
    # now find the common path prefix (if any)
    prefix = os.path.commonprefix(parts)
    if prefix:
        # re-join the path elements
        prefix = '/'.join(prefix) + '/'
    # get the length of the common prefix
    offset = len(prefix)
    # now re-set the filenames
    for zipinfo in zip.infolist():
        name = zipinfo.filename
        # only check files (not directories)
        if len(name) > offset and any([part in name for part in filters]):
            # remove the common prefix
            zipinfo.filename = name[offset:]
            yield zipinfo

def is_git_repo(path,remote_url):
    try:
        repo = git.Repo(path)
        _ = repo.git_dir
        return remote_url == repo.remotes.origin.url
    except git.exc.InvalidGitRepositoryError:
        return False
    except git.exc.NoSuchPathError:
        return False

def get_repo_name_from_url(remote_url):
    return remote_url.split('.git')[0].split('/')[-1]

class InstallationType(Enum):
    UPDATE="u"
    NEW="n"
    PULL="p"

def create_bare_repo(remote_url,depth=True,bare=True):
    new_file_name = unique_filename() + ".git"
    path_to_tmp_dir = os.path.join(os.getcwd(),new_file_name)
    if depth:
        repo = git.Repo.clone_from(remote_url,to_path=path_to_tmp_dir,depth=1,bare=bare)
    else:
        repo = git.Repo.clone_from(remote_url,to_path=path_to_tmp_dir,bare=bare)

    return path_to_tmp_dir, repo


def get_all_projects_from_remote(projects_git_repo):

    path_to_tmp_dir, repo = create_bare_repo(projects_git_repo)
    ProjectNames = repo.git.execute(
        ["git","ls-tree","--full-tree","--name-only","HEAD"]
    )

    shutil.rmtree(path_to_tmp_dir)

    return ProjectNames.split("\n")

def is_new_project(projects_git_repo, project_name):
    projects_list = get_all_projects_from_remote(projects_git_repo)
    return not (format_str(project_name) in [format_str(project) for project in projects_list])
    
def get_base_zip_tag_url(base_git_url,org_name,project_name):
    return f"{base_git_url}/{org_name}/{project_name}/archive/refs/tags/"



class ProjectInstance(object):
    def __init__(self,update,project_name,projects_git_repo,commons_git_repo,base_zip_url):
        self.update = update
        self.project_name = project_name
        self.projects_git_repo = projects_git_repo
        self.commons_git_repo = commons_git_repo
        self.base_zip_url = base_zip_url
        self.projects_repo_name = get_repo_name_from_url(projects_git_repo)
        self.installation_type = self.get_installation_type()

        self.create_new_project()

    
    
    def get_installation_type(self):
        if self.update:
            return InstallationType.UPDATE.value
        is_new = is_new_project(self.projects_git_repo,self.project_name)
        if is_new:
            return InstallationType.NEW.value
        return InstallationType.PULL.value
    
    def update_commons(self):

        is_repo_present =  is_git_repo(os.path.join(os.getcwd(),self.projects_repo_name),self.projects_git_repo)
        assert is_repo_present, "No projects git repo is present"

        path_to_workspace = os.path.join(os.getcwd(),self.projects_repo_name,self.project_name)
        assert os.path.isdir(path_to_workspace), f"Project {self.project_name} is not present"

        path_to_tmp_dir, repo_tags = create_bare_repo(self.commons_git_repo,depth=False,bare=True)
        tags = sorted(repo_tags.tags, key=lambda t: t.commit.committed_date)
        tags = [tag.name for tag in tags]
        shutil.rmtree(path_to_tmp_dir)
        
        assert len(tags) >= 1, "No tag exists on solutions-contrib project"

        latest_tag = tags[-1]
        tag_url = self.base_zip_url + latest_tag + ".zip"
        r = requests.get(tag_url,stream=True)
        z = zipfile.ZipFile(io.BytesIO(r.content))

        shutil.rmtree(os.path.join(path_to_workspace,"commons"))

        z.extractall(path_to_workspace,get_members(z,filters=["commons"]))

        path_to_deps = os.path.join(path_to_workspace,"project","deps.json")

        assert not os.path.isfile(path_to_deps), "No dependencies file is found"

        with open(path_to_deps,"r") as f:
            deps = json.load(f)
            deps["tag"] = latest_tag
        
        os.remove(path_to_deps)
        with open(path_to_deps,"w") as f:
            json.dump(deps,f)
        
        




    def create_new_project(self):

        ######## Create git repo if not exists ##############
        is_repo_present = is_git_repo(os.path.join(os.getcwd(),self.projects_repo_name),self.projects_git_repo)
        if not is_repo_present:
            repo_projects = git.Repo.clone_from(self.projects_git_repo,to_path=os.path.join(os.getcwd(),self.projects_repo_name),no_checkout=True)
        else:
            repo_projects = git.Repo.init(os.path.join(os.getcwd(),self.projects_repo_name))

        ####### Add sparse checkout and project folder ########
        repo_projects.git.execute(
            ["git","config","core.sparsecheckout","true"]
        )  

        with open(os.path.join(os.getcwd(),self.projects_repo_name,".git","info","sparse-checkout"),"w") as f:
            f.write(self.project_name + "/")
        
        path_to_workspace = os.path.join(os.getcwd(),self.projects_repo_name,self.project_name)
        assert not os.path.isdir(path_to_workspace), "The project alredy exists in this directory use -u to update commons"

        path_to_tmp_dir, repo_tags = create_bare_repo(self.commons_git_repo,depth=False,bare=True)
        tags = sorted(repo_tags.tags, key=lambda t: t.commit.committed_date)
        tags = [tag.name for tag in tags]
        shutil.rmtree(path_to_tmp_dir)
        
        assert len(tags) >= 1, "No tag exists on solutions-contrib project"

        latest_tag = tags[-1]
        tag_url = self.base_zip_url + latest_tag + ".zip"
        r = requests.get(tag_url,stream=True)
        z = zipfile.ZipFile(io.BytesIO(r.content))
        
        os.mkdir(path_to_workspace)

        z.extractall(path_to_workspace,get_members(z))

        assert os.path.isdir(os.path.join(path_to_workspace,"project")), "No folder project created"

        with open(os.path.join(path_to_workspace,"project","deps.json"),"w") as f:
            json.dump({"tag" : latest_tag},f)
        
        #### Add .gitignore #####
        with open(os.path.join(path_to_workspace,".gitignore"),"w") as f:
            f.write('{}\n{}\n{}\n{}\n{}\n'.format("commons","node_modules","*.DS_Store","*__pycache__*",".venv"))


        repo_projects.git.execute(
            ["git","-C",path_to_workspace,"read-tree","-m","-u","HEAD"]
        )

        repo_projects.git.execute(
            ["git","-C",path_to_workspace,"add","."]
        )

        repo_projects.git.execute(
            ["git","-C",path_to_workspace,"commit","-m",f"project {self.project_name} added"]
        )
        
        repo_projects.git.execute(
            ["git","-C",path_to_workspace,"push"]
        )




    def pull_project(self):
        return 
    



    









if __name__ == "__main__":

    ORG_NAME = "dataiku"
    PROJECT_COMMONS = "solutions-contrib"
    COMMONS_GIT_REPO_SSH = "git@github.com:dataiku/solutions-contrib.git"
    PROJECTS_GIT_REPO_SSH = "git@github.com:anaslaaroussi1/test-repo.git"
    BASE_GIT_URL = "https://github.com/"
    BASE_ZIP_URL = get_base_zip_tag_url(BASE_GIT_URL,ORG_NAME,PROJECT_COMMONS)


    parser = argparse.ArgumentParser(description="Initialize or update a business solution web app project")
    parser.add_argument('-n','--name',
            help="The project name to initialize or update (if the project is already in git, this name must match the folder / repo name of the priject)",
            required=True)
    
    parser.add_argument("-u","--update",
            help="Updates the commons of the project if it exists locally",
            action="store_true")
    
    args = parser.parse_args()

    is_update = args.update
    project_name = args.name

    
    ProjectInstance(is_update,project_name,PROJECTS_GIT_REPO_SSH,COMMONS_GIT_REPO_SSH,BASE_ZIP_URL)

    

    