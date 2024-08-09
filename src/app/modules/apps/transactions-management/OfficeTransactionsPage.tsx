/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import { PageLink, PageTitle } from "../../../../_metronic/layout/core"
import { OfficeTransaction } from "./_core/_models"
import {
  deleteOfficeTransaction,
  getAllOfficeTransactions,
  newOfficeTransaction,
} from "./_core/_requests"
import { Button, Modal } from "react-bootstrap"
import { KTIcon } from "../../../../_metronic/helpers"
import toast from "react-hot-toast"
import {
  convertToTurkishDate,
  formatPrice,
} from "../../../../_metronic/helpers/kyHelpers"

import * as Yup from "yup"
import { ErrorMessage, Field, Form, Formik } from "formik"
import { useAuth } from "../../auth"
import CurrencyInput from "react-currency-input-field"

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
  const [addTransactionShow, setAddTransactionShow] = useState(false)

  const [officeTransactionsLoaded, setOfficeTransactionsLoaded] =
    useState(false)
  const [officeTransactions, setOfficeTransactions] =
    useState<OfficeTransaction[]>()

  const [currentOfficeTransaction, setCurrentOfficeTransaction] =
    useState<OfficeTransaction>()

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

              <button
                type="button"
                className="btn btn-light-primary me-3"
                onClick={() => setAddTransactionShow(true)}
              >
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
                İşlem Başlığı
              </div>
              <div className="col-lg-3 ps-5 text-gray-500 fs-7 fw-bold">
                İşlem Tarihi
              </div>
              <div className="col-lg-2 ps-5 text-gray-500 fs-7 fw-bold">
                İşlem Miktarı
              </div>
              <div className="col-lg-2 ps-5 text-gray-500 fs-7 fw-bold">
                İşlem Türü
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
                      {officeTransaction.title}
                    </div>
                    <div className="col-lg-3 ps-5 text-gray-700 fs-6 fw-bold">
                      {convertToTurkishDate(officeTransaction.createdAt)}
                    </div>

                    <div className="col-lg-2 ps-5 text-gray-700 fs-6 fw-bold">
                      {formatPrice(officeTransaction.amount)}
                    </div>

                    <div className="col-lg-2 ps-5 text-gray-700 fs-6 fw-bold">
                      {officeTransaction.payout === "true" ? "Gider" : "Gelir"}
                    </div>

                    <div className="col-lg-2 d-flex justify-content-end">
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
                  İşlem Başlığı
                </label>
                <div className="fw-normal fs-6 mb-2">
                  {currentOfficeTransaction?.title}
                </div>
              </div>

              <div className="col-6 mb-3">
                <label
                  className="fw-bolder fs-7 mb-2 text-gray-600 text-uppercase spacing"
                  style={{ letterSpacing: "1px" }}
                >
                  Miktarı
                </label>
                <div className="fw-normal fs-6 mb-2">
                  {formatPrice(currentOfficeTransaction?.amount ?? "")}
                </div>
              </div>

              <div className="col-6 mb-3">
                <label
                  className="fw-bolder fs-7 mb-2 text-gray-600 text-uppercase spacing"
                  style={{ letterSpacing: "1px" }}
                >
                  Türü
                </label>
                <div className="fw-normal fs-6 mb-2">
                  {currentOfficeTransaction?.payout === "true"
                    ? "Gider"
                    : "Gelir"}
                </div>
              </div>

              <div className="col-6 mb-3">
                <label
                  className="fw-bolder fs-7 mb-2 text-gray-600 text-uppercase spacing"
                  style={{ letterSpacing: "1px" }}
                >
                  Tarihi
                </label>
                <div className="fw-normal fs-6 mb-2">
                  {convertToTurkishDate(
                    currentOfficeTransaction?.createdAt ?? ""
                  )}
                </div>
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
                    await deleteOfficeTransaction(currentOfficeTransaction.id)
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

      <AddTransactionModal
        show={addTransactionShow}
        onHide={setAddTransactionShow}
      />
    </div>
  )
}

export const AddTransactionModal = ({
  show,
  onHide,
}: {
  show: boolean
  onHide: any
}) => {
  const { currentUser } = useAuth()
  const [currentAmount, setCurrentAmount] = useState("")
  const [isSubmitting, setSubmitting] = useState(false)

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Başlık alanı zorunludur."),
    officeId: Yup.string(),
    amount: Yup.string().required("İşlem Miktarı alanı zorunludur."),
    payout: Yup.string().required("İşlem Türü alanı zorunludur."),
    createdAt: Yup.string().required("İşlem Tarihi alanı zorunludur."),
  })

  const handleSubmit = async (values: any) => {
    if (!isSubmitting) {
      try {
        setSubmitting(true)
        await newOfficeTransaction(values)

        toast.success("Ofis işlemi eklendi.")
        setTimeout(() => window.location.reload(), 1000)
      } catch (err) {
        setSubmitting(false)
        console.error(err)
        toast.error("Ofis işlemi eklenirken bir sorun yaşandı.")
      }
    }
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <div className="d-flex justify-content-between align-items-center w-100">
          <Modal.Title>İşlem Oluştur</Modal.Title>
          <div
            className="btn btn-icon btn-sm btn-active-light-primary ms-2"
            onClick={() => onHide(false)}
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
          <Formik
            id="kt_modal_add_office_form"
            className="form"
            onSubmit={handleSubmit}
            initialValues={{ officeId: currentUser?.officeId }}
            validationSchema={validationSchema}
            enableReinitialize={true}
            noValidate
          >
            {({ setFieldValue }) => (
              <Form
                noValidate
                id="kt_modal_add_user_form"
                placeholder={undefined}
              >
                <div
                  className="d-flex flex-column me-n7 pe-7 pt-5"
                  id="kt_modal_add_user_scroll"
                  data-kt-scroll="true"
                  data-kt-scroll-activate="{default: false, lg: true}"
                  data-kt-scroll-max-height="auto"
                  data-kt-scroll-dependencies="#kt_modal_add_user_header"
                  data-kt-scroll-wrappers="#kt_modal_add_user_scroll"
                  data-kt-scroll-offset="300px"
                >
                  <div className="fv-row mb-7">
                    <label className="required fw-bold fs-6 mb-2">
                      İşlem Başlığı
                    </label>

                    <Field
                      type="text"
                      name="title"
                      className="form-control form-control-solid mb-3 mb-lg-0"
                      autoComplete="off"
                    />

                    <ErrorMessage name="title" />
                  </div>

                  <div className="fv-row mb-7">
                    <label className="required fw-bold fs-6 mb-2">
                      İşlem Miktarı
                    </label>

                    <CurrencyInput
                      name="amount"
                      className="form-control form-control-lg form-control-solid"
                      value={currentAmount}
                      onValueChange={(value) => {
                        const price = value ? value?.toString() : ""
                        setCurrentAmount(price)
                        setFieldValue("amount", price)
                      }}
                      intlConfig={{ locale: "tr-TR", currency: "TRY" }}
                      style={{ fontSize: 16, fontWeight: 800 }}
                    />

                    <ErrorMessage name="amount" />
                  </div>

                  <div className="fv-row mb-7">
                    <label className="required fw-bold fs-6 mb-2">
                      İşlem Türü
                    </label>

                    <Field
                      as="select"
                      name="payout"
                      className="form-select form-select-solid mb-3 mb-lg-0"
                      required
                    >
                      <option value=""></option>
                      <option value="true">Gider</option>
                      <option value="false">Gelir</option>
                    </Field>

                    <ErrorMessage name="payout" />
                  </div>

                  <div className="fv-row mb-7">
                    <label className="required fw-bold fs-6 mb-2">
                      İşlem Tarihi
                    </label>

                    <Field
                      type="date"
                      name="createdAt"
                      className="form-control form-control-solid mb-3 mb-lg-0"
                      required
                    />

                    <ErrorMessage name="date" />
                  </div>

                  <div className="text-center pt-15">
                    <button
                      type="reset"
                      onClick={() => onHide(false)}
                      className="btn btn-light me-3"
                      data-kt-users-modal-action="cancel"
                    >
                      İptal
                    </button>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      data-kt-users-modal-action="submit"
                      disabled={isSubmitting}
                    >
                      <span className="indicator-label">Kaydet</span>
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default OfficeTransactionsPage
