#!/bin/sh
set -eux pipefail
corepack enable
yarn set version stable
script_dir="$(dirname "$(readlink -f "$0")")"

cd "$script_dir"

yarn workspaces focus k8s
export IMAGE_SUFFIX="$SHORT_SHA"

yarn workspace k8s run manifest
echo "Manifest written to /packages/k8s/.k8ts/*.yaml probably"
export IMAGE_NAME="registry.host/grb/grb"
base_tag="k8s-$SERVICE"
export IMAGE_TAGS="$base_tag,$base_tag-$SHORT_SHA"
manifest_base="packages/k8s/.k8ts"
mkdir -p "$manifest_base/.$SERVICE"
cp "$manifest_base/$SERVICE.yaml" "$manifest_base/.$SERVICE/"
export MANIFEST_PATH="$manifest_base/.$SERVICE"
export IMAGE_TITLE="GRB $SERVICE Manifests"
sh /laniakea/push.sh
