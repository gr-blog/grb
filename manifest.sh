#!/usr/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# manifest.sh — GitHub Actions edition (image‑name & tag update)
# -----------------------------------------------------------------------------
# * Originally written for self‑hosted GitLab; this version adapts the script
#   to GitHub Actions environment variables and registry layout.
# * Assumes the workflow job sets SERVICE and SHORT_SHA (see containers.yml).
# * **2025‑07‑04 change:**
#     • Image name must now follow **grb‑k8s‑$SERVICE**
#     • Tags pushed are **latest** and **$SHORT_SHA**
# -----------------------------------------------------------------------------

# ---------- 1. Derive GitHub‑equivalent CI metadata ---------------------------

# Full repository URL (e.g. https://github.com/owner/repo)
CI_PROJECT_URL="${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}"

# Link to the running workflow execution (used in annotations)
CI_JOB_ID="${GITHUB_RUN_ID}"
CI_JOB_URL="${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}"

# Required variables check -----------------------------------------------------
for var in SERVICE SHORT_SHA; do
    if [ -z "${!var:-}" ]; then
        echo "Error: Environment variable $var is not set." >&2
        exit 1
    fi
done

# ---------- 2. Build the manifests with Yarn workspaces -----------------------

corepack enable
yarn set version stable

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$script_dir"

yarn workspaces focus k8s
export IMAGE_SUFFIX="$SHORT_SHA"
yarn workspace k8s run manifest

echo "Manifest written to packages/k8s/.k8ts/*.yaml (likely)"

# ---------- 3. Compute image‑naming & tagging rules ---------------------------

REGISTRY="ghcr.io"
IMAGE_OWNER="${GITHUB_REPOSITORY_OWNER,,}" # lower‑case owner for GHCR

# Registry path mapping: ghcr.io/<owner>/grb-k8s-<service>
IMAGE_NAME="$REGISTRY/$IMAGE_OWNER/grb-k8s-$SERVICE"

# Push two tags: the git short‑sha and "latest"
IMAGE_TAGS="$SHORT_SHA,latest"

# Stash manifest yaml under a per‑service directory so we can push it as an OCI artifact
manifest_base="packages/k8s/.k8ts"
mkdir -p "$manifest_base/.$SERVICE"
cp "$manifest_base/$SERVICE.yaml" "$manifest_base/.$SERVICE/"
MANIFEST_PATH="$manifest_base/.$SERVICE"

IMAGE_TITLE="GRB‑k8s $SERVICE Manifests"

# ---------- 4. Push the manifest list with ORAS ------------------------------

oras push \
    --artifact-type application/vnd.oci.image.manifest.v1+json \
    --annotation "org.opencontainers.image.url=$CI_PROJECT_URL" \
    --annotation "org.opencontainers.image.title=$IMAGE_TITLE" \
    --annotation "com.github.actions.run.id=$CI_JOB_ID" \
    --annotation "com.github.actions.run.url=$CI_JOB_URL" \
    "$IMAGE_NAME:$IMAGE_TAGS" \
    "$MANIFEST_PATH"
