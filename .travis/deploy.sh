#!/bin/bash
set -e

REPO=`git config remote.origin.url`
SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}
SHA=`git rev-parse --verify HEAD`

echo "Clone gh-pages to build"

git clone $REPO build
pushd build
git checkout $TARGET_BRANCH || git checkout --orphan $TARGET_BRANCH
popd

echo "Clean build"
rm -rf build/* || exit 0
ls -l build

echo "Run build"
npm run build

echo "Commit"
cd build
git config user.name "Travis CI"
git config user.email "$COMMIT_AUTHOR_EMAIL"

git add --all .
git commit -m ":up: Deploy ${SHA}"

echo "Set up git"
ENCRYPTED_KEY_VAR="encrypted_${ENCRYPTION_LABEL}_key"
ENCRYPTED_IV_VAR="encrypted_${ENCRYPTION_LABEL}_iv"
ENCRYPTED_KEY=${!ENCRYPTED_KEY_VAR}
ENCRYPTED_IV=${!ENCRYPTED_IV_VAR}

openssl aes-256-cbc -K $ENCRYPTED_KEY -iv $ENCRYPTED_IV -in ../.travis/deploy_key.enc -out deploy_key -d
chmod 600 deploy_key

eval `ssh-agent -s`
ssh-add deploy_key

echo "Push changes"
git push $SSH_REPO $TARGET_BRANCH
