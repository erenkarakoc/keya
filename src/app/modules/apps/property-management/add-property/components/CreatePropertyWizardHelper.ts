import * as Yup from "yup"

export type ICreateAccount =  {
  id: string
  title: string

  agentId: string
  officeId: string
  sahibindenNo?: number
  emlakJetNo?: number
  personalDescription?: string

  propertyDetails: {
    photoURLs: string[]
    description?: HTMLElement
    type?: "flat" | "land" | "office" | "project" | "building"
    square?: string
    withAccesories?: boolean
    room?: "1+1" | "1.5+1" | "2+0" | "2+1" | "2.5+1" | "2+2" | "3+0" | "3+1" | "3.5+1" | "3+2" | "3+3" | "4+0" | "4+1" | "4.5+1" | "4.5+2" | "4+2" | "4+3" | "4+4" | "5+1" | "5.5+1" | "5+2" | "5+3" | "5+4" | "6+1" | "6+2" | "6.5+1" | "6+3" | "6+4" | "7+1" | "7+2" | "7+3" | "8+1" | "8+2" | "8+3" | "8+4" | "9+1" | "9+2" | "9+3" | "9+4" | "9+5" | "9+6" | "10+1" | "10+2" | "10++"
    bathroom?: number
    balcony?: boolean
    elevator?: boolean
    parkingLot?: "closedParkingLot" | "openParkingLot"
    deedStatus?: "condominium" | "floorAltitude" | "shareTitleDeed" | "detachedTitleDeed" | "landTitleDeed"
    heating?: "stove" | "naturalGasStove" | "floorRadiator" | "central" | "centerShareMeter" | "combiBoilerNaturalGas" | "combiBoilerElectricity" | "floorHeating" | "airConditioning" | "fancoilUnit" | "solarEnergy" | "electricRadiator" | "geothermal" | "fireplace" | "VRV" | "heatPump"
    inComplex?: boolean
    buildingAge?: number
    buildingFloors?: number
    atFloor?: number
    dues?: number
    facade?: "north" | "east" | "south" | "west"
    
    featuresInner?: string[]
    featuresOuter?: string[]
    featuresNeighbourhood?: string[]
    featuresTransportation?: string[]
    featuresView?: string[]
    featuresForDisabled?: string[]

    price: number
    for: "sale" | "rent" | "with-assets" | "lease"
    exchange?: boolean

    address: {
      lat: number
      lang: number
    }
  }

  ownerDetails?: {
    ownerFullName?: string
    ownerPhoneNumber?: string
    permit?: "long" | "short" | "whatsapp" | "other"
    permitDate?: string
    permitUntilDate?: string
    permitPrice?: number
  }

  createdAt: string
  updatedAt: string
}

const step0Schema = Yup.object({
  accountType: Yup.string(),
})

const step1Schema = Yup.object({
  title: Yup.string()
    .max(100, "İlan adı en fazla 50 karakterden oluşmalı.")
    .required("İlan adı alanı zorunludur."),
  description: Yup.string(),
  type: Yup.string().required("Gayrimenkul türü alanı zorunludur."),
  price: Yup.number().required("Fiyat alanı zorunludur."),
  for: Yup.string().required("İlan türü alanı zorunludur.")
})

const step2Schema = Yup.object({
 photoURLs: Yup.array().min(10, "En az 10 fotoğraf seçilmesi zorunludur.").required("Fotoğraf alanı zorunludur."),
 room: Yup.string(),
})

const step3Schema = Yup.object({
  photoURLs: Yup.array()
    .min(1, "En az bir fotoğraf seçilmesi zorunludur.")
    .required("En az bir fotoğraf seçilmesi zorunludur."),
})

const step4Schema = Yup.object({
  users: Yup.array(),
})

const step5Schema = Yup.object({
  empty: Yup.string(),
})

const inits: ICreateAccount =  {
  id: "",
  title: "",
  agentId: "",
  officeId: "",
  sahibindenNo: 0,
  emlakJetNo: 0,
  personalDescription: "",
  propertyDetails: {
    photoURLs: [],
    description: undefined,
    type: undefined,
    square: "",
    withAccesories: undefined,
    room: undefined,
    bathroom: 0,
    balcony: false,
    elevator: false,
    parkingLot: undefined,
    deedStatus: undefined,
    heating: undefined,
    inComplex: false,
    buildingAge: 0,
    buildingFloors: 0,
    atFloor: 0,
    dues: 0,
    facade: undefined,
    
    featuresInner: [],
    featuresOuter: [],
    featuresNeighbourhood: [],
    featuresTransportation: [],
    featuresView: [],
    featuresForDisabled: [],

    price: 0,
    for: "sale",
    exchange: false,

    address: {
      lat: 0,
      lang: 0,
    },
  },

  ownerDetails: {
    ownerFullName: "",
    ownerPhoneNumber: "",
    permit: undefined,
    permitDate: "",
    permitUntilDate: "",
    permitPrice: 0,
  },

  createdAt: "",
  updatedAt: ""
}

export {
  step0Schema,
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  inits,
}
