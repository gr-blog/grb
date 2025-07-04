Let's start with the following structure:

import {rootLogger} from "./logging"

(The logger is winston but don't do the setup)

Accept env args (not from file; will probably be passed via k8s).

1. DISCORD_TOKEN (string of the right char class)
2. CHANNEL_DATA_ID (string -- digits)
3. CHANNEL_ANNOUNCE_ID (string -- digits)
4. GRB_API (string -- URL)

Define zod schemas:

```
export const Token = z.string().regexp(...) // insert char class
export const ChannelId = z.string().digits()
```

Define zod validation and transform into an object with the shape:

```
export interface DiscordAnnouncerOptions {
    token: string //Token
    channelId: {
        data: string // ChannelId
        announce: string //ChannelId
    }
}
```

Define function craeteDiscordClient accepting the token:

1. Initializes client
2. Sends a test request
3. Returns the client

Define DiscordAnnouncer class. Receives:

```
export interface DiscordAnnouncerOptions {
    client: REST
    announceChannelId: string
}
```

Has method `announce` that receives `AnnouncePost`.

Define:

```
export interface AnnouncePost {
    url: string
    published: Dayjs
    title: string
    description: string
    cover: string
}
```

dummy Implementation sends the object as a JSON string (indented) via content to the channel.
