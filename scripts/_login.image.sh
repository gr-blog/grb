#!/bin/sh
set -eux
printf '%s' "$GITHUB_TOKEN" |
    docker login ghcr.io \
        --username "$GITHUB_ACTOR" \
        --password-stdin
