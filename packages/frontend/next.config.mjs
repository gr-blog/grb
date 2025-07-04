import createMDX from "@next/mdx"

const remotePatterns = ["localhost", "host.docker.internal", "api", "api.grb.local"].map(
    hostname => ({
        protocol: "http",
        hostname,
        port: "3000",
        pathname: "**"
    })
)

remotePatterns.push({
    hostname: "api.grb.svc.cluster.local",
    protocol: "http",
    pathname: "images/**"
})

/** @type {import("next").NextConfig} */
const nextConfig = {
    output: "standalone",
    pageExtensions: ["tsx", "mdx", "ts", "jsx", "js"],
    env: {
        ROARR_LOG: "true"
    },
    images: {
        remotePatterns: remotePatterns
    },
    sassOptions: {
        loadPaths: ["node_modules"],
        silenceDeprecations: ["mixed-decls"]
    }
    /* config options here */
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
