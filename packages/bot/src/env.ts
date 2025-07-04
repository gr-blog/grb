import z from "zod"
export const Token = z.string().regex(/^[MN][A-Za-z.\d_-]+$/, {
    message:
        "Invalid Discord token format. Must start with M or N and contain alphanumeric characters, dots, or dashes."
})
export const ChannelId = z.string().regex(/^\d+$/, {
    message: "Channel ID must be a numeric snowflake string"
})

export const Url = z.string().url({
    message: "Invalid URL format"
})

export const EnvOptions = z.object({
    TOKEN_DISCORD: Token,
    MOCK_DISCORD: z
        .enum(["true", "false"])
        .default("false")
        .transform(v => v === "true"),
    CHANNEL_ID_DEV_DATA: ChannelId,
    CHANNEL_ID_XYZ_DATA: ChannelId,
    CHANNEL_ID_ANNOUNCE: ChannelId,
    URL_GRB_API: Url,
    DB_ENTRY_HEADER: z.string(),
    ANNOUNCE_CUTOFF: z.string()
})

export type EnvOptions = z.output<typeof EnvOptions>
export const APP_OPTIONS = Symbol("APP_OPTIONS")
export default EnvOptions
