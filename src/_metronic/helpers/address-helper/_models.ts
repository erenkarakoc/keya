interface Timezone {
  zoneName: string
  gmtOffset: number
  gmtOffsetName: string
  abbreviation: string
  tzName: string
}

export interface Country {
  id: string
  name: string
}

export interface State {
  id: string
  name: string
}

export interface City {
  id: string
  name: string
}
