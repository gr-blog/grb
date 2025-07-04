import socialUrls from "@/social-urls"
import FooterLink from "./footer-link"
import "./footer.scss"

export default function GlobalFooter() {
    const links = [
        <FooterLink text="email" href={`mailto:${socialUrls.email}`} name="contact" me={true} />,
        <FooterLink
            text="linkedin"
            href={socialUrls.linkedIn}
            name="linkedin"
            me={true}
            openInNewTab={true}
        />,
        <FooterLink text="home" href="/" name="home" />,
        <FooterLink
            text="github"
            href="https://github.com/GregRos"
            name="github"
            me={true}
            openInNewTab={true}
        />,
        <FooterLink
            text="bluesky"
            href={socialUrls.bluesky}
            name="bluesky"
            me={true}
            openInNewTab={true}
        />
    ].map((x, i) => <li key={i}>{x}</li>)

    return (
        <div className="footer__box">
            <footer className="footer">
                <nav className="footer__sitemap">
                    <ul>{links}</ul>
                </nav>
                <div className="footer__vanity">GregRos</div>
                <aside className="footer__made">
                    made with <span className="footer__made__heart">💖</span> using Next.js + NestJS
                </aside>
            </footer>
        </div>
    )
}
