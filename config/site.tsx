import { BookOpenText, HomeIcon, Users } from 'lucide-react'

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "MyAnimeHub",
  description:
    "Anime database and community for anime fans. Discover, share, and discuss anime. Built with Radix UI and Next.js 13.",
  mainNav: [
    {
      icon: <HomeIcon size={20} />,
      title: "Anime",
      href: "/",
      alternativePath: "/anime",
      disabled: false,
    },
    {
      icon: <BookOpenText size={20} />,
      title: "Manga",
      href: "/manga",
    },
    {
      icon: <Users size={20} />,
      title: "Comunidade",
      href: "/community",
    },
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
}
