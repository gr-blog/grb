"use client"

import { firaCode, firaSans } from "@/app/fonts"
import { useState } from "react"

import Image from "next/image"
import Cookies from "universal-cookie"
import { NewsletterSub } from "./helpers"
import "./newsletter.scss"
export const Subscription = new NewsletterSub(new Cookies())
export interface NewsletterProps {
    isAlreadyJoined: boolean
}
export default function Newsletter(props: NewsletterProps) {
    const [email, setEmail] = useState("")
    const [isJoined, setIsSubscribed] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await fetch("/api/newsletter/join", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        })
        console.log(await res.json())
        if (res.ok) {
            setIsSubscribed(true)
            Subscription.isSubscribed = true
        }
    }

    const heading = <h4 className="newsletter__heading">Newsletter</h4>

    function wrap(extraClass: string, kids: React.ReactNode) {
        return (
            <section className={`newsletter`}>
                <div className="newsletter__contents">
                    {heading}
                    {kids}
                </div>
            </section>
        )
    }
    if (props.isAlreadyJoined) {
        return null
    }
    if (isJoined) {
        return wrap(
            "newsletter--joined",
            <div className="newsletter--joined">
                <Image
                    className="newsletter--joined__image"
                    src="/subscribed.png"
                    alt="Newsletter joined"
                    width={64}
                    height={64}
                />
                <div className="newsletter--joined__text">Subscribed!</div>
            </div>
        )
    }

    return wrap(
        "",
        <>
            <p className="newsletter__text">Liked the post? Subscribe to the weekly newsletter!</p>
            <form className="newsletter__form" onSubmit={handleSubmit}>
                <input
                    name="email"
                    required
                    type="email"
                    value={email}
                    placeholder="your@email.com"
                    onChange={e => setEmail(e.target.value)}
                    className={`newsletter__email ${firaCode.className}`}
                />
                <button type="submit" className={`newsletter__submit ${firaSans.className}`}>
                    <Image src="/subscribe.png" alt="Subscribe icon" width={24} height={24} />
                </button>
            </form>
        </>
    )
}
