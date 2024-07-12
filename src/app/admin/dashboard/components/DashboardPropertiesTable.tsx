/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react"

import { KTIcon } from "../../../../_metronic/helpers"

import { Property } from "../../../modules/apps/property-management/_core/_models"
import { User } from "../../../modules/apps/user-management/_core/_models"
import { Office } from "../../../modules/apps/office-management/_core/_models"
import {
  ISODateToTimestamp,
  formatPrice,
} from "../../../../_metronic/helpers/kyHelpers"

type Props = {
  className: string
  properties: Property[]
  users?: User[]
  offices?: Office[]
}

const DashboardPropertiesTable: React.FC<Props> = ({
  className,
  properties,
  users,
  offices,
}) => {
  const [latestProperties, setLatestProperties] = useState<Property[]>()

  useEffect(() => {
    if (properties.length > 0) {
      const sortedProperties = [...properties].sort(
        (a, b) =>
          ISODateToTimestamp(b.createdAt) - ISODateToTimestamp(a.createdAt)
      )
      setLatestProperties(sortedProperties.slice(0, 10))
    }
  }, [properties])

  return (
    <div className={`card ${className}`}>
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">Yeni İlanlar</span>
          <span className="text-muted mt-1 fw-semibold fs-7">
            Toplam {properties.length} ilan
          </span>
        </h3>
        <div className="card-toolbar">
          <a
            href="/arayuz/ilan-yonetimi/ilan-ekle"
            className="btn btn-sm btn-light-primary"
          >
            <KTIcon iconName="plus" className="fs-2" />
            Yeni İlan
          </a>
        </div>
      </div>
      <div className="card-body py-3">
        <div className="table-responsive">
          <table className="table align-middle gs-0 gy-4">
            <thead>
              <tr className="fw-bold text-muted bg-light">
                <th className="ps-4 min-w-325px rounded-start">İlan Başlığı</th>
                {users && <th className="min-w-125px">Danışman</th>}
                {offices && <th className="min-w-150px">Ofis</th>}
                <th className="min-w-125px">Fiyat</th>
                <th className="pe-4 min-w-200px text-end rounded-end">
                  Yayında
                </th>
              </tr>
            </thead>
            <tbody>
              {latestProperties &&
                latestProperties.map((property) => (
                  <tr>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="symbol symbol-50px me-5">
                          <img
                            src={property.propertyDetails.photoURLs[0] ?? ""}
                            alt={property.title}
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <div className="d-flex justify-content-start flex-column">
                          <a
                            href={`/arayuz/ilan-detayi/${property.id}/genel`}
                            className="text-gray-900 fw-bold text-hover-primary text-uppercase mb-1 fs-6"
                            style={{
                              maxWidth: 300,
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              textWrap: "nowrap",
                            }}
                            title={property.title}
                          >
                            {property.title}
                          </a>
                          <span
                            className="text-muted fw-semibold text-muted d-block fs-7 w-200px"
                            style={{
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                            }}
                          >
                            {property.propertyDetails.address.label}
                          </span>
                        </div>
                      </div>
                    </td>
                    {users && (
                      <td>
                        <div className="d-flex gap-3">
                          {users
                            .filter((user) =>
                              property.userIds.includes(user.id)
                            )
                            .map((user, i) => (
                              <div className="position-relative" key={i}>
                                <a
                                  href={`/arayuz/kullanici-detayi/${user.id}/genel`}
                                  target="_blank"
                                  key={user.id}
                                  className="symbol symbol-circle symbol-30px with-tooltip overflow-hidden"
                                  style={{
                                    marginRight: -20,
                                    border: "2px solid #fff",
                                  }}
                                >
                                  <div className="symbol-label">
                                    <img
                                      src={`${user.photoURL}`}
                                      alt={user.firstName}
                                      className="w-100"
                                    />
                                  </div>
                                </a>
                                <span className="symbol-tooltip">
                                  {`${user.firstName} ${user.lastName}`}
                                </span>
                              </div>
                            ))}
                        </div>
                      </td>
                    )}
                    {offices && (
                      <td>
                        {offices
                          .filter((office) =>
                            property.officeId.includes(office.id)
                          )
                          .map((office) => (
                            <a
                              href={`/arayuz/ofis-detayi/${office.id}/genel`}
                              target="_blank"
                              className="text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6"
                            >
                              {import.meta.env.VITE_APP_NAME} {office.name}
                            </a>
                          ))}
                      </td>
                    )}
                    <td>
                      <span className="text-gray-900 fw-bold d-block mb-1 fs-6">
                        {formatPrice(property.propertyDetails.price)}
                      </span>
                    </td>
                    <td className="text-end">
                      <span
                        className={`badge badge-light-${
                          property.saleDetails?.active ? "success" : "danger"
                        } fs-7 fw-semibold`}
                      >
                        {property.saleDetails?.active ? "Evet" : "Hayır"}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export { DashboardPropertiesTable }
