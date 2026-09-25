import { FC } from "react"
import Link from "next/link"

import type { CharacterEntry, StaffEntry } from "@/config/services/types"

import { CategoryLabel } from "../ui/category-label"
import { Image } from "../custom-image"

interface PersonTileProps {
  href: string
  imageUrl: string
  name: string
  role: string
}

const PersonTile: FC<PersonTileProps> = ({ href, imageUrl, name, role }) => (
  <Link
    href={href}
    target="_blank"
    className="group flex w-28 shrink-0 flex-col gap-2 sm:w-32"
  >
    <div className="relative aspect-[3/4] w-full overflow-hidden border border-border bg-card transition-[filter] duration-200 ease-out group-hover:brightness-110">
      <Image
        src={imageUrl}
        alt={name}
        width={128}
        height={171}
        className="absolute inset-0 size-full object-cover"
      />
    </div>
    <div>
      <p className="line-clamp-2 text-xs font-medium leading-snug text-foreground">
        {name}
      </p>
      <CategoryLabel className="mt-0.5">{role}</CategoryLabel>
    </div>
  </Link>
)

interface CharactersRailProps {
  characters: CharacterEntry[]
}

export const CharactersRail: FC<CharactersRailProps> = ({ characters }) => {
  if (!characters?.length) return null

  return (
    <div className="flex w-full flex-wrap gap-x-4 gap-y-6">
      {characters.slice(0, 12).map(({ character, role, voice_actors }) => {
        const japaneseVA = voice_actors?.find(
          (va) => va.language === "Japanese"
        )

        return (
          <PersonTile
            key={character.mal_id}
            href={character.url}
            imageUrl={character.images.jpg.image_url}
            name={character.name}
            role={japaneseVA ? `${role} · ${japaneseVA.person.name}` : role}
          />
        )
      })}
    </div>
  )
}

interface StaffRailProps {
  staff: StaffEntry[]
}

export const StaffRail: FC<StaffRailProps> = ({ staff }) => {
  if (!staff?.length) return null

  return (
    <div className="flex w-full flex-wrap gap-x-4 gap-y-6">
      {staff.slice(0, 12).map(({ person, positions }) => (
        <PersonTile
          key={person.mal_id}
          href={person.url}
          imageUrl={person.images.jpg.image_url}
          name={person.name}
          role={positions.join(", ")}
        />
      ))}
    </div>
  )
}
