import { FC, useEffect, useState } from "react"
import { Property } from "../../../_core/_models"

type Props = {
  property: Property
}

const PropertyInfoCell: FC<Props> = ({ property }) => {
  const [photoURL, setPhotoURL] = useState("")

  useEffect(() => {
    if (property.propertyDetails.photoURLs) {
      setPhotoURL(property.propertyDetails.photoURLs[0])
    }
  }, [property])

  return (
    <div className="d-flex align-items-center">
      {/* begin:: Avatar */}
      <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
        <a href={`/arayuz/ilan-detayi/${property.id}/genel`}>
          <div
            className="symbol-label"
            style={{ background: "var(--bs-gray-200)" }}
          >
            {photoURL ? (
              <img
                src={photoURL}
                alt={property?.title}
                className="w-100"
                style={{ height: "100%", width: "100%", objectFit: "cover" }}
              />
            ) : (
              ""
            )}
          </div>
        </a>
      </div>
      <div className="d-flex flex-column">
        <a
          href={`/arayuz/ilan-detayi/${property.id}/genel`}
          className="text-gray-800 text-hover-primary"
        >
          {property?.title}
        </a>
      </div>
      {property.saleDetails?.soldDate ? (
        <div className="d-flex align-items-center border border-danger rounded-1 ms-4 p-1 fs-8 text-danger">
          SATILDI
        </div>
      ) : (
        ""
      )}
    </div>
  )
}

export { PropertyInfoCell }
