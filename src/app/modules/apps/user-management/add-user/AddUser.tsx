import { useEffect, useRef, useState } from "react"
import { KTIcon } from "../../../../../_metronic/helpers"
import { Step0 } from "./components/steps/Step0"
import { Step1 } from "./components/steps/Step1"
import { Step2 } from "./components/steps/Step2"
import { Step3 } from "./components/steps/Step3"
import { Step4 } from "./components/steps/Step4"
import { StepperComponent } from "../../../../../_metronic/assets/ts/components"
import { Form, Formik, FormikValues } from "formik"
import {
  step0Schema,
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  ICreateAccount,
  inits,
} from "./components/CreateAccountWizardHelper"
import { Content } from "../../../../../_metronic/layout/components/Content"

import { initializeApp } from "firebase/app"
import { firebaseConfig } from "../../../../../firebase/BaseConfig"
import { getFunctions, httpsCallable } from "firebase/functions"

import toast from "react-hot-toast"
import { addUsersToOffice } from "../_core/_requests"

initializeApp(firebaseConfig)
const functions = getFunctions()

const registerUser = httpsCallable(functions, "registerUser")

const AddUser = () => {
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

    if (stepper.currentStepIndex !== stepper.totalStepsNumber) {
      stepper.goNext()
      setCurrentSchemaIndex((prevIndex) => prevIndex + 1)
    } else {
      setSubmittingForm(true)

      try {
        const res: any = await registerUser(values)

        console.log(res)

        setSubmittingForm(false)
        actions.setSubmitting(false)

        addUsersToOffice(values.officeId, [res?.data?.userId])

        toast.success("Kullanıcı başarıyla eklendi!")

        window.location.href = "/arayuz/kullanici-yonetimi/kullanicilar"
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
        <div
          ref={stepperRef}
          className="stepper stepper-pills stepper-column d-flex flex-column flex-xl-row flex-row-fluid"
          id="kt_create_account_stepper"
        >
          {/* begin::Aside*/}
          <div className="card d-flex justify-content-center justify-content-xl-start flex-row-auto w-100 w-xl-300px w-xxl-400px me-9">
            {/* begin::Wrapper*/}
            <div className="card-body px-6 px-lg-10 px-xxl-15 py-20">
              {/* begin::Nav*/}
              <div className="stepper-nav">
                {/* begin::Step 0*/}
                <div
                  className="stepper-item current"
                  data-kt-stepper-element="nav"
                ></div>
                {/* end::Step 0*/}

                {/* begin::Step 1*/}
                <div className="stepper-item" data-kt-stepper-element="nav">
                  {/* begin::Wrapper*/}
                  <div className="stepper-wrapper">
                    {/* begin::Icon*/}
                    <div className="stepper-icon w-40px h-40px">
                      <i className="stepper-check fas fa-check"></i>
                      <span className="stepper-number">1</span>
                    </div>
                    {/* end::Icon*/}

                    {/* begin::Label*/}
                    <div className="stepper-label">
                      <h3 className="stepper-title">Genel Bilgiler</h3>
                      <div className="stepper-desc fw-semibold">
                        Ad soyad ve giriş bilgileri
                      </div>
                    </div>
                    {/* end::Label*/}
                  </div>
                  {/* end::Wrapper*/}

                  {/* begin::Line*/}
                  <div className="stepper-line h-40px"></div>
                  {/* end::Line*/}
                </div>
                {/* end::Step 1*/}

                {/* begin::Step 2*/}
                <div className="stepper-item" data-kt-stepper-element="nav">
                  {/* begin::Wrapper*/}
                  <div className="stepper-wrapper">
                    {/* begin::Icon*/}
                    <div className="stepper-icon w-40px h-40px">
                      <i className="stepper-check fas fa-check"></i>
                      <span className="stepper-number">2</span>
                    </div>
                    {/* end::Icon*/}

                    {/* begin::Label*/}
                    <div className="stepper-label">
                      <h3 className="stepper-title">Detaylı Bilgiler</h3>
                      <div className="stepper-desc fw-semibold">
                        Fotoğraf ve iletişim bilgileri
                      </div>
                    </div>
                    {/* end::Label*/}
                  </div>
                  {/* end::Wrapper*/}

                  {/* begin::Line*/}
                  <div className="stepper-line h-40px"></div>
                  {/* end::Line*/}
                </div>
                {/* end::Step 2*/}

                {/* begin::Step 3*/}
                <div className="stepper-item" data-kt-stepper-element="nav">
                  {/* begin::Wrapper*/}
                  <div className="stepper-wrapper">
                    {/* begin::Icon*/}
                    <div className="stepper-icon w-40px h-40px">
                      <i className="stepper-check fas fa-check"></i>
                      <span className="stepper-number">3</span>
                    </div>
                    {/* end::Icon*/}

                    {/* begin::Label*/}
                    <div className="stepper-label">
                      <h3 className="stepper-title">Ofis ve Yetkiler</h3>
                      <div className="stepper-desc fw-semibold">
                        Kullanıcı ofisi ve rolü
                      </div>
                    </div>
                    {/* end::Label*/}
                  </div>
                  {/* end::Wrapper*/}

                  {/* begin::Line*/}
                  <div className="stepper-line h-40px"></div>
                  {/* end::Line*/}
                </div>
                {/* end::Step 3*/}

                {/* begin::Step 4*/}
                <div className="stepper-item" data-kt-stepper-element="nav">
                  {/* begin::Wrapper*/}
                  <div className="stepper-wrapper">
                    {/* begin::Icon*/}
                    <div className="stepper-icon w-40px h-40px">
                      <i className="stepper-check fas fa-check"></i>
                      <span className="stepper-number">4</span>
                    </div>
                    {/* end::Icon*/}

                    {/* begin::Label*/}
                    <div className="stepper-label">
                      <h3 className="stepper-title">Son Bir Adım</h3>
                      <div className="stepper-desc fw-semibold">
                        Kullanıcıya giriş bilgilerini iletin
                      </div>
                    </div>
                    {/* end::Label*/}
                  </div>
                  {/* end::Wrapper*/}
                </div>
                {/* end::Step 4*/}
              </div>
              {/* end::Nav*/}
            </div>
            {/* end::Wrapper*/}
          </div>
          {/* begin::Aside*/}

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
                  <div className="current" data-kt-stepper-element="content">
                    <Step0 />
                  </div>

                  <div data-kt-stepper-element="content">
                    <Step1 setFieldValue={setFieldValue} />
                  </div>

                  <div data-kt-stepper-element="content">
                    <Step2 setFieldValue={setFieldValue} values={values} />
                  </div>

                  <div data-kt-stepper-element="content">
                    <Step3 setFieldValue={setFieldValue} />
                  </div>

                  <div data-kt-stepper-element="content">
                    <Step4 values={values} />
                  </div>

                  <div className="d-flex flex-stack pt-10">
                    <div className="mr-2">
                      <button
                        onClick={prevStep}
                        type="button"
                        className="btn btn-lg btn-light-primary me-3"
                        data-kt-stepper-action="previous"
                      >
                        <KTIcon iconName="arrow-left" className="fs-4 me-1" />
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
                              Devam et
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
      </Content>
    </>
  )
}

export { AddUser }
