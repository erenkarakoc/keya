/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom"
import { KTIcon } from "../../../../../../../_metronic/helpers"
import { UsersListFilter } from "./UsersListFilter"

import * as XLSX from "xlsx"
import { getAllUsers } from "../../../_core/_requests"
import { User } from "../../../_core/_models"
import { getUserRoleText } from "../../../../../../../_metronic/helpers/kyHelpers"

const exportUsersToExcel = async () => {
  const data: User[] = await getAllUsers()

  const headers: { header: string; key: string }[] = [
    { header: "TC", key: "tc" },
    { header: "Ad", key: "firstName" },
    { header: "Soyad", key: "lastName" },
    { header: "E-posta", key: "email" },
    { header: "Telefon", key: "phoneNumber" },
    { header: "Ülke", key: "address.country" },
    { header: "Şehir", key: "address.state" },
    { header: "İlçe", key: "address.city" },
    { header: "Adres", key: "address.addressLine" },
    { header: "Doğum Tarihi", key: "birthDate" },
    { header: "Rol", key: "role" },
    { header: "Referans", key: "ref" },
    { header: "Katılış Tarihi", key: "joinedAt" },
    { header: "Kullanıcı Sayfası", key: "id" },
    { header: "Ofis Sayfası", key: "officeId" },
    { header: "Fotoğraf", key: "photoURL" },
    { header: "Sisteme Kayıt Tarihi", key: "createdAt" },
    { header: "Son Güncelleme Tarihi", key: "updatedAt" },
  ]

  const formattedData = data.map((user) => {
    const formattedUser: { [key: string]: any } = {}

    headers.forEach((header) => {
      const keys = header.key.split(".")
      let value = user as any

      keys.forEach((key) => {
        value = value ? value[key] : ""

        if (value && key === "country") {
          value = value.split("|")[0]
        }
        if (value && key === "state") {
          value = value.split("|")[0]
        }
        if (value && key === "city") {
          value = value.split("|")[0]
        }
        if (value && key === "role") {
          value = getUserRoleText(value)
        }
      })

      formattedUser[header.header] = value
    })

    return formattedUser
  })

  const worksheet = XLSX.utils.json_to_sheet(formattedData, {
    header: headers.map((h) => h.header),
  })

  formattedData.forEach((user, index) => {
    const rowIndex = index + 2
    if (user["Kullanıcı Sayfası"]) {
      worksheet[`N${rowIndex}`] = {
        f: `HYPERLINK("https://keya.com.tr/kullanici-detayi/${user["Kullanıcı Sayfası"]}", "Link")`,
      }
    }
    if (user["Ofis Sayfası"]) {
      worksheet[`O${rowIndex}`] = {
        f: `HYPERLINK("https://keya.com.tr/ofis-detayi/${user["Ofis Sayfası"]}", "Link")`,
      }
    }
    if (user["Fotoğraf"]) {
      worksheet[`P${rowIndex}`] = {
        f: `HYPERLINK("${user["Fotoğraf"]}", "Link")`,
      }
    }
  })

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Tüm Kullanıcılar")
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" })

  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = `Personel Bilgi.xlsx`

  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
}

const UsersListToolbar = () => {
  return (
    <div
      className="d-flex justify-content-end"
      data-kt-user-table-toolbar="base"
    >
      <UsersListFilter />

      <button
        type="button"
        className="btn btn-light-primary me-3"
        onClick={exportUsersToExcel}
      >
        <KTIcon iconName="exit-up" className="fs-2" />
        Dışa Aktar
      </button>

      <Link
        to="/arayuz/kullanici-yonetimi/kullanici-ekle"
        className="btn btn-primary"
      >
        <KTIcon iconName="plus" className="fs-2" />
        Ekle
      </Link>
    </div>
  )
}

export { UsersListToolbar }
