/* eslint-disable @typescript-eslint/no-explicit-any */
import { ID } from "../../../../../_metronic/helpers"
import { Property, PropertiesQueryResponse } from "./_models"

import { firebaseConfig } from "../../../../../firebase/BaseConfig"
import { initializeApp } from "firebase/app"
import {
  getFirestore,
  collection,
  query,
  orderBy,
  startAfter,
  getDocs,
  getDoc,
  doc,
  where,
  updateDoc,
  deleteDoc,
  limit,
} from "firebase/firestore"

initializeApp(firebaseConfig)
const db = getFirestore()

const getProperties = async (
  queryString: string
): Promise<PropertiesQueryResponse> => {
  try {
    const params = new URLSearchParams(queryString)
    const page = parseInt(params.get("page") || "1", 10)
    const itemsPerPage = parseInt(params.get("items_per_page") || "10", 10) as
      | 10
      | 30
      | 50
      | 100
    const sortField = params.get("sort") || "title"
    const sortOrder = params.get("order") || "asc"
    const searchQuery = params.get("search") || ""

    const db = getFirestore()
    const propertiesCollection = collection(db, "properties")

    let q = query(propertiesCollection)

    // Apply search filter if search query is provided
    if (searchQuery) {
      q = query(
        propertiesCollection,
        where("title", ">=", searchQuery),
        where("title", "<=", searchQuery + "\uf8ff")
      )
    }

    // Apply sorting
    q = query(q, orderBy(sortField, sortOrder as "asc" | "desc"))

    // Paginate results
    const offset = (page - 1) * itemsPerPage
    if (offset > 0) {
      const lastVisibleDoc = await getDocs(q).then(
        (snapshot) => snapshot.docs[offset - 1]
      )
      q = query(q, startAfter(lastVisibleDoc), limit(itemsPerPage))
    } else {
      q = query(q, limit(itemsPerPage))
    }

    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      console.log("No documents found")
    }

    const properties: Property[] = []
    snapshot.forEach((doc) => {
      if (doc.exists()) {
        properties.push(doc.data() as Property)
      }
    })

    // Calculate pagination metadata
    const totalPropertiesQuery = await getDocs(collection(db, "properties"))
    const totalProperties = totalPropertiesQuery.size
    const totalPages = Math.ceil(totalProperties / itemsPerPage)
    const nextPage = page < totalPages ? page + 1 : null
    const prevPage = page > 1 ? page - 1 : null

    // Generate pagination links
    const links = []
    if (prevPage !== null) {
      links.push({
        url: `/?page=${prevPage}&items_per_page=${itemsPerPage}&sort=${sortField}&order=${sortOrder}&search=${searchQuery}`,
        label: "&laquo; Previous",
        active: false,
        page: prevPage,
      })
    }
    for (let i = 1; i <= totalPages; i++) {
      links.push({
        url: `/?page=${i}&items_per_page=${itemsPerPage}&sort=${sortField}&order=${sortOrder}&search=${searchQuery}`,
        label: `${i}`,
        active: i === page,
        page: i,
      })
    }
    if (nextPage !== null) {
      links.push({
        url: `/?page=${nextPage}&items_per_page=${itemsPerPage}&sort=${sortField}&order=${sortOrder}&search=${searchQuery}`,
        label: "Next &raquo;",
        active: false,
        page: nextPage,
      })
    }

    return {
      data: properties,
      payload: {
        pagination: {
          page: page,
          items_per_page: itemsPerPage,
          links: links,
        },
      },
    }
  } catch (error) {
    console.error("Error fetching properties:", error)
    return {
      data: [],
      payload: {
        pagination: {
          page: 1,
          items_per_page: 10,
          links: [],
        },
      },
    }
  }
}

const getAllProperties = async (): Promise<Property[]> => {
  try {
    const db = getFirestore()
    const propertyCollectionRef = collection(db, "properties")
    const propertyDocSnapshot = await getDocs(propertyCollectionRef)

    const properties: Property[] = []

    propertyDocSnapshot.forEach((doc) => {
      const propertyData = doc.data() as Property
      properties.push({ ...propertyData, id: doc.id })
    })

    return properties
  } catch (error) {
    console.error("Error fetching properties:", error)
    return []
  }
}

const searchProperties = async (queryStr: string) => {
  try {
    const db = getFirestore()
    const propertiesCollectionRef = collection(db, "properties")

    const q = query(
      propertiesCollectionRef,
      where("title", ">=", queryStr.toUpperCase()),
      where("title", "<=", queryStr.toUpperCase() + "\uf8ff")
    )

    const propertyDocSnapshot = await getDocs(q)

    const properties: Property[] = []

    propertyDocSnapshot.forEach((doc) => {
      const propertyData = doc.data() as Property
      properties.push({ ...propertyData, id: doc.id })
    })

    return properties
  } catch (error) {
    console.error("Error fetching users by search query:", error)
    return []
  }
}

const getPropertiesBySearchTerm = async (
  searchTerm: string
): Promise<Property[]> => {
  try {
    const db = getFirestore()
    const propertyCollectionRef = collection(db, "properties")

    const q = query(
      propertyCollectionRef,
      where("title", ">=", searchTerm.toUpperCase()),
      where("title", "<=", searchTerm.toUpperCase() + "\uf8ff")
    )

    const querySnapshot = await getDocs(q)

    const properties: Property[] = []

    querySnapshot.forEach((doc) => {
      const propertyData = doc.data() as Property
      properties.push(propertyData)
    })

    return properties
  } catch (error) {
    console.error("Error fetching properties by search term:", error)
    return []
  }
}

const getPropertiesByUserIds = async (
  userIds: string[]
): Promise<Property[]> => {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    console.error("Invalid or empty userIds array")
    return []
  }

  try {
    const db = getFirestore()
    const propertyCollectionRef = collection(db, "properties")
    const q = query(
      propertyCollectionRef,
      where("userIds", "array-contains-any", userIds)
    )
    const propertyDocSnapshot = await getDocs(q)

    const properties: Property[] = []

    propertyDocSnapshot.forEach((doc) => {
      const propertyData = doc.data() as Property
      properties.push({ ...propertyData, id: doc.id })
    })

    return properties
  } catch (error) {
    console.error("Error fetching properties by user IDs:", error)
    return []
  }
}

const getPropertiesByOfficeId = async (
  officeId: string
): Promise<Property[]> => {
  if (!officeId) {
    console.error("Invalid or empty officeId")
    return []
  }

  try {
    const db = getFirestore()
    const propertyCollectionRef = collection(db, "properties")
    const q = query(propertyCollectionRef, where("officeId", "==", officeId))
    const propertyDocSnapshot = await getDocs(q)

    const properties: Property[] = []

    propertyDocSnapshot.forEach((doc) => {
      const propertyData = doc.data() as Property
      properties.push({ ...propertyData, id: doc.id })
    })

    return properties
  } catch (error) {
    console.error("Error fetching properties by office ID:", error)
    return []
  }
}

const getPropertyById = async (id: string): Promise<Property | undefined> => {
  try {
    const db = getFirestore()
    const propertyDocRef = doc(db, "properties", id)
    const propertyDocSnapshot = await getDoc(propertyDocRef)

    if (propertyDocSnapshot.exists()) {
      return propertyDocSnapshot.data() as Property
    } else {
      return undefined
    }
  } catch (error) {
    console.error("Error fetching property:", error)
    return undefined
  }
}

const getPropertyNameById = async (id: string): Promise<string | undefined> => {
  try {
    const db = getFirestore()
    const propertyDocRef = doc(db, "properties", id)
    const propertyDocSnapshot = await getDoc(propertyDocRef)

    if (propertyDocSnapshot.exists()) {
      const propertyData = propertyDocSnapshot.data()
      if (propertyData) {
        return propertyData.name as string
      }
    }
    return undefined
  } catch (error) {
    console.error("Error fetching property:", error)
    return undefined
  }
}

const updateProperty = async (
  property: Property
): Promise<Property | undefined> => {
  const propertyDocRef = doc(db, "properties", property.id)
  await updateDoc(propertyDocRef, property)
  return property
}

const deleteProperty = async (propertyId: string): Promise<void> => {
  try {
    const propertyRef = doc(db, "properties", propertyId)
    await deleteDoc(propertyRef)
  } catch (error) {
    console.error("Error deleting property documents:", error)
    throw error
  }
}

const deleteSelectedProperties = async (
  propertyIds: Array<ID>
): Promise<void> => {
  try {
    await Promise.all(
      propertyIds.map(async (propertyId) => {
        if (typeof propertyId === "string") {
          await deleteProperty(propertyId)
        } else {
          console.error("Invalid propertyId")
        }
      })
    )
  } catch (error) {
    console.error("Error deleting properties:", error)
    throw error
  }
}

const getPropertyFromSahibinden = (
  pasted: string,
  setFieldValue: any,
  setCurrentPrice: any,
  setCurrentDues: any,
  setDescription: any,
  setMarkerPosition: any,
  map: any
) => {
  const parser = new DOMParser()
  const content = parser.parseFromString(pasted, "text/html")

  const titleContent = content
    .querySelector(".classifiedDetailTitle")
    ?.querySelector("h1")?.innerHTML
  setFieldValue("title", titleContent)

  const priceContent: HTMLInputElement | null = content.querySelector(
    "#favoriteClassifiedPrice"
  )
  setCurrentPrice(priceContent?.value.replace(/\D/g, "") ?? "")
  setFieldValue(
    "propertyDetails.price",
    priceContent?.value.replace(/\D/g, "") ?? ""
  )

  const descriptionContent = content.querySelector(
    "#classifiedDescription"
  )?.innerHTML
  setDescription(descriptionContent ?? "")
  setFieldValue("propertyDetails.description", descriptionContent)

  const forContent = content
    .querySelector(".search-result-bc")
    ?.querySelector("li:nth-of-type(3)")
    ?.querySelector("span")?.innerHTML
  setFieldValue(
    "propertyDetails.for",
    forContent === "Satılık"
      ? "sale"
      : forContent === "Kiralık"
      ? "rent"
      : forContent === "Devren Satılık"
      ? "lease-sale"
      : forContent === "Devren Kiralık"
      ? "lease-rent"
      : ""
  )

  const addressContent = content
    .querySelector(".getDirectionsButton")
    ?.querySelector("a")
    ?.getAttribute("href")
  if (addressContent) {
    const [addressLatContent, addressLngContent] =
      addressContent.split("/").pop()?.split(",") ?? []
    if (addressLatContent && addressLngContent) {
      const lat = parseFloat(addressLatContent.trim())
      const lng = parseFloat(addressLngContent.trim())

      setMarkerPosition({ lat, lng })
      map?.setCenter({ lat, lng })
      map?.setZoom(14)
    }
  }

  const facade: string[] = []
  const facadeContent = content
    .querySelector("#classifiedProperties")
    ?.querySelector("ul:nth-of-type(1)")
    ?.querySelectorAll(".selected")
  facadeContent?.forEach((selected) => {
    if (selected.innerHTML.trim() === "Doğu") facade.push("east")
    if (selected.innerHTML.trim() === "Batı") facade.push("west")
    if (selected.innerHTML.trim() === "Kuzey") facade.push("north")
    if (selected.innerHTML.trim() === "Güney") facade.push("south")
  })
  setFieldValue("propertyDetails.facade", facade)

  const featuresInner: string[] = []
  const featuresInnerContent = content
    .querySelector("#classifiedProperties")
    ?.querySelector("ul:nth-of-type(2)")
    ?.querySelectorAll(".selected")
  featuresInnerContent?.forEach((selected) =>
    featuresInner.push(selected.innerHTML.trim())
  )
  setFieldValue("propertyDetails.featuresInner", featuresInner)

  const featuresOuter: string[] = []
  const featuresOuterContent = content
    .querySelector("#classifiedProperties")
    ?.querySelector("ul:nth-of-type(3)")
    ?.querySelectorAll(".selected")
  featuresOuterContent?.forEach((selected) =>
    featuresOuter.push(selected.innerHTML.trim())
  )
  setFieldValue("propertyDetails.featuresOuter", featuresOuter)

  const featuresNeighbourhood: string[] = []
  const featuresNeighbourhoodContent = content
    .querySelector("#classifiedProperties")
    ?.querySelector("ul:nth-of-type(4)")
    ?.querySelectorAll(".selected")
  featuresNeighbourhoodContent?.forEach((selected) =>
    featuresNeighbourhood.push(selected.innerHTML.trim())
  )
  setFieldValue("propertyDetails.featuresNeighbourhood", featuresNeighbourhood)

  const featuresTransportation: string[] = []
  const featuresTransportationContent = content
    .querySelector("#classifiedProperties")
    ?.querySelector("ul:nth-of-type(5)")
    ?.querySelectorAll(".selected")
  featuresTransportationContent?.forEach((selected) =>
    featuresTransportation.push(selected.innerHTML.trim())
  )
  setFieldValue(
    "propertyDetails.featuresTransportation",
    featuresTransportation
  )

  const featuresView: string[] = []
  const featuresViewContent = content
    .querySelector("#classifiedProperties")
    ?.querySelector("ul:nth-of-type(6)")
    ?.querySelectorAll(".selected")
  featuresViewContent?.forEach((selected) =>
    featuresView.push(selected.innerHTML.trim())
  )
  setFieldValue("propertyDetails.featuresView", featuresView)

  const featuresRealEstateType: string[] = []
  const featuresRealEstateTypeContent = content
    .querySelector("#classifiedProperties")
    ?.querySelector("ul:nth-of-type(7)")
    ?.querySelectorAll(".selected")
  featuresRealEstateTypeContent?.forEach((selected) =>
    featuresRealEstateType.push(selected.innerHTML.trim())
  )
  setFieldValue(
    "propertyDetails.featuresRealEstateType",
    featuresRealEstateType
  )

  const featuresForDisabled: string[] = []
  const featuresForDisabledContent = content
    .querySelector("#classifiedProperties")
    ?.querySelector("ul:nth-of-type(8)")
    ?.querySelectorAll(".selected")
  featuresForDisabledContent?.forEach((selected) =>
    featuresForDisabled.push(selected.innerHTML.trim())
  )
  setFieldValue("propertyDetails.featuresForDisabled", featuresForDisabled)

  // INFO LIST
  const infoList = content.querySelectorAll(".classifiedInfoList li")

  const exchangeContent = Array.from(infoList)
    .find((li) => li.textContent?.includes("Takas"))
    ?.querySelector("span")
    ?.innerHTML.trim()
  if (exchangeContent)
    setFieldValue(
      "propertyDetails.exchange",
      exchangeContent?.includes("Evet") ? "true" : "false"
    )
  else setFieldValue("propertyDetails.exchange", "false")

  const typeContent = Array.from(infoList)
    .find((li) => li.textContent?.includes("Emlak Tipi"))
    ?.querySelector("span")
    ?.innerHTML.trim()
  setFieldValue(
    "propertyDetails.type",
    typeContent?.includes("Arsa")
      ? "land"
      : typeContent?.includes("İş Yeri")
      ? "office"
      : "residence"
  )

  const roomContent = Array.from(infoList)
    .find((li) => li.textContent?.includes("Oda Sayısı"))
    ?.querySelector("span")
    ?.innerHTML.trim()
  setFieldValue("propertyDetails.room", roomContent ?? "")

  const deedStatusContent = Array.from(infoList)
    .find((li) => li.textContent?.includes("Tapu Durumu"))
    ?.querySelector("span")
    ?.innerHTML.trim()
  const deedStatus = deedStatusContent?.includes("Kat Mülkiyetli")
    ? "condominium"
    : deedStatusContent?.includes("Kat İrtifaklı")
    ? "floorAltitude"
    : deedStatusContent?.includes("Hisseli Tapulu")
    ? "shareTitleDeed"
    : deedStatusContent?.includes("Müstakil Tapulu")
    ? "detachedTitleDeed"
    : deedStatusContent?.includes("Arsa Tapulu")
    ? "landTitleDeed"
    : ""
  setFieldValue("propertyDetails.deedStatus", deedStatus)

  const squareGrossContent = Array.from(infoList)
    .find((li) => li.textContent?.includes("(Brüt)"))
    ?.querySelector("span")
    ?.innerHTML.trim()
  setFieldValue("propertyDetails.squareGross", squareGrossContent ?? "")

  const squareNetContent = Array.from(infoList)
    .find((li) => li.textContent?.includes("(Net)"))
    ?.querySelector("span")
    ?.innerHTML.trim()
  setFieldValue("propertyDetails.squareNet", squareNetContent ?? "")

  const parkingLotContent = Array.from(infoList)
    .find((li) => li.textContent?.includes("Otopark"))
    ?.querySelector("span")
    ?.innerHTML.trim()
  const parkingLot = parkingLotContent?.includes("Açık & Kapalı Otopark")
    ? "openNclosedParkingLot"
    : parkingLotContent?.includes("Açık Otopark")
    ? "openParkingLot"
    : parkingLotContent?.includes("Kapalı Otopark")
    ? "closedParkingLot"
    : ""
  setFieldValue("propertyDetails.parkingLot", parkingLot ?? "")

  const heatingContent = Array.from(infoList)
    .find((li) => li.textContent?.includes("Isıtma"))
    ?.querySelector("span")
    ?.innerHTML.trim()
  const heating = heatingContent?.includes("Soba")
    ? "stove"
    : heatingContent?.includes("Doğalgaz Sobası")
    ? "naturalGasStove"
    : heatingContent?.includes("Kat Kaloriferi")
    ? "floorRadiator"
    : heatingContent?.includes("Merkezi (Pay Ölçer)")
    ? "centerShareMeter"
    : heatingContent?.includes("Merkezi")
    ? "central"
    : heatingContent?.includes("Kombi (Doğalgaz)")
    ? "combiBoilerNaturalGas"
    : heatingContent?.includes("Kombi (Elektrik)")
    ? "combiBoilerElectricity"
    : heatingContent?.includes("Yerden Isıtma")
    ? "floorHeating"
    : heatingContent?.includes("Klima")
    ? "airConditioning"
    : heatingContent?.includes("Fancoil Ünitesi")
    ? "fancoilUnit"
    : heatingContent?.includes("Güneş Enerjisi")
    ? "solarEnergy"
    : heatingContent?.includes("Elektrikli Radyatör")
    ? "electricRadiator"
    : heatingContent?.includes("Jeotermal")
    ? "geothermal"
    : heatingContent?.includes("Şömine")
    ? "fireplace"
    : heatingContent?.includes("VRV")
    ? "VRV"
    : heatingContent?.includes("Isı Pompası")
    ? "heatPump"
    : ""
  setFieldValue("propertyDetails.heating", heating ?? "")

  const duesContent = Array.from(infoList)
    .find((li) => li.textContent?.includes("Aidat"))
    ?.querySelector("span")
    ?.innerHTML.trim()
  setFieldValue(
    "propertyDetails.dues",
    duesContent != "Belirtilmemiş" ? duesContent : ""
  )
  setCurrentDues(duesContent != "Belirtilmemiş" ? duesContent ?? "" : "")

  const bathroomContent = Array.from(infoList)
    .find((li) => li.textContent?.includes("Banyo Sayısı"))
    ?.querySelector("span")
    ?.innerHTML.trim()
  setFieldValue("propertyDetails.bathroom", bathroomContent ?? "")

  const buildingAgeContent = Array.from(infoList)
    .find((li) => li.textContent?.includes("Bina Yaşı"))
    ?.querySelector("span")
    ?.innerHTML.trim()
  setFieldValue("propertyDetails.buildingAge", buildingAgeContent ?? "")

  const buildingFloorsContent = Array.from(infoList)
    .find((li) => li.textContent?.includes("Kat Sayısı"))
    ?.querySelector("span")
    ?.innerHTML.trim()
  setFieldValue("propertyDetails.buildingFloors", buildingFloorsContent ?? "")

  const buildingAtFloorContent = Array.from(infoList)
    .find((li) => li.textContent?.includes("Bulunduğu Kat"))
    ?.querySelector("span")
    ?.innerHTML.trim()
  setFieldValue("propertyDetails.buildingAtFloor", buildingAtFloorContent ?? "")

  const balconyContent = Array.from(infoList)
    .find((li) => li.textContent?.includes("Balkon"))
    ?.querySelector("span")
    ?.innerHTML.trim()
  setFieldValue(
    "propertyDetails.balcony",
    balconyContent === "Var" ? "true" : "false"
  )

  const elevatorContent = Array.from(infoList)
    .find((li) => li.textContent?.includes("Asansör"))
    ?.querySelector("span")
    ?.innerHTML.trim()
  setFieldValue(
    "propertyDetails.elevator",
    elevatorContent === "Var" ? "true" : "false"
  )

  const withAccesoriesContent = Array.from(infoList)
    .find((li) => li.textContent?.includes("Eşyalı"))
    ?.querySelector("span")
    ?.innerHTML.trim()
  setFieldValue(
    "propertyDetails.withAccesories",
    withAccesoriesContent === "Evet" ? "true" : "false"
  )

  const inComplexContent = Array.from(infoList)
    .find((li) => li.textContent?.includes("Site İçerisinde"))
    ?.querySelector("span")
    ?.innerHTML.trim()
  setFieldValue(
    "propertyDetails.inComplex",
    inComplexContent === "Evet" ? "true" : "false"
  )

  const sahibindenNoContent = Array.from(infoList)
    .find((li) => li.textContent?.includes("İlan No"))
    ?.querySelector("span")
    ?.innerHTML.trim()
  setFieldValue("sahibindenNo", sahibindenNoContent ?? "")
}

export {
  getProperties,
  getAllProperties,
  searchProperties,
  getPropertiesBySearchTerm,
  getPropertiesByUserIds,
  getPropertiesByOfficeId,
  getPropertyById,
  getPropertyNameById,
  deleteProperty,
  deleteSelectedProperties,
  updateProperty,
  getPropertyFromSahibinden,
}
