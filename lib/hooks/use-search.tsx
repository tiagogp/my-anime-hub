import { createContext, FC, useContext, useEffect, useState } from 'react'
import Cookies from 'cookies-js'
import { useForm, UseFormRegister } from 'react-hook-form'
import { useDebounce } from './use-debounce'
import { api } from '@/config/api'
import { DataSessionProps } from '@/config/services/seasons'

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
    haveMore: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [focusSearch, setFocusSearch] = useState(false)

  const delayFocusSearch = useDebounce<boolean>(focusSearch, 500)

  const search = watch('search')

  const debouncedValue = useDebounce<string>(search, 500)

  useEffect(() => {
    const updateSearchResult = async () => {
      if (debouncedValue) {

        const { data } = await api.get(`/anime?q=${debouncedValue}&limit=10`)
        Cookies.set('search', debouncedValue)
        Cookies.set('searchResult', JSON.stringify({
          data: data.data.slice(0, 10),
          haveMore: data.pagination.current_page < data.pagination.last_visible_page
        }))

        setSearchResult({
          data: data.data.slice(0, 10),
          haveMore: data.pagination.current_page < data.pagination.last_visible_page
        })
      }
    }

    updateSearchResult()
  }, [debouncedValue])

  useEffect(() => {
    const oldValueSearch = Cookies.get('search') ?? ''
    const oldValueSearchResult = Cookies.get('searchResult') ? JSON.parse(localStorage.getItem('searchResult') ?? '') : []

    setValue('search', oldValueSearch)
    setSearchResult(oldValueSearchResult)
  }, [])

  const setSearch = (value: string) => {
    Cookies.set('search', value)
    setValue('search', value)
  }

  return (
    <SearchContext.Provider
      value={{ setFocusSearch, focusSearch, delayFocusSearch, isLoading, searchResult, setSearch, search, register }}>
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = (): ISearchContext => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used with SearchProvider')
  }

  return context
}