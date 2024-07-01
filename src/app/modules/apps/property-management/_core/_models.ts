import { Response } from "../../../../../_metronic/helpers"

export type Property = {
  id: string
  title: string

  userIds: string[]
  officeId: string
  sahibindenNo?: string
  emlakJetNo?: string
  hepsiEmlakNo?: string
  personalDescription?: string

  propertyDetails: {
    photoURLs: string[]
    description?: string
    type?: "flat" | "land" | "office" | "project" | "other"
    squareGross?: number
    squareNet?: number
    withAccesories?: boolean
    room?:
      | "1+1"
      | "1.5+1"
      | "2+0"
      | "2+1"
      | "2.5+1"
      | "2+2"
      | "3+0"
      | "3+1"
      | "3.5+1"
      | "3+2"
      | "3+3"
      | "4+0"
      | "4+1"
      | "4.5+1"
      | "4.5+2"
      | "4+2"
      | "4+3"
      | "4+4"
      | "5+1"
      | "5.5+1"
      | "5+2"
      | "5+3"
      | "5+4"
      | "6+1"
      | "6+2"
      | "6.5+1"
      | "6+3"
      | "6+4"
      | "7+1"
      | "7+2"
      | "7+3"
      | "8+1"
      | "8+2"
      | "8+3"
      | "8+4"
      | "9+1"
      | "9+2"
      | "9+3"
      | "9+4"
      | "9+5"
      | "9+6"
      | "10+1"
      | "10+2"
      | "10++"
      | ""
    bathroom?: number
    balcony?: boolean
    elevator?: boolean
    parkingLot?:
      | "openNclosedParkingLot"
      | "closedParkingLot"
      | "openParkingLot"
      | ""
    deedStatus?:
      | "condominium"
      | "floorAltitude"
      | "shareTitleDeed"
      | "detachedTitleDeed"
      | "landTitleDeed"
      | ""
    heating?:
      | "stove"
      | "naturalGasStove"
      | "floorRadiator"
      | "central"
      | "centerShareMeter"
      | "combiBoilerNaturalGas"
      | "combiBoilerElectricity"
      | "floorHeating"
      | "airConditioning"
      | "fancoilUnit"
      | "solarEnergy"
      | "electricRadiator"
      | "geothermal"
      | "fireplace"
      | "VRV"
      | "heatPump"
      | ""
    inComplex?: boolean
    buildingAge?: string
    buildingFloors?: string
    buildingAtFloor?: string
    dues?: string
    facade?: string[]
    exchange?: boolean

    featuresInner?: string[]
    featuresOuter?: string[]
    featuresNeighbourhood?: string[]
    featuresTransportation?: string[]
    featuresView?: string[]
    featuresRealEstateType?: string[]
    featuresForDisabled?: string[]

    price: string
    for: "sale" | "rent" | "lease-sale" | "lease-rent" | ""

    address: {
      label: string
      lat: number | undefined
      lng: number | undefined
    }
  }

  ownerDetails?: {
    ownerFullName?: string
    ownerPhoneNumber?: string
    permit?: string
    permitDate?: string
    permitUntilDate?: string
    permitPrice?: string
  }

  saleDetails?: {
    agentFee?: string
    officeFee?: string
    sold?: boolean
    soldPrice?: string
    soldDate?: string
    active: boolean
  }

  createdAt: string
  updatedAt: string
}

export type PropertiesQueryResponse = Response<Array<Property>>
