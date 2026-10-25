export interface Currency {
  code: string
  name: string
  symbol: string
}

export interface Language {
  iso639_1: string
  iso639_2: string
  name: string
  nativeName: string
}

export interface Flags {
  svg: string
  png: string
}

/** Shape as it arrives in data.json: some array fields are absent, not empty. */
export interface RawCountry {
  name: string
  nativeName: string
  topLevelDomain: string[]
  alpha2Code: string
  alpha3Code: string
  capital?: string
  region: string
  subregion: string
  population: number
  borders?: string[]
  currencies?: Currency[]
  languages: Language[]
  flags: Flags
}

/** Shape the app works with: every field present after normalisation. */
export interface Country {
  name: string
  nativeName: string
  topLevelDomain: string[]
  alpha2Code: string
  alpha3Code: string
  capital: string
  region: string
  subregion: string
  population: number
  borders: string[]
  currencies: Currency[]
  languages: Language[]
  flags: Flags
}

export interface BorderCountry {
  code: string
  name: string
}
