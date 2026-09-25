interface JikanErrorBody {
  status: number
  type: string
  message: string
  error: unknown
}

export class JikanFetchError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "JikanFetchError"
    this.status = status
  }
}

const RETRY_DELAY_MS = 400

export async function fetchJikan<T>(
  url: URL,
  init?: RequestInit,
  retries = 3
): Promise<T> {
  let lastError: JikanFetchError = new JikanFetchError("Unknown error", 500)

  for (let attempt = 0; attempt <= retries; attempt++) {
    const response = await fetch(url, init)

    if (response.ok) {
      return response.json() as Promise<T>
    }

    const body = (await response
      .json()
      .catch(() => null)) as JikanErrorBody | null

    lastError = new JikanFetchError(
      body?.message ?? response.statusText,
      response.status
    )

    if (attempt < retries) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS))
    }
  }

  throw lastError
}
