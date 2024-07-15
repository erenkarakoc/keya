/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom"
import { KTIcon } from "../../../../../../../_metronic/helpers"
import { PropertiesListFilter } from "./PropertiesListFilter"

import * as XLSX from "xlsx"

import { Property } from "../../../_core/_models"
import { User } from "../../../../user-management/_core/_models"

import { getAllProperties } from "../../../_core/_requests"
import { getAllUsers } from "../../../../user-management/_core/_requests"

import { formatPrice } from "../../../../../../../_metronic/helpers/kyHelpers"

const PropertiesListToolbar = () => {
  const exportPropertiesToExcel = async () => {
    const data: Property[] = await getAllProperties()
    const users: User[] = await getAllUsers()

    const headers: { header: string; key: string }[] = [
      { header: "Durum", key: "saleDetails.active" },
      { header: "Tarih", key: "createdAt" },
      { header: "İlan Başlığı", key: "title" },
      { header: "Yetki Belgesi Türü", key: "ownerDetails.permit" },
      { header: "Yetki Belgesi Alınan Tarih", key: "ownerDetails.permitDate" },
      {
        header: "Yetki Belgesi Geçerlilik Tarihi",
        key: "ownerDetails.permitUntilDate",
      },
      {
        header: "Yetki Belgesi Üzerindeki Fiyatı",
        key: "ownerDetails.permitPrice",
      },
      { header: "Mal Sahibi Adı Soyadı", key: "ownerDetails.ownerFullName" },
      { header: "Mal Sahibi İletişim", key: "ownerDetails.ownerPhoneNumber" },
      { header: "İlan Tipi", key: "propertyDetails.for" },
      { header: "Fiyat", key: "propertyDetails.price" },
      { header: "Danışman", key: "userIds" },
      { header: "Not", key: "personalDescription" },
      { header: "Keya Linki", key: "id" },
      { header: "Sahibinden Linki", key: "sahibindenNo" },
      { header: "Emlakjet Linki", key: "emlakJetNo" },
      { header: "Sisteme Kayıt Tarihi", key: "createdAt" },
      { header: "Son Güncelleme Tarihi", key: "updatedAt" },
    ]

    const formattedData = data.map((property) => {
      const formattedUser: { [key: string]: any } = {}

      headers.forEach((header) => {
        const keys = header.key.split(".")
        let value = property as any

        keys.forEach((key) => {
          value = value ? value[key] : ""

          if (value && key === "active") {
            value = value === "true" ? "Aktif" : "Pasif"
          }
          if (value && key === "permitUntilDate") {
            value = value === "limitless" ? "Süresiz" : value
          }
          if (value && key === "permitPrice") {
            value = formatPrice(value)
          }
          if (value && key === "for") {
            value =
              value === "sale"
                ? "Satılık"
                : value === "rent"
                ? "Kiralık"
                : value === "lease-sale"
                ? "Devren Satılık"
                : value === "lease-rent"
                ? "Devren Kiralık"
                : ""
          }
          if (value && key === "price") {
            value = formatPrice(value)
          }
          if (value && key === "userIds") {
            value = value
              .map((userId: any) => {
                const user = users.find((user) => user.id === userId)
                return user ? `${user.firstName} ${user.lastName}` : ""
              })
              .join(" ve ")
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

    formattedData.forEach((property, index) => {
      const rowIndex = index + 2

      if (property["Keya Linki"]) {
        worksheet[`N${rowIndex}`] = {
          t: "s",
          f: `HYPERLINK("https://keya.com.tr/ilan-detayi/${property["Keya Linki"]}", "Link")`,
        }
      }
      if (property["Sahibinden Linki"]) {
        worksheet[`O${rowIndex}`] = {
          t: "s",
          f: `HYPERLINK("https://shbd.io/${property["Sahibinden Linki"]}", "Link")`,
        }
      }
      if (property["Emlakjet Linki"]) {
        worksheet[`P${rowIndex}`] = {
          t: "s",
          f: `HYPERLINK("https://emlakjet.com/ilan/${property["Emlakjet Linki"]}", "Link")`,
        }
      }
    })

    worksheet["!cols"] = [
      { width: 6.4 },
      { width: 10 },
      { width: 20 },
      { width: 10 },
      { width: 10 },
      { width: 10 },
      { width: 11 },
      { width: 20 },
      { width: 16 },
      { width: 6 },
      { width: 12 },
      { width: 20 },
      { width: 6 },
      { width: 4.5 },
      { width: 4.5 },
      { width: 4.5 },
      { width: 10 },
      { width: 10 },
    ]

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tüm İlanlar")
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    })
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" })

    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `İlan Bilgi.xlsx`

    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
  }

  return (
    <div
      className="d-flex justify-content-end"
      data-kt-property-table-toolbar="base"
    >
      <PropertiesListFilter />

      {/* begin::Export */}
      <button
        type="button"
        className="btn btn-light-primary me-3"
        onClick={exportPropertiesToExcel}
      >
        <KTIcon iconName="exit-up" className="fs-2" />
        Dışa Aktar
      </button>
      {/* end::Export */}

      {/* begin::Add property */}
      <Link to="/arayuz/ilan-yonetimi/ilan-ekle" className="btn btn-primary">
        <KTIcon iconName="plus" className="fs-2" />
        Ekle
      </Link>
      {/* end::Add property */}
    </div>
  )
}

export { PropertiesListToolbar }
