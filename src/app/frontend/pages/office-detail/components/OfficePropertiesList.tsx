import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Property } from "../../../../modules/apps/property-management/_core/_models"
import { KYPropertyCard } from "../../properties/components/KYPropertyCard/KYPropertyCard"
import { KYPagination } from "../../../components/KYPagination/KYPagination"
import { getAllProperties } from "../../../../modules/apps/property-management/_core/_requests"
import { Office } from "../../../../modules/apps/office-management/_core/_models"

interface Props {
  office: Office
  properties: Property[]
  propertiesLoaded: boolean
}

const PAGE_SIZE = 8

const OfficePropertiesList: React.FC<Props> = ({ office }) => {
  const [properties, setProperties] = useState<Property[]>([])
  const [propertiesLoaded, setPropertiesLoaded] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const allProperties = await getAllProperties()

        const officeProperties = allProperties.filter((property) =>
          property.officeId.includes(office.id)
        )

        officeProperties.sort((a, b) => {
          if (a.createdAt < b.createdAt) return -1
          if (a.createdAt > b.createdAt) return 1
          return 0
        })

        setProperties(officeProperties)
        setPropertiesLoaded(true)

        const totalOffices = officeProperties.length
        setTotalPages(Math.ceil(totalOffices / PAGE_SIZE))
      } catch (error) {
        setPropertiesLoaded(false)
        console.error("Error fetching properties:", error)
      }
    }

    fetchProperties()
  }, [office])

  const renderOffices = () => {
    const startIndex = (currentPage - 1) * PAGE_SIZE
    const endIndex = startIndex + PAGE_SIZE
    return properties.slice(startIndex, endIndex).map((property, idx) => (
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 + idx * 0.1 }}
        className="col-lg-3"
        key={property.id}
      >
        <KYPropertyCard property={property} />
      </motion.div>
    ))
  }

  return (
    <>
      <div className="row ky-offices-list" style={{ marginBottom: "auto" }}>
        {renderOffices()}
      </div>
      {propertiesLoaded && properties.length > PAGE_SIZE && (
        <KYPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      )}
    </>
  )
}

export { OfficePropertiesList }
