/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react"
import { KTIcon } from "../../../../../_metronic/helpers"
import { Step0 } from "./components/steps/Step0"
import { Step1 } from "./components/steps/Step1"
import { Step2 } from "./components/steps/Step2"
import { Step3 } from "./components/steps/Step3"
import { Step4 } from "./components/steps/Step4"
import { Step5 } from "./components/steps/Step5"
import { StepperComponent } from "../../../../../_metronic/assets/ts/components"

import { useMap } from "@vis.gl/react-google-maps"

import { Form, Formik, FormikValues } from "formik"
import {
  step0Schema,
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  ICreateAccount,
  inits,
} from "./components/CreatePropertyWizardHelper"
import { Content } from "../../../../../_metronic/layout/components/Content"

import { initializeApp } from "firebase/app"
import { firebaseApp, firebaseConfig } from "../../../../../firebase/BaseConfig"
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore"

import toast from "react-hot-toast"
import { getOfficeIdByUserId } from "../../user-management/_core/_requests"
import { Modal } from "react-bootstrap"
import { getPropertyFromSahibinden } from "../_core/_requests"
import { timestampToISODate } from "../../../../../_metronic/helpers/kyHelpers"

initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)

const AddProperty = () => {
  const [quickAddModalShow, setQuickAddModalShow] = useState(false)
  const [pastedData, setPastedData] = useState("")

  const [currentPrice, setCurrentPrice] = useState("")
  const [currentDues, setCurrentDues] = useState("")
  const [description, setDescription] = useState<string>(
    `<p class="ql-align-center"><br></p><p class="ql-align-center">_______________</p><p class="ql-align-center"><br></p><p class="ql-align-center"><span style="color: rgb(255, 255, 255);">Detaylı bilgi için iletişime geçiniz:</span></p><p class="ql-align-center"><strong style="color: rgb(255, 255, 255);">Keya Real Estate: +90 (312) 439 45 45</strong></p><p class="ql-align-center"><br></p><p class="ql-align-center"><strong style="color: rgb(255, 255, 255);">T.C ANKARA VALİLİĞİ TİCARET İL MÜDÜRLÜĞÜ</strong></p><p class="ql-align-center"><strong style="color: rgb(255, 255, 255);">TAŞINMAZ TİCARETİ YETKİ BELGESİ&nbsp;</strong><a href="https://ttbs.gtb.gov.tr/Home/BelgeSorgula?BelgeNo=0600556" rel="noopener noreferrer" target="_blank" style="color: rgb(0, 102, 204);"><strong><u>0600556</u></strong></a><strong style="color: rgb(255, 255, 255);">&nbsp;NUMARASI İLE YETKİLİ EMLAK FİRMASIDIR.</strong></p><p class="ql-align-center"><br></p><p class="ql-align-center"><em style="color: rgb(255, 255, 255);">Ofisimizde Web Tapu sistemi ile işlemleriniz yapılabilmektedir.</em></p>`
  )

  const map = useMap()
  const [markerPosition, setMarkerPosition] = useState({
    lat: 0,
    lng: 0,
  })

  const stepperRef = useRef<HTMLDivElement | null>(null)
  const [stepper, setStepper] = useState<StepperComponent | null>(null)
  const [submittingForm, setSubmittingForm] = useState<boolean>(false)

  const [currentSchemaIndex, setCurrentSchemaIndex] = useState<number>(0)
  const schemas = [
    step0Schema,
    step1Schema,
    step2Schema,
    step3Schema,
    step4Schema,
    step5Schema,
  ]

  const [initValues] = useState<ICreateAccount>(inits)

  const loadStepper = () => {
    setStepper(
      StepperComponent.createInstance(stepperRef.current as HTMLDivElement)
    )
  }

  const prevStep = () => {
    if (!stepper) return
    stepper.goPrev()
    setCurrentSchemaIndex((prevIndex) => prevIndex - 1)
  }

  const submitStep = async (values: ICreateAccount, actions: FormikValues) => {
    if (!stepper) return

    window.scrollTo(0, 0)

    if (stepper.currentStepIndex !== stepper.totalStepsNumber) {
      stepper.goNext()
      setCurrentSchemaIndex((prevIndex) => prevIndex + 1)
    } else {
      setSubmittingForm(true)

      try {
        const newPropertyRef = doc(collection(db, "properties"))

        await setDoc(newPropertyRef, values)

        const officeId = await getOfficeIdByUserId(values.userIds[0])
        const permitDate = new Date(values?.ownerDetails?.permitDate ?? "")
          .getTime()
          .toString()
        const permitUntilDate =
          values?.ownerDetails?.permitUntilDate === "limitless"
            ? "limitless"
            : timestampToISODate(
                new Date(values?.ownerDetails?.permitUntilDate ?? "")
                  .getTime()
                  .toString()
              )

        await updateDoc(newPropertyRef, {
          id: newPropertyRef.id,
          officeId,
          title: values.title.toUpperCase(),
          ownerDetails: {
            ownerFullName: values.ownerDetails?.ownerFullName,
            ownerPhoneNumber: values.ownerDetails?.ownerPhoneNumber,
            permit: values.ownerDetails?.permit,
            permitDate,
            permitUntilDate,
            permitPrice: values.ownerDetails?.permitPrice,
          },
          createdAt: timestampToISODate(new Date().getTime().toString()),
          updatedAt: timestampToISODate(new Date().getTime().toString()),
        })

        setSubmittingForm(false)
        actions.setSubmitting(false)

        toast.success("İlan başarıyla eklendi!")
        window.location.href = "ilan-yonetimi/ilanlar"
      } catch (error) {
        toast.error(
          "Bir hata oluştu! Lütfen bilgileri kontrol edin veya daha sonra tekrar deneyin."
        )
        setSubmittingForm(false)
        actions.setSubmitting(false)
        console.error(error)
      }
    }
  }

  useEffect(() => {
    if (!stepperRef.current) {
      return
    }

    loadStepper()
  }, [stepperRef])

  return (
    <>
      <Content>
        <div className="card">
          <div className="card-body">
            <div
              ref={stepperRef}
              className="stepper stepper-links d-flex flex-column pt-15"
              id="kt_create_property_stepper"
            >
              <div className="stepper-nav mb-5">
                <div
                  className="stepper-item current"
                  data-kt-stepper-element="nav"
                ></div>

                <div
                  className="stepper-item current"
                  data-kt-stepper-element="nav"
                >
                  <h3 className="stepper-title">Genel Bilgiler</h3>
                </div>

                <div className="stepper-item" data-kt-stepper-element="nav">
                  <h3 className="stepper-title">Detaylı Bilgiler</h3>
                </div>

                <div className="stepper-item" data-kt-stepper-element="nav">
                  <h3 className="stepper-title">Özellikler</h3>
                </div>

                <div className="stepper-item" data-kt-stepper-element="nav">
                  <h3 className="stepper-title">Konum</h3>
                </div>

                <div className="stepper-item" data-kt-stepper-element="nav">
                  <h3 className="stepper-title">Portföy</h3>
                </div>
              </div>

              <div className="d-flex flex-row-fluid flex-center bg-body rounded">
                <Formik
                  initialValues={initValues}
                  validationSchema={schemas[currentSchemaIndex]}
                  onSubmit={submitStep}
                  enableReinitialize={true}
                >
                  {({ values, setFieldValue }) => (
                    <Form
                      className="py-20 w-100 w-xl-700px px-9"
                      noValidate
                      id="kt_create_account_form"
                      placeholder={undefined}
                    >
                      <div
                        className="current"
                        data-kt-stepper-element="content"
                      >
                        <Step0 />
                      </div>

                      <div data-kt-stepper-element="content">
                        <Step1
                          currentPrice={currentPrice}
                          setCurrentPrice={setCurrentPrice}
                          description={description}
                          setDescription={setDescription}
                          setFieldValue={setFieldValue}
                        />
                      </div>

                      <div data-kt-stepper-element="content">
                        <Step2
                          values={values}
                          setFieldValue={setFieldValue}
                          setCurrentDues={setCurrentDues}
                          currentDues={currentDues}
                        />
                      </div>

                      <div data-kt-stepper-element="content">
                        <Step3 values={values} setFieldValue={setFieldValue} />
                      </div>

                      <div data-kt-stepper-element="content">
                        <Step4
                          values={values}
                          setFieldValue={setFieldValue}
                          markerPosition={markerPosition}
                          setMarkerPosition={setMarkerPosition}
                          map={map}
                        />
                      </div>

                      <div data-kt-stepper-element="content">
                        <Step5 setFieldValue={setFieldValue} />
                      </div>

                      <div className="d-flex flex-stack pt-10">
                        <div className="mr-2">
                          <button
                            onClick={prevStep}
                            type="button"
                            className="btn btn-lg btn-light-primary me-3"
                            data-kt-stepper-action="previous"
                          >
                            <KTIcon
                              iconName="arrow-left"
                              className="fs-4 me-1"
                            />
                            Geri
                          </button>
                        </div>

                        <div>
                          <button
                            type="button"
                            className="btn btn-lg btn-warning text-gray-100 fw-bolder me-3"
                            onClick={() => setQuickAddModalShow(true)}
                          >
                            sahibinden
                          </button>
                          <button
                            type="submit"
                            className="btn btn-lg btn-primary me-3"
                          >
                            <span className="indicator-label">
                              {submittingForm ? (
                                <span
                                  className="indicator-progress"
                                  style={{ display: "block" }}
                                >
                                  Lütfen bekleyin...
                                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                                </span>
                              ) : stepper?.currentStepIndex ===
                                (stepper?.totalStepsNumber || 2) ? (
                                <>
                                  Kaydet
                                  <KTIcon
                                    iconName="arrow-right"
                                    className="fs-3 ms-2 me-0"
                                  />
                                </>
                              ) : (
                                <>
                                  İleri
                                  <KTIcon
                                    iconName="arrow-right"
                                    className="fs-3 ms-2 me-0"
                                  />
                                </>
                              )}
                            </span>
                          </button>
                        </div>
                      </div>

                      <Modal
                        show={quickAddModalShow}
                        onHide={() => setQuickAddModalShow(false)}
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>İlanı Sahibinden'den Getir</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div className="fv-row">
                            <p className="form-label">
                              <span className="text-white fs-2 fw-bolder font-monospace">
                                1.
                              </span>
                              &nbsp;İlanın Sahibinden sayfasına gidin.
                            </p>
                            <p className="form-label">
                              <span className="text-white fs-2 fw-bolder font-monospace">
                                2.
                              </span>
                              &nbsp;Sağ tıklayıp "Sayfa Kaynağını Görüntüle"
                              seçeneğine tıklayın.
                            </p>
                            <p className="form-label">
                              <span className="text-white fs-2 fw-bolder font-monospace">
                                3.
                              </span>
                              &nbsp;Açılan yeni sekmedeki tüm metni kopyalayın.
                            </p>
                            <p className="form-label">
                              <span className="text-white fs-2 fw-bolder font-monospace">
                                4.
                              </span>
                              &nbsp;Kopyaladığınız içeriği aşağıya yapıştırın:
                            </p>

                            <textarea
                              className="form-control form-control-solid mt-6"
                              rows={3}
                              placeholder="<!doctype html>..."
                              onChange={(e) => setPastedData(e.target.value)}
                            />
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          <button
                            type="button"
                            className="btn btn-light"
                            onClick={() => setQuickAddModalShow(false)}
                          >
                            Kapat
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                              if (pastedData) {
                                getPropertyFromSahibinden(
                                  pastedData,
                                  setFieldValue,
                                  setCurrentPrice,
                                  setCurrentDues,
                                  setDescription,
                                  setMarkerPosition,
                                  map
                                )
                                setQuickAddModalShow(false)
                              } else {
                                toast.error(
                                  "Lütfen geçerli bir Sahibinden ilanı verisi sağlayın."
                                )
                              }
                            }}
                          >
                            Bilgileri Değiştir
                          </button>
                        </Modal.Footer>
                      </Modal>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </Content>
    </>
  )
}

export { AddProperty }
