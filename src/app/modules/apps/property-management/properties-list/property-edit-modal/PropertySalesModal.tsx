/* eslint-disable @typescript-eslint/no-explicit-any */
import "./PropertySalesModal.css"
import { FC, useEffect, useState } from "react"

import { ErrorMessage, Field } from "formik"

import CurrencyInput from "react-currency-input-field"
import toast from "react-hot-toast"
import {
  deleteTransaction,
  getTransactionsByPropertyId,
  newTransaction,
} from "../../../transactions-management/_core/_requests"

interface PropertySalesModalProp {
  show: boolean
  setShow: any
  property: any
  values: any
  setFieldValue: any
  handleSubmit: any
}

const PropertySalesModal: FC<PropertySalesModalProp> = ({
  show,
  setShow,
  property,
  values,
  setFieldValue,
  handleSubmit,
}) => {
  const [currentAgentFee, setCurrentAgentFee] = useState("")
  const [currentOfficeFee, setCurrentOfficeFee] = useState("")
  const [currentSoldPrice, setCurrentSoldPrice] = useState("")
  const [currentSoldDate, setCurrentSoldDate] = useState("")
  const [currentTeamLeaderProfit, setCurrentTeamLeaderProfit] = useState("")
  const [currentOtherExpenses, setCurrentOtherExpenses] = useState("")

  const handleSoldSubmit = async () => {
    setFieldValue("saleDetails.active", false)
    setFieldValue("saleDetails.agentFee", currentAgentFee)
    setFieldValue("saleDetails.officeFee", currentOfficeFee)
    setFieldValue("saleDetails.soldPrice", currentSoldPrice)

    const date = new Date(currentSoldDate)
    setFieldValue("saleDetails.soldDate", date.getTime())

    setFieldValue("soldStatus.soldPrice", currentSoldPrice)
    setFieldValue("soldStatus.officeProfit", currentOfficeFee)
    setFieldValue("soldStatus.agentProfit", currentAgentFee)
    setFieldValue("soldStatus.teamLeaderProfit", currentTeamLeaderProfit)
    setFieldValue("soldStatus.otherExpenses", currentOtherExpenses)

    const calculatedTotalProfit =
      parseInt(currentAgentFee) +
      parseInt(currentOfficeFee) +
      parseInt(currentTeamLeaderProfit)

    const transaction = {
      userIds: values.userIds,
      officeId: values.officeId,
      propertyId: values.id,
      customerName: values.soldStatus.customerName,
      soldPrice: values.saleDetails.soldPrice,
      agentProfit: values.saleDetails.agentFee,
      officeProfit: values.saleDetails.officeFee,
      totalProfit: calculatedTotalProfit.toString(),
      teamLeaderProfit: values.soldStatus.teamLeaderProfit,
      percentage: values.soldStatus.percentage,
      agentGotPaid: values.soldStatus.agentGotPaid,
      informationForm: values.soldStatus.informationForm,
      otherExpenses: values.soldStatus.otherExpenses,
      createdAt: new Date().getTime().toString(),
    }

    values.soldStatus = transaction

    await newTransaction(transaction)
    await handleSubmit(values, true)

    setShow(false)
    toast.success("İlan satıldı olarak işaretlendi.")
  }

  const handleNotSoldSubmit = async () => {
    setCurrentAgentFee("")
    setCurrentOfficeFee("")
    setCurrentSoldPrice("")
    setCurrentSoldDate("")
    setCurrentOtherExpenses("")
    setCurrentTeamLeaderProfit("")

    setFieldValue("saleDetails.active", true)
    setFieldValue("saleDetails.agentFee", "")
    setFieldValue("saleDetails.officeFee", "")
    setFieldValue("saleDetails.soldPrice", "")
    setFieldValue("saleDetails.soldDate", "")

    setFieldValue("soldStatus.customerName", "")
    setFieldValue("soldStatus.percentage", "")

    const transactionToRemove = await getTransactionsByPropertyId(property.id)
    transactionToRemove.forEach(async (transaction) => {
      if (transaction.id) await deleteTransaction(transaction.id)
    })

    console.log(transactionToRemove)

    handleSubmit(values, true)
    setShow(false)
    toast.success("İlan satılmadı olarak işaretlendi.")
  }

  useEffect(() => {
    if (property.saleDetails?.agentFee) {
      setCurrentAgentFee(property.saleDetails.agentFee)
    }
    if (property.saleDetails?.officeFee) {
      setCurrentOfficeFee(property.saleDetails.officeFee)
    }
    if (property.saleDetails?.soldPrice) {
      setCurrentSoldPrice(property.saleDetails.soldPrice)
    }
    if (property.soldStatus?.otherExpenses) {
      setCurrentOtherExpenses(property.soldStatus.otherExpenses)
    }
    if (property.soldStatus?.teamLeaderProfit) {
      setCurrentTeamLeaderProfit(property.soldStatus.teamLeaderProfit)
    }

    if (property.saleDetails?.soldDate) {
      const date = new Date(parseInt(property.saleDetails.soldDate))
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const day = String(date.getDate()).padStart(2, "0")
      setCurrentSoldDate(`${year}-${month}-${day}` ?? "")
    }
  }, [property])

  return (
    <>
      <div
        className={`property-sales-modal${show ? " show" : ""}`}
        id="kt_modal_add_property"
      >
        <div className="property-sales-modal-wrapper mw-500px">
          <div className="modal-header">
            <h2 className="fw-bolder m-0">Satış Durumu Belirle</h2>
            <div
              className="btn btn-icon btn-sm btn-active-icon-primary ms-auto"
              onClick={() => setShow(false)}
              style={{ cursor: "pointer" }}
            >
              <i className="ki-solid ki-cross fs-1"></i>
            </div>
          </div>

          <div className="property-sales-modal-content">
            <div className="fv-row mb-3">
              <label className="form-label required mb-3">Satış Bedeli</label>
              <CurrencyInput
                name="saleDetails.salePrice"
                className="form-control form-control-lg form-control-solid"
                allowDecimals={false}
                value={currentSoldPrice}
                onValueChange={(value) => {
                  const price = value ? value?.toString() : ""
                  setCurrentSoldPrice(price)
                }}
                intlConfig={{ locale: "tr-TR", currency: "TRY" }}
              />

              <div className="text-danger mt-2">
                <ErrorMessage name="saleDetails.salePrice" />
              </div>
            </div>

            <div className="fv-row mb-3 row">
              <div className="col-md-6">
                <label className="form-label required mb-3">
                  Ofis Hizmet Bedeli
                </label>
                <CurrencyInput
                  name="saleDetails.officeFee"
                  className="form-control form-control-lg form-control-solid"
                  allowDecimals={false}
                  value={currentOfficeFee}
                  onValueChange={(value) => {
                    const price = value ? value?.toString() : ""
                    setCurrentOfficeFee(price)
                  }}
                  intlConfig={{ locale: "tr-TR", currency: "TRY" }}
                />

                <div className="text-danger mt-2">
                  <ErrorMessage name="saleDetails.officeFee" />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label required mb-3">
                  Danışman Hizmet Bedeli
                </label>
                <CurrencyInput
                  name="saleDetails.agentFee"
                  className="form-control form-control-lg form-control-solid"
                  allowDecimals={false}
                  value={currentAgentFee}
                  onValueChange={(value) => {
                    const price = value ? value?.toString() : ""
                    setCurrentAgentFee(price)
                  }}
                  intlConfig={{ locale: "tr-TR", currency: "TRY" }}
                />

                <div className="text-danger mt-2">
                  <ErrorMessage name="saleDetails.agentFee" />
                </div>
              </div>
            </div>

            <div className="fv-row mb-3">
              <label className="form-label mb-3">Takım Lideri Payı</label>
              <CurrencyInput
                name="soldStatus.teamLeaderProfit"
                className="form-control form-control-lg form-control-solid"
                allowDecimals={false}
                value={currentTeamLeaderProfit}
                onValueChange={(value) => {
                  const price = value ? value?.toString() : ""
                  setCurrentTeamLeaderProfit(price)
                }}
                intlConfig={{ locale: "tr-TR", currency: "TRY" }}
              />

              <div className="text-danger mt-2">
                <ErrorMessage name="soldStatus.teamLeaderProfit" />
              </div>
            </div>

            <div className="fv-row mb-3">
              <label className="form-label mb-3">Diğer Giderler</label>
              <CurrencyInput
                name="soldStatus.otherExpenses"
                className="form-control form-control-lg form-control-solid"
                allowDecimals={false}
                value={currentOtherExpenses}
                onValueChange={(value) => {
                  const price = value ? value?.toString() : ""
                  setCurrentOtherExpenses(price)
                }}
                intlConfig={{ locale: "tr-TR", currency: "TRY" }}
              />

              <div className="text-danger mt-2">
                <ErrorMessage name="soldStatus.otherExpenses" />
              </div>
            </div>

            <div className="fv-row mb-3">
              <label className="form-label mb-3">Alıcı Adı</label>
              <Field
                type="text"
                className="form-control form-control-lg form-control-solid"
                name="soldStatus.customerName"
              />

              <div className="text-danger mt-2">
                <ErrorMessage name="soldStatus.customerName" />
              </div>
            </div>

            <div className="fv-row mb-3">
              <label className="form-label">Danışmana Ödeme Yapıldı</label>

              <div className="d-flex gap-2">
                <label className="d-flex cursor-pointer">
                  <span className="form-check form-check-custom form-check-solid">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="soldStatus.agentGotPaid"
                      id="agentGotPaidTrue"
                      value="true"
                    />
                  </span>
                  <span
                    className="d-flex align-items-center me-2 ms-2"
                    style={{ width: "fitContent" }}
                  >
                    <span className="d-flex flex-column">
                      <span className="fw-bolder text-gray-800 fs-5">Evet</span>
                    </span>
                  </span>
                </label>

                <label className="d-flex cursor-pointer">
                  <span className="form-check form-check-custom form-check-solid">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="soldStatus.agentGotPaid"
                      id="agentGotPaidFalse"
                      value="false"
                    />
                  </span>
                  <span
                    className="d-flex align-items-center me-2 ms-2"
                    style={{ width: "fitContent" }}
                  >
                    <span className="d-flex flex-column">
                      <span className="fw-bolder text-gray-800 fs-5">
                        Hayır
                      </span>
                    </span>
                  </span>
                </label>
              </div>

              <div className="text-danger mt-2">
                <ErrorMessage name="soldStatus.agentGotPaid" />
              </div>
            </div>

            <div className="fv-row mb-3">
              <label className="form-label">Bilgi Formu</label>

              <div className="d-flex gap-2">
                <label className="d-flex cursor-pointer">
                  <span className="form-check form-check-custom form-check-solid">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="soldStatus.informationForm"
                      id="informationFormTrue"
                      value="true"
                    />
                  </span>
                  <span
                    className="d-flex align-items-center me-2 ms-2"
                    style={{ width: "fitContent" }}
                  >
                    <span className="d-flex flex-column">
                      <span className="fw-bolder text-gray-800 fs-5">Var</span>
                    </span>
                  </span>
                </label>

                <label className="d-flex cursor-pointer">
                  <span className="form-check form-check-custom form-check-solid">
                    <Field
                      className="form-check-input"
                      type="radio"
                      name="soldStatus.informationForm"
                      id="informationFormFalse"
                      value="false"
                    />
                  </span>
                  <span
                    className="d-flex align-items-center me-2 ms-2"
                    style={{ width: "fitContent" }}
                  >
                    <span className="d-flex flex-column">
                      <span className="fw-bolder text-gray-800 fs-5">Yok</span>
                    </span>
                  </span>
                </label>
              </div>

              <div className="text-danger mt-2">
                <ErrorMessage name="soldStatus.informationForm" />
              </div>
            </div>

            <div className="fv-row mb-3">
              <label className="form-label mb-3">Yüzdelik Dilim</label>
              <Field
                type="text"
                className="form-control form-control-lg form-control-solid"
                name="soldStatus.percentage"
              />

              <div className="text-danger mt-2">
                <ErrorMessage name="soldStatus.percentage" />
              </div>
            </div>

            <div className="fv-row mb-3">
              <label className="form-label mb-3 required">Satış Tarihi</label>
              <Field
                type="date"
                className="form-control form-control-lg form-control-solid"
                value={currentSoldDate}
                onChange={(e: any) => {
                  const date = e.target.value
                  setCurrentSoldDate(date)
                }}
              />

              <div className="text-danger mt-2">
                <ErrorMessage name="saleDetails.saleDate" />
              </div>
            </div>

            <div className="text-center pt-15">
              <button
                type="button"
                className="btn btn-danger me-3"
                onClick={handleNotSoldSubmit}
              >
                <span className="indicator-label">Satılmadı</span>
              </button>

              <button
                type="button"
                className="btn btn-success"
                disabled={
                  currentAgentFee &&
                  currentOfficeFee &&
                  currentSoldPrice &&
                  currentSoldDate
                    ? false
                    : true
                }
                onClick={handleSoldSubmit}
              >
                <span className="indicator-label">Satıldı</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`property-sales-modal-backdrop${show ? " show" : ""}`}
        onClick={() => setShow(false)}
      ></div>
    </>
  )
}

export { PropertySalesModal }
