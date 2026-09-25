"use client"
export default function ErrorPage({
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <section className="mx-auto max-w-content px-4 py-24">
      <h1 className="font-display text-2xl">Unable to load this page</h1>
      <p className="my-4 text-muted-foreground">
        Please try again in a moment.
      </p>
      <button className="border border-border px-4 py-2" onClick={reset}>
        Try again
      </button>
    </section>
  )
}
