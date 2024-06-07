import { FC, useState, useEffect, ChangeEvent } from "react"
import { ErrorMessage, useFormikContext } from "formik"

import {
  slugify,
  generateRandomName,
} from "../../../../../../../_metronic/helpers/kyHelpers"

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
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
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([])

  const { setFieldValue } = useFormikContext()

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      const uploadPromises: Promise<void>[] = []

      files.forEach((file) => {
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
          `images/properties/${slugify(values.name)}-${randomName}`
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
          İlan görsellerinizi yükleyin. Lütfen ilan görsellerinin özenle
          çekilmiş olduğundan emin olun.
        </div>
      </div>

      <div className="fv-row mb-10">
        <label className="form-label mb-5 w-100 required">
          Bilgisayarınızdan seçin
        </label>

        <input
          type="file"
          accept=".png, .jpg, .jpeg"
          onChange={handleImageChange}
          multiple
        />

        <div
          className="image-input image-input-outline d-flex flex-wrap mt-6"
          data-kt-image-input="true"
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

                  const index = uploadedImageUrls.indexOf(url)
                  if (index !== -1) {
                    const updatedUrls = [...uploadedImageUrls]
                    updatedUrls.splice(index, 1)
                    setUploadedImageUrls(updatedUrls)
                  }
                }}
              >
                <i className="bi bi-x fs-7"></i>
                <input type="hidden" name="avatar_remove" />
              </label>
            </div>
          ))}
        </div>

        <div className="form-text mt-6">
          İzin verilen dosya türleri: png, jpg, jpeg.
        </div>

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
