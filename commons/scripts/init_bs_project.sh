#!/bin/bash 

function usage() {
    cat <<USAGE

    Usage: $0 [-n --project-name] [-r --remote-url] [-u --update]

    Options:
        -n : The name of the project to create or update
        -r : The remote git url to attach the project to
        -u : to update existing project (commons)
USAGE
    exit 1
}

UPDATE="false"
RemoteUrl=
ProjectName=
source_zip="https://github.com/dataiku/solutions-contrib/archive/refs/heads/web-infra.zip"

while getopts n:r:uh flag 
do
    case "${flag}" in
                n) ProjectName=${OPTARG}
                        ;;
                r) RemoteUrl=${OPTARG}
                         ;;
                u) UPDATE="true";;
                h) usage;;
                *) echo "Invalid option: -$flag" ;;
        esac
done


if [ ! -n "$ProjectName" ]; then
    echo 'Option -n (project name) is missing' 
    exit 1
fi

if [ ! -n "$RemoteUrl" ]; then
    echo 'Option -r (remote url) is missing' 
    exit 1
fi

if [[ "$UPDATE" == "false" ]]; then

    # TODO :  Add check to see if project name already exists

    wget "$source_zip" -O "$ProjectName.zip"
    source_folder_name=$(unzip -Z -1 "$ProjectName.zip" | head -1)
    mkdir ./"$ProjectName"
    unzip ./"$ProjectName.zip" -d ./"$ProjectName"
    cd ./"$ProjectName" && \
    mv -v ./"$source_folder_name"/* . && \
    rm -rf ./"$source_folder_name" && \
    cd ..
    rm ./"$ProjectName.zip"
    mv ./"$ProjectName/project"  ./"$ProjectName/$ProjectName"

    # TODO : Add moving package.json

    cd ./"$ProjectName/$ProjectName" && \
    git init && \
    git add . && \
    git commit -m "initial setup" && \
    git branch -M main && \
    git remote add origin "$RemoteUrl" && \
    git push -u origin main

fi

# source_zip="https://github.com/dataiku/solutions-contrib/archive/refs/heads/web-infra.zip"


# # get project name and remote git url 
# read -p "Enter your project name:"  projectname
# read -p "Enter your remote git url for this project:" remote_git_url




# # download zip 
# wget "$source_zip" -O "$projectname-root.zip"

# # get folder name in zip file
# source_folder_name=$(unzip -Z -1 "$projectname-root.zip" | head -1)

# # unzip and rename project
# unzip ./"$projectname-root.zip" && \
# rm ./"$projectname-root.zip" && \
# mv ./"$source_folder_name" ./"$projectname-workspace" && \
# mv ./"$projectname-workspace/project"  ./"$projectname-workspace/${projectname}"

# # Add commons to .gitignore
# echo "\ncommons" >> ./"$projectname-workspace/.gitignore"

# # Attach project to new remote
# cd ./"$projectname-workspace/" && \
# git init && \
# git add . && \
# git commit -m "initial setup" && \
# git branch -M main && \
# git remote add origin "$remote_git_url" && \
# git push -u origin main

