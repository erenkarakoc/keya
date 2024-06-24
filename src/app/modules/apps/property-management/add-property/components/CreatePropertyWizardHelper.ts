import * as Yup from "yup"

export type ICreateAccount = {
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
    type?: "flat" | "land" | "office" | "project" | ""
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
    buildingAge?: number
    buildingFloors?: number
    buildingAtFloor?: number
    dues?: string
    facade?: "north" | "east" | "south" | "west" | ""
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

const step0Schema = Yup.object({
  accountType: Yup.string(),
})

const step1Schema = Yup.object({
  saleDetails: Yup.object({
    agentFee: Yup.string(),
    officeFee: Yup.string(),
    sold: Yup.boolean(),
    soldPrice: Yup.string(),
    soldDate: Yup.string(),
    active: Yup.boolean(),
  }),
  title: Yup.string().required("İlan Başlığı alanı zorunludur."),
  propertyDetails: Yup.object({
    description: Yup.string()
      .matches(
        /<[^>]*>([^<>\s]|[^<>\s][^<]*[^<>\s])<\/[^>]*>/,
        "Açıklama alanı zorunludur."
      )
      .required("Açıklama alanı zorunludur."),
    price: Yup.string().required("Fiyat alanı zorunludur."),
    type: Yup.string().required("Gayrimenkul Türü alanı zorunludur."),
    for: Yup.string().required("İlan Türü alanı zorunludur."),
    exchange: Yup.boolean().required("Takasa Açık alanı zorunludur."),
  }),
})

const step2Schema = Yup.object({
  propertyDetails: Yup.object({
    photoURLs: Yup.array()
      .min(20, "En az 20 görsel seçilmesi zorunludur.")
      .required("Görsel alanı zorunludur."),
    room: Yup.string(),
    squareGross: Yup.number(),
    squareNet: Yup.number(),
    withAccesories: Yup.boolean(),
    bathroom: Yup.number(),
    balcony: Yup.boolean(),
    elevator: Yup.boolean(),
    parkingLot: Yup.string(),
    deedStatus: Yup.string(),
    heating: Yup.string(),
    inComplex: Yup.boolean(),
    buildingAge: Yup.number(),
    buildingFloors: Yup.number(),
    buildingAtFloor: Yup.number(),
    dues: Yup.string(),
    facade: Yup.string(),
  }),
})

const step3Schema = Yup.object({
  propertyDetails: Yup.object({
    featuresInner: Yup.array(),
    featuresOuter: Yup.array(),
    featuresNeighbourhood: Yup.array(),
    featuresTransportation: Yup.array(),
    featuresView: Yup.array(),
    featuresRealEstateType: Yup.array(),
    featuresForDisabled: Yup.array(),
  }),
})

const step4Schema = Yup.object({
  propertyDetails: Yup.object({
    address: Yup.object({
      lng: Yup.number().test(
        "is-nonzero",
        "Konum bilgisi zorunludur.",
        (value) => value !== 0
      ),
    }),
  }),
})

const step5Schema = Yup.object({
  userIds: Yup.array()
    .min(1, "Gayrimenkul Danışmanı alanı zorunludur")
    .required("Gayrimenkul Danışmanı alanı zorunludur "),
  ownerDetails: Yup.object({
    ownerFullName: Yup.string().required(
      "Gayrimenkul Sahibinin Adı Soyadı alanı zorunludur."
    ),
    ownerPhoneNumber: Yup.string()
      .matches(/^\+/, "Telefon numarası + işareti ile başlamalıdır")
      .min(14, "Gayrimenkul Sahibinin Telefon Numarası alanı zorunludur")
      .required("Gayrimenkul Sahibinin Telefon Numarası alanı zorunludur."),
    permit: Yup.string().required("Yetki Türü alanı zorunludur."),
    permitDate: Yup.string().required(
      "Yetki Başlangıç Tarihi alanı zorunludur."
    ),
    permitUntilDate: Yup.string().required(
      "Yetki Bitiş Tarihi alanı zorunludur."
    ),
    permitPrice: Yup.number()
      .min(1, "Yetki Fiyatı alanı zorunludur.")
      .required("Yetki Fiyatı alanı zorunludur."),
  }),
  sahibindenNo: Yup.string(),
  emlakJetNo: Yup.string(),
  hepsiEmlakNo: Yup.string(),
  personalDescription: Yup.string(),
})

const inits: ICreateAccount = {
  id: "",
  title: "",
  userIds: [],
  officeId: "",
  sahibindenNo: "",
  emlakJetNo: "",
  hepsiEmlakNo: "",
  personalDescription: "",
  propertyDetails: {
    photoURLs: [],
    description: "",
    type: "",
    squareGross: undefined,
    squareNet: undefined,
    withAccesories: false,
    room: "",
    bathroom: undefined,
    balcony: false,
    elevator: false,
    parkingLot: "",
    deedStatus: "",
    heating: "",
    inComplex: undefined,
    buildingAge: undefined,
    buildingFloors: undefined,
    buildingAtFloor: undefined,
    dues: "",
    facade: "",
    exchange: undefined,

    featuresInner: [],
    featuresOuter: [],
    featuresNeighbourhood: [],
    featuresTransportation: [],
    featuresView: [],
    featuresRealEstateType: [],
    featuresForDisabled: [],

    price: "",
    for: "",

    address: {
      label: "",
      lat: undefined,
      lng: undefined,
    },
  },

  ownerDetails: {
    ownerFullName: "",
    ownerPhoneNumber: "",
    permit: "",
    permitDate: "",
    permitUntilDate: "",
    permitPrice: undefined,
  },

  saleDetails: {
    agentFee: "",
    officeFee: "",
    sold: undefined,
    soldPrice: "",
    soldDate: "",
    active: false,
  },

  createdAt: "",
  updatedAt: "",
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
