import React, { useEffect, useState } from "react"
import { KTIcon, toAbsoluteUrl } from "../../../../_metronic/helpers"
import { User } from "../../../modules/apps/user-management/_core/_models"
import { getAllUsers } from "../../../modules/apps/user-management/_core/_requests"
import { getUserRoleText } from "../../../../_metronic/helpers/kyHelpers"
import { getOfficeById } from "../../../modules/apps/office-management/_core/_requests"

type Props = {
  className: string
}

const DashboardUsersTable: React.FC<Props> = ({ className }) => {
  const [users, setUsers] = useState<User[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const fetchUsers = async () => {
    try {
      const usersArr = await getAllUsers()

      usersArr.sort((a, b) => {
        if (a.firstName < b.firstName) return -1
        if (a.firstName > b.firstName) return 1
        return 0
      })

      setUsers(usersArr)

      const totalUsers = usersArr.length
      setTotalPages(Math.ceil(totalUsers / 10))
    } catch (error) {
      console.error("Error fetching agents and brokers:", error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">
            Danışman İstatistikleri
          </span>
          {users ? (
            <span className="text-muted mt-1 fw-semibold fs-7">
              {users.length} Danışman
            </span>
          ) : (
            ""
          )}
        </h3>
        <div
          className="card-toolbar"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          data-bs-trigger="hover"
          title="Click to add a user"
        >
          <a
            href="#"
            className="btn btn-sm btn-light-primary"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_invite_friends"
          >
            <KTIcon iconName="plus" className="fs-3" />
            Yeni Danışman
          </a>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className="card-body py-3">
        {/* begin::Table container */}
        <div className="table-responsive">
          {/* begin::Table */}
          <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
            {/* begin::Table head */}
            <thead>
              <tr className="fw-bold text-muted">
                <th className="w-25px">
                  <div className="form-check form-check-sm form-check-custom form-check-solid">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="1"
                      data-kt-check="true"
                      data-kt-check-target=".widget-9-check"
                    />
                  </div>
                </th>
                <th className="min-w-150px">Danışman</th>
                <th className="min-w-140px">Ofis</th>
                <th className="min-w-120px">Bu Ayki Kazanç</th>
                <th className="min-w-100px text-end">Actions</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {users
                ? users.map((user) => {
                    return (
                      <tr>
                        <td>
                          <div className="form-check form-check-sm form-check-custom form-check-solid">
                            <input
                              className="form-check-input widget-9-check"
                              type="checkbox"
                              value="1"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="symbol symbol-45px me-5">
                              <img
                                src={user.photoURL ?? ""}
                                alt={`${user.firstName} ${user.lastName}`}
                                style={{ objectFit: "cover" }}
                              />
                            </div>
                            <div className="d-flex justify-content-start flex-column">
                              <a
                                href="#"
                                className="text-gray-900 fw-bold text-hover-primary fs-6"
                              >
                                {user.firstName} {user.lastName}
                              </a>
                              <span className="text-muted fw-semibold text-muted d-block fs-7">
                                {getUserRoleText(user.role)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <a
                            href="#"
                            className="text-gray-900 fw-bold text-hover-primary d-block fs-6"
                          >
                            Keya Ankara
                          </a>
                          <span className="text-muted fw-semibold text-muted d-block fs-7">
                            Ankara
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="d-flex flex-column w-100 me-2">
                            <div className="d-flex flex-stack mb-2">
                              <span className="text-muted me-2 fs-7 fw-semibold">
                                ₺15.000
                              </span>
                            </div>
                            {/* <div className="progress h-6px w-100">
                              <div
                                className="progress-bar bg-primary"
                                role="progressbar"
                                style={{ width: "50%" }}
                              ></div>
                            </div> */}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex justify-content-end flex-shrink-0">
                            <a
                              href="#"
                              className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                            >
                              <KTIcon iconName="switch" className="fs-3" />
                            </a>
                            <a
                              href="#"
                              className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                            >
                              <KTIcon iconName="pencil" className="fs-3" />
                            </a>
                            <a
                              href="#"
                              className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
                            >
                              <KTIcon iconName="trash" className="fs-3" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                : ""}
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  )
}

export { DashboardUsersTable }
