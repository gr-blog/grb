#!/bin/sh
set -eux
scripts="$(cd "$(dirname "$0")" && pwd)"
chmod +x "$scripts/_login.image.sh"
"$scripts/_login.image.sh"
SHORT_SHA="$(printf '%s' "$GITHUB_SHA" | cut -c1-7)"

if [ -z "${SERVICE:-}" ]; then
    echo "Error: SERVICE variable is not set."
    exit 1
fi

if [ -z "${TARGET:-}" ]; then
    export TARGET="$SERVICE"
fi
grb_image() {
    echo "name=registry.host/grb/grb:$1"
}
IMAGE_NAME="registry.host/grb/grb:$SERVICE"
export IMAGE_CANON="$IMAGE_NAME"
export IMAGE_COMMIT="$IMAGE_NAME-$SHORT_SHA"
if [ -f /laniakea/build.sh ]; then
    sh /laniakea/build.sh \
        --opt build-arg:SERVICE="$SERVICE" \
        --opt target="$TARGET"
else
    docker buildx build \
        --file Dockerfile \
        --target "$TARGET" \
        --build-arg SERVICE="$SERVICE" \
        --tag "$IMAGE_NAME" \
        --load \
        .
fi
