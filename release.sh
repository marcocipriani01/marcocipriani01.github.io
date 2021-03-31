#!/bin/bash
cd "$(dirname "$0")"
echo -e "========= marcocipriani01.github.io website builder ========="

echo -e "******** Production build ********"
JEKYLL_ENV=production bundle exec jekyll build -d "DeployedWebsiteHTML"

echo -e "******** Git repo configuration ********"
git config --global credential.helper 'cache --timeout=3600' 2> /dev/null
git config --global credential.helper cache 2> /dev/null
read -p "Message: " msg
git add -A
git commit -a -m "$msg"

echo -e "******** Pushing sources to GitHub ********"
git push origin master
cd "DeployedWebsiteHTML/"
git add -A
git commit -a -m "$msg"
echo -e "******** Pushing built website to GitHub Pages ********"
git push origin master
cd ..
echo -e "******** Done ********\n"