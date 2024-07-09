interface Timezone {
  zoneName: string
  gmtOffset: number
  gmtOffsetName: string
  abbreviation: string
  tzName: string
}

export interface Country {
  id: number
  name: string
  iso3: string
  iso2: string
  numeric_code: string
  phone_code: string
  capital: string
  currency: string
  currency_name: string
  currency_symbol: string
  tld: string
  native: string | null | undefined
  region: string
  region_id: string | null | undefined
  subregion: string
  subregion_id: string | null | undefined
  nationality: string
  timezones: Timezone[] | null | undefined
  translations: { [key: string]: string | undefined }
  latitude: string
  longitude: string
  emoji: string
  emojiU: string
}

export interface State {
  id: number
  name: string
  country_id: number
  country_code: string
  country_name: string
  state_code: string
  type: string | null
  latitude: string | null
  longitude: string | null
}

export interface City {
  id: number
  name: string
  state_id: number
  state_code: string
  state_name: string
  country_id: number
  country_code: string
  country_name: string
  latitude: string
  longitude: string
  wikiDataId: string
}
