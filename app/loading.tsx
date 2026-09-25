import { GalleryGrid } from "@/components/ui/gallery-grid"

export default function Loading() {
  return (
    <section
      aria-label="Loading catalog"
      role="status"
      className="mx-auto w-full max-w-content px-4 py-24 sm:px-6"
    >
      <p className="mb-8 font-mono text-sm text-muted-foreground">Loading…</p>
      <div aria-hidden="true">
        <GalleryGrid>
          {Array.from({ length: 10 }, (_, item) => (
            <div
              key={item}
              className="h-72 border border-border bg-card motion-safe:animate-pulse"
            />
          ))}
        </GalleryGrid>
      </div>
    </section>
  )
}
