import React from "react"
import { KTIcon } from "../../../../_metronic/helpers"

import { User } from "../../../modules/apps/user-management/_core/_models"
import { Office } from "../../../modules/apps/office-management/_core/_models"

import { getUserRoleText } from "../../../../_metronic/helpers/kyHelpers"
import { KYOfficeImage } from "../../../frontend/components/KYOfficeImage/KYOfficeImage"

type Props = {
  className: string
  users: User[]
  offices: Office[] | undefined
}

const DashboardAgentsTable: React.FC<Props> = ({
  users,
  offices,
  className,
}) => {
  return (
    <div className={`card ${className}`}>
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
            href="/arayuz/kullanici-yonetimi/kullanici-ekle"
            className="btn btn-sm btn-light-primary"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_invite_friends"
          >
            <KTIcon iconName="plus" className="fs-3" />
            Yeni Danışman
          </a>
        </div>
      </div>
      <div className="card-body py-3">
        <div className="table-responsive">
          <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
            <thead>
              <tr className="fw-bold text-muted">
                <th className="min-w-150px">Danışman</th>
                {offices && <th className="min-w-140px">Ofis</th>}
                <th className="min-w-120px">Bu Ayki Kazanç</th>
                <th className="min-w-100px text-end"></th>
              </tr>
            </thead>
            <tbody>
              {users
                ? users.map((user, i) => {
                    return (
                      <tr key={i}>
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
                                href={`/arayuz/kullanici-detayi/${user.id}/genel`}
                                target="_blank"
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
                        {offices && (
                          <td>
                            {offices
                              .filter((office) =>
                                user.officeId.includes(office.id)
                              )
                              .map((office) => (
                                <a
                                  href={`/arayuz/ofis-detayi/${office.id}/genel`}
                                  target="_blank"
                                  className="text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6"
                                >
                                  {/* {import.meta.env.VITE_APP_NAME} {office.name} */}
                                  <KYOfficeImage
                                    officeName={office.name}
                                    height={50}
                                    width={50}
                                  />
                                </a>
                              ))}
                          </td>
                        )}
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
          </table>
        </div>
      </div>
    </div>
  )
}

export { DashboardAgentsTable }
