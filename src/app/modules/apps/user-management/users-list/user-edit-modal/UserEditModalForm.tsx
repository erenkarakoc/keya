import { FC, useState, useEffect, ChangeEvent } from "react"
import * as Yup from "yup"
import { useFormik } from "formik"
import { isNotEmpty, toAbsoluteUrl } from "../../../../../../_metronic/helpers"
import { User } from "../core/_models"
import clsx from "clsx"
import { useListView } from "../core/ListViewProvider"
import { UsersListLoading } from "../components/loading/UsersListLoading"
import { updateUser } from "../core/_requests"
import { useQueryResponse } from "../core/QueryResponseProvider"

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { firebaseApp } from "../../../../../../firebase/BaseConfig"
import { httpsCallable, getFunctions } from "firebase/functions"
import { getAuth } from "@firebase/auth"

import { Office } from "../../../office-management/offices-list/core/_models"
import { getAllOffices } from "../../../office-management/offices-list/core/_requests"

const storage = getStorage(firebaseApp)
const auth = getAuth()
const functions = getFunctions()
const updateEmail = httpsCallable(functions, "updateEmail")

type Props = {
  isUserLoading: boolean
  user: User
}

const editUserSchema = Yup.object().shape({
  avatar: Yup.string(),
  firstName: Yup.string()
    .min(3, "Ad en az 3 karakterden oluşmalı")
    .max(50, "Ad fazla 50 karakterden oluşmalı")
    .required("Ad alanı zorunludur"),
  lastName: Yup.string()
    .min(3, "Soyad en az 3 karakterden oluşmalı")
    .max(50, "Soyad en fazla 50 karakterden oluşmalı")
    .required("Soyad alanı zorunludur"),
  email: Yup.string()
    .email("Geçerli bir e-posta adresi gir")
    .min(3, "E-posta en az 3 karakterden oluşmalı")
    .max(50, "E-posta 50 karakterden oluşmalı")
    .required("E-posta girilmesi zorunludur"),
  officeId: Yup.string().required("Bir ofis seçilmesi zorunludur"),
})

const UserEditModalForm: FC<Props> = ({ user, isUserLoading }) => {
  const { setItemIdForUpdate } = useListView()
  const { refetch } = useQueryResponse()

  const [uploadedImage, setUploadedImage] = useState<File | string | null>(null)
  const [userForEdit, setUserForEdit] = useState<User>({
    ...user,
  })

  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
    userForEdit.photoURL as string
  )

  const [offices, setOffices] = useState<Office[]>()

  const blankImg = toAbsoluteUrl("media/svg/avatars/blank.svg")

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0]
      setUploadedImage(selectedFile)
      setUploadedImageUrl(URL.createObjectURL(selectedFile))
      setUserForEdit((prevUser) => ({
        ...prevUser,
        photoURL: URL.createObjectURL(selectedFile),
      }))
    }
  }

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  const formik = useFormik({
    initialValues: userForEdit,
    validationSchema: editUserSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)
      try {
        if (isNotEmpty(values.id)) {
          if (!auth.currentUser) {
            console.log("User is not authenticated. Please sign in.")
            return
          }
          if (uploadedImage) {
            try {
              const storageRef = ref(
                storage,
                `images/avatars/avatar-${userForEdit.uid}`
              )
              await uploadBytes(storageRef, uploadedImage as File)
              const downloadURL = await getDownloadURL(storageRef)
              values.photoURL = downloadURL
            } catch (error) {
              console.error("Error uploading image:", error)
            }
          }

          await updateUser(values)
          await updateEmail({ uid: values.uid, newEmail: values.email })
        }
      } catch (error) {
        console.error(error)
      } finally {
        setSubmitting(false)
        cancel(true)
      }
    },
  })

  const fetchOffices = async () => {
    setOffices(await getAllOffices())
  }

  useEffect(() => {
    fetchOffices()
  }, [])

  return (
    <>
      <form
        id="kt_modal_add_user_form"
        className="form"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        {/* begin::Scroll */}
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
          {/* begin::Input group */}
          <div className="fv-row mb-7">
            {/* begin::Image input */}
            <div
              className="image-input image-input-outline"
              data-kt-image-input="true"
              style={{
                backgroundImage: `url('${
                  userForEdit.photoURL ? userForEdit.photoURL : blankImg
                }')`,
              }}
            >
              {/* begin::Preview existing avatar */}
              <div
                className="image-input-wrapper w-125px h-125px"
                style={{
                  backgroundImage: `url('${
                    uploadedImageUrl ? uploadedImageUrl : blankImg
                  }')`,
                }}
              ></div>
              {/* end::Preview existing avatar */}

              {/* begin::Label */}
              <label
                className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                data-kt-image-input-action="change"
                data-bs-toggle="tooltip"
                title="Fotoğrafı Değiştir"
              >
                <i className="bi bi-pencil-fill fs-7"></i>

                <input
                  type="file"
                  name="avatar"
                  accept=".png, .jpg, .jpeg"
                  onChange={handleImageChange}
                />
                {/* <input type="hidden" name="avatar_remove" /> */}
              </label>
              {/* end::Label */}
            </div>
            {/* end::Image input */}

            {/* begin::Hint */}
            <div className="form-text">
              İzin verilen dosya türleri: png, jpg, jpeg.
            </div>
            {/* end::Hint */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className="fv-row mb-7">
            {/* begin::Label */}
            <label className="required fw-bold fs-6 mb-2">Ad</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder="Ad"
              {...formik.getFieldProps("firstName")}
              type="text"
              name="firstName"
              value={formik.values.firstName}
              className={clsx(
                "form-control form-control-solid mb-3 mb-lg-0",
                {
                  "is-invalid":
                    formik.touched.firstName && formik.errors.firstName,
                },
                {
                  "is-valid":
                    formik.touched.firstName && !formik.errors.firstName,
                }
              )}
              autoComplete="off"
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert">{formik.errors.firstName}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className="fv-row mb-7">
            {/* begin::Label */}
            <label className="required fw-bold fs-6 mb-2">Soyad</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder="Soyad"
              {...formik.getFieldProps("lastName")}
              type="text"
              name="lastName"
              value={formik.values.lastName}
              className={clsx(
                "form-control form-control-solid mb-3 mb-lg-0",
                {
                  "is-invalid":
                    formik.touched.lastName && formik.errors.lastName,
                },
                {
                  "is-valid":
                    formik.touched.lastName && !formik.errors.lastName,
                }
              )}
              autoComplete="off"
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert">{formik.errors.lastName}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className="fv-row mb-7">
            {/* begin::Label */}
            <label className="required fw-bold fs-6 mb-2">E-posta</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder="Email"
              {...formik.getFieldProps("email")}
              value={formik.values.email}
              className={clsx(
                "form-control form-control-solid mb-3 mb-lg-0",
                {
                  "is-invalid": formik.touched.email && formik.errors.email,
                },
                {
                  "is-valid": formik.touched.email && !formik.errors.email,
                }
              )}
              type="email"
              name="email"
              autoComplete="off"
              disabled={formik.isSubmitting || isUserLoading}
            />
            {/* end::Input */}
            {formik.touched.email && formik.errors.firstName && (
              <div className="fv-plugins-message-container">
                <span role="alert">{formik.errors.firstName}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className="fv-row mb-7">
            {/* begin::Label */}
            <label className="required fw-bold fs-6 mb-2">Ofisi</label>
            {/* end::Label */}

            {/* begin::Input */}
            <select
              className="form-select form-select-lg form-select-solid"
              name="officeId"
              value={formik.values.officeId}
              onChange={(e) => {
                formik.setFieldValue("officeId", e.target.value)
              }}
            >
              <option></option>
              {offices &&
                offices.map((office) => (
                  <option
                    value={office.id}
                    office-id={office.id}
                    key={office.id}
                  >
                    Keya {office.name}
                  </option>
                ))}
            </select>
            {/* end::Input */}
            {formik.touched.officeId && formik.errors.officeId && (
              <div className="fv-plugins-message-container">
                <span role="alert">{formik.errors.officeId}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className="mb-7">
            {/* begin::Label */}
            <label className="required fw-bold fs-6 mb-5">Ünvan</label>
            {/* end::Label */}
            {/* begin::Roles */}
            {/* begin::Input row */}
            <div className="d-flex fv-row">
              {/* begin::Radio */}
              <div className="form-check form-check-custom form-check-solid">
                {/* begin::Input */}
                <input
                  className="form-check-input me-3"
                  {...formik.getFieldProps("role")}
                  name="role"
                  type="radio"
                  value="admin"
                  id="kt_modal_update_role_option_0"
                  checked={formik.values.role === "admin"}
                  disabled={formik.isSubmitting || isUserLoading}
                />

                {/* end::Input */}
                {/* begin::Label */}
                <label
                  className="form-check-label"
                  htmlFor="kt_modal_update_role_option_0"
                >
                  <div className="fw-bolder text-gray-800">Yönetici</div>
                  <div className="text-gray-600">Tüm yetkiler</div>
                </label>
                {/* end::Label */}
              </div>
              {/* end::Radio */}
            </div>
            {/* end::Input row */}
            <div className="separator separator-dashed my-5"></div>
            {/* begin::Input row */}
            <div className="d-flex fv-row">
              {/* begin::Radio */}
              <div className="form-check form-check-custom form-check-solid">
                {/* begin::Input */}
                <input
                  className="form-check-input me-3"
                  {...formik.getFieldProps("role")}
                  name="role"
                  type="radio"
                  value="broker"
                  id="kt_modal_update_role_option_1"
                  checked={formik.values.role === "broker"}
                  disabled={formik.isSubmitting || isUserLoading}
                />
                {/* end::Input */}
                {/* begin::Label */}
                <label
                  className="form-check-label"
                  htmlFor="kt_modal_update_role_option_1"
                >
                  <div className="fw-bolder text-gray-800">Broker</div>
                  <div className="text-gray-600">
                    Franchise ofisi dahilinde tüm yetkiler
                  </div>
                </label>
                {/* end::Label */}
              </div>
              {/* end::Radio */}
            </div>
            {/* end::Input row */}
            <div className="separator separator-dashed my-5"></div>
            {/* begin::Input row */}
            <div className="d-flex fv-row">
              {/* begin::Radio */}
              <div className="form-check form-check-custom form-check-solid">
                {/* begin::Input */}
                <input
                  className="form-check-input me-3"
                  {...formik.getFieldProps("role")}
                  name="role"
                  type="radio"
                  value="assistant"
                  id="kt_modal_update_role_option_2"
                  checked={formik.values.role === "assistant"}
                  disabled={formik.isSubmitting || isUserLoading}
                />

                {/* end::Input */}
                {/* begin::Label */}
                <label
                  className="form-check-label"
                  htmlFor="kt_modal_update_role_option_2"
                >
                  <div className="fw-bolder text-gray-800">Ofis Asistanı</div>
                  <div className="text-gray-600">
                    Franchise ofisi dahilinde üst düzey yetkiler
                  </div>
                </label>
                {/* end::Label */}
              </div>
              {/* end::Radio */}
            </div>
            {/* end::Input row */}
            <div className="separator separator-dashed my-5"></div>
            {/* begin::Input row */}
            <div className="d-flex fv-row">
              {/* begin::Radio */}
              <div className="form-check form-check-custom form-check-solid">
                {/* begin::Input */}
                <input
                  className="form-check-input me-3"
                  {...formik.getFieldProps("role")}
                  name="role"
                  type="radio"
                  value="human-resources"
                  id="kt_modal_update_role_option_3"
                  checked={formik.values.role === "human-resources"}
                  disabled={formik.isSubmitting || isUserLoading}
                />
                {/* end::Input */}
                {/* begin::Label */}
                <label
                  className="form-check-label"
                  htmlFor="kt_modal_update_role_option_3"
                >
                  <div className="fw-bolder text-gray-800">
                    İnsan Kaynakları
                  </div>
                  <div className="text-gray-600">
                    Danışmanlar ve personeller dahilinde yetkiler
                  </div>
                </label>
                {/* end::Label */}
              </div>
              {/* end::Radio */}
            </div>
            {/* end::Input row */}
            <div className="separator separator-dashed my-5"></div>
            {/* begin::Input row */}
            <div className="d-flex fv-row">
              {/* begin::Radio */}
              <div className="form-check form-check-custom form-check-solid">
                {/* begin::Input */}
                <input
                  className="form-check-input me-3"
                  {...formik.getFieldProps("role")}
                  name="role"
                  type="radio"
                  id="kt_modal_update_role_option_4"
                  value="franchise-manager"
                  checked={formik.values.role === "franchise-manager"}
                  disabled={formik.isSubmitting || isUserLoading}
                />
                {/* end::Input */}
                {/* begin::Label */}
                <label
                  className="form-check-label"
                  htmlFor="kt_modal_update_role_option_4"
                >
                  <div className="fw-bolder text-gray-800">
                    Franchise Yöneticisi
                  </div>
                  <div className="text-gray-600">
                    Franchise ofisler ve yeni broker adayları dahilinde yetkiler
                  </div>
                </label>
                {/* end::Label */}
              </div>
              {/* end::Radio */}
            </div>
            {/* end::Input row */}
            <div className="separator separator-dashed my-5"></div>
            {/* begin::Input row */}
            <div className="d-flex fv-row">
              {/* begin::Radio */}
              <div className="form-check form-check-custom form-check-solid">
                {/* begin::Input */}
                <input
                  className="form-check-input me-3"
                  {...formik.getFieldProps("role")}
                  name="role"
                  type="radio"
                  id="kt_modal_update_role_option_5"
                  value="agent"
                  checked={formik.values.role === "agent"}
                  disabled={formik.isSubmitting || isUserLoading}
                />
                {/* end::Input */}
                {/* begin::Label */}
                <label
                  className="form-check-label"
                  htmlFor="kt_modal_update_role_option_5"
                >
                  <div className="fw-bolder text-gray-800">
                    Gayrimenkul Danışmanı
                  </div>
                  <div className="text-gray-600">
                    Kendi portföyleri dahilinde yetkiler
                  </div>
                </label>
                {/* end::Label */}
              </div>
              {/* end::Radio */}
            </div>
            {/* end::Input row */}
            {/* end::Roles */}
          </div>
          {/* end::Input group */}
        </div>
        {/* end::Scroll */}

        {/* begin::Actions */}
        <div className="text-center pt-15">
          <button
            type="reset"
            onClick={() => cancel()}
            className="btn btn-light me-3"
            data-kt-users-modal-action="cancel"
            disabled={formik.isSubmitting || isUserLoading}
          >
            İptal
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            data-kt-users-modal-action="submit"
            disabled={
              isUserLoading ||
              formik.isSubmitting ||
              !formik.isValid ||
              !formik.touched
            }
          >
            <span className="indicator-label">Kaydet</span>
            {(formik.isSubmitting || isUserLoading) && (
              <span className="indicator-progress">
                Please wait...{" "}
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            )}
          </button>
        </div>
        {/* end::Actions */}
      </form>
      {(formik.isSubmitting || isUserLoading) && <UsersListLoading />}
    </>
  )
}

export { UserEditModalForm }
