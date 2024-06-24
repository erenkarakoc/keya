import React from "react"

import { Property } from "../../../modules/apps/property-management/_core/_models"

interface OverviewProps {
  property: Property
}

const Overview: React.FC<OverviewProps> = ({ property }) => {
  return (
    <div className="row g-5 g-xxl-8">
      <div className="col-12 d-flex flex-column gap-5">
        <div className="card">
          <div className="card-body">
            <h3 className="card-title align-items-start flex-column">
              <span className="card-label fw-bold fs-3 mb-1">
                İlan Açıklaması
              </span>
            </h3>
            <div className="separator separator-dashed my-10"></div>
            <div
              dangerouslySetInnerHTML={{
                __html: property.propertyDetails.description ?? "",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export { Overview }
