import Link from "next/link"

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <section className="mx-auto w-full max-w-content px-4 py-24 sm:px-6">
      <p className="mb-4 font-mono text-xs text-muted-foreground">404</p>
      <h1 className="font-display text-4xl">Page not found</h1>
      <p className="my-6 text-muted-foreground">
        This page or title is unavailable. Explore the catalog to find something
        else.
      </p>
      <Link
        href="/"
        className="inline-flex border border-border px-4 py-3 text-sm transition-colors hover:bg-foreground hover:text-background"
      >
        Back to home
      </Link>
    </section>
  )
}
