#!/bin/bash 


source_zip="https://github.com/dataiku/solutions-contrib/archive/refs/heads/web-infra.zip"

# get project name and remote git url 
read -p "Enter your project name:"  projectname
read -p "Enter your remote git url for this project:" remote_git_url




# download zip 
wget "$source_zip" -O "$projectname-root.zip"

# get folder name in zip file
source_folder_name=$(unzip -Z -1 "$projectname-root.zip" | head -1)

# unzip and rename project
unzip ./"$projectname-root.zip" && \
rm ./"$projectname-root.zip" && \
mv ./"$source_folder_name" ./"$projectname-workspace" && \
mv ./"$projectname-workspace/project"  ./"$projectname-workspace/${projectname}"

# Add commons to .gitignore
echo "\ncommons" >> ./"$projectname-workspace/.gitignore"

# Attach project to new remote
cd ./"$projectname-workspace/" && \
git init && \
git add . && \
git commit -m "initial setup" && \
git branch -M main && \
git remote add origin "$remote_git_url" && \
git push -u origin main

