/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom"
import { KTIcon } from "../../../../../../../_metronic/helpers"
import { UsersListFilter } from "./UsersListFilter"

import * as XLSX from "xlsx"

import { User } from "../../../_core/_models"
import { Office } from "../../../../office-management/_core/_models"

import { getAllUsers } from "../../../_core/_requests"
import { getAllOffices } from "../../../../office-management/_core/_requests"

import {
  getUserRoleText,
  slugify,
} from "../../../../../../../_metronic/helpers/kyHelpers"

const exportUsersToExcel = async () => {
  const data: User[] = await getAllUsers()
  const offices: Office[] = await getAllOffices()

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
    { header: "Fotoğraf", key: "photoURL" },
    { header: "Ofis Sayfası", key: "officeId" },
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
        if (value && key === "officeId") {
          const office = offices.find((office) => office.id === value)

          if (office) {
            value =
              import.meta.env.VITE_APP_NAME +
              " " +
              office.name +
              "|" +
              office.id
          } else {
            value = ""
          }
        }
      })

      formattedUser[header.header] = value
    })

    return formattedUser
  })

  const worksheet = XLSX.utils.json_to_sheet(formattedData, {
    header: headers.map((h) => h.header),
    cellStyles: true,
  })

  worksheet["!autofilter"] = { ref: `A1:R1` }

  formattedData.forEach((user, index) => {
    const rowIndex = index + 2

    if (user["Telefon"]) {
      worksheet[`E${rowIndex}`] = {
        f: `HYPERLINK("https://wa.me/${slugify(user["Telefon"])}", "${
          user["Telefon"]
        }")`,
      }
    }
    if (user["Kullanıcı Sayfası"]) {
      worksheet[`N${rowIndex}`] = {
        f: `HYPERLINK("https://keya.com.tr/kullanici-detayi/${user["Kullanıcı Sayfası"]}", "Link")`,
      }
    }
    if (user["Fotoğraf"]) {
      worksheet[`O${rowIndex}`] = {
        f: `HYPERLINK("${user["Fotoğraf"]}", "Link")`,
      }
    }
    if (user["Ofis Sayfası"]) {
      worksheet[`P${rowIndex}`] = {
        f: `HYPERLINK("https://keya.com.tr/ofis-detayi/${
          user["Ofis Sayfası"].split("|")[1]
        }", "${user["Ofis Sayfası"].split("|")[0]}")`,
      }
    }
  })

  worksheet["!cols"] = [
    { width: 12 },
    { width: 15 },
    { width: 15 },
    { width: 28 },
    { width: 16 },
    { width: 7 },
    { width: 9 },
    { width: 13 },
    { width: 13 },
    { width: 10 },
    { width: 21 },
    { width: 20 },
    { width: 10 },
    { width: 4.5 },
    { width: 4.5 },
    { width: 14 },
    { width: 10 },
    { width: 10 },
  ]

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
