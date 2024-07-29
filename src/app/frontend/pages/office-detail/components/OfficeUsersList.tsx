import { motion } from "framer-motion"
import { useEffect, useState } from "react"

import { KYPagination } from "../../../components/KYPagination/KYPagination"

import { Office } from "../../../../modules/apps/office-management/_core/_models"
import { User } from "../../../../modules/apps/user-management/_core/_models"
import { getAllUsers } from "../../../../modules/apps/user-management/_core/_requests"
import { KYAgentCard } from "../../agents/components/KYAgentCard/KYAgentCard"

interface Props {
  office: Office
}

const PAGE_SIZE = 8

const OfficeUsersList: React.FC<Props> = ({ office }) => {
  const [users, setUsers] = useState<User[]>([])
  const [usersLoaded, setUsersLoaded] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers()

        const officeUsers = allUsers.filter((user) =>
          user.officeId.includes(office.id)
        )

        officeUsers.sort((a, b) => {
          if (a.createdAt < b.createdAt) return -1
          if (a.createdAt > b.createdAt) return 1
          return 0
        })

        setUsers(officeUsers)
        setUsersLoaded(true)

        const totalOffices = officeUsers.length
        setTotalPages(Math.ceil(totalOffices / PAGE_SIZE))
      } catch (error) {
        setUsersLoaded(false)
        console.error("Error fetching users:", error)
      }
    }

    fetchUsers()
  }, [office])

  const renderOffices = () => {
    const startIndex = (currentPage - 1) * PAGE_SIZE
    const endIndex = startIndex + PAGE_SIZE
    return users.slice(startIndex, endIndex).map((user, idx) => (
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 + idx * 0.1 }}
        className="col-lg-3"
        key={user.id}
      >
        <KYAgentCard user={user} officeNameDisabled={true} />
      </motion.div>
    ))
  }

  return (
    <>
      <div className="row ky-offices-list" style={{ marginBottom: "auto" }}>
        {users.length ? (
          renderOffices()
        ) : (
          <div className="text-white opacity-50 fw-semibold fs-7 py-20 rounded text-center border border-2 border-gray-200">
            Ofise ait ilan bulunamadı.
          </div>
        )}
      </div>
      {usersLoaded && users.length > PAGE_SIZE && (
        <KYPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      )}
    </>
  )
}

export { OfficeUsersList }
