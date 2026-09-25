import { redirect } from "next/navigation"

export default function CommunityPage({
  searchParams,
}: {
  searchParams: { search?: string }
}) {
  redirect(
    searchParams.search
      ? `/anime?search=${encodeURIComponent(searchParams.search)}`
      : "/anime"
  )
}
