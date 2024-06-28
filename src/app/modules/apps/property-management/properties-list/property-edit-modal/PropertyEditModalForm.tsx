/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState, useEffect, ChangeEvent, DragEvent, useRef } from "react"

import toast from "react-hot-toast"

import { Formik, Form, Field, ErrorMessage } from "formik"

import { Property } from "../../_core/_models"

import {
  generateRandomName,
  getUserRoleText,
  urlify,
} from "../../../../../../_metronic/helpers/kyHelpers"

import { PropertiesListLoading } from "../components/loading/PropertiesListLoading"
import { useListView } from "../../_core/ListViewProvider"
import { useQueryResponse } from "../../_core/QueryResponseProvider"

import { updateProperty } from "../../_core/_requests"

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage"
import { firebaseApp } from "../../../../../../firebase/BaseConfig"
import { getAuth } from "@firebase/auth"

import Lightbox from "yet-another-react-lightbox"
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails"
import "yet-another-react-lightbox/styles.css"
import "yet-another-react-lightbox/plugins/thumbnails.css"
import CurrencyInput from "react-currency-input-field"
import ReactQuill from "react-quill"
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
} from "../../add-property/components/CreatePropertyWizardHelper"

import { APIProvider } from "@vis.gl/react-google-maps"
import { GoogleMapStep } from "../../add-property/components/steps/GoogleMapStep"
import MultiSelect from "../../../components/multiselect/MultiSelect"
import { Link } from "react-router-dom"
import { getUsersByRole } from "../../../user-management/_core/_requests"
import { AsYouType } from "libphonenumber-js"
import { PropertySalesModal } from "./PropertySalesModal"

const storage = getStorage(firebaseApp)
const auth = getAuth()

type Props = {
  isPropertyLoading: boolean
  property: Property
}

const editPropertySchema = step1Schema
  .concat(step2Schema)
  .concat(step3Schema)
  .concat(step4Schema)
  .concat(step5Schema)

const PropertyEditModalForm: FC<Props> = ({ property, isPropertyLoading }) => {
  const featuresInner = [
    "ADSL",
    "Ahşap Doğrama",
    "Akıllı Ev",
    "Alarm (Hırsız)",
    "Alarm (Yangın)",
    "Alaturka Tuvalet",
    "Alüminyum Doğrama",
    "Amerikan Kapı",
    "Amerikan Mutfak",
    "Ankastre Fırın",
    "Barbekü",
    "Beyaz Eşya",
    "Boyalı",
    "Bulaşık Makinesi",
    "Buzdolabı",
    "Çamaşır Kurutma Makinesi",
    "Çamaşır Makinesi",
    "Çamaşır Odası",
    "Çelik Kapı",
    "Duşakabin",
    "Duvar Kağıdı",
    "Ebeveyn Banyosu",
    "Fırın",
    "Fiber İnternet",
    "Giyinme Odası",
    "Gömme Dolap",
    "Görüntülü Diafon",
    "Hilton Banyo",
    "Intercom Sistemi",
    "Isıcam",
    "Jakuzi",
    "Kartonpiyer",
    "Kiler",
    "Klima",
    "Küvet",
    "Laminat Zemin",
    "Marley",
    "Mobilya",
    "Mutfak (Ankastre)",
    "Mutfak (Laminat)",
    "Mutfak Doğalgazı",
    "Panjur/Jaluzi",
    "Parke Zemin",
    "PVC Doğrama",
    "Seramik Zemin",
    "Set Üstü Ocak",
    "Spot Aydınlatma",
    "Şofben",
    "Şömine",
    "Teras",
    "Termosifon",
    "Vestiyer",
    "Wi-Fi",
    "Yüz Tanıma & Parmak İzi",
  ]

  const featuresOuter = [
    "Araç Şarj İstasyonu",
    "24 Saat Güvenlik",
    "Apartman Görevlisi",
    "Buhar Odası",
    "Çocuk Oyun Parkı",
    "Hamam",
    "Hidrofor",
    "Isı Yalıtımı",
    "Jeneratör",
    "Kablo TV",
    "Kamera Sistemi",
    "Kreş",
    "Müstakil Havuzlu",
    "Sauna",
    "Ses Yalıtımı",
    "Siding",
    "Spor Alanı",
    "Su Deposu",
    "Tenis Kortu",
    "Uydu",
    "Yangın Merdiveni",
    "Yüzme Havuzu (Açık)",
    "Yüzme Havuzu (Kapalı)",
  ]

  const featuresNeighbourhood = [
    "Alışveriş Merkezi",
    "Belediye",
    "Cami",
    "Cemevi",
    "Denize Sıfır",
    "Eczane",
    "Eğlence Merkezi",
    "Fuar",
    "Göle Sıfır",
    "Hastane",
    "Havra",
    "İlkokul-Ortaokul",
    "İtfaiye",
    "Kilise",
    "Lise",
    "Market",
    "Park",
    "Plaj",
    "Polis Merkezi",
    "Sağlık Ocağı",
    "Semt Pazarı",
    "Spor Salonu",
    "Şehir Merkezi",
    "Üniversite",
  ]

  const featuresTransportation = [
    "Anayol",
    "Avrasya Tüneli",
    "Boğaz Köprüleri",
    "Cadde",
    "Deniz Otobüsü",
    "Dolmuş",
    "E-5",
    "Havaalanı",
    "İskele",
    "Marmaray",
    "Metro",
    "Metrobüs",
    "Minibüs",
    "Otobüs Durağı",
    "Sahil",
    "Teleferik",
    "TEM",
    "Tramvay",
    "Tren İstasyonu",
    "Troleybüs",
  ]

  const featuresView = [
    "Boğaz",
    "Deniz",
    "Doğa",
    "Göl",
    "Havuz",
    "Park & Yeşil Alan",
    "Şehir",
  ]

  const featuresRealEstateType = [
    "Ara Kat",
    "Ara Kat Dubleks",
    "Bahçe Dubleksi",
    "Bahçe Katı",
    "Bahçeli",
    "Çatı Dubleksi",
    "En Üst Kat",
    "Forleks",
    "Garaj / Dükkan",
    "Giriş Katı",
    "Kat Dubleksi",
    "Loft",
    "Müstakil Girişli</label>",
    "Ters Dubleks",
    "Tripleks",
    "Zemin Kat",
  ]

  const featuresForDisabled = [
    "Araç Park Yeri",
    "Asansör",
    "Banyo",
    "Geniş Koridor",
    "Giriş / Rampa",
    "Merdiven",
    "Mutfak",
    "Oda Kapısı",
    "Park",
    "Priz / Elektrik",
    "Tutamak /",
    "Tuvalet",
    "Yüzme Havuzu",
  ]

  const { setItemIdForUpdate } = useListView()
  const { refetch } = useQueryResponse()

  const [submittingForm, setSubmittingForm] = useState<boolean>(false)

  const [propertySalesModalShow, setPropertySalesModalShow] =
    useState<boolean>(false)

  const [currentActive, setCurrentActive] = useState(false)

  const [isDragging, setIsDragging] = useState(false)
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([])
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const [currentDues, setCurrentDues] = useState("")
  const [currentPermitPrice, setCurrentPermitPrice] = useState("")
  const [currentPrice, setCurrentPrice] = useState("")

  const [description, setDescription] = useState<string>(
    `<p class="ql-align-center"><br></p><p class="ql-align-center">_______________</p><p class="ql-align-center"><br></p><p class="ql-align-center"><span style="color: rgb(255, 255, 255);">Detaylı bilgi için iletişime geçiniz:</span></p><p class="ql-align-center"><strong style="color: rgb(255, 255, 255);">Keya Real Estate: +90 (312) 439 45 45</strong></p><p class="ql-align-center"><br></p><p class="ql-align-center"><strong style="color: rgb(255, 255, 255);">T.C ANKARA VALİLİĞİ TİCARET İL MÜDÜRLÜĞÜ</strong></p><p class="ql-align-center"><strong style="color: rgb(255, 255, 255);">TAŞINMAZ TİCARETİ YETKİ BELGESİ&nbsp;</strong><a href="https://ttbs.gtb.gov.tr/Home/BelgeSorgula?BelgeNo=0600556" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 102, 204);"><strong><u>0600556</u></strong></a><strong style="color: rgb(255, 255, 255);">&nbsp;NUMARASI İLE YETKİLİ EMLAK FİRMASIDIR.</strong></p><p class="ql-align-center"><br></p><p class="ql-align-center"><em style="color: rgb(255, 255, 255);">Ofisimizde Web Tapu sistemi ile işlemleriniz yapılabilmektedir.</em></p>`
  )

  const [users, setUsers] = useState<{ id: string; label: string }[]>([])
  const [currentUsers, setCurrentUsers] = useState<any>([])
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState<string | null>(
    "+90"
  )
  const [countryCode, setCountryCode] = useState<string | null>("TR")

  const ReactQuillRef = useRef(null)
  const ReactQuillModules = {
    toolbar: [
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link"],
    ],
  }

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await handleFiles(Array.from(files))
    }
  }

  const handleFiles = async (files: File[]) => {
    const uploadPromises: Promise<void>[] = []
    const currentCount = uploadedImageUrls.length
    const remainingSlots = 50 - currentCount

    if (currentCount >= 50) {
      toast.error("En fazla 50 görsel ekleyebilirsiniz.")
      return
    }

    const filesToUpload = files.slice(0, remainingSlots)
    const excessFiles = files.slice(remainingSlots)

    filesToUpload.forEach((file) => {
      const fileSizeInMB = file.size / (1024 * 1024)
      if (fileSizeInMB > 2) {
        toast.error(
          `${file.name} adlı dosya yüklenemedi. Dosya boyutu 2 MB'den küçük olmalıdır!`
        )
        return
      }

      const randomName = generateRandomName()
      const storageRef = ref(
        storage,
        `images/properties/${urlify(property.title)}/${randomName}`
      )
      const uploadPromise = uploadBytes(storageRef, file)
        .then(() => getDownloadURL(storageRef))
        .then((downloadURL) => {
          setUploadedImageUrls((prevUrls) => [...prevUrls, downloadURL])
        })
        .catch((error) => console.error("Error uploading image:", error))

      uploadPromises.push(uploadPromise)
    })

    await Promise.all(uploadPromises)

    if (excessFiles.length > 0) {
      toast.error("En fazla 50 görsel ekleyebilirsiniz.")
    }
  }

  const handleImageDelete = async (url: string) => {
    try {
      const storageRef = ref(storage, url)

      await getDownloadURL(storageRef)
      await deleteObject(storageRef)

      setUploadedImageUrls((prevUrls) =>
        prevUrls.filter((prevUrl) => prevUrl !== url)
      )
    } catch (error: any) {
      if (error.code === "storage/object-not-found") {
        setUploadedImageUrls((prevUrls) =>
          prevUrls.filter((prevUrl) => prevUrl !== url)
        )
        console.log("Object does not exist")
      } else {
        console.error("Error deleting image:", error)
      }
    }
  }

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  const handleFeaturesChange = (
    e: ChangeEvent<HTMLInputElement>,
    fieldName: string,
    values: any,
    setFieldValue: any
  ) => {
    const { checked, value } = e.target
    const currentValues = (values.propertyDetails as any)[fieldName] || []

    let updatedValues: string[] = []

    if (checked) {
      updatedValues = [...currentValues, value]
    } else {
      updatedValues = currentValues.filter((item: string) => item !== value)
    }

    setFieldValue(`propertyDetails.${fieldName}`, updatedValues)
  }

  const handlePhoneNumberChange = (
    e: ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    const asYouType = new AsYouType()
    const formatted = asYouType.input(e.target.value)
    const countryCode = asYouType.getNumber()?.country

    setCurrentPhoneNumber(formatted)
    setFieldValue("ownerDetails.ownerPhoneNumber", formatted)
    setCountryCode(countryCode ? countryCode : "")
  }

  const handleSubmit = async (values: Property, keepModal?: boolean) => {
    setSubmittingForm(true)
    try {
      if (!auth.currentUser) {
        console.log("User is not authenticated. Please sign in.")
        return
      }

      values.propertyDetails.photoURLs = uploadedImageUrls

      await updateProperty(values)

      toast.success("İlan bilgileri güncellendi.")
    } catch (ex) {
      toast.error(
        "İlan bilgileri güncellenirken bir hata oluştu, lütfen tekrar deneyin."
      )

      console.error(ex)
    } finally {
      setSubmittingForm(false)
      if (!keepModal) cancel(true)
    }
  }

  useEffect(() => {
    if (property.ownerDetails?.ownerPhoneNumber) {
      setCurrentPhoneNumber(property.ownerDetails.ownerPhoneNumber)
    }
    if (property.ownerDetails?.permitPrice) {
      setCurrentPermitPrice(property.ownerDetails.permitPrice)
    }
    if (property.propertyDetails.dues) {
      setCurrentDues(property.propertyDetails.dues)
    }
    if (property.saleDetails) {
      setCurrentActive(property.saleDetails.active)
    }
    setCurrentPrice(property.propertyDetails.price)
    setUploadedImageUrls(property.propertyDetails.photoURLs)
  }, [property])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const brokersPromise = getUsersByRole("broker")
        const agentsPromise = getUsersByRole("agent")
        const assistantsPromise = getUsersByRole("assistant")
        const humanResourcesPromise = getUsersByRole("human-resources")

        const [brokers, agents, assistants, humanResources] = await Promise.all(
          [
            brokersPromise,
            agentsPromise,
            assistantsPromise,
            humanResourcesPromise,
          ]
        )

        const usersArr = []

        if (agents) {
          usersArr.push(
            ...agents.map((user) => ({
              id: user.id,
              label:
                user.firstName +
                " " +
                user.lastName +
                " | " +
                getUserRoleText(user.role as string),
            }))
          )
        }

        if (brokers) {
          usersArr.push(
            ...brokers.map((user) => ({
              id: user.id,
              label:
                user.firstName +
                " " +
                user.lastName +
                " | " +
                getUserRoleText(user.role as string),
            }))
          )
        }

        if (assistants) {
          usersArr.push(
            ...assistants.map((user) => ({
              id: user.id,
              label:
                user.firstName +
                " " +
                user.lastName +
                " | " +
                getUserRoleText(user.role as string),
            }))
          )
        }

        if (humanResources) {
          usersArr.push(
            ...humanResources.map((user) => ({
              id: user.id,
              label:
                user.firstName +
                " " +
                user.lastName +
                " | " +
                getUserRoleText(user.role as string),
            }))
          )
        }

        setUsers(usersArr)
        setCurrentUsers(
          usersArr
            .filter((user) => property.userIds.includes(user.id))
            .map((user) => ({ id: user.id, label: user.label }))
        )
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    fetchUsers()
  }, [property])

  return (
    <>
      <Formik
        id="kt_modal_add_property_form"
        className="form"
        onSubmit={(values) => handleSubmit(values, false)}
        initialValues={property}
        validationSchema={editPropertySchema}
        enableReinitialize={true}
        noValidate
      >
        {({ values, setFieldValue, isValid }) => (
          <Form
            noValidate
            id="property_edit_modal_form"
            placeholder={undefined}
          >
            {/* begin::Scroll */}
            <div
              className="d-flex flex-column me-n7 pe-7 pt-5"
              id="kt_modal_add_property_scroll"
              data-kt-scroll="true"
              data-kt-scroll-activate="{default: false, lg: true}"
              data-kt-scroll-max-height="auto"
              data-kt-scroll-dependencies="#kt_modal_add_property_header"
              data-kt-scroll-wrappers="#kt_modal_add_property_scroll"
              data-kt-scroll-offset="300px"
            >
              <div className="fv-row mb-10 pb-10 border-bottom border-2">
                <label className="form-label mb-5 w-100">İlan Durumu</label>

                <div className="row align-items-center">
                  <div className="col-6">
                    <label className="cursor-pointer form-check form-switch form-switch-sm form-check-custom form-check-solid col d-flex justify-content-center align-items-center border p-6 rounded">
                      <span className="form-check-label text-gray-700 fs-5 fw-bold ms-0 me-2">
                        İlanı Yayınla
                      </span>

                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="saleDetails.active"
                        checked={currentActive}
                        onChange={(e: any) => {
                          setFieldValue("saleDetails.active", e.target.checked)
                          setCurrentActive(e.target.checked)
                        }}
                      />
                    </label>
                  </div>

                  <div className="col-6">
                    <button
                      type="button"
                      className="btn btn-primary w-100"
                      onClick={() => setPropertySalesModalShow(true)}
                    >
                      Satış Durumu
                    </button>

                    <PropertySalesModal
                      show={propertySalesModalShow}
                      setShow={setPropertySalesModalShow}
                      values={values}
                      setFieldValue={setFieldValue}
                      property={property}
                      handleSubmit={handleSubmit}
                    />
                  </div>
                </div>
              </div>

              <div className="fv-row mb-7">
                <label className="form-label mb-5 w-100 required">
                  Bilgisayarınızdan seçin
                </label>

                <div
                  className={`ky-image-input${isDragging ? " dragging" : ""}`}
                  onDragEnter={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setIsDragging(true)
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setIsDragging(false)
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setIsDragging(true)
                  }}
                  onDrop={async (e: DragEvent<HTMLDivElement>) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setIsDragging(false)

                    if (
                      e.dataTransfer.files &&
                      e.dataTransfer.files.length > 0
                    ) {
                      await handleFiles(Array.from(e.dataTransfer.files))
                      e.dataTransfer.clearData()
                    }
                  }}
                >
                  <input
                    id="ky-property-image-input"
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    onChange={handleImageChange}
                    multiple
                  />
                  <label htmlFor="ky-property-image-input">
                    Görsel Seç veya Sürükle
                  </label>
                </div>

                <div className="form-text mt-4">
                  İzin verilen dosya türleri: png, jpg, jpeg.
                </div>

                <div
                  className="image-input image-input-outline d-flex flex-wrap mt-6"
                  data-kt-image-input="true"
                  style={{ maxHeight: 300, overflowY: "auto" }}
                >
                  {uploadedImageUrls.map((url, index) => (
                    <div
                      key={index}
                      className="image-input-wrapper position-relative w-125px h-125px"
                      style={{
                        backgroundImage: `url(${url})`,
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                      onClick={() => {
                        setLightboxOpen(true)
                      }}
                    >
                      <label
                        className="btn btn-icon btn-circle btn-color-white w-20px h-20px bg-gray-300 bg-hover-gray-400 shadow"
                        data-kt-image-input-action="change"
                        data-bs-toggle="tooltip"
                        title="Fotoğrafı Sil"
                        style={{
                          zIndex: 999,
                          top: 15,
                          left: 15,
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleImageDelete(url)
                        }}
                      >
                        <i className="bi bi-x fs-7"></i>
                        <input type="hidden" name="avatar_remove" />
                      </label>
                    </div>
                  ))}
                </div>

                {uploadedImageUrls.length ? (
                  <div className="form-text mt-2">
                    {uploadedImageUrls.length} görsel yüklendi.
                  </div>
                ) : (
                  ""
                )}

                <Lightbox
                  open={lightboxOpen}
                  close={() => setLightboxOpen(false)}
                  slides={[...uploadedImageUrls.map((url) => ({ src: url }))]}
                  plugins={[Thumbnails]}
                />

                <div className="text-danger mt-2">
                  <ErrorMessage
                    name="propertyDetails.photoURLs"
                    className="mt-10"
                  />
                </div>
              </div>

              <div className="fv-row mb-7">
                <div className="col-md-12">
                  <label className="form-label required mb-3">
                    İlan Başlığı
                  </label>

                  <Field
                    type="text"
                    className="form-control form-control-lg form-control-solid"
                    name="title"
                    style={{ textTransform: "uppercase" }}
                  />
                  <div className="text-danger mt-2">
                    <ErrorMessage name="title" />
                  </div>
                </div>
              </div>

              <div className="fv-row mb-7 row">
                <div className="col-md-6">
                  <label className="form-label required mb-3">
                    İlan Fiyatı
                  </label>
                  <CurrencyInput
                    name="propertyDetails.price"
                    className="form-control form-control-lg form-control-solid"
                    allowDecimals={false}
                    value={currentPrice}
                    onValueChange={(value) => {
                      const price = value ? value?.toString() : ""
                      setCurrentPrice(price)
                      setFieldValue("propertyDetails.price", price)
                    }}
                    intlConfig={{ locale: "tr-TR", currency: "TRY" }}
                    style={{ fontSize: 18, fontWeight: 800 }}
                  />

                  <div className="text-danger mt-2">
                    <ErrorMessage name="propertyDetails.price" />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label required">Takasa Açık</label>

                  <div className="d-flex gap-2">
                    <label className="d-flex cursor-pointer">
                      <span className="form-check form-check-custom form-check-solid">
                        <Field
                          className="form-check-input"
                          type="radio"
                          name="propertyDetails.exchange"
                          id="exchangeTrue"
                          value="true"
                        />
                      </span>
                      <span
                        className="d-flex align-items-center me-2 ms-2"
                        style={{ width: "fitContent" }}
                      >
                        <span className="d-flex flex-column">
                          <span className="fw-bolder text-gray-800 fs-5">
                            Evet
                          </span>
                        </span>
                      </span>
                    </label>

                    <label className="d-flex cursor-pointer">
                      <span className="form-check form-check-custom form-check-solid">
                        <Field
                          className="form-check-input"
                          type="radio"
                          name="propertyDetails.exchange"
                          id="exchangeFalse"
                          value="false"
                        />
                      </span>
                      <span
                        className="d-flex align-items-center me-2 ms-2"
                        style={{ width: "fitContent" }}
                      >
                        <span className="d-flex flex-column">
                          <span className="fw-bolder text-gray-800 fs-5">
                            Hayır
                          </span>
                        </span>
                      </span>
                    </label>
                  </div>

                  <div className="text-danger mt-2">
                    <ErrorMessage name="propertyDetails.exchange" />
                  </div>
                </div>
              </div>

              <div className="fv-row mb-7 row">
                <div className="col-md-6">
                  <label className="form-label required mb-3">
                    Gayrimenkul Türü
                  </label>
                  <Field
                    as="select"
                    className="form-select form-select-lg form-select-solid"
                    name="propertyDetails.type"
                  >
                    <option></option>
                    <option value="residence">Konut</option>
                    <option value="land">Arsa</option>
                    <option value="office">İş Yeri</option>
                    <option value="project">Proje</option>
                  </Field>

                  <div className="text-danger mt-2">
                    <ErrorMessage name="propertyDetails.type" />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label required mb-3">İlan Türü</label>
                  <Field
                    as="select"
                    className="form-select form-select-lg form-select-solid"
                    name="propertyDetails.for"
                  >
                    <option></option>
                    <option value="sale">Satılık</option>
                    <option value="rent">Kiralık</option>
                    <option value="lease-sale">Devren Satılık</option>
                    <option value="lease-rent">Devren Kiralık</option>
                  </Field>

                  <div className="text-danger mt-2">
                    <ErrorMessage name="propertyDetails.for" />
                  </div>
                </div>
              </div>

              <div className="fv-row mb-20">
                <div className="col-md-12">
                  <label className="form-label required mb-3">
                    İlan Açıklaması
                  </label>
                  <ReactQuill
                    ref={ReactQuillRef}
                    theme="snow"
                    value={description}
                    modules={ReactQuillModules}
                    onChange={(e) => {
                      setDescription(e)
                      setFieldValue("propertyDetails.description", e)
                    }}
                    className="custom-quill"
                  />

                  <input
                    type="hidden"
                    value={description}
                    name="propertyDetails.description"
                  />

                  <div className="text-danger mt-2">
                    <ErrorMessage name="propertyDetails.description" />
                  </div>
                </div>
              </div>

              <div className="fv-row">
                <div
                  className="form-label"
                  data-accordion-toggle="detailedInformation"
                  onClick={(e) => {
                    const target = e.target as HTMLElement
                    target.classList.toggle("active")
                  }}
                >
                  Detaylı Bilgiler
                </div>
                <div
                  className="d-flex flex-column gap-8 mb-0"
                  data-accordion-content="detailedInformation"
                >
                  <div className="fv-row mb-5 row">
                    <div className="col-md-6">
                      <label className="form-label mb-3">Oda Sayısı</label>
                      <Field
                        as="select"
                        className="form-select form-select-lg form-select-solid"
                        name="propertyDetails.room"
                      >
                        <option></option>
                        <option value="1+1">1+1</option>
                        <option value="1.5+1">1.5+1</option>
                        <option value="2+0">2+0</option>
                        <option value="2+1">2+1</option>
                        <option value="2.5+1">2.5+1</option>
                        <option value="2+2">2+2</option>
                        <option value="3+0">3+0</option>
                        <option value="3+1">3+1</option>
                        <option value="3.5+1">3.5+1</option>
                        <option value="3+2">3+2</option>
                        <option value="3+3">3+3</option>
                        <option value="4+0">4+0</option>
                        <option value="4+1">4+1</option>
                        <option value="4.5+1">4.5+1</option>
                        <option value="4.5+2">4.5+2</option>
                        <option value="4+2">4+2</option>
                        <option value="4+3">4+3</option>
                        <option value="4+4">4+4</option>
                        <option value="5+1">5+1</option>
                        <option value="5.5+1">5.5+1</option>
                        <option value="5+2">5+2</option>
                        <option value="5+3">5+3</option>
                        <option value="5+4">5+4</option>
                        <option value="6+1">6+1</option>
                        <option value="6+2">6+2</option>
                        <option value="6.5+1">6.5+1</option>
                        <option value="6+3">6+3</option>
                        <option value="6+4">6+4</option>
                        <option value="7+1">7+1</option>
                        <option value="7+2">7+2</option>
                        <option value="7+3">7+3</option>
                        <option value="8+1">8+1</option>
                        <option value="8+2">8+2</option>
                        <option value="8+3">8+3</option>
                        <option value="8+4">8+4</option>
                        <option value="9+1">9+1</option>
                        <option value="9+2">9+2</option>
                        <option value="9+3">9+3</option>
                        <option value="9+4">9+4</option>
                        <option value="9+5">9+5</option>
                        <option value="9+6">9+6</option>
                        <option value="10+1">10+1</option>
                        <option value="10+2">10+2</option>
                        <option value="10++">10 ve üzeri</option>
                      </Field>

                      <div className="text-danger mt-2">
                        <ErrorMessage name="propertyDetails.room" />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label mb-3">Tapu Durumu</label>
                      <Field
                        as="select"
                        className="form-select form-select-lg form-select-solid"
                        name="propertyDetails.deedStatus"
                      >
                        <option></option>
                        <option value="condominium">Kat Mülkiyetli</option>
                        <option value="floorAltitude">Kat İrtifaklı</option>
                        <option value="shareTitleDeed">Hisseli Tapulu</option>
                        <option value="detachedTitleDeed">
                          Müstakil Tapulu
                        </option>
                        <option value="landTitleDeed">Arsa Tapulu</option>
                      </Field>

                      <div className="text-danger mt-2">
                        <ErrorMessage name="propertyDetails.deedStatus" />
                      </div>
                    </div>
                  </div>

                  <div className="fv-row mb-5 row">
                    <div className="col-md-4">
                      <label className="form-label mb-3">
                        Brüt M<sup>2</sup>
                      </label>
                      <Field
                        type="number"
                        className="form-control form-control-lg form-control-solid"
                        name="propertyDetails.squareGross"
                      />

                      <div className="text-danger mt-2">
                        <ErrorMessage name="propertyDetails.squareGross" />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label mb-3">
                        Net M<sup>2</sup>
                      </label>
                      <Field
                        type="number"
                        className="form-control form-control-lg form-control-solid"
                        name="propertyDetails.squareNet"
                      />

                      <div className="text-danger mt-2">
                        <ErrorMessage name="propertyDetails.squareNet" />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label mb-3">Banyo Sayısı</label>
                      <Field
                        type="number"
                        className="form-control form-control-lg form-control-solid"
                        name="propertyDetails.bathroom"
                      />

                      <div className="text-danger mt-2">
                        <ErrorMessage name="propertyDetails.bathroom" />
                      </div>
                    </div>
                  </div>

                  <div className="fv-row mb-5 row">
                    <div className="col-md-6">
                      <label className="form-label mb-3">Otopark</label>
                      <Field
                        as="select"
                        className="form-select form-select-lg form-select-solid"
                        name="propertyDetails.parkingLot"
                      >
                        <option></option>
                        <option value="openNclosedParkingLot">
                          Açık & Kapalı Otopark
                        </option>
                        <option value="openParkingLot">Açık Otopark</option>
                        <option value="closedParkingLot">Kapalı Otopark</option>
                      </Field>

                      <div className="text-danger mt-2">
                        <ErrorMessage name="propertyDetails.parkingLot" />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label mb-3">Isıtma</label>
                      <Field
                        as="select"
                        className="form-select form-select-lg form-select-solid"
                        name="propertyDetails.heating"
                      >
                        <option></option>
                        <option value="stove">Soba</option>
                        <option value="naturalGasStove">Doğalgaz Sobası</option>
                        <option value="floorRadiator">Kat Kaloriferi</option>
                        <option value="central">Merkezi</option>
                        <option value="centerShareMeter">
                          Merkezi (Pay Ölçer)
                        </option>
                        <option value="combiBoilerNaturalGas">
                          Kombi (Doğalgaz)
                        </option>
                        <option value="combiBoilerElectricity">
                          Kombi (Elektrik)
                        </option>
                        <option value="floorHeating">Yerden Isıtma</option>
                        <option value="airConditioning">Klima</option>
                        <option value="fancoilUnit">Fancoil Ünitesi</option>
                        <option value="solarEnergy">Güneş Enerjisi</option>
                        <option value="electricRadiator">
                          Elektrikli Radyatör
                        </option>
                        <option value="geothermal">Jeotermal</option>
                        <option value="fireplace">Şömine</option>
                        <option value="VRV">VRV</option>
                        <option value="heatPump">Isı Pompası</option>
                      </Field>

                      <div className="text-danger mt-2">
                        <ErrorMessage name="propertyDetails.heating" />
                      </div>
                    </div>
                  </div>

                  <div className="fv-row mb-5 row">
                    <div className="col-md-6">
                      <label className="form-label mb-3">Aidat</label>
                      <CurrencyInput
                        name="propertyDetails.dues"
                        value={currentDues}
                        className="form-control form-control-lg form-control-solid"
                        allowDecimals={false}
                        onValueChange={(value) => {
                          const due = value ? value?.toString() : ""
                          setCurrentDues(due)
                          setFieldValue("propertyDetails.dues", due)
                        }}
                        intlConfig={{ locale: "tr-TR", currency: "TRY" }}
                      />

                      <div className="text-danger mt-2">
                        <ErrorMessage name="propertyDetails.dues" />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label mb-3">Cephe</label>
                      <Field
                        as="select"
                        className="form-select form-select-lg form-select-solid"
                        name="propertyDetails.facade"
                      >
                        <option></option>
                        <option value="north">Kuzey</option>
                        <option value="south">Güney</option>
                        <option value="east">Doğu</option>
                        <option value="west">Batı</option>
                      </Field>

                      <div className="text-danger mt-2">
                        <ErrorMessage name="propertyDetails.facade" />
                      </div>
                    </div>
                  </div>

                  <div className="fv-row mb-5 row">
                    <div className="col-md-4">
                      <label className="form-label mb-3">Bina Yaşı</label>
                      <Field
                        type="number"
                        className="form-control form-control-lg form-control-solid"
                        name="propertyDetails.buildingAge"
                      />

                      <div className="text-danger mt-2">
                        <ErrorMessage name="propertyDetails.buildingAge" />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label mb-3">Bina Kat Sayısı</label>
                      <Field
                        type="number"
                        className="form-control form-control-lg form-control-solid"
                        name="propertyDetails.buildingFloors"
                      />

                      <div className="text-danger mt-2">
                        <ErrorMessage name="propertyDetails.buildingFloors" />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label mb-3">Bulunduğu Kat</label>
                      <Field
                        type="number"
                        className="form-control form-control-lg form-control-solid"
                        name="propertyDetails.buildingAtFloor"
                      />

                      <div className="text-danger mt-2">
                        <ErrorMessage name="propertyDetails.buildingAtFloor" />
                      </div>
                    </div>
                  </div>

                  <div className="fv-row mb-5 row row-gap-4">
                    <div className="col-md-6">
                      <label className="form-label mb-3">Balkon</label>
                      <div className="d-flex gap-2">
                        <label className="d-flex cursor-pointer">
                          <span className="form-check form-check-custom form-check-solid">
                            <Field
                              className="form-check-input"
                              type="radio"
                              name="propertyDetails.balcony"
                              id="balconyTrue"
                              value="true"
                            />
                          </span>
                          <span
                            className="d-flex align-items-center me-2 ms-2"
                            style={{ width: "fitContent" }}
                          >
                            <span className="d-flex flex-column">
                              <span className="fw-bolder text-gray-800 fs-5">
                                Evet
                              </span>
                            </span>
                          </span>
                        </label>

                        <label className="d-flex cursor-pointer">
                          <span className="form-check form-check-custom form-check-solid">
                            <Field
                              className="form-check-input"
                              type="radio"
                              name="propertyDetails.balcony"
                              id="balconyFalse"
                              value="false"
                            />
                          </span>
                          <span
                            className="d-flex align-items-center me-2 ms-2"
                            style={{ width: "fitContent" }}
                          >
                            <span className="d-flex flex-column">
                              <span className="fw-bolder text-gray-800 fs-5">
                                Hayır
                              </span>
                            </span>
                          </span>
                        </label>
                      </div>

                      <div className="text-danger mt-2">
                        <ErrorMessage name="propertyDetails.balcony" />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label mb-3">Asansör</label>
                      <div className="d-flex gap-2">
                        <label className="d-flex cursor-pointer">
                          <span className="form-check form-check-custom form-check-solid">
                            <Field
                              className="form-check-input"
                              type="radio"
                              name="propertyDetails.elevator"
                              id="elevatorTrue"
                              value="true"
                            />
                          </span>
                          <span
                            className="d-flex align-items-center me-2 ms-2"
                            style={{ width: "fitContent" }}
                          >
                            <span className="d-flex flex-column">
                              <span className="fw-bolder text-gray-800 fs-5">
                                Evet
                              </span>
                            </span>
                          </span>
                        </label>

                        <label className="d-flex cursor-pointer">
                          <span className="form-check form-check-custom form-check-solid">
                            <Field
                              className="form-check-input"
                              type="radio"
                              name="propertyDetails.elevator"
                              id="elevatorFalse"
                              value="false"
                            />
                          </span>
                          <span
                            className="d-flex align-items-center me-2 ms-2"
                            style={{ width: "fitContent" }}
                          >
                            <span className="d-flex flex-column">
                              <span className="fw-bolder text-gray-800 fs-5">
                                Hayır
                              </span>
                            </span>
                          </span>
                        </label>
                      </div>

                      <div className="text-danger mt-2">
                        <ErrorMessage name="propertyDetails.elevator" />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label mb-3">Eşyalı</label>
                      <div className="d-flex gap-2">
                        <label className="d-flex cursor-pointer">
                          <span className="form-check form-check-custom form-check-solid">
                            <Field
                              className="form-check-input"
                              type="radio"
                              name="propertyDetails.withAccesories"
                              id="withAccesoriesTrue"
                              value="true"
                            />
                          </span>
                          <span
                            className="d-flex align-items-center me-2 ms-2"
                            style={{ width: "fitContent" }}
                          >
                            <span className="d-flex flex-column">
                              <span className="fw-bolder text-gray-800 fs-5">
                                Evet
                              </span>
                            </span>
                          </span>
                        </label>

                        <label className="d-flex cursor-pointer">
                          <span className="form-check form-check-custom form-check-solid">
                            <Field
                              className="form-check-input"
                              type="radio"
                              name="propertyDetails.withAccesories"
                              id="withAccesoriesFalse"
                              value="false"
                            />
                          </span>
                          <span
                            className="d-flex align-items-center me-2 ms-2"
                            style={{ width: "fitContent" }}
                          >
                            <span className="d-flex flex-column">
                              <span className="fw-bolder text-gray-800 fs-5">
                                Hayır
                              </span>
                            </span>
                          </span>
                        </label>
                      </div>

                      <div className="text-danger mt-2">
                        <ErrorMessage name="propertyDetails.withAccesories" />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label mb-3">Site İçi</label>
                      <div className="d-flex gap-2">
                        <label className="d-flex cursor-pointer">
                          <span className="form-check form-check-custom form-check-solid">
                            <Field
                              className="form-check-input"
                              type="radio"
                              name="propertyDetails.inComplex"
                              id="inComplexTrue"
                              value="true"
                            />
                          </span>
                          <span
                            className="d-flex align-items-center me-2 ms-2"
                            style={{ width: "fitContent" }}
                          >
                            <span className="d-flex flex-column">
                              <span className="fw-bolder text-gray-800 fs-5">
                                Evet
                              </span>
                            </span>
                          </span>
                        </label>

                        <label className="d-flex cursor-pointer">
                          <span className="form-check form-check-custom form-check-solid">
                            <Field
                              className="form-check-input"
                              type="radio"
                              name="propertyDetails.inComplex"
                              id="inComplexFalse"
                              value="false"
                            />
                          </span>
                          <span
                            className="d-flex align-items-center me-2 ms-2"
                            style={{ width: "fitContent" }}
                          >
                            <span className="d-flex flex-column">
                              <span className="fw-bolder text-gray-800 fs-5">
                                Hayır
                              </span>
                            </span>
                          </span>
                        </label>
                      </div>

                      <div className="text-danger mt-2">
                        <ErrorMessage name="propertyDetails.inComplex" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="fv-row">
                <div
                  className="form-label"
                  data-accordion-toggle="features"
                  onClick={(e) => {
                    const target = e.target as HTMLElement
                    target.classList.toggle("active")
                  }}
                >
                  Özellikler
                </div>
                <div
                  className="d-flex flex-column pt-3 mb-0"
                  data-accordion-content="features"
                >
                  <div className="fv-row">
                    <label
                      className="form-label"
                      data-accordion-toggle="featuresInner"
                      onClick={(e) => {
                        const target = e.target as HTMLElement
                        target.classList.toggle("active")
                      }}
                    >
                      İç Özellikler
                    </label>

                    <div
                      className="d-flex row row-gap-8"
                      data-accordion-content="featuresInner"
                    >
                      {featuresInner.map((feature, index) => (
                        <label
                          key={index}
                          className="d-flex align-items-start cursor-pointer col-4 col-md-3"
                        >
                          <span className="form-check form-check-custom form-check-solid">
                            <Field
                              className="form-check-input"
                              type="checkbox"
                              name="propertyDetails.featuresInner"
                              id={`featuresInner${index + 1}`}
                              value={feature}
                              checked={values.propertyDetails?.featuresInner?.includes(
                                feature
                              )}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleFeaturesChange(
                                  e,
                                  "featuresInner",
                                  values,
                                  setFieldValue
                                )
                              }
                            />
                          </span>
                          <span className="fw-bolder text-gray-800 fs-7 me-2 ms-2">
                            {feature}
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className="text-danger mt-2">
                      <ErrorMessage name="propertyDetails.featuresInner" />
                    </div>
                  </div>

                  <div className="fv-row">
                    <label
                      className="form-label"
                      data-accordion-toggle="featuresOuter"
                      onClick={(e) => {
                        const target = e.target as HTMLElement
                        target.classList.toggle("active")
                      }}
                    >
                      Dış Özellikler
                    </label>

                    <div
                      className="d-flex row row-gap-8"
                      data-accordion-content="featuresOuter"
                    >
                      {featuresOuter.map((feature, index) => (
                        <label
                          key={index}
                          className="d-flex align-items-start cursor-pointer col-4 col-md-3"
                        >
                          <span className="form-check form-check-custom form-check-solid">
                            <Field
                              className="form-check-input"
                              type="checkbox"
                              name="propertyDetails.featuresOuter"
                              id={`featuresOuter${index + 1}`}
                              value={feature}
                              checked={values.propertyDetails?.featuresOuter?.includes(
                                feature
                              )}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleFeaturesChange(
                                  e,
                                  "featuresOuter",
                                  values,
                                  setFieldValue
                                )
                              }
                            />
                          </span>
                          <span className="fw-bolder text-gray-800 fs-7 me-2 ms-2">
                            {feature}
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className="text-danger mt-2">
                      <ErrorMessage name="propertyDetails.featuresOuter" />
                    </div>
                  </div>

                  <div className="fv-row">
                    <label
                      className="form-label"
                      data-accordion-toggle="featuresNeighbourhood"
                      onClick={(e) => {
                        const target = e.target as HTMLElement
                        target.classList.toggle("active")
                      }}
                    >
                      Muhit Özellikleri
                    </label>

                    <div
                      className="d-flex row row-gap-8"
                      data-accordion-content="featuresNeighbourhood"
                    >
                      {featuresNeighbourhood.map((feature, index) => (
                        <label
                          key={index}
                          className="d-flex align-items-start cursor-pointer col-4 col-md-3"
                        >
                          <span className="form-check form-check-custom form-check-solid">
                            <Field
                              className="form-check-input"
                              type="checkbox"
                              name="propertyDetails.featuresNeighbourhood"
                              id={`featuresNeighbourhood${index + 1}`}
                              value={feature}
                              checked={values.propertyDetails?.featuresNeighbourhood?.includes(
                                feature
                              )}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleFeaturesChange(
                                  e,
                                  "featuresNeighbourhood",
                                  values,
                                  setFieldValue
                                )
                              }
                            />
                          </span>
                          <span className="fw-bolder text-gray-800 fs-7 me-2 ms-2">
                            {feature}
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className="text-danger mt-2">
                      <ErrorMessage name="propertyDetails.featuresNeighbourhood" />
                    </div>
                  </div>

                  <div className="fv-row">
                    <label
                      className="form-label"
                      data-accordion-toggle="featuresTransportation"
                      onClick={(e) => {
                        const target = e.target as HTMLElement
                        target.classList.toggle("active")
                      }}
                    >
                      Ulaşım Özellikleri
                    </label>

                    <div
                      className="d-flex row row-gap-8"
                      data-accordion-content="featuresTransportation"
                    >
                      {featuresTransportation.map((feature, index) => (
                        <label
                          key={index}
                          className="d-flex align-items-start cursor-pointer col-4 col-md-3"
                        >
                          <span className="form-check form-check-custom form-check-solid">
                            <Field
                              className="form-check-input"
                              type="checkbox"
                              name="propertyDetails.featuresTransportation"
                              id={`featuresTransportation${index + 1}`}
                              value={feature}
                              checked={values.propertyDetails?.featuresTransportation?.includes(
                                feature
                              )}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleFeaturesChange(
                                  e,
                                  "featuresTransportation",
                                  values,
                                  setFieldValue
                                )
                              }
                            />
                          </span>
                          <span className="fw-bolder text-gray-800 fs-7 me-2 ms-2">
                            {feature}
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className="text-danger mt-2">
                      <ErrorMessage name="propertyDetails.featuresNeighbourhood" />
                    </div>
                  </div>

                  <div className="fv-row">
                    <label
                      className="form-label"
                      data-accordion-toggle="featuresView"
                      onClick={(e) => {
                        const target = e.target as HTMLElement
                        target.classList.toggle("active")
                      }}
                    >
                      Manzara
                    </label>

                    <div
                      className="d-flex row row-gap-8"
                      data-accordion-content="featuresView"
                    >
                      {featuresView.map((feature, index) => (
                        <label
                          key={index}
                          className="d-flex align-items-start cursor-pointer col-4 col-md-3"
                        >
                          <span className="form-check form-check-custom form-check-solid">
                            <Field
                              className="form-check-input"
                              type="checkbox"
                              name="propertyDetails.featuresView"
                              id={`featuresView${index + 1}`}
                              value={feature}
                              checked={values.propertyDetails?.featuresView?.includes(
                                feature
                              )}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleFeaturesChange(
                                  e,
                                  "featuresView",
                                  values,
                                  setFieldValue
                                )
                              }
                            />
                          </span>
                          <span className="fw-bolder text-gray-800 fs-7 me-2 ms-2">
                            {feature}
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className="text-danger mt-2">
                      <ErrorMessage name="propertyDetails.featuresView" />
                    </div>
                  </div>

                  <div className="fv-row">
                    <label
                      className="form-label"
                      data-accordion-toggle="featuresRealEstateType"
                      onClick={(e) => {
                        const target = e.target as HTMLElement
                        target.classList.toggle("active")
                      }}
                    >
                      Konut Tipi
                    </label>

                    <div
                      className="d-flex row row-gap-8"
                      data-accordion-content="featuresRealEstateType"
                    >
                      {featuresRealEstateType.map((feature, index) => (
                        <label
                          key={index}
                          className="d-flex align-items-start cursor-pointer col-4 col-md-3"
                        >
                          <span className="form-check form-check-custom form-check-solid">
                            <Field
                              className="form-check-input"
                              type="checkbox"
                              name="propertyDetails.featuresRealEstateType"
                              id={`featuresRealEstateType${index + 1}`}
                              value={feature}
                              checked={values.propertyDetails?.featuresRealEstateType?.includes(
                                feature
                              )}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleFeaturesChange(
                                  e,
                                  "featuresRealEstateType",
                                  values,
                                  setFieldValue
                                )
                              }
                            />
                          </span>
                          <span className="fw-bolder text-gray-800 fs-7 me-2 ms-2">
                            {feature}
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className="text-danger mt-2">
                      <ErrorMessage name="propertyDetails.featuresRealEstateType" />
                    </div>
                  </div>

                  <div className="fv-row">
                    <label
                      className="form-label"
                      data-accordion-toggle="featuresForDisabled"
                      onClick={(e) => {
                        const target = e.target as HTMLElement
                        target.classList.toggle("active")
                      }}
                    >
                      Engelliye ve Yaşlıya Uygun
                    </label>

                    <div
                      className="d-flex row row-gap-8"
                      data-accordion-content="featuresForDisabled"
                    >
                      {featuresForDisabled.map((feature, index) => (
                        <label
                          key={index}
                          className="d-flex align-items-start cursor-pointer col-4 col-md-3"
                        >
                          <span className="form-check form-check-custom form-check-solid">
                            <Field
                              className="form-check-input"
                              type="checkbox"
                              name="propertyDetails.featuresForDisabled"
                              id={`featuresForDisabled${index + 1}`}
                              value={feature}
                              checked={values.propertyDetails?.featuresForDisabled?.includes(
                                feature
                              )}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleFeaturesChange(
                                  e,
                                  "featuresForDisabled",
                                  values,
                                  setFieldValue
                                )
                              }
                            />
                          </span>
                          <span className="fw-bolder text-gray-800 fs-7 me-2 ms-2">
                            {feature}
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className="text-danger mt-2">
                      <ErrorMessage name="propertyDetails.featuresForDisabled" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="fv-row">
                <div
                  className="form-label"
                  data-accordion-toggle="location"
                  onClick={(e) => {
                    const target = e.target as HTMLElement
                    target.classList.toggle("active")
                  }}
                >
                  Konum
                </div>
                <div
                  className="d-flex flex-column gap-8 mb-0"
                  data-accordion-content="location"
                >
                  <APIProvider
                    apiKey={import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY}
                  >
                    <GoogleMapStep
                      values={values}
                      setFieldValue={setFieldValue}
                      height={300}
                    />
                  </APIProvider>
                </div>
              </div>

              <div className="fv-row">
                <div
                  className="form-label mb-8"
                  data-accordion-toggle="property"
                  onClick={(e) => {
                    const target = e.target as HTMLElement
                    target.classList.toggle("active")
                  }}
                >
                  Portföy
                </div>
                <div
                  className="d-flex flex-column gap-8 mb-0"
                  data-accordion-content="property"
                >
                  <div className="fv-row mb-3">
                    <label className="form-label required mb-3">
                      Gayrimenkul Danışmanı
                    </label>

                    <MultiSelect
                      options={users}
                      defaultValue={currentUsers}
                      id="userIds"
                      name="userIds"
                      notFoundText="Aramanızla eşleşen bir kullanıcı bulunamadı."
                    />

                    <div className="form-text">
                      Lütfen portföy sahibi gayrimenkul danışmanlarını seçin.
                      Eğer sisteme kayıtlı değilse{" "}
                      <Link
                        to="/arayuz/kullanici-yonetimi/kullanici-ekle"
                        target="_blank"
                      >
                        Kullanıcı Ekle
                      </Link>{" "}
                      sayfasından kaydedebilirsiniz.
                    </div>
                    <div className="text-danger mt-2">
                      <ErrorMessage name="userIds" />
                    </div>
                  </div>

                  <div className="fv-row mb-3">
                    <div className="col-md-12">
                      <label className="form-label mb-3 required">
                        Gayrimenkul Sahibinin Adı Soyadı
                      </label>

                      <Field
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        name="ownerDetails.ownerFullName"
                      />

                      <div className="text-danger mt-2">
                        <ErrorMessage name="ownerDetails.ownerFullName" />
                      </div>
                    </div>
                  </div>

                  <div className="fv-row mb-3">
                    <label className="form-label mb-3 required">
                      Gayrimenkul Sahibinin Telefon Numarası
                    </label>

                    <div className="position-relative">
                      <Field
                        className="form-control form-control-lg form-control-solid"
                        placeholder="+90 5xx xxx xx xx"
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handlePhoneNumberChange(e, setFieldValue)
                        }
                        value={currentPhoneNumber}
                        style={{ paddingLeft: "40px" }}
                        name="ownerDetails.ownerPhoneNumber"
                      />
                      <span
                        className={`fi fi-${countryCode?.toLowerCase()} position-absolute`}
                        style={{
                          top: "50%",
                          transform: "translateY(-50%)",
                          left: "13px",
                        }}
                      ></span>
                    </div>
                    <div className="form-text">
                      Lütfen numaranın başında ülke kodu bulundurun. Örn. +90
                    </div>
                    <div className="text-danger mt-2">
                      <ErrorMessage name="ownerDetails.ownerPhoneNumber" />
                    </div>
                  </div>

                  <div className="fv-row mb-3 row">
                    <div className="col-md-6">
                      <label className="form-label mb-3 required">
                        Yetki Türü
                      </label>
                      <Field
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        name="ownerDetails.permit"
                      />

                      <div className="form-text">
                        Lütfen yetki türünü belirtin. Örn. Yetki belgesi
                        imzalandı, mesaj aracılığıyla alındı.
                      </div>
                      <div className="text-danger mt-2">
                        <ErrorMessage name="ownerDetails.permit" />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label required mb-3">
                        Yetki Fiyatı
                      </label>
                      <CurrencyInput
                        name="ownerDetails.permitPrice"
                        value={currentPermitPrice}
                        className="form-control form-control-lg form-control-solid"
                        allowDecimals={false}
                        onValueChange={(value) => {
                          const permitPrice = value ? value?.toString() : ""
                          setCurrentPermitPrice(permitPrice)
                          setFieldValue("ownerDetails.permitPrice", permitPrice)
                        }}
                        intlConfig={{ locale: "tr-TR", currency: "TRY" }}
                      />

                      <div className="text-danger mt-2">
                        <ErrorMessage name="ownerDetails.permitPrice" />
                      </div>
                    </div>
                  </div>

                  <div className="fv-row mb-3 row">
                    <div className="col-md-6">
                      <label className="form-label mb-3 required">
                        Yetki Başlangıç Tarihi
                      </label>
                      <Field
                        type="date"
                        className="form-control form-control-lg form-control-solid"
                        name="ownerDetails.permitDate"
                      />

                      <div className="text-danger mt-2">
                        <ErrorMessage name="ownerDetails.permitDate" />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label mb-3 required">
                        Yetki Bitiş Tarihi
                      </label>
                      <Field
                        type="date"
                        className="form-control form-control-lg form-control-solid"
                        name="ownerDetails.permitUntilDate"
                      />

                      <div className="text-danger mt-2">
                        <ErrorMessage name="ownerDetails.permitUntilDate" />
                      </div>
                    </div>
                  </div>

                  <div className="fv-row mb-3 row">
                    <label className="form-label fs-4  mb-5">
                      İlan Numaraları
                    </label>
                    <div className="col-md-4">
                      <label className="form-label mb-3">Sahibinden</label>
                      <Field
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        name="sahibindenNo"
                      />

                      <div className="text-danger mt-2">
                        <ErrorMessage name="sahibindenNo" />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label mb-3">Emlakjet</label>
                      <Field
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        name="emlakJetNo"
                      />

                      <div className="text-danger mt-2">
                        <ErrorMessage name="emlakJetNo" />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label mb-3">Hepsiemlak</label>
                      <Field
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        name="hepsiEmlakNo"
                      />

                      <div className="text-danger mt-2">
                        <ErrorMessage name="hepsiEmlakNo" />
                      </div>
                    </div>
                  </div>

                  <div className="fv-row mb-3 row">
                    <div className="col-md-12">
                      <label className="form-label mb-3">İlan Notu</label>
                      <Field
                        as="textarea"
                        className="form-control form-control-lg form-control-solid"
                        name="personalDescription"
                      />

                      <div className="text-danger mt-2">
                        <ErrorMessage name="personalDescription" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* end::Scroll */}

            {/* begin::Actions */}
            <div className="text-center pt-15">
              <button
                type="button"
                onClick={() => cancel()}
                className="btn btn-light me-3"
                data-kt-properties-modal-action="cancel"
                disabled={submittingForm || isPropertyLoading}
              >
                İptal
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                data-kt-properties-modal-action="submit"
                disabled={!isValid || isPropertyLoading || submittingForm}
              >
                <span className="indicator-label">Kaydet</span>
                {submittingForm && (
                  <span className="indicator-progress">
                    Lütfen Bekleyin...{" "}
                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                )}
              </button>
            </div>
            {/* end::Actions */}
          </Form>
        )}
      </Formik>
      {isPropertyLoading && <PropertiesListLoading />}
    </>
  )
}

export { PropertyEditModalForm }
