export interface Country {
  name: Name
  cca3: string
  independent: boolean
  unMember: boolean
  capital: string[]
  region: string
  subregion: string
  area: number
  flags: {
    svg: string
    alt: string
  }
  population: number
  currencies: Currency[]
  languages: string[],
  borders: string[],
  continents: string[]
}

export interface Name {
  common: string
  official: string
}

export interface Currency {
  name: string,
  symbol: string
}
