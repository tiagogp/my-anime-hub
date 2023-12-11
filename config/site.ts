export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "OtakuHub",
  description:
    "Anime database and community for anime fans. Discover, share, and discuss anime. Built with Radix UI and Next.js 13.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Animes Dublado",
      href: "/dub",
    },
    {
      title: "Animes",
      href: "/animes",
    },
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
}
