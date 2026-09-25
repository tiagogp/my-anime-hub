import Link from "next/link"

export const Footer = () => (
  <footer className="mx-auto flex w-full max-w-content justify-center border-t border-border px-4 py-12 sm:px-6">
    <p className="max-w-[52ch] text-center font-mono text-[0.6875rem] leading-relaxed tracking-wide text-muted-foreground sm:text-left">
      Built by{" "}
      <Link
        href="https://github.com/tiagogp-exe"
        className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
      >
        Tiago Guimarães
      </Link>
      . Source available on{" "}
      <Link
        href="https://github.com/tiagogp-exe/doc"
        className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
      >
        GitHub
      </Link>
      . Data via{" "}
      <Link
        href="https://anilist.co"
        className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
      >
        AniList
      </Link>
      .
    </p>
  </footer>
)
