#!/bin/bash

# This script can be used to build and pack a library and install it in a target directory project. It is expected to work with
# beta versions of the library where the package.json version is of the form x.x.x-beta.x. It will increment the beta version during the process
# so that the target library gets an updated version
# Usage:  scripts/buildPackAndInstall.sh packages/rainbowkit-wallet-adapter <external target directory>#
SOURCE_DIR=${1:-.}
TARGET_DIR=$2

cd $SOURCE_DIR;
ABS_SOURCE_DIR=$(pwd)

if [ -z "$TARGET_DIR" ]; then
    echo "Please provide a target directory as an argument."
    exit 1
fi

VERSION=$(jq -r .version package.json)
BETA_VERSION=${VERSION##*.}
PREFIX=${VERSION%-*}
BETA_VERSION=$((BETA_VERSION+1))
NEW_VERSION="$PREFIX-beta.$BETA_VERSION"
jq --arg v $NEW_VERSION '.version = $v' package.json > temp.json && mv temp.json package.json
pnpm run build
TARBALL=$(pnpm pack)
cd $TARGET_DIR;
echo "yarn add $ABS_SOURCE_DIR/$TARBALL"
yarn add "$ABS_SOURCE_DIR/$TARBALL";
cd -;