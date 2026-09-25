import { BookOpenText, CalendarDays, HomeIcon } from "lucide-react"

import { SITE_DESCRIPTION, SITE_NAME } from "./seo"

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
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
