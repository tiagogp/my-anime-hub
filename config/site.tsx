import { BookOpenText, CalendarDays, HomeIcon } from 'lucide-react'

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "MyAnimeHub",
  description:
    "Anime database and community for anime fans. Discover, share, and discuss anime. Built with Radix UI and Next.js 13.",
  mainNav: [
    {
      icon: <HomeIcon size={20} />,
      title: "Anime",
      href: "/anime",
      alternativePath: "/",
      disabled: false,
    },
    {
      icon: <BookOpenText size={20} />,
      title: "Manga",
      href: "/manga",
    },
    {
      icon: <CalendarDays size={20} />,
      title: "Schedule",
      href: "/schedule",
    },
  ],
  links: {
    twitter: "https://twitter.com/tiagogp_exe",
    github: "https://github.com/tiagogp-exe",
    docs: "https://ui.shadcn.com",
  },
}
