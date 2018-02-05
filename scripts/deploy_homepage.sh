#!/bin/bash

REPO_HOME="`dirname $(readlink -e \"$0\")`/.."
source $REPO_HOME/configs/deploy.config

# check npm build finished
echo '- Building homepage...'

if [ ! -d "$REPO_HOME/Homepage/dist" ]; then
    (cd $REPO_HOME/Homepage \ 
    npm install && npm run build)
fi

# Deploy to web root
echo '- Deploying...'

rm -rf "$HTTP_ROOT/*"
cp -r $REPO_HOME/Homepage/dist/* $HTTP_ROOT


