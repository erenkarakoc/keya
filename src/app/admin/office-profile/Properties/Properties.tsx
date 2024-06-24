import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import { UsersList } from "./components/UsersList"

import { KTIcon } from "../../../../_metronic/helpers"

import { Property } from "../../../modules/apps/property-management/_core/_models"
import { getPropertiesByOfficeId } from "../../../modules/apps/property-management/_core/_requests"
import {
  convertToTurkishDate,
  formatPrice,
} from "../../../../_metronic/helpers/kyHelpers"

export function Properties() {
  const { id } = useParams()
  const [propertiesLoading, setPropertiesLoading] = useState(true)

  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [propertiesLength, setPropertiesLength] = useState(0)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const PROPERTIES_PER_PAGE = 6

  const [sortOption, setSortOption] = useState("default")

  useEffect(() => {
    const fetchProperties = async () => {
      if (id) {
        setPropertiesLoading(true)
        const propertiesArr: Property[] = await getPropertiesByOfficeId(id)
        setProperties(propertiesArr)
        setPropertiesLength(propertiesArr.length)
        setFilteredProperties(propertiesArr.slice(0, PROPERTIES_PER_PAGE))
        setTotalPages(Math.ceil(propertiesArr.length / PROPERTIES_PER_PAGE))
        setPropertiesLoading(false)
      }
    }

    fetchProperties()
  }, [id])

  useEffect(() => {
    filterProperties(sortOption)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties, sortOption])

  const filterProperties = (sortOption: string) => {
    const sortedProperties = [...properties]

    switch (sortOption) {
      case "ascendingPrice":
        sortedProperties.sort(
          (a, b) =>
            parseFloat(a.propertyDetails.price) -
            parseFloat(b.propertyDetails.price)
        )
        break
      case "descendingPrice":
        sortedProperties.sort(
          (a, b) =>
            parseFloat(b.propertyDetails.price) -
            parseFloat(a.propertyDetails.price)
        )
        break
      case "newToOld":
        sortedProperties.sort(
          (a, b) => parseInt(b.createdAt) - parseInt(a.createdAt)
        )
        break
      case "oldToNew":
        sortedProperties.sort(
          (a, b) => parseInt(a.createdAt) - parseInt(b.createdAt)
        )

        break
      default:
        // default sorting by createdAt from new to old
        sortedProperties.sort(
          (a, b) => parseInt(b.createdAt) - parseInt(a.createdAt)
        )
        break
    }

    setFilteredProperties(sortedProperties.slice(0, PROPERTIES_PER_PAGE))
    setTotalPages(Math.ceil(sortedProperties.length / PROPERTIES_PER_PAGE))
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    const start = (page - 1) * PROPERTIES_PER_PAGE
    const end = page * PROPERTIES_PER_PAGE
    setFilteredProperties(properties.slice(start, end))
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value)
  }

  return (
    <>
      <div className="d-flex flex-wrap flex-stack mb-6">
        <h3 className="fw-bolder my-2">
          Portföyler
          <span className="fs-6 text-gray-500 fw-bold ms-1">
            ({propertiesLength})
          </span>
        </h3>

        <div className="d-flex my-2">
          <select
            name="sortOption"
            className="form-select form-select-white form-select-sm w-125px me-2"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="default">Sırala</option>
            <option value="newToOld">Yeniden Eskiye</option>
            <option value="oldToNew">Eskiden Yeniye</option>
            <option value="ascendingPrice">Fiyata Göre Artan</option>
            <option value="descendingPrice">Fiyata Göre Azalan</option>
          </select>

          <a
            href="/arayuz/ilan-yonetimi/ilan-ekle"
            target="_blank"
            className="btn btn-sm btn-light-primary"
          >
            <KTIcon iconName="plus" className="fs-2" />
            Yeni İlan
          </a>
        </div>
      </div>

      {propertiesLoading ? (
        <div className="d-flex align-items-center justify-content-center text-gray-600 fw-semibold fs-7 py-20 w-100">
          <span className="spinner-border spinner-border-lg"></span>
        </div>
      ) : filteredProperties.length ? (
        <>
          <div className="row g-6 g-xl-9">
            {filteredProperties.map((property, i) => (
              <div className="col-md-6 col-xl-4" key={i}>
                <div className="card border border-2 border-gray-300 border-hover overflow-hidden h-100">
                  <div className="card-header border-0 p-0 pb-0">
                    <img
                      src={property.propertyDetails.photoURLs[0]}
                      alt={property.title}
                      style={{
                        aspectRatio: "1 / 0.7",
                        width: "100%",
                        objectFit: "cover",
                        overflow: "hidden",
                      }}
                    />

                    <div className="card-toolbar">
                      <span
                        className={`badge badge-light-${
                          property.saleDetails?.active ? "success" : "danger"
                        } fw-bolder me-auto px-4 py-3`}
                        style={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                        }}
                      >
                        {property.saleDetails?.active
                          ? "Yayında"
                          : "Yayında Değil"}
                      </span>
                    </div>
                  </div>

                  <div className="card-body p-6">
                    <Link
                      to={`/arayuz/ilan-detayi/${property.id}/genel`}
                      target="_blank"
                      className="fs-3 fw-bolder text-gray-900 text-hover-primary text-uppercase"
                    >
                      {property.title}
                    </Link>

                    <p className="text-gray-500 fw-bold fs-5 mt-1 mb-7">
                      {property.propertyDetails.address.label}
                    </p>

                    <div className="d-flex flex-wrap">
                      <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-7 mb-3">
                        <div className="fs-6 text-gray-800 fw-bolder">
                          {formatPrice(property.propertyDetails.price)}
                        </div>
                        <div className="fw-bold text-gray-500">Fiyat</div>
                      </div>

                      <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 mb-3">
                        <div className="fs-6 text-gray-800 fw-bolder">
                          {convertToTurkishDate(
                            property.ownerDetails?.permitUntilDate ?? ""
                          )}
                        </div>
                        <div className="fw-bold text-gray-500">
                          Yetki Bitiş Tarihi
                        </div>
                      </div>
                    </div>

                    {property.userIds.length > 1 && (
                      <UsersList property={property} currentUserId={id ?? ""} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {propertiesLength > 5 ? (
            <div className="d-flex flex-stack flex-wrap pt-10">
              <div className="fs-6 fw-bold text-gray-700">
                {`${propertiesLength} ilandan ${
                  PROPERTIES_PER_PAGE * (currentPage - 1) + 1
                } - ${Math.min(
                  PROPERTIES_PER_PAGE * currentPage,
                  propertiesLength
                )} gösteriliyor`}
              </div>

              <ul className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                  <li
                    key={index}
                    className={`page-item ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            ""
          )}
        </>
      ) : (
        <div className="text-gray-600 fw-semibold fs-7 card py-20 rounded text-center border border-gray-200">
          {propertiesLength && !filteredProperties.length
            ? "Bu filtreye uygun portföy bulunamadı."
            : "Ofise ait portföy bulunamadı."}
        </div>
      )}
    </>
  )
}
