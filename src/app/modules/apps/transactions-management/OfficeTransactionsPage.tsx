import { useEffect, useState } from "react"
import { PageLink, PageTitle } from "../../../../_metronic/layout/core"
import { OfficeTransaction } from "./_core/_models"
import { deleteTransaction, getAllOfficeTransactions } from "./_core/_requests"
import { Button, Modal } from "react-bootstrap"
import { KTIcon } from "../../../../_metronic/helpers"
import toast from "react-hot-toast"
import {
  convertToTurkishDate,
  formatPrice,
} from "../../../../_metronic/helpers/kyHelpers"
import { getAllOffices } from "../office-management/_core/_requests"
import { Office } from "../office-management/_core/_models"
import { KYOfficeImage } from "../../../frontend/components/KYOfficeImage/KYOfficeImage"

const franchiseBreadcrumbs: Array<PageLink> = [
  {
    title: "Ofis Muhasebesi",
    path: "islem-yonetimi",
    isSeparator: false,
    isActive: false,
  },
]

const PAGE_SIZE = 10

const OfficeTransactionsPage = () => {
  const [show, setShow] = useState(false)

  const [officeTransactionsLoaded, setOfficeTransactionsLoaded] =
    useState(false)
  const [officeTransactions, setOfficeTransactions] =
    useState<OfficeTransaction[]>()

  const [currentOfficeTransaction, setCurrentOfficeTransaction] =
    useState<OfficeTransaction>()

  const [offices, setOffices] = useState<Office[]>()

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

  const visibleTransactions = officeTransactions?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const fetchOfficeTransactions = async () => {
    const allOfficeTransactions = await getAllOfficeTransactions()
    setOfficeTransactions(allOfficeTransactions)
    setOfficeTransactionsLoaded(true)
    setTotalPages(Math.ceil(allOfficeTransactions.length / PAGE_SIZE))
  }

  useEffect(() => {
    fetchOfficeTransactions()
  }, [])

  useEffect(() => {
    const fetchOffices = async () => {
      setOffices(await getAllOffices())
    }

    fetchOffices()
  }, [])

  return (
    <div>
      <PageTitle breadcrumbs={franchiseBreadcrumbs}>Ofis İşlemleri</PageTitle>

      <div className="card">
        <div className="card-header">
          <div className="card-title">İşlemleri Gözden Geçir</div>

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

              <button type="button" className="btn btn-light-primary me-3">
                <KTIcon iconName="plus" className="fs-2" />
                Oluştur
              </button>
            </div>
          </div>
        </div>
        <div className="card-body py-10">
          <div className="d-flex flex-column gap-3">
            <div className="row align-items-center bg-gray-100 rounded py-5 pe-5">
              <div className="col-lg-3 ps-5 text-gray-500 fs-7 fw-bold">
                İşlem Sahibi
              </div>
              <div className="col-lg-3 ps-5 text-gray-500 fs-7 fw-bold">
                İşlem Tarihi
              </div>
              <div className="col-lg-3 ps-5 text-gray-500 fs-7 fw-bold">
                İşlem Miktarı
              </div>
            </div>
            {officeTransactionsLoaded ? (
              visibleTransactions?.length ? (
                visibleTransactions.map((officeTransaction) => (
                  <div
                    key={officeTransaction.id}
                    className="row align-items-center bg-gray-100 rounded py-5 pe-5"
                  >
                    <div className="col-lg-3 ps-5 text-gray-700 fs-6 fw-bold">
                      {offices &&
                        offices
                          .filter((office) =>
                            officeTransaction.officeId.includes(office.id)
                          )
                          .map((office, i) => (
                            <div className="position-relative" key={i}>
                              <a
                                href={`/arayuz/ofis-detayi/${office.id}/genel`}
                                target="_blank"
                                key={office.id}
                                className="symbol symbol-circle symbol-30px with-tooltip overflow-hidden"
                                style={{
                                  marginRight: -20,
                                  border: "2px solid #fff",
                                }}
                              >
                                <div className="symbol-label">
                                  <KYOfficeImage officeName={office.name} />
                                </div>
                              </a>
                              <span className="symbol-tooltip">
                                {`${import.meta.env.VITE_APP_NAME} ${
                                  office.name
                                }`}
                              </span>
                            </div>
                          ))}
                    </div>
                    <div className="col-lg-3 ps-5 text-gray-700 fs-6 fw-bold">
                      {convertToTurkishDate(officeTransaction.createdAt)}
                    </div>

                    <div className="col-lg-3 ps-5 text-gray-700 fs-6 fw-bold">
                      {formatPrice(officeTransaction.amount)}
                    </div>

                    <div className="col-lg-3 d-flex justify-content-end">
                      <Button
                        type="button"
                        onClick={() => {
                          setCurrentOfficeTransaction(officeTransaction)

                          setShow(true)
                        }}
                      >
                        İncele
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <span className="text-muted text-center p-10 fw-bold">
                  {officeTransactions?.length
                    ? "İdari kadro işlemi bulunamadı."
                    : "Bu filtrelere uygun bir işlem bulunamadı."}
                </span>
              )
            ) : (
              <div className="d-flex align-items-center justify-content-center text-gray-600 fw-semibold fs-7 py-20 w-100">
                <span className="spinner-border spinner-border-lg"></span>
              </div>
            )}
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
                  test
                </label>
                <div className="fw-normal fs-6 mb-2">test</div>
              </div>
            </div>
          </div>

          <Modal.Footer className="mt-10 pb-0 px-0">
            <div className="d-flex w-100">
              <button
                type="button"
                className="btn btn-danger me-3"
                onClick={async () => {
                  if (currentOfficeTransaction?.id) {
                    await deleteTransaction(currentOfficeTransaction.id)
                  }
                  setShow(false)
                  toast.success("İşlem silindi.")
                  fetchOfficeTransactions()
                }}
              >
                İşlemi Sil
              </button>
              <button
                type="button"
                className="btn btn-light"
                style={{ marginLeft: "auto" }}
                onClick={() => setShow(false)}
              >
                Kapat
              </button>
              <a className="btn btn-success ms-3" href={`#`}>
                İşlem
              </a>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default OfficeTransactionsPage
