/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState, useEffect, ChangeEvent, DragEvent } from "react"
import { ErrorMessage, useFormikContext } from "formik"

import {
  slugify,
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

import toast from "react-hot-toast"

const storage = getStorage(firebaseApp)

interface Step3Props {
  values: {
    name: string
  }
}

const Step3: FC<Step3Props> = ({ values }) => {
  const [isDragging, setIsDragging] = useState(false)
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
        `images/offices/${slugify(values.name)}/${randomName}`
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

  const handleImageDelete = async (url: string, setFieldValue: any) => {
    try {
      const storageRef = ref(storage, url)

      await deleteObject(storageRef)

      setUploadedImageUrls((prevUrls) =>
        prevUrls.filter((prevUrl) => prevUrl !== url)
      )
      setFieldValue("photoURLs", uploadedImageUrls)
    } catch (error) {
      console.error("Error deleting image:", error)
    }
  }

  useEffect(() => {
    setFieldValue("photoURLs", uploadedImageUrls)
  }, [setFieldValue, uploadedImageUrls])

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
            onChange={(e) => {
              handleImageChange(e)
            }}
            multiple
          />
          <label htmlFor="ky-office-image-input">Görsel Seç veya Sürükle</label>
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
                  handleImageDelete(url, setFieldValue)
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
          <ErrorMessage name="photoURLs" className="mt-10" />
        </div>
      </div>
    </div>
  )
}

export { Step3 }
