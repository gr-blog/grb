import dayjs from "dayjs"

export default function getStartTime() {
    const now = dayjs()
    const uptime = process.uptime()
    const startTime = now.subtract(uptime, "seconds")
    return startTime
}
