import React from "react"

import { Property } from "../../../modules/apps/property-management/_core/_models"

interface DetailsProps {
  property: Property
}

const Details: React.FC<DetailsProps> = () => {
  return (
    <div className="row g-5 g-xxl-8">
      <div className="col-12 d-flex flex-column gap-5">
        <div className="card">
          <div className="card-body">
            <h3 className="card-title align-items-start flex-column">
              <span className="card-label fw-bold fs-3 mb-1">
                İlan Bilgileri
              </span>
            </h3>
            <div className="separator separator-dashed my-10"></div>

            <div className="d-flex justify-content-center py-10">
              <span className="text-gray-500 fw-bold">
                İlan bilgisi bulunamadı.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Details }
