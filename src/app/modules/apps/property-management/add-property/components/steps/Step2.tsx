import { FC, useState, useEffect, ChangeEvent, DragEvent } from "react"
import { Field, ErrorMessage, useFormikContext } from "formik"

import {
  urlify,
  generateRandomName,
} from "../../../../../../../_metronic/helpers/kyHelpers"

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage"
import { firebaseApp } from "../../../../../../../firebase/BaseConfig"

import Lightbox from "yet-another-react-lightbox"
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails"
import "yet-another-react-lightbox/styles.css"
import "yet-another-react-lightbox/plugins/thumbnails.css"

import CurrencyInput from "react-currency-input-field"

import toast from "react-hot-toast"

const storage = getStorage(firebaseApp)

interface Step2Props {
  values: {
    title: string
  }
  setFieldValue: (
    field: string,
    value: string,
    shouldValidate?: boolean
  ) => void
}

const Step2: FC<Step2Props> = ({ values }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const [isDragging, setIsDragging] = useState(false)
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([])

  const { setFieldValue } = useFormikContext()

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
        `images/properties/${urlify(values.title)}/${randomName}`
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

      await deleteObject(storageRef)

      setUploadedImageUrls((prevUrls) =>
        prevUrls.filter((prevUrl) => prevUrl !== url)
      )
    } catch (error) {
      console.error("Error deleting image:", error)
    }
  }

  useEffect(() => {
    setFieldValue("propertyDetails.photoURLs", uploadedImageUrls)
  }, [setFieldValue, uploadedImageUrls])

  return (
    <div className="w-100">
      <div className="pb-10 pb-lg-15">
        <h2 className="fw-bolder text-gray-900">Detaylı Bilgiler</h2>
        <div className="text-gray-500 fw-bold fs-6">
          İlana dair detaylı bilgileri girin. Lütfen ilan görsellerinin özenle
          çekilmiş olduğundan emin olun.
        </div>
      </div>

      <div className="fv-row mb-10">
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

            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
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
          <ErrorMessage name="propertyDetails.photoURLs" className="mt-10" />
        </div>
      </div>

      <div className="fv-row mb-10 row">
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
            <option value="detachedTitleDeed">Müstakil Tapulu</option>
            <option value="landTitleDeed">Arsa Tapulu</option>
          </Field>

          <div className="text-danger mt-2">
            <ErrorMessage name="propertyDetails.deedStatus" />
          </div>
        </div>
      </div>

      <div className="fv-row mb-10 row">
        <div className="col-md-6">
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

        <div className="col-md-6">
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
      </div>

      <div className="fv-row mb-10 row">
        <div className="col-md-6">
          <label className="form-label mb-3">Otopark</label>
          <Field
            as="select"
            className="form-select form-select-lg form-select-solid"
            name="propertyDetails.parkingLot"
          >
            <option></option>
            <option value="openNclosedParkingLot">Açık & Kapalı Otopark</option>
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
            <option value="centerShareMeter">Merkezi (Pay Ölçer)</option>
            <option value="combiBoilerNaturalGas">Kombi (Doğalgaz)</option>
            <option value="combiBoilerElectricity">Kombi (Elektrik)</option>
            <option value="floorHeating">Yerden Isıtma</option>
            <option value="airConditioning">Klima</option>
            <option value="fancoilUnit">Fancoil Ünitesi</option>
            <option value="solarEnergy">Güneş Enerjisi</option>
            <option value="electricRadiator">Elektrikli Radyatör</option>
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

      <div className="fv-row mb-10 row">
        <div className="col-md-6">
          <label className="form-label mb-3">Aidat</label>
          <CurrencyInput
            name="propertyDetails.dues"
            className="form-control form-control-lg form-control-solid"
            allowDecimals={false}
            onValueChange={(value) => {
              const due = value ? value?.toString() : ""
              setFieldValue("propertyDetails.dues", due)
            }}
            intlConfig={{ locale: "tr-TR", currency: "TRY" }}
          />

          <div className="text-danger mt-2">
            <ErrorMessage name="propertyDetails.dues" />
          </div>
        </div>

        <div className="col-md-6">
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

      <div className="fv-row mb-10 row">
        <label className="form-label mb-3">Cephe</label>
        <div className="d-flex flex-wrap justify-content-between gap-2">
          <label className="d-flex cursor-pointer">
            <span className="form-check form-check-custom form-check-solid">
              <Field
                className="form-check-input"
                type="checkbox"
                name="propertyDetails.facade"
                id="facadeWest"
                value="west"
              />
            </span>
            <span
              className="d-flex align-items-center me-2 ms-2"
              style={{ width: "fitContent" }}
            >
              <span className="d-flex flex-column">
                <span className="fw-bolder text-gray-800 fs-5">Batı</span>
              </span>
            </span>
          </label>

          <label className="d-flex cursor-pointer">
            <span className="form-check form-check-custom form-check-solid">
              <Field
                className="form-check-input"
                type="checkbox"
                name="propertyDetails.facade"
                id="facadeEast"
                value="east"
              />
            </span>
            <span
              className="d-flex align-items-center me-2 ms-2"
              style={{ width: "fitContent" }}
            >
              <span className="d-flex flex-column">
                <span className="fw-bolder text-gray-800 fs-5">Doğu</span>
              </span>
            </span>
          </label>

          <label className="d-flex cursor-pointer">
            <span className="form-check form-check-custom form-check-solid">
              <Field
                className="form-check-input"
                type="checkbox"
                name="propertyDetails.facade"
                id="facadeSouth"
                value="south"
              />
            </span>
            <span
              className="d-flex align-items-center me-2 ms-2"
              style={{ width: "fitContent" }}
            >
              <span className="d-flex flex-column">
                <span className="fw-bolder text-gray-800 fs-5">Güney</span>
              </span>
            </span>
          </label>

          <label className="d-flex cursor-pointer">
            <span className="form-check form-check-custom form-check-solid">
              <Field
                className="form-check-input"
                type="checkbox"
                name="propertyDetails.facade"
                id="facadeNorth"
                value="north"
              />
            </span>
            <span
              className="d-flex align-items-center me-2 ms-2"
              style={{ width: "fitContent" }}
            >
              <span className="d-flex flex-column">
                <span className="fw-bolder text-gray-800 fs-5">Kuzey</span>
              </span>
            </span>
          </label>
        </div>

        <div className="text-danger mt-2">
          <ErrorMessage name="propertyDetails.facade" />
        </div>
      </div>

      <div className="fv-row mb-10 row">
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

      <div className="mb-10 fv-row row row-gap-4">
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
                  <span className="fw-bolder text-gray-800 fs-5">Evet</span>
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
                  <span className="fw-bolder text-gray-800 fs-5">Hayır</span>
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
                  <span className="fw-bolder text-gray-800 fs-5">Evet</span>
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
                  <span className="fw-bolder text-gray-800 fs-5">Hayır</span>
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
                  <span className="fw-bolder text-gray-800 fs-5">Evet</span>
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
                  <span className="fw-bolder text-gray-800 fs-5">Hayır</span>
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
                  <span className="fw-bolder text-gray-800 fs-5">Evet</span>
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
                  <span className="fw-bolder text-gray-800 fs-5">Hayır</span>
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
  )
}

export { Step2 }
