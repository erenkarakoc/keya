/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState, useEffect, ChangeEvent, DragEvent } from "react"
import { ErrorMessage, useFormikContext } from "formik"

import {
  generateRandomName,
  urlify,
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

import imageCompression from "browser-image-compression"
import toast from "react-hot-toast"

const storage = getStorage(firebaseApp)

interface Step3Props {
  values: {
    name: string
  }
}

const Step3: FC<Step3Props> = ({ values }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [totalImagesToUpload, setTotalImagesToUpload] = useState(0)
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([])

  const [lightboxOpen, setLightboxOpen] = useState(false)

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
    const remainingSlots = 100 - currentCount

    setUploadingImages(true)
    setTotalImagesToUpload(files.length)

    if (currentCount >= 100) {
      toast.error("En fazla 100 görsel ekleyebilirsiniz.")
      return
    }

    const filesToUpload = files.slice(0, remainingSlots)
    const excessFiles = files.slice(remainingSlots)

    filesToUpload.forEach(async (file) => {
      let readyToUpload = file
      const fileSizeInMB = file.size / (1024 * 1024)

      if (fileSizeInMB > 2) {
        try {
          const compressionPromise = imageCompression(file, { maxSizeMB: 2 })

          toast.promise(
            compressionPromise,
            {
              loading: `${file.name} adlı yüksek boyutlu görsel sıkıştırılıyor, lütfen bekleyin...`,
              success: `${file.name} adlı görsel başarıyla sıkıştırıldı.`,
              error: `${file.name} adlı görsel sıkıştırılamadı. Lütfen tekrar deneyin veya farklı bir görsel yükleyin.`,
            },
            {
              id: file.name,
              success: {
                duration: 2000,
              },
              position: "bottom-right",
            }
          )

          const compressedFile = await compressionPromise
          readyToUpload = compressedFile
        } catch (error) {
          toast.error(
            `${file.name} adlı dosya yüklenemedi. Dosya boyutu 5 MB'den küçük olmalıdır!`
          )
        }
      }

      const randomName = generateRandomName()
      const storageRef = ref(
        storage,
        `images/offices/${urlify(values.name)}/${randomName}`
      )
      const uploadPromise = uploadBytes(storageRef, readyToUpload)
        .then(() => getDownloadURL(storageRef))
        .then((downloadURL) => {
          setUploadedImageUrls((prevUrls) => [...prevUrls, downloadURL])
        })
        .catch((error) => console.error("Error uploading image:", error))

      uploadPromises.push(uploadPromise)
    })

    await Promise.all(uploadPromises)

    setUploadingImages(false)

    if (excessFiles.length > 0) {
      toast.error("En fazla 100 görsel ekleyebilirsiniz.")
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
    setFieldValue("photoURLs", uploadedImageUrls)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedImageUrls])

  return (
    <div className="w-100">
      <div className="pb-10 pb-lg-15">
        <h2 className="fw-bolder text-gray-900">Görseller</h2>
        <div className="text-gray-500 fw-bold fs-6">
          Ofis görsellerinizi yükleyin. Lütfen ofis görsellerinin özenle
          çekilmiş olduğundan emin olun.
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

            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              await handleFiles(Array.from(e.dataTransfer.files))
              e.dataTransfer.clearData()
            }
          }}
        >
          <input
            id="ky-office-image-input"
            type="file"
            accept=".png, .jpg, .jpeg"
            onChange={handleImageChange}
            multiple
          />
          <label htmlFor="ky-office-image-input">Görsel Seç veya Sürükle</label>
        </div>

        <div className="form-text mt-4">
          İzin verilen dosya türleri: png, jpg, jpeg.
        </div>

        {uploadingImages ? (
          <div className="d-flex align-items-center gap-5 mt-5">
            <div className="text-gray-600 fw-semibold fs-7">
              <span className="spinner-border spinner-border-lg"></span>
            </div>
            <span className="text-gray-600">
              Görseller karşıya yükleniyor. {uploadedImageUrls.length} /{" "}
              {totalImagesToUpload} yüklendi.
            </span>
          </div>
        ) : (
          ""
        )}

        <div
          className="image-input image-input-outline d-flex flex-wrap py-5 px-2 gap-2 mt-6"
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
                boxShadow: "0 0 10px -2px rgba(0, 0, 0, 0.1)",
              }}
              onClick={() => {
                setLightboxOpen(true)
              }}
            >
              <label
                className="btn btn-icon btn-circle btn-color-white w-20px h-20px bg-gray-500 bg-hover-gray-400 shadow"
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

        {!uploadingImages && uploadedImageUrls.length ? (
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
          <ErrorMessage name="photoURLs" className="mt-10" />
        </div>
      </div>
    </div>
  )
}

export { Step3 }
