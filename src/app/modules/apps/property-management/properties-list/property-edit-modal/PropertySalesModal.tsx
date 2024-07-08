/* eslint-disable @typescript-eslint/no-explicit-any */
import "./PropertySalesModal.css"
import { FC, useEffect, useState } from "react"

import { ErrorMessage, Field } from "formik"

import CurrencyInput from "react-currency-input-field"
import toast from "react-hot-toast"
import { newTransaction } from "../../../transactions-management/_core/_requests"

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
  const [isSold, setIsSold] = useState(false)

  const [currentAgentFee, setCurrentAgentFee] = useState("")
  const [currentOfficeFee, setCurrentOfficeFee] = useState("")
  const [currentSoldPrice, setCurrentSoldPrice] = useState("")
  const [currentSoldDate, setCurrentSoldDate] = useState("")
  const [currentOtherExpenses, setCurrentOtherExpenses] = useState("")

  const [currentTeamLeaderProfit, setCurrentTeamLeaderProfit] = useState("")

  const handleSoldSubmit = () => {
    if (isSold) {
      setFieldValue("saleDetails.active", false)
      setFieldValue("saleDetails.agentFee", currentAgentFee)
      setFieldValue("saleDetails.officeFee", currentOfficeFee)
      setFieldValue("saleDetails.soldPrice", currentSoldPrice)

      const date = new Date(currentSoldDate)

      setFieldValue("saleDetails.soldDate", date.getTime())

      handleSubmit(values, true)

      console.log({
        userIds: values.userIds,
        officeId: values.officeId,
        propertyId: values.id,
        customerName: values.soldStatus.customerName,
        soldPrice: currentSoldPrice,
        agentProfit: currentAgentFee,
        officeProfit: currentOfficeFee,
        totalProfit: (
          parseInt(currentAgentFee) +
          parseInt(currentOfficeFee) +
          parseInt(currentTeamLeaderProfit)
        ).toString(),
        teamLeaderProfit: currentTeamLeaderProfit,
        percentage: values.soldStatus.percentage,
        agentGotPaid: values.soldStatus.agentGotPaid,
        informationForm: values.soldStatus.informationForm,
        otherExpenses: currentOtherExpenses,
        createdAt: currentSoldDate,
      })

      setShow(false)
      toast.success("İlan satıldı olarak işaretlendi.")
    } else {
      setCurrentAgentFee("")
      setCurrentOfficeFee("")
      setCurrentSoldPrice("")
      setCurrentSoldDate("")

      setFieldValue("saleDetails.active", true)
      setFieldValue("saleDetails.agentFee", "")
      setFieldValue("saleDetails.officeFee", "")
      setFieldValue("saleDetails.soldPrice", "")
      setFieldValue("saleDetails.soldDate", "")

      setFieldValue("soldStatus", {})

      handleSubmit(values, true)
      setShow(false)
      toast.success("İlan satılmadı olarak işaretlendi.")
    }
  }

  useEffect(() => {
    setCurrentAgentFee(property.saleDetails.agentFee ?? "")
    setCurrentOfficeFee(property.saleDetails.officeFee ?? "")
    setCurrentSoldPrice(property.saleDetails.soldPrice ?? "")
    setCurrentOtherExpenses(property.soldStatus.otherExpenses ?? "")
    setCurrentTeamLeaderProfit(property.soldStatus.teamLeaderProfit ?? "")

    const date = new Date(parseInt(property.saleDetails.soldDate))
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    setCurrentSoldDate(`${year}-${month}-${day}` ?? "")
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
                  setFieldValue("soldStatus.soldPrice", price)
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
                    setFieldValue("soldStatus.officeProfit", price)
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
                    setFieldValue("soldStatus.agentProfit", price)
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
                  setFieldValue("soldStatus.teamLeaderProfit", price)
                }}
                intlConfig={{ locale: "tr-TR", currency: "TRY" }}
              />

              <div className="text-danger mt-2">
                <ErrorMessage name="soldStatus.teamLeaderProfit" />
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
              <label className="form-label mb-3">Diğer Giderler</label>
              <CurrencyInput
                name="soldStatus.otherExpenses"
                className="form-control form-control-lg form-control-solid"
                allowDecimals={false}
                value={currentOtherExpenses}
                onValueChange={(value) => {
                  const price = value ? value?.toString() : ""
                  setCurrentOtherExpenses(price)
                  setFieldValue("soldStatus.otherExpenses", price)
                }}
                intlConfig={{ locale: "tr-TR", currency: "TRY" }}
              />

              <div className="text-danger mt-2">
                <ErrorMessage name="soldStatus.otherExpenses" />
              </div>
            </div>

            <div className="fv-row mb-3">
              <label className="form-label required">
                Danışmana Ödeme Yapıldı
              </label>

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
              <label className="form-label required">Bilgi Formu</label>

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
              <label className="form-label mb-3 required">Yüzdelik Dilim</label>
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
                onClick={() => {
                  setIsSold(false)
                  setTimeout(() => handleSoldSubmit(), 1000)
                }}
              >
                <span className="indicator-label">Satılmadı</span>
              </button>

              <button
                type="button"
                className="btn btn-success"
                onClick={() => {
                  if (
                    currentAgentFee &&
                    currentOfficeFee &&
                    currentSoldPrice &&
                    currentSoldDate
                  ) {
                    setIsSold(true)
                    setTimeout(() => handleSoldSubmit(), 1000)
                  } else {
                    toast.error("Lütfen tüm alanları doldurun.")
                  }
                }}
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
