#!/bin/sh
if command -v apk >/dev/null 2>&1; then
    apk add --no-cache git
elif command -v apt-get >/dev/null 2>&1; then
    apt-get update
    apt-get install -y git
else
    echo "Neither apk nor apt-get found. Cannot install git."
    exit 1
fi
