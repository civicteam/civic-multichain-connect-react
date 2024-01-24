#!/bin/bash

# Base URL for the S3 bucket
base_url="https://civic-evm-config.s3.amazonaws.com"

# Destination directory where icons will be stored, passed as an argument
dest_dir=${1:-"./"}  # Default to current directory if no argument is given

# Ensure destination directory exists
mkdir -p "$dest_dir"

# Download the chainIconMapping.json file
curl "${base_url}/chainIconMapping.json" -o ./src/chainIconMapping.json
curl "${base_url}/evmNetworks.json" -o ./src/evmNetworks.json

# Parse the JSON file and extract SVG filenames
icons=$(jq -r '.[] | .icon + ".svg"' ./src/chainIconMapping.json)

# Download each SVG file only if it does not exist
for icon in $icons; do
    # Check if the file already exists
    if [ ! -f "${dest_dir}/${icon}" ]; then
        # File does not exist, download it
        curl "${base_url}/${icon}" -o "${dest_dir}/${icon}"
    else
        echo "File ${icon} already exists, skipping download."
    fi
done

# Download the solana icon if it does not exist
if [ ! -f "${dest_dir}/solana.svg" ]; then
    # File does not exist, download it
    curl "${base_url}/solana.svg" -o "${dest_dir}/solana.svg"
else
    echo "File solana already exists, skipping download."
fi