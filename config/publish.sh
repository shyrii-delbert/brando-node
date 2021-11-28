#!/bin/bash
source .env

# Copy files
mkdir public_temp
cp ./config/scf_bootstrap ./public_temp
cp -r ./dist ./public_temp/dist

# Zip it
pushd ./public_temp
zip -q -r ../pub.zip ./*
popd

# Publish
node ./config/publish.js

# Do clean
rm -rf ./public_temp
rm pub.zip
