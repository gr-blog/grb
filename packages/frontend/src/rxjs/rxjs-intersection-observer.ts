"use client"
import { seq } from "doddle"
import { Subject } from "rxjs"

export function createObserver(options?: IntersectionObserverInit) {
    const subject = new Subject<IntersectionObserverEntry>()
    const observer = new IntersectionObserver(entries => {
        for (const x of seq(entries).orderBy(x => x.time, true)) {
            subject.next(x)
        }
    }, options)
    return {
        observer,
        events: subject
    }
}
