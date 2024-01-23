#!/bin/bash

# Base URL for the S3 bucket
base_url="https://civic-evm-config.s3.amazonaws.com"

# Destination directory where icons will be stored, passed as an argument
dest_dir=${1:-"./"}  # Default to current directory if no argument is given

# Ensure destination directory exists
mkdir -p "$dest_dir"

# Download the chainIconMapping.json file
curl "${base_url}/chainIconMapping.json" -o chainIconMapping.json

# Parse the JSON file and extract SVG filenames
icons=$(jq -r '.[] | .icon + ".svg"' chainIconMapping.json)

# Download each SVG file
for icon in $icons; do
    curl "${base_url}/${icon}" -o "${dest_dir}/${icon}"
done
