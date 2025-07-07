#!/bin/sh
set -eux

# Create or reuse a builder that uses the docker-container driver
docker buildx create --name ci-builder --driver docker-container --use 2>/dev/null ||
    docker buildx use ci-builder

docker buildx inspect --bootstrap
printf '%s' "$GITHUB_TOKEN" |
    docker login ghcr.io \
        --username "$GITHUB_ACTOR" \
        --password-stdin
