import argparse
import os
import uuid
import git
from enum import Enum
import shutil
import requests
import zipfile
import io
import json


class InstallationType(Enum):
    UPDATE = "u"
    NEW = "n"
    PULL = "p"


# TODO : Split part of these files in src folder to make them general for the template
DYNAMIC_TEMPLATE_FILES_FOLDERS = [
    "package.json",
    "requirements.txt",
    "src",
    "index.html",
]


class EnvMode(Enum):
    LOCAL = "local"
    STUDIO = "studio"


def get_mode():
    code_studio_path = os.environ.get("DKU_CODE_STUDIO_BROWSER_PATH", "")
    is_code_studio = code_studio_path != ""
    return EnvMode.STUDIO.value if is_code_studio else EnvMode.LOCAL.value


def move_all_files(src, dest):
    allfiles = os.listdir(src)
    for f in allfiles:
        src_path = os.path.join(src, f)
        dst_path = os.path.join(dest, f)
        shutil.move(src_path, dst_path)


def is_git_repo(path, remote_url=None):
    try:
        repo = git.Repo(path)
        _ = repo.git_dir
        if remote_url:
            return remote_url == repo.remotes.origin.url
        return True
    except git.exc.InvalidGitRepositoryError:
        return False
    except git.exc.NoSuchPathError:
        return False


def unique_filename():
    return str(uuid.uuid4())


def format_str(name: str):
    return name.lower().strip()


def create_bare_repo(remote_url, depth=True, bare=True):
    new_file_name = unique_filename() + ".git"
    path_to_tmp_dir = os.path.join(os.getcwd(), new_file_name)
    if depth:
        repo = git.Repo.clone_from(
            remote_url, to_path=path_to_tmp_dir, depth=1, bare=bare
        )
    else:
        repo = git.Repo.clone_from(remote_url, to_path=path_to_tmp_dir, bare=bare)

    return path_to_tmp_dir, repo


def get_members(zip, filters=["commons", "project"]):
    parts = []
    # get all the path prefixes
    for name in zip.namelist():
        # only check files (not directories)
        if not name.endswith("/"):
            # keep list of path elements (minus filename)
            parts.append(name.split("/")[:-1])
    # now find the common path prefix (if any)
    prefix = os.path.commonprefix(parts)
    if prefix:
        # re-join the path elements
        prefix = "/".join(prefix) + "/"
    # get the length of the common prefix
    offset = len(prefix)
    # now re-set the filenames
    for zipinfo in zip.infolist():
        name = zipinfo.filename
        removed_prefix_name = name[offset:]
        # only check files (not directories)

        if len(name) > offset and any(
            [removed_prefix_name.startswith(val) for val in filters]
        ):
            if len(filters) == 1 and filters[0] == "project":
                if not any(
                    [
                        file_folder in removed_prefix_name
                        for file_folder in DYNAMIC_TEMPLATE_FILES_FOLDERS
                    ]
                ):
                    # remove the common prefix
                    zipinfo.filename = removed_prefix_name
                    yield zipinfo

            else:
                # remove the common prefix
                zipinfo.filename = removed_prefix_name
                yield zipinfo


def merge_npm_packages(new_template_package, package_dest):
    merged_package = {}
    for key in new_template_package:
        if key != "dependencies" and key != "devDependencies":
            merged_package[key] = new_template_package[key]
        else:
            merged_package[key] = {
                dep_: package_dest[key][dep_] for dep_ in package_dest[key]
            }
            for dep in new_template_package[key]:
                if not dep in package_dest[key]:
                    merged_package[key][dep] = new_template_package[key][dep]

    return merged_package


def get_base_zip_tag_url(base_git_url, org_name, project_name):
    return f"{base_git_url}/{org_name}/{project_name}/archive/refs/tags/"


def is_remote_empty(projects_git_repo):
    (
        path_to_tmp_dir,
        repo,
    ) = create_bare_repo(projects_git_repo)
    refs = repo.refs

    shutil.rmtree(path_to_tmp_dir)
    return len(refs) == 0


def get_repo_name_from_url(remote_url):
    return remote_url.split(".git")[0].split("/")[-1]


class ProjectInstance(object):
    def __init__(
        self,
        update,
        projects_git_repo,
        commons_git_repo,
        base_zip_url,
        commons_tag,
        project_path,
        framework_ref,
    ):
        self.update = update
        self.projects_git_repo = projects_git_repo
        self.commons_git_repo = commons_git_repo
        self.base_zip_url = base_zip_url
        self.commons_tag = commons_tag
        self.project_path = project_path
        self.framework_ref = framework_ref
        self.installation_type = self.get_installation_type()
        self.mode = get_mode()

        if self.installation_type == InstallationType.NEW.value:
            self.create_new_project()
        elif self.installation_type == InstallationType.UPDATE.value:
            self.update_commons()
        else:
            self.pull_project()

    def get_installation_type(self):
        if self.update:
            return InstallationType.UPDATE.value

        is_new = is_remote_empty(self.projects_git_repo)
        if is_new:
            return InstallationType.NEW.value
        return InstallationType.PULL.value

    def create_new_project(self):
        project_name = get_repo_name_from_url(self.projects_git_repo)
        path_to_project_folder = os.path.join(os.getcwd(), project_name)
        assert not os.path.isdir(
            path_to_project_folder
        ), "The project is already present in this directory"

        if self.framework_ref:
            r = requests.get(self.framework_ref, stream=True)
            z = zipfile.ZipFile(io.BytesIO(r.content))
            latest_tag = f"branch-{self.framework_ref}"

        else:
            path_to_tmp_dir, repo_tags = create_bare_repo(
                self.commons_git_repo, depth=False, bare=True
            )
            tags = sorted(repo_tags.tags, key=lambda t: t.commit.committed_date)
            tags = [tag.name for tag in tags]
            shutil.rmtree(path_to_tmp_dir)

            assert len(tags) >= 1, "No tag exists on solutions-contrib project"

            latest_tag = tags[-1]
            tag_url = self.base_zip_url + latest_tag + ".zip"
            r = requests.get(tag_url, stream=True)
            z = zipfile.ZipFile(io.BytesIO(r.content))

        os.mkdir(path_to_project_folder)
        z.extractall(path_to_project_folder, get_members(z))

        assert os.path.isdir(
            os.path.join(path_to_project_folder, "project")
        ), "No folder project created"

        with open(
            os.path.join(path_to_project_folder, "project", "deps.json"), "w"
        ) as f:
            json.dump({"commons": {"tag": latest_tag}}, f)

        #### Add .gitignore #####
        with open(os.path.join(path_to_project_folder, ".gitignore"), "w") as f:
            f.write(
                "{}\n{}\n{}\n{}\n{}\n".format(
                    "commons", "node_modules", "*.DS_Store", "*__pycache__*", ".venv"
                )
            )

        repo = git.Repo.init(path_to_project_folder)

        repo.git.execute(
            [
                "git",
                "-C",
                path_to_project_folder,
                "remote",
                "add",
                "origin",
                self.projects_git_repo,
            ]
        )

        repo.git.execute(["git", "-C", path_to_project_folder, "branch", "-M", "main"])

        repo.git.execute(["git", "-C", path_to_project_folder, "add", "."])

        repo.git.execute(
            ["git", "-C", path_to_project_folder, "commit", "-m", "initial setup"]
        )

        repo.git.execute(
            ["git", "-C", path_to_project_folder, "push", "-u", "origin", "main"]
        )

        if self.mode == EnvMode.STUDIO.value:
            move_all_files(
                path_to_project_folder,
                os.path.join(os.getcwd(), "project-lib-versioned", "python"),
            )
            shutil.rmtree(path_to_project_folder)

    def update_commons(self):

        path_to_repo = os.path.join(os.getcwd(), self.project_path)
        is_repo_present = is_git_repo(path_to_repo)
        assert is_repo_present, "No projects git repo is present"

        path_to_tmp_dir, repo_tags = create_bare_repo(
            self.commons_git_repo, depth=False, bare=True
        )
        tags = sorted(repo_tags.tags, key=lambda t: t.commit.committed_date)
        tags = [tag.name for tag in tags]
        shutil.rmtree(path_to_tmp_dir)

        assert len(tags) >= 1, "No tag exists on solutions-contrib project"

        if self.commons_tag:
            assert (
                self.commons_tag in tags
            ), "The requested tag is not present in remote"

        requested_tag = self.commons_tag if self.commons_tag else tags[-1]

        tag_url = self.base_zip_url + requested_tag + ".zip"
        r = requests.get(tag_url, stream=True)
        z = zipfile.ZipFile(io.BytesIO(r.content))
        z_ = zipfile.ZipFile(io.BytesIO(r.content))
        relative_path = z.namelist()[0].split("/")[0]

        if os.path.isdir(os.path.join(path_to_repo, "commons")):
            shutil.rmtree(os.path.join(path_to_repo, "commons"))

        z.extractall(path_to_repo, get_members(z, filters=["project"]))

        z_.extractall(path_to_repo, get_members(z_, filters=["commons"]))

        # Extracting infra files

        # Extract and merge package.json file
        with z.open(relative_path + "/project/" + "package.json") as f:
            new_template_package = json.load(f)

        path_to_npm_package = os.path.join(path_to_repo, "project", "package.json")
        with open(path_to_npm_package) as f:
            package_dest = json.load(f)

        merged_package = merge_npm_packages(new_template_package, package_dest)

        os.remove(path_to_npm_package)
        with open(path_to_npm_package, "w") as f:
            json.dump(merged_package, f, indent=4)

        path_to_deps = os.path.join(path_to_repo, "project", "deps.json")

        assert os.path.isfile(path_to_deps), "No dependencies file is found"

        with open(path_to_deps, "r") as f:
            deps = json.load(f)
            deps["commons"]["tag"] = requested_tag

        os.remove(path_to_deps)
        with open(path_to_deps, "w") as f:
            json.dump(deps, f, indent=4)

    def pull_project(self):
        project_name = get_repo_name_from_url(self.projects_git_repo)
        path_to_project_folder = os.path.join(os.getcwd(), project_name)
        assert not os.path.isdir(
            path_to_project_folder
        ), "The project is already present in this directory"

        repo_project = git.Repo.clone_from(
            self.projects_git_repo, to_path=path_to_project_folder
        )

        repo_project.git.execute(["git", "pull"])

        path_to_workspace = os.path.join(os.getcwd(), project_name)
        assert os.path.isdir(path_to_workspace), "Project creation failed"

        path_to_deps = os.path.join(path_to_workspace, "project", "deps.json")

        with open(path_to_deps, "r") as f:
            deps = json.load(f)
            tag = deps["commons"]["tag"]

        tag_url = self.base_zip_url + tag + ".zip"
        r = requests.get(tag_url, stream=True)
        z = zipfile.ZipFile(io.BytesIO(r.content))

        z.extractall(path_to_workspace, get_members(z, filters=["commons"]))

        if self.mode == EnvMode.STUDIO.value:
            move_all_files(
                path_to_workspace,
                os.path.join(os.getcwd(), "project-lib-versioned", "python"),
            )
            shutil.rmtree(path_to_project_folder)


if __name__ == "__main__":
    MODE = get_mode()
    ORG_NAME = "dataiku"
    PROJECT_COMMONS = "solutions-contrib"
    COMMONS_GIT_REPO_SSH = "git@github.com:dataiku/solutions-contrib.git"
    COMMONS_GIT_REPO_HTTPS = "https://github.com/dataiku/solutions-contrib.git"
    BASE_GIT_URL = "https://github.com/"
    BASE_ZIP_URL = get_base_zip_tag_url(BASE_GIT_URL, ORG_NAME, PROJECT_COMMONS)

    COMMONS_GIT_REPO = (
        COMMONS_GIT_REPO_SSH if MODE == EnvMode.LOCAL.value else COMMONS_GIT_REPO_HTTPS
    )

    parser = argparse.ArgumentParser(
        description="Initialize or update a business solution web app project"
    )

    parser.add_argument(
        "-r",
        "--remote",
        help="The project remote url",
    )

    parser.add_argument(
        "-ref",
        "--reference",
        help="The git reference to load the starter template from",
    )

    parser.add_argument(
        "-p",
        "--path",
        help="The path to an existing project",
    )

    parser.add_argument(
        "-u",
        "--update",
        help="Updates the commons of the project if it exists locally",
        action="store_true",
    )

    parser.add_argument("-t", "--tag", help="The commons tag if update")

    args = parser.parse_args()

    if args.update and args.path is None:
        parser.error("specify a --path to the existing project folder for updates")

    is_update = args.update
    project_remote_url = args.remote
    framework_ref = args.reference
    commons_tag = args.tag
    project_path = args.path

    ##### TEST SCRIPT #######

    ProjectInstance(
        is_update,
        project_remote_url,
        COMMONS_GIT_REPO,
        BASE_ZIP_URL,
        commons_tag,
        project_path,
        framework_ref,
    )
