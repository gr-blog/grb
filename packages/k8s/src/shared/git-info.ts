const imageSuffix = process.env.IMAGE_SUFFIX
if (!imageSuffix) {
    throw new Error("IMAGE_SUFFIX env var is not set")
}

export const IMAGE_TAG = `${process.env.IMAGE_SUFFIX}`
