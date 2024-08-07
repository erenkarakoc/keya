import { useEffect, useState } from "react"
import { PageLink, PageTitle } from "../../../../_metronic/layout/core"
import { Transaction } from "./_core/_models"
import { deleteTransaction, getAllTransactions } from "./_core/_requests"
import { Button, Modal } from "react-bootstrap"
import { KTIcon } from "../../../../_metronic/helpers"
import toast from "react-hot-toast"
import {
  convertToTurkishDate,
  formatPrice,
} from "../../../../_metronic/helpers/kyHelpers"
import { User } from "../user-management/_core/_models"
import { getAllUsers } from "../user-management/_core/_requests"
import { Office } from "../office-management/_core/_models"
import { getAllOffices } from "../office-management/_core/_requests"
import { KYOfficeImage } from "../../../frontend/components/KYOfficeImage/KYOfficeImage"

const franchiseBreadcrumbs: Array<PageLink> = [
  {
    title: "Kullanıcı Muhasebesi",
    path: "islem-yonetimi",
    isSeparator: false,
    isActive: false,
  },
]

const PAGE_SIZE = 10

const FranchisePage = () => {
  const [show, setShow] = useState(false)

  const [transactionsLoaded, setTransactionsLoaded] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>()

  const [users, setUsers] = useState<User[]>()
  const [offices, setOffices] = useState<Office[]>()

  const [currentTransaction, setCurrentTransaction] = useState<Transaction>()

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

  const visibleTransactions = transactions?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const fetchTransactions = async () => {
    const allApplications = await getAllTransactions()
    setTransactions(allApplications)
    setTransactionsLoaded(true)
    setTotalPages(Math.ceil(allApplications.length / PAGE_SIZE))
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  useEffect(() => {
    const fetchUsers = async () => setUsers(await getAllUsers())
    const fetchOffices = async () => setOffices(await getAllOffices())

    fetchUsers()
    fetchOffices()
  }, [])

  return (
    <div>
      <PageTitle breadcrumbs={franchiseBreadcrumbs}>
        Danışman İşlemleri
      </PageTitle>

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
            {transactionsLoaded ? (
              visibleTransactions?.length ? (
                visibleTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="row align-items-center bg-gray-100 rounded py-5 pe-5"
                  >
                    <div className="col-lg-3 ps-5 text-gray-700 fs-6 fw-bold">
                      {users &&
                        users
                          .filter((user) =>
                            transaction.userIds.includes(user.id)
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
                    <div className="col-lg-3 ps-5 text-gray-700 fs-6 fw-bold">
                      {convertToTurkishDate(transaction.createdAt)}
                    </div>

                    <div className="col-lg-3 ps-5 text-gray-700 fs-6 fw-bold">
                      {formatPrice(transaction.totalProfit)}
                    </div>

                    <div className="col-lg-3 d-flex justify-content-end">
                      <Button
                        type="button"
                        onClick={() => {
                          setCurrentTransaction(transaction)

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
                  Bu filtrelere uygun bir işlem bulunamadı.
                </span>
              )
            ) : (
              <div className="d-flex align-items-center justify-content-center text-gray-600 fw-semibold fs-7 py-20 w-100">
                <span className="spinner-border spinner-border-lg"></span>
              </div>
            )}
          </div>

          {transactions && transactions?.length > PAGE_SIZE && (
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
          )}
        </div>
      </div>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header>
          <div className="d-flex justify-content-between align-items-center w-100">
            <Modal.Title>İşlem Detayı</Modal.Title>
            <div
              className="btn btn-icon btn-sm btn-active-light-primary ms-2"
              onClick={() => setShow(false)}
              aria-label="Close"
            >
              <KTIcon iconName="cross" iconType="solid" className="fs-1" />
            </div>
          </div>
        </Modal.Header>

        {currentTransaction ? (
          <>
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
                      İşlem Sahibi
                    </label>
                    <div className="fw-normal fs-6 mb-2">
                      {users &&
                        users
                          .filter((user) =>
                            currentTransaction.userIds.includes(user.id)
                          )
                          .map((user, i) => (
                            <div className="position-relative" key={i}>
                              <a
                                href={`/arayuz/kullanici-detayi/${user.id}/genel`}
                                target="_blank"
                                key={user.id}
                                className="symbol symbol-circle symbol-50px with-tooltip overflow-hidden"
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
                  </div>
                  <div className="col-6 mb-3">
                    <label
                      className="fw-bolder fs-7 mb-2 text-gray-600 text-uppercase spacing"
                      style={{ letterSpacing: "1px" }}
                    >
                      Ofisi
                    </label>
                    <div className="fw-normal fs-6 mb-2">
                      {offices &&
                        offices
                          .filter((office) =>
                            currentTransaction.officeId.includes(office.id)
                          )
                          .map((office, i) => (
                            <a
                              href={`ofis-detayi/${office.id}`}
                              target="_blank"
                            >
                              <KYOfficeImage officeName={office.name} key={i} />
                            </a>
                          ))}
                    </div>
                  </div>

                  <div className="col-6 mb-3">
                    <label
                      className="fw-bolder fs-7 mb-2 text-gray-600 text-uppercase spacing"
                      style={{ letterSpacing: "1px" }}
                    >
                      İlgili İlan
                    </label>
                    <div className="mb-2">
                      <a
                        href={`/arayuz/ilan-detayi/${currentTransaction.propertyId}/`}
                        target="_blank"
                        className="text-gray-900 text-hover-primary fs-5"
                      >
                        İlan Linki
                      </a>
                    </div>
                  </div>

                  {currentTransaction.customerName && (
                    <div className="col-6 mb-3">
                      <label
                        className="fw-bolder fs-7 mb-2 text-gray-600 text-uppercase spacing"
                        style={{ letterSpacing: "1px" }}
                      >
                        Alıcı Adı
                      </label>
                      <div className="fw-normal fs-6 mb-2">
                        {currentTransaction.customerName}
                      </div>
                    </div>
                  )}

                  {currentTransaction.soldPrice && (
                    <div className="col-6 mb-3">
                      <label
                        className="fw-bolder fs-7 mb-2 text-gray-600 text-uppercase spacing"
                        style={{ letterSpacing: "1px" }}
                      >
                        Satış Fiyatı
                      </label>
                      <div className="fw-normal fs-6 mb-2">
                        {formatPrice(currentTransaction.soldPrice)}
                      </div>
                    </div>
                  )}

                  {currentTransaction.totalProfit && (
                    <div className="col-6 mb-3">
                      <label
                        className="fw-bolder fs-7 mb-2 text-gray-600 text-uppercase spacing"
                        style={{ letterSpacing: "1px" }}
                      >
                        Toplam Hizmet Bedeli
                      </label>
                      <div className="fw-normal fs-6 mb-2">
                        {formatPrice(currentTransaction.totalProfit)}
                      </div>
                    </div>
                  )}

                  {currentTransaction.agentProfit && (
                    <div className="col-6 mb-3">
                      <label
                        className="fw-bolder fs-7 mb-2 text-gray-600 text-uppercase spacing"
                        style={{ letterSpacing: "1px" }}
                      >
                        Danışman Kazancı
                      </label>
                      <div className="fw-normal fs-6 mb-2">
                        {formatPrice(currentTransaction.agentProfit)}
                      </div>
                    </div>
                  )}

                  {currentTransaction.officeProfit && (
                    <div className="col-6 mb-3">
                      <label
                        className="fw-bolder fs-7 mb-2 text-gray-600 text-uppercase spacing"
                        style={{ letterSpacing: "1px" }}
                      >
                        Ofis Kazancı
                      </label>
                      <div className="fw-normal fs-6 mb-2">
                        {formatPrice(currentTransaction.officeProfit)}
                      </div>
                    </div>
                  )}

                  {currentTransaction.teamLeaderProfit && (
                    <div className="col-6 mb-3">
                      <label
                        className="fw-bolder fs-7 mb-2 text-gray-600 text-uppercase spacing"
                        style={{ letterSpacing: "1px" }}
                      >
                        Takım Lideri Kazancı
                      </label>
                      <div className="fw-normal fs-6 mb-2">
                        {formatPrice(currentTransaction.teamLeaderProfit)}
                      </div>
                    </div>
                  )}

                  {currentTransaction.otherExpenses && (
                    <div className="col-6 mb-3">
                      <label
                        className="fw-bolder fs-7 mb-2 text-gray-600 text-uppercase spacing"
                        style={{ letterSpacing: "1px" }}
                      >
                        Diğer Giderler
                      </label>
                      <div className="fw-normal fs-6 mb-2">
                        {formatPrice(currentTransaction.otherExpenses)}
                      </div>
                    </div>
                  )}

                  {currentTransaction.percentage && (
                    <div className="col-6 mb-3">
                      <label
                        className="fw-bolder fs-7 mb-2 text-gray-600 text-uppercase spacing"
                        style={{ letterSpacing: "1px" }}
                      >
                        Yüzdelik Dilim
                      </label>
                      <div className="fw-normal fs-6 mb-2">
                        %{currentTransaction.percentage}
                      </div>
                    </div>
                  )}

                  {currentTransaction.agentGotPaid && (
                    <div className="col-6 mb-3">
                      <label
                        className="fw-bolder fs-7 mb-2 text-gray-600 text-uppercase spacing"
                        style={{ letterSpacing: "1px" }}
                      >
                        Danışmana Ödeme Yapıldı
                      </label>
                      <div className="fw-normal fs-6 mb-2">
                        {currentTransaction.agentGotPaid === "true"
                          ? "Evet"
                          : "Hayır"}
                      </div>
                    </div>
                  )}

                  {currentTransaction.informationForm && (
                    <div className="col-6 mb-3">
                      <label
                        className="fw-bolder fs-7 mb-2 text-gray-600 text-uppercase spacing"
                        style={{ letterSpacing: "1px" }}
                      >
                        Bilgi Formu Var
                      </label>
                      <div className="fw-normal fs-6 mb-2">
                        {currentTransaction.informationForm === "true"
                          ? "Evet"
                          : "Hayır"}
                      </div>
                    </div>
                  )}

                  {currentTransaction.createdAt && (
                    <div className="col-6 mb-3">
                      <label
                        className="fw-bolder fs-7 mb-2 text-gray-600 text-uppercase spacing"
                        style={{ letterSpacing: "1px" }}
                      >
                        İşlem Tarihi
                      </label>
                      <div className="fw-normal fs-6 mb-2">
                        {convertToTurkishDate(currentTransaction.createdAt)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Modal.Footer className="mt-10 pb-0 px-0">
                <div className="d-flex w-100">
                  <button
                    type="button"
                    className="btn btn-danger d-none me-3"
                    onClick={async () => {
                      if (currentTransaction?.id) {
                        await deleteTransaction(currentTransaction.id)
                      }
                      setShow(false)
                      toast.success("İşlem silindi.")
                      fetchTransactions()
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
                </div>
              </Modal.Footer>
            </Modal.Body>
          </>
        ) : (
          ""
        )}
      </Modal>
    </div>
  )
}

export default FranchisePage
