"use client"
import { createObserver } from "@/rxjs/rxjs-intersection-observer"
import { doddle, seq } from "doddle"
import { debounceTime, filter } from "rxjs"
interface HeadingEntry {
    element: HTMLElement
    id: string
}

let last_position = 0
export class HeadingObserver {
    _stopped = false
    private _observer = doddle(() => {
        const obs = createObserver({
            rootMargin: "-25% 0px -35% 0px",
            threshold: [0.1]
        })
        const e2 = obs.events
            .pipe(
                filter(x => x.isIntersecting),
                filter(x => !this._stopped),
                filter(x => x.intersectionRatio > 0.1),
                debounceTime(75)
            )
            .subscribe(x => {
                last_position = window.scrollY
                return this._handler?.(
                    this._lastSections?.get(x.target.getAttribute("data-heading-id")!)
                )
            })
        return {
            observer: obs.observer,
            events: e2
        }
    })
    constructor() {}
    private _lastSections?: Map<string, HeadingEntry>
    private _handler?: (heading: HeadingEntry | undefined) => void
    _lastChange = 0
    watch(handler: (heading: HeadingEntry | undefined) => void) {
        this._handler = handler
        const currentHeadings = this._getSectionEntries().pull()
        let shouldHeadingsChange = false
        if (!this._lastSections) {
            shouldHeadingsChange = true
        } else {
            const areEqual = seq(currentHeadings)
                .setEquals(this._lastSections, x => x[1].element)
                .pull()
            if (!areEqual) {
                shouldHeadingsChange = true
            }
        }
        const observer = this._observer.pull().observer
        if (shouldHeadingsChange && this._lastSections) {
            this._lastSections.forEach(x => observer.unobserve(x.element))
        }
        this._lastSections = currentHeadings
        if (shouldHeadingsChange) {
            this._lastSections.forEach(x => observer.observe(x.element))
        }
    }

    stop(value: boolean) {
        this._stopped = value
    }

    _getSectionEntries() {
        const mdSectionTags = seq
            .range(2, 7)
            .map(x => `[data-heading-id]`)
            .toArray()
            .map(x => x.join(", "))
        const sections = document.querySelectorAll(mdSectionTags.pull())
        return seq(sections)
            .map((section, i) => {
                return {
                    element: section as HTMLElement,
                    order: i,
                    id: section.getAttribute("data-heading-id")!
                }
            })
            .toMap(x => [x.id, x])
    }
}

export const observer = new HeadingObserver()
