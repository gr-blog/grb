#!/bin/sh
set -eux

script_dir=$(cd "$(dirname "$0")" && pwd)
chmod +x "$script_dir"/_*.manifest.sh
"$script_dir/_install.manifest.sh"
"$script_dir/_install.git.sh"

CI_PROJECT_URL="${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}"
CI_JOB_ID="${GITHUB_RUN_ID}"
CI_JOB_URL="${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}"
SHORT_SHA="$(printf '%s' "$GITHUB_SHA" | cut -c1-7)"
for var in SERVICE SHORT_SHA; do
    eval "value=\${$var}"
    if [ -z "$value" ]; then
        echo "Error: Environment variable $var is not set." >&2
        exit 1
    fi
done

# ---------- 2. Build the manifests with Yarn workspaces -----------------------

corepack enable
yarn set version stable

script_dir=$(cd "$(dirname "$0")" && pwd)
chmod +x "$script_dir/_install.manifest.sh"
"$script_dir/_install.manifest.sh"
yarn workspaces focus k8s
export IMAGE_SUFFIX="$SHORT_SHA"
yarn workspace k8s run manifest

echo "Manifest written to packages/k8s/.k8ts/*.yaml (likely)"

# ---------- 3. Compute image‑naming & tagging rules ---------------------------

REGISTRY="ghcr.io"
IMAGE_OWNER=$(printf '%s' "$GITHUB_REPOSITORY_OWNER" | tr '[:upper:]' '[:lower:]')

IMAGE_NAME="$REGISTRY/$IMAGE_OWNER/grb-k8s-$SERVICE"

# Push two tags: the git short‑sha and "latest"
IMAGE_TAGS="$SHORT_SHA latest"

manifest_base="packages/k8s/.k8ts"
mkdir -p "$manifest_base/.$SERVICE"
cp "$manifest_base/$SERVICE.yaml" "$manifest_base/.$SERVICE/"
MANIFEST_PATH="$manifest_base/.$SERVICE"

IMAGE_TITLE="GRB‑k8s $SERVICE Manifests"

# ---------- 4. Push the manifest list with ORAS ------------------------------

for tag in $IMAGE_TAGS; do
    oras push \
        --artifact-type application/vnd.oci.image.manifest.v1+json \
        --annotation "org.opencontainers.image.url=$CI_PROJECT_URL" \
        --annotation "org.opencontainers.image.title=$IMAGE_TITLE" \
        --annotation "com.github.actions.run.id=$CI_JOB_ID" \
        --annotation "com.github.actions.run.url=$CI_JOB_URL" \
        "$IMAGE_NAME:$tag" \
        "$MANIFEST_PATH"
done
