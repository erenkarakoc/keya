import { useEffect, useState } from "react"
import { PageLink, PageTitle } from "../../../../_metronic/layout/core"
import { FranchiseApplication } from "./_core/_models"
import {
  deleteFranchiseApplication,
  getAllFranchiseApplications,
} from "./_core/_requests"
import { Button, Modal } from "react-bootstrap"
import { KTIcon } from "../../../../_metronic/helpers"
import toast from "react-hot-toast"
import {
  getCountryById,
  getStateById,
} from "../../../../_metronic/helpers/kyHelpers"

const franchiseBreadcrumbs: Array<PageLink> = [
  {
    title: "Franchise Yönetimi",
    path: "franchise-yonetimi",
    isSeparator: false,
    isActive: false,
  },
]

const PAGE_SIZE = 10

const FranchisePage = () => {
  const [show, setShow] = useState(false)

  const [applicationsLoaded, setApplicationsLoaded] = useState(false)
  const [applications, setApplications] = useState<FranchiseApplication[]>()

  const [currentApplication, setCurrentApplication] =
    useState<FranchiseApplication>()
  const [currentCountry, setCurrentCountry] = useState("")
  const [currentState, setCurrentState] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const visibleApplications = applications?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const fetchApplications = async () => {
    const allApplications = await getAllFranchiseApplications()
    setApplications(allApplications)
    setApplicationsLoaded(true)
    setTotalPages(Math.ceil(allApplications.length / PAGE_SIZE))
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  return (
    <div>
      <PageTitle breadcrumbs={franchiseBreadcrumbs}>Başvurular</PageTitle>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Başvuruları Gözden Geçir</div>

          <div className="card-toolbar">
            <div
              className="d-flex justify-content-end"
              data-kt-office-table-toolbar="base"
            >
              <button
                type="button"
                className="btn btn-light-primary me-3"
                data-kt-menu-trigger="click"
                data-kt-menu-placement="bottom-end"
              >
                <KTIcon iconName="filter" className="fs-2" />
                Filtrele
              </button>
              <div
                className="menu menu-sub menu-sub-dropdown w-300px w-md-325px"
                data-kt-menu="true"
              >
                <div className="px-7 py-5">
                  <div className="fs-5 text-gray-900 fw-bolder">
                    Filtreleme Seçenekleri
                  </div>
                </div>

                <div className="separator border-gray-200"></div>

                <div className="px-7 py-5" data-kt-office-table-filter="form">
                  <div className="mb-10">
                    <label className="form-label fs-6 fw-bold">Tarih:</label>
                    <select
                      className="form-select form-select-solid fw-bolder"
                      data-kt-select2="true"
                      data-placeholder="Select option"
                      data-allow-clear="true"
                      data-kt-office-table-filter="two-step"
                      data-hide-search="true"
                    >
                      <option value=""></option>
                      <option value="" selected>
                        Yenden Eskiye
                      </option>
                      <option value="">Eskiden Yeniye</option>
                    </select>
                  </div>

                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-light btn-active-light-primary fw-bold me-2 px-6"
                      data-kt-menu-dismiss="true"
                      data-kt-office-table-filter="reset"
                    >
                      Sıfırla
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary fw-bold px-6"
                      data-kt-menu-dismiss="true"
                      data-kt-office-table-filter="filter"
                    >
                      Uygula
                    </button>
                  </div>
                </div>
              </div>

              <button type="button" className="btn btn-light-primary me-3">
                <KTIcon iconName="exit-up" className="fs-2" />
                Dışa Aktar
              </button>
            </div>
          </div>
        </div>
        <div className="card-body py-10">
          <div className="d-flex flex-column gap-3">
            {applicationsLoaded
              ? visibleApplications?.length
                ? visibleApplications.map((application) => (
                    <div
                      key={application.id}
                      className="d-flex justify-content-between align-items-center bg-gray-100 rounded py-5 pe-5"
                    >
                      <div className="ps-5 text-gray-800 fs-6 fw-bold">
                        {application.firstName} {application.lastName}
                      </div>
                      <Button
                        type="button"
                        className="ms-5"
                        onClick={() => {
                          setCurrentApplication(application)
                          if (application.address.country) {
                            const country = getCountryById(
                              Number(application.address.country)
                            )
                            setCurrentCountry(country?.translations.tr ?? "")
                          }
                          if (application.address.state) {
                            const state = getStateById(
                              Number(application.address.state)
                            )
                            setCurrentState(state?.name ?? "")
                          }
                          setShow(true)
                        }}
                      >
                        İncele
                      </Button>
                    </div>
                  ))
                : "Bulunamadı"
              : "Loading..."}
          </div>

          <div className="d-flex justify-content-center">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <Button
                className="btn-sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <KTIcon iconName="left" className="fs-3 p-0" />
              </Button>

              <span
                style={{ userSelect: "none", margin: "0 10px" }}
                className="text-gray-700 fw-bolder"
              >
                {currentPage} / {totalPages}
              </span>
              <Button
                className="btn-sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <KTIcon iconName="right" className="fs-3 p-0" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header>
          <div className="d-flex justify-content-between align-items-center w-100">
            <Modal.Title>Başvuru Detayı</Modal.Title>
            <div
              className="btn btn-icon btn-sm btn-active-light-primary ms-2"
              onClick={() => setShow(false)}
              aria-label="Close"
            >
              <KTIcon iconName="cross" iconType="solid" className="fs-1" />
            </div>
          </div>
        </Modal.Header>

        <Modal.Body>
          <div
            className="d-flex flex-column me-n7 pe-7 pt-5"
            id="kt_modal_franchise_application_scroll"
            data-kt-scroll="true"
            data-kt-scroll-activate="{default: false, lg: true}"
            data-kt-scroll-max-height="auto"
            data-kt-scroll-dependencies="#kt_modal_franchise_application_header"
            data-kt-scroll-wrappers="#kt_modal_franchise_application_scroll"
            data-kt-scroll-offset="300px"
            style={{ maxHeight: "unset" }}
          >
            <div className="row">
              <div className="col-6 mb-3">
                <label
                  className="fw-bolder fs-7 mb-2 text-gray-600 text-uppercase spacing"
                  style={{ letterSpacing: "1px" }}
                >
                  Ad Soyad
                </label>
                <div className="fw-normal fs-6 mb-2">
                  {currentApplication?.firstName} {currentApplication?.lastName}
                </div>
              </div>

              {currentApplication?.occupation && (
                <div className="col-6 mb-3">
                  <label
                    className="fw-bolder fs-7 mb-2 text-gray-600 text-uppercase spacing"
                    style={{ letterSpacing: "1px" }}
                  >
                    Meslek
                  </label>
                  <div className="fw-normal fs-6 mb-2">
                    {currentApplication.occupation}
                  </div>
                </div>
              )}
              {currentApplication?.address.country && (
                <div className="col-6 mb-3">
                  <label
                    className="fw-bolder fs-7 mb-2 text-gray-600 text-uppercase spacing"
                    style={{ letterSpacing: "1px" }}
                  >
                    Ülke
                  </label>
                  <div className="fw-normal fs-6 mb-2">{currentCountry}</div>
                </div>
              )}
              {currentApplication?.address.state && (
                <div className="col-6 mb-3">
                  <label
                    className="fw-bolder fs-7 mb-2 text-gray-600 text-uppercase spacing"
                    style={{ letterSpacing: "1px" }}
                  >
                    Şehir
                  </label>
                  <div className="fw-normal fs-6 mb-2">{currentState}</div>
                </div>
              )}
              {currentApplication?.phoneNumber && (
                <div className="col-6 mb-3">
                  <label
                    className="fw-bolder fs-7 mb-2 text-gray-600 text-uppercase spacing"
                    style={{ letterSpacing: "1px" }}
                  >
                    Telefon Numarası
                  </label>
                  <div className="fw-normal fs-6 mb-2">
                    {currentApplication.phoneNumber}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Modal.Footer className="mt-10 pb-0 px-0">
            <div className="d-flex w-100">
              <button
                type="button"
                className="btn btn-danger me-3"
                onClick={async () => {
                  if (currentApplication?.id) {
                    await deleteFranchiseApplication(currentApplication.id)
                  }
                  setShow(false)
                  toast.success("Başvuru silindi.")
                  fetchApplications()
                }}
              >
                Başvuruyu Sil
              </button>
              <button
                type="button"
                className="btn btn-light"
                style={{ marginLeft: "auto" }}
                onClick={() => setShow(false)}
              >
                Kapat
              </button>
              <a
                className="btn btn-success ms-3"
                href={`tel:${currentApplication?.phoneNumber}`}
              >
                Başvuranı Ara
              </a>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default FranchisePage
