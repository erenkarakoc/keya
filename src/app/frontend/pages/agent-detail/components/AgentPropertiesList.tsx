import { User } from "../../../../modules/apps/user-management/_core/_models"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Property } from "../../../../modules/apps/property-management/_core/_models"
import { KYPropertyCard } from "../../properties/components/KYPropertyCard/KYPropertyCard"
import { KYPagination } from "../../../components/KYPagination/KYPagination"
import { getAllProperties } from "../../../../modules/apps/property-management/_core/_requests"

interface Props {
  user: User
}

const PAGE_SIZE = 8

const AgentPropertiesList: React.FC<Props> = ({ user }) => {
  const [properties, setProperties] = useState<Property[]>([])
  const [propertiesLoaded, setPropertiesLoaded] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const allProperties = await getAllProperties()

        const userProperties = allProperties.filter((property) =>
          property.userIds.includes(user.id)
        )

        userProperties.sort((a, b) => {
          if (a.createdAt < b.createdAt) return -1
          if (a.createdAt > b.createdAt) return 1
          return 0
        })

        setProperties(userProperties)
        setPropertiesLoaded(true)

        const totalOffices = userProperties.length
        setTotalPages(Math.ceil(totalOffices / PAGE_SIZE))
      } catch (error) {
        setPropertiesLoaded(false)
        console.error("Error fetching properties:", error)
      }
    }

    fetchProperties()
  }, [user])

  const renderOffices = () => {
    const startIndex = (currentPage - 1) * PAGE_SIZE
    const endIndex = startIndex + PAGE_SIZE
    return propertiesLoaded ? (
      properties.length ? (
        properties.slice(startIndex, endIndex).map((property, idx) => (
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
      ) : (
        <div className="text-white opacity-50 fw-semibold fs-7 py-20 rounded text-center border border-2 border-gray-200">
          Kullanıcıya ait ilan bulunamadı.
        </div>
      )
    ) : (
      <div className="d-flex align-items-center justify-content-center fw-semibold fs-7 py-20 w-100 text-white opacity-50">
        <span className="spinner-border spinner-border-lg"></span>
      </div>
    )
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

export { AgentPropertiesList }
