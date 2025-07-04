Define

```
export interface DiscordDbOptions {
    client: REST
    hostnames: string[]
    dataChannelId: string
}
```

Define class `DiscordDb`, receives above type.

This class stores and reads messages from discord as a persistence mechanism.

Each such message begins with a `HEADER` string (hardcoded) and is in the form:

```
HEADER,HOST,SLUG,yyyy-MM-dd
```

And this has the object form

```
export interface PostEntry {
    host: string
    slug: string
    date: Dayjs
}
```

Define methods `_decode` and `_encode` to convert to/from this format. `_decode` also checks that
the message's sender is the bot.

Define method `readLast(count)`. Retrieves the last `count` messages from `options.dataChannel`, filtering out the ones that begin with HEADER and parsing them via `_decode`.

Result is an array of post entry objects which is returned.

Define analogous method `append` that takes a `PostEntry` object, uses `_encode`, posts the text as a message to the data channel.
