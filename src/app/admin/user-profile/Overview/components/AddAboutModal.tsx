/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"

import * as Yup from "yup"
import { Formik, Form, Field, ErrorMessage } from "formik"
import toast from "react-hot-toast"

import { User } from "../../../../modules/apps/user-management/_core/_models"
import {
  removeUserAbout,
  updateUser,
} from "../../../../modules/apps/user-management/_core/_requests"
import { KTIcon } from "../../../../../_metronic/helpers"

import { getAuth } from "@firebase/auth"
import { Modal } from "react-bootstrap"

interface AddAboutModalProps {
  user: User
  currentAbout: { title: string; description: string } | undefined
  setCurrentAbout: Dispatch<
    SetStateAction<{ title: string; description: string } | undefined>
  >
  show: boolean
  setShow: Dispatch<SetStateAction<boolean>>
}

const auth = getAuth()

const AddAboutModal: React.FC<AddAboutModalProps> = ({
  user,
  currentAbout,
  setCurrentAbout,
  show,
  setShow,
}) => {
  const [submittingForm, setSubmittingForm] = useState(false)
  const [userForEdit, setUserForEdit] = useState<User>({
    ...user,
  })
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  const editAboutSchema = Yup.object().shape({
    about: Yup.object({
      title: Yup.string().required("Başlık alanı gereklidir."),
      description: Yup.string().required("Açıklama alanı gereklidir."),
    }),
  })

  const handleSubmit = async (values: User) => {
    setSubmittingForm(true)

    try {
      if (values.id) {
        if (!auth.currentUser) {
          console.log("User is not authenticated. Please sign in.")
          return
        }

        setCurrentAbout({
          title: values.about?.title ?? "",
          description: values.about?.description ?? "",
        })

        await updateUser(values)

        toast.success("Hakkında bilgisi güncellendi.")
        setShow(false)
      }
    } catch (error) {
      toast.error(
        "Hakkında bilgisi güncellenirken bir hata oluştu, lütfen tekrar deneyin."
      )

      console.error(error)
    } finally {
      setSubmittingForm(false)
    }
  }

  useEffect(() => {
    setUserForEdit((prevState) => ({
      ...prevState!,
      about: {
        title: currentAbout?.title,
        description: currentAbout?.description,
      },
    }))
  }, [currentAbout])

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header>
        <div className="d-flex justify-content-between align-items-center w-100">
          <Modal.Title>Kullanıcı Hakkında Bilgisi</Modal.Title>
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
        <Formik
          id="kt_modal_add_office_form"
          className="form"
          onSubmit={handleSubmit}
          initialValues={userForEdit}
          validationSchema={editAboutSchema}
          enableReinitialize={true}
          noValidate
        >
          <Form noValidate id="kt_modal_add_user_form" placeholder={undefined}>
            <div
              className="d-flex flex-column me-n7 pe-7 pt-5"
              id="kt_modal_add_user_scroll"
              data-kt-scroll="true"
              data-kt-scroll-activate="{default: false, lg: true}"
              data-kt-scroll-max-height="auto"
              data-kt-scroll-dependencies="#kt_modal_add_user_header"
              data-kt-scroll-wrappers="#kt_modal_add_user_scroll"
              data-kt-scroll-offset="300px"
              style={{ maxHeight: "unset" }}
            >
              <div className="fv-row mb-7">
                <label className="fw-bold fs-6 mb-2">Başlık</label>

                <Field
                  placeholder={`Merhaba, ben ${user.firstName}!`}
                  type="text"
                  name="about.title"
                  className="form-control form-control-solid mb-3 mb-lg-2"
                  autoComplete="off"
                />

                <span className="text-danger">
                  <ErrorMessage name="about.title" />
                </span>
              </div>

              <div className="fv-row mb-7">
                <label className="fw-bold fs-6 mb-2">Açıklama</label>

                <Field
                  placeholder="Açıklama"
                  as="textarea"
                  rows={6}
                  name="about.description"
                  className="form-control form-control-solid mb-3 mb-lg-2"
                  autoComplete="off"
                />

                <span className="text-danger">
                  <ErrorMessage name="about.description" />
                </span>
              </div>
            </div>

            <Modal.Footer className="px-0">
              <div className="d-flex w-100">
                <button
                  ref={cancelButtonRef}
                  type="button"
                  className="btn btn-danger"
                  style={{ marginRight: "auto" }}
                  disabled={
                    currentAbout === undefined ? true : false && submittingForm
                  }
                  onClick={async () => {
                    await removeUserAbout(user.id)
                    setCurrentAbout(undefined)
                    setShow(false)
                    toast.success("Hakkında alanı silindi.")
                  }}
                >
                  Sil
                </button>

                <button
                  ref={cancelButtonRef}
                  type="button"
                  className="btn btn-light me-3"
                  disabled={submittingForm}
                  style={{ marginLeft: "auto" }}
                  onClick={() => setShow(false)}
                >
                  İptal
                </button>

                <button type="submit" className="btn btn-primary">
                  {submittingForm ? (
                    <span className="indicator-label">
                      Kaydediliyor{" "}
                      <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                  ) : (
                    <span className="indicator-label">Kaydet</span>
                  )}
                </button>
              </div>
            </Modal.Footer>
          </Form>
        </Formik>
      </Modal.Body>
    </Modal>
  )
}

export { AddAboutModal }
