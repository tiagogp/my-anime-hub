import { BookOpenText, HomeIcon, Users } from 'lucide-react'

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "MyAnimeHub",
  description:
    "Anime database and community for anime fans. Discover, share, and discuss anime. Built with Radix UI and Next.js 13.",
  mainNav: [
    {
      icon: <HomeIcon size={20} />,
      title: "Home",
      href: "/",
      disabled: false,
    },
    {
      icon: <Users size={20} />,
      title: "Comunidade",
      href: "/community",
    },
    {
      icon: <BookOpenText size={20} />,
      title: "Manga",
      href: "/manga",
    },
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
}
