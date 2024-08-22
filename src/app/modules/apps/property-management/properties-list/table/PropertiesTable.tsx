import { useEffect, useState } from "react"
import { Property } from "../../_core/_models"
import { PropertiesListLoading } from "../components/loading/PropertiesListLoading"
import { KTCardBody } from "../../../../../../_metronic/helpers"
import { MenuComponent } from "../../../../../../_metronic/assets/ts/components"
import { getAllProperties } from "../../_core/_requests"
import { PropertyActionsCell } from "./columns/PropertyActionsCell"
import { PropertyInfoCell } from "./columns/PropertyInfoCell"
import { PropertySelectionCell } from "./columns/PropertySelectionCell"
import { PropertyBadgeCell } from "./columns/PropertyBadgeCell"
import { PropertiesListPagination } from "../components/pagination/PropertiesListPagination"
import { useListView } from "../../_core/ListViewProvider"
import { slugify } from "../../../../../../_metronic/helpers/kyHelpers"
import { PropertyUsersCell } from "./columns/PropertyUsersCell"
import { PropertyActiveCell } from "./columns/PropertyActiveCell"
import { PropertyPermitUntilCell } from "./columns/PropertyPermitUntilCell"

const PropertiesTable = () => {
  const { searchTerm } = useListView()

  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const fetchProperties = async () => {
      const allProperties = await getAllProperties()
      setProperties(allProperties ?? [])
    }

    fetchProperties()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      setFilteredProperties(
        properties.filter((property) =>
          slugify(property.title).includes(slugify(searchTerm.toLowerCase()))
        )
      )
    } else {
      setFilteredProperties(properties)
    }
    setCurrentPage(1)
  }, [searchTerm, properties])

  useEffect(() => {
    MenuComponent.reinitialization()
  }, [searchTerm, currentPage, filteredProperties])

  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <KTCardBody className="py-4">
      <div className="table-responsive">
        <table
          id="kt_table_properties"
          className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
        >
          <thead>
            <tr className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0">
              <th colSpan={1} role="columnheader" className="w-10px pe-2"></th>
              <th colSpan={1} role="columnheader" className="min-w-125px">
                İlan Başlığı
              </th>
              <th colSpan={1} role="columnheader" className="min-w-125px">
                Danışman
              </th>
              <th colSpan={1} role="columnheader" className="min-w-125px">
                Fiyat
              </th>
              <th colSpan={1} role="columnheader" className="min-w-125px">
                Yayında
              </th>
              <th colSpan={1} role="columnheader" className="min-w-125px">
                Yetki Bitiş Tarihi
              </th>
              <th
                colSpan={1}
                role="columnheader"
                className="text-end min-w-100px"
              ></th>
            </tr>
          </thead>
          <tbody className="text-gray-600 fw-bold">
            {properties.length ? (
              paginatedProperties.length ? (
                paginatedProperties.map((property) => (
                  <tr role="row" key={property.id}>
                    <td role="cell">
                      <PropertySelectionCell id={property.id} />
                    </td>
                    <td role="cell">
                      <PropertyInfoCell property={property} />
                    </td>
                    <td role="cell">
                      <PropertyUsersCell userIds={property.userIds} />
                    </td>
                    <td role="cell">
                      <PropertyBadgeCell
                        text={property.propertyDetails.price}
                      />
                    </td>
                    <td role="cell">
                      <PropertyActiveCell
                        isActive={property.saleDetails?.active}
                      />
                    </td>
                    <td role="cell">
                      <PropertyPermitUntilCell
                        date={property.ownerDetails?.permitUntilDate}
                      />
                    </td>
                    <td className="text-end min-w-100px actions" role="cell">
                      <PropertyActionsCell
                        id={property.id}
                        userIds={property.userIds}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <div className="d-flex text-center w-100 align-content-center justify-content-center">
                      Bu filtrelere uygun ilan bulunamadı.
                    </div>
                  </td>
                </tr>
              )
            ) : (
              <PropertiesListLoading />
            )}
          </tbody>
        </table>
      </div>

      <PropertiesListPagination
        propertiesLength={filteredProperties.length}
        paginatedPropertiesLength={paginatedProperties.length}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </KTCardBody>
  )
}

export { PropertiesTable }
