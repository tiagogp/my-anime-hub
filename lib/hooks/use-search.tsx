import {
  FC,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
} from "react"
import { usePathname } from "next/navigation"
import Cookies from "cookies-js"
import { UseFormRegister, useForm } from "react-hook-form"

import { api } from "@/config/api"
import type { DataSessionProps } from "@/config/services/types"

import { useDebounce } from "./use-debounce"
import { useKeyboardShortcut } from "./use-keyboard-shortcut"

interface ISearchContext {
  setFocusSearch: (value: boolean) => void
  focusSearch: boolean
  delayFocusSearch: boolean
  isLoading: boolean
  searchResult: {
    data: DataSessionProps[]
    haveMore: boolean
  }
  register: UseFormRegister<FormData>
  setSearch: (value: string) => void
  search: string
  inputRef: MutableRefObject<HTMLInputElement | null>
}

const SearchContext = createContext<ISearchContext | null>(null)

interface SearchProviderProps {
  children: React.ReactNode
}

interface FormData {
  search: string
}

interface DataProps {
  data: DataSessionProps[]
  haveMore: boolean
}

export const SearchProvider: FC<SearchProviderProps> = ({ children }) => {
  const { setValue, watch, register } = useForm<FormData>()
  const [searchResult, setSearchResult] = useState<DataProps>({
    data: [],
    haveMore: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [focusSearch, setFocusSearch] = useState(false)
  const pathname = usePathname()
  const delayFocusSearch = useDebounce<boolean>(focusSearch, 500)
  const isManga = pathname.includes("manga")
  const inputRef = useRef<HTMLInputElement | null>(null)

  const correctInitialPathname = isManga ? `manga` : `anime`

  const search = watch("search")

  const debouncedValue = useDebounce<string>(search, 500)

  const COOKIES_KEYS = {
    SEARCH: `search-${correctInitialPathname}`,
    SEARCH_RESULT: `searchResult-${correctInitialPathname}`,
  }

  useKeyboardShortcut(["control", "k"], () => {
    inputRef.current?.focus()
  })

  useKeyboardShortcut(["escape"], () => {
    inputRef.current?.blur()

    setFocusSearch(false)
  })

  useEffect(() => {
    const updateSearchResult = async () => {
      if (debouncedValue) {
        setIsLoading(true)
        const { data } = await api.get(
          `/${correctInitialPathname}?q=${debouncedValue}&limit=10&sfw=true`
        )
        setIsLoading(false)
        Cookies.set(COOKIES_KEYS.SEARCH, debouncedValue)
        Cookies.set(
          COOKIES_KEYS.SEARCH_RESULT,
          JSON.stringify({
            data: data.data.slice(0, 10),
            haveMore:
              data.pagination.current_page < data.pagination.last_visible_page,
          })
        )

        setSearchResult({
          data: data.data.slice(0, 10),
          haveMore:
            data.pagination.current_page < data.pagination.last_visible_page,
        })
      }
    }

    updateSearchResult()
  }, [
    COOKIES_KEYS.SEARCH,
    COOKIES_KEYS.SEARCH_RESULT,
    correctInitialPathname,
    debouncedValue,
  ])

  useEffect(() => {
    const oldValueSearch = Cookies.get(COOKIES_KEYS.SEARCH) ?? ""
    const oldValueSearchResult = Cookies.get(COOKIES_KEYS.SEARCH_RESULT)
      ? localStorage.getItem(COOKIES_KEYS.SEARCH_RESULT) &&
        JSON.parse(localStorage.getItem(COOKIES_KEYS.SEARCH_RESULT) ?? "")
      : []

    setValue("search", oldValueSearch)
    setSearchResult(oldValueSearchResult)
  }, [COOKIES_KEYS.SEARCH, COOKIES_KEYS.SEARCH_RESULT, setValue])

  const setSearch = (value: string) => {
    Cookies.set(COOKIES_KEYS.SEARCH, value)
    setValue("search", value)
  }

  return (
    <SearchContext.Provider
      value={{
        setFocusSearch,
        focusSearch,
        delayFocusSearch,
        isLoading,
        searchResult,
        setSearch,
        search,
        register,
        inputRef,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = (): ISearchContext => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error("useSearch must be used with SearchProvider")
  }

  return context
}
