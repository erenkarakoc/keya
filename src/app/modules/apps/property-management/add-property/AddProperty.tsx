import { useEffect, useRef, useState } from "react"
import { KTIcon } from "../../../../../_metronic/helpers"
import { Step0 } from "./components/steps/Step0"
import { Step1 } from "./components/steps/Step1"
import { Step2 } from "./components/steps/Step2"
import { Step3 } from "./components/steps/Step3"
import { Step4 } from "./components/steps/Step4"
import { Step5 } from "./components/steps/Step5"
import { StepperComponent } from "../../../../../_metronic/assets/ts/components"

import { APIProvider } from "@vis.gl/react-google-maps"

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

initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)

const AddProperty = () => {
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

    console.log(values)
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
        const permitUntilDate = new Date(
          values?.ownerDetails?.permitUntilDate ?? ""
        )
          .getTime()
          .toString()

        await updateDoc(newPropertyRef, {
          id: newPropertyRef.id,
          officeId,
          ownerDetails: {
            permitDate,
            permitUntilDate,
          },
          createdAt: new Date().getTime().toString(),
          updatedAt: new Date().getTime().toString(),
        })

        setSubmittingForm(false)
        actions.setSubmitting(false)

        toast.success("İlan başarıyla eklendi!")
        window.location.reload()
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
                        <Step1 setFieldValue={setFieldValue} />
                      </div>

                      <div data-kt-stepper-element="content">
                        <Step2 values={values} setFieldValue={setFieldValue} />
                      </div>

                      <div data-kt-stepper-element="content">
                        <Step3 values={values} setFieldValue={setFieldValue} />
                      </div>

                      <div data-kt-stepper-element="content">
                        <APIProvider
                          apiKey={import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY}
                        >
                          <Step4
                            values={values}
                            setFieldValue={setFieldValue}
                          />
                        </APIProvider>
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
