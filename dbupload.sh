#!/bin/bash

# Replace "/path/to/config" with the path to your Perkeep configuration file
PERKEEP_CONFIG="/path/to/config"

# Replace "data.json" with the name of your JSON file
JSON_FILE="data.json"

# Start Perkeep server
perkeepd -config="$PERKEEP_CONFIG" &

# Wait for the server to start (adjust this sleep duration as needed)
sleep 5

# Upload JSON file to Perkeep
camput blob -in="$JSON_FILE" -camliconfig="$PERKEEP_CONFIG"

# Stop Perkeep server (optional, adjust as needed)
killall perkeepd

