/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, FC } from "react"
import { Field, ErrorMessage } from "formik"

interface Step3Props {
  values: {
    propertyDetails: {
      featuresInner?: string[]
      featuresOuter?: string[]
      featuresNeighbourhood?: string[]
      featuresTransportation?: string[]
      featuresView?: string[]
      featuresRealEstateType?: string[]
      featuresForDisabled?: string[]
    }
  }
  setFieldValue: (
    field: string,
    value: string[] | string,
    shouldValidate?: boolean
  ) => void
}

const Step3: FC<Step3Props> = ({ values, setFieldValue }) => {
  const featuresInner = [
    "ADSL",
    "Ahşap Doğrama",
    "Akıllı Ev",
    "Alarm (Hırsız)",
    "Alarm (Yangın)",
    "Alaturka Tuvalet",
    "Alüminyum Doğrama",
    "Amerikan Kapı",
    "Amerikan Mutfak",
    "Ankastre Fırın",
    "Barbekü",
    "Beyaz Eşya",
    "Boyalı",
    "Bulaşık Makinesi",
    "Buzdolabı",
    "Çamaşır Kurutma Makinesi",
    "Çamaşır Makinesi",
    "Çamaşır Odası",
    "Çelik Kapı",
    "Duşakabin",
    "Duvar Kağıdı",
    "Ebeveyn Banyosu",
    "Fırın",
    "Fiber İnternet",
    "Giyinme Odası",
    "Gömme Dolap",
    "Görüntülü Diafon",
    "Hilton Banyo",
    "Intercom Sistemi",
    "Isıcam",
    "Jakuzi",
    "Kartonpiyer",
    "Kiler",
    "Klima",
    "Küvet",
    "Laminat Zemin",
    "Marley",
    "Mobilya",
    "Mutfak (Ankastre)",
    "Mutfak (Laminat)",
    "Mutfak Doğalgazı",
    "Panjur/Jaluzi",
    "Parke Zemin",
    "PVC Doğrama",
    "Seramik Zemin",
    "Set Üstü Ocak",
    "Spot Aydınlatma",
    "Şofben",
    "Şömine",
    "Teras",
    "Termosifon",
    "Vestiyer",
    "Wi-Fi",
    "Yüz Tanıma & Parmak İzi",
  ]

  const featuresOuter = [
    "Araç Şarj İstasyonu",
    "24 Saat Güvenlik",
    "Apartman Görevlisi",
    "Buhar Odası",
    "Çocuk Oyun Parkı",
    "Hamam",
    "Hidrofor",
    "Isı Yalıtımı",
    "Jeneratör",
    "Kablo TV",
    "Kamera Sistemi",
    "Kreş",
    "Müstakil Havuzlu",
    "Sauna",
    "Ses Yalıtımı",
    "Siding",
    "Spor Alanı",
    "Su Deposu",
    "Tenis Kortu",
    "Uydu",
    "Yangın Merdiveni",
    "Yüzme Havuzu (Açık)",
    "Yüzme Havuzu (Kapalı)",
  ]

  const featuresNeighbourhood = [
    "Alışveriş Merkezi",
    "Belediye",
    "Cami",
    "Cemevi",
    "Denize Sıfır",
    "Eczane",
    "Eğlence Merkezi",
    "Fuar",
    "Göle Sıfır",
    "Hastane",
    "Havra",
    "İlkokul-Ortaokul",
    "İtfaiye",
    "Kilise",
    "Lise",
    "Market",
    "Park",
    "Plaj",
    "Polis Merkezi",
    "Sağlık Ocağı",
    "Semt Pazarı",
    "Spor Salonu",
    "Şehir Merkezi",
    "Üniversite",
  ]

  const featuresTransportation = [
    "Anayol",
    "Avrasya Tüneli",
    "Boğaz Köprüleri",
    "Cadde",
    "Deniz Otobüsü",
    "Dolmuş",
    "E-5",
    "Havaalanı",
    "İskele",
    "Marmaray",
    "Metro",
    "Metrobüs",
    "Minibüs",
    "Otobüs Durağı",
    "Sahil",
    "Teleferik",
    "TEM",
    "Tramvay",
    "Tren İstasyonu",
    "Troleybüs",
  ]

  const featuresView = [
    "Boğaz",
    "Deniz",
    "Doğa",
    "Göl",
    "Havuz",
    "Park & Yeşil Alan",
    "Şehir",
  ]

  const featuresRealEstateType = [
    "Ara Kat",
    "Ara Kat Dubleks",
    "Bahçe Dubleksi",
    "Bahçe Katı",
    "Bahçeli",
    "Çatı Dubleksi",
    "En Üst Kat",
    "Forleks",
    "Garaj / Dükkan",
    "Giriş Katı",
    "Kat Dubleksi",
    "Loft",
    "Müstakil Girişli</label>",
    "Ters Dubleks",
    "Tripleks",
    "Zemin Kat",
  ]

  const featuresForDisabled = [
    "Araç Park Yeri",
    "Asansör",
    "Banyo",
    "Geniş Koridor",
    "Giriş / Rampa",
    "Merdiven",
    "Mutfak",
    "Oda Kapısı",
    "Park",
    "Priz / Elektrik",
    "Tutamak /",
    "Tuvalet",
    "Yüzme Havuzu",
  ]

  const handleFeaturesChange = (
    e: ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const { checked, value } = e.target
    const currentValues = (values.propertyDetails as any)[fieldName] || []

    let updatedValues: string[] = []

    if (checked) {
      updatedValues = [...currentValues, value]
    } else {
      updatedValues = currentValues.filter((item: string) => item !== value)
    }

    setFieldValue(`propertyDetails.${fieldName}`, updatedValues)
  }

  return (
    <div className="w-100">
      <div className="pb-10 pb-lg-12">
        <h2 className="fw-bolder text-gray-900">Özellikler</h2>

        <div className="text-gray-500 fw-bold fs-6">
          Gayrimenkul'e dair özellikleri seçin.
        </div>
      </div>

      <div className="fv-row mb-2">
        <label
          className="form-label mb-8 active"
          data-accordion-toggle="featuresInner"
          onClick={(e) => {
            const target = e.target as HTMLElement
            target.classList.toggle("active")
          }}
        >
          İç Özellikler
        </label>

        <div
          className="d-flex row row-gap-8"
          data-accordion-content="featuresInner"
        >
          {featuresInner.map((feature, index) => (
            <label
              key={index}
              className="d-flex align-items-start cursor-pointer col-4 col-md-3"
            >
              <span className="form-check form-check-custom form-check-solid">
                <Field
                  className="form-check-input"
                  type="checkbox"
                  name="propertyDetails.featuresInner"
                  id={`featuresInner${index + 1}`}
                  value={feature}
                  checked={values.propertyDetails?.featuresInner?.includes(
                    feature
                  )}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFeaturesChange(e, "featuresInner")
                  }
                />
              </span>
              <span className="fw-bolder text-gray-800 fs-7 me-2 ms-2">
                {feature}
              </span>
            </label>
          ))}
        </div>

        <div className="text-danger mt-2">
          <ErrorMessage name="propertyDetails.featuresInner" />
        </div>
      </div>

      <div className="fv-row mb-2">
        <label
          className="form-label mb-8"
          data-accordion-toggle="featuresOuter"
          onClick={(e) => {
            const target = e.target as HTMLElement
            target.classList.toggle("active")
          }}
        >
          Dış Özellikler
        </label>

        <div
          className="d-flex row row-gap-8"
          data-accordion-content="featuresOuter"
        >
          {featuresOuter.map((feature, index) => (
            <label
              key={index}
              className="d-flex align-items-start cursor-pointer col-4 col-md-3"
            >
              <span className="form-check form-check-custom form-check-solid">
                <Field
                  className="form-check-input"
                  type="checkbox"
                  name="propertyDetails.featuresOuter"
                  id={`featuresOuter${index + 1}`}
                  value={feature}
                  checked={values.propertyDetails?.featuresOuter?.includes(
                    feature
                  )}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFeaturesChange(e, "featuresOuter")
                  }
                />
              </span>
              <span className="fw-bolder text-gray-800 fs-7 me-2 ms-2">
                {feature}
              </span>
            </label>
          ))}
        </div>

        <div className="text-danger mt-2">
          <ErrorMessage name="propertyDetails.featuresOuter" />
        </div>
      </div>

      <div className="fv-row mb-2">
        <label
          className="form-label mb-8"
          data-accordion-toggle="featuresNeighbourhood"
          onClick={(e) => {
            const target = e.target as HTMLElement
            target.classList.toggle("active")
          }}
        >
          Muhit Özellikleri
        </label>

        <div
          className="d-flex row row-gap-8"
          data-accordion-content="featuresNeighbourhood"
        >
          {featuresNeighbourhood.map((feature, index) => (
            <label
              key={index}
              className="d-flex align-items-start cursor-pointer col-4 col-md-3"
            >
              <span className="form-check form-check-custom form-check-solid">
                <Field
                  className="form-check-input"
                  type="checkbox"
                  name="propertyDetails.featuresNeighbourhood"
                  id={`featuresNeighbourhood${index + 1}`}
                  value={feature}
                  checked={values.propertyDetails?.featuresNeighbourhood?.includes(
                    feature
                  )}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFeaturesChange(e, "featuresNeighbourhood")
                  }
                />
              </span>
              <span className="fw-bolder text-gray-800 fs-7 me-2 ms-2">
                {feature}
              </span>
            </label>
          ))}
        </div>

        <div className="text-danger mt-2">
          <ErrorMessage name="propertyDetails.featuresNeighbourhood" />
        </div>
      </div>

      <div className="fv-row mb-2">
        <label
          className="form-label mb-8"
          data-accordion-toggle="featuresTransportation"
          onClick={(e) => {
            const target = e.target as HTMLElement
            target.classList.toggle("active")
          }}
        >
          Ulaşım Özellikleri
        </label>

        <div
          className="d-flex row row-gap-8"
          data-accordion-content="featuresTransportation"
        >
          {featuresTransportation.map((feature, index) => (
            <label
              key={index}
              className="d-flex align-items-start cursor-pointer col-4 col-md-3"
            >
              <span className="form-check form-check-custom form-check-solid">
                <Field
                  className="form-check-input"
                  type="checkbox"
                  name="propertyDetails.featuresTransportation"
                  id={`featuresTransportation${index + 1}`}
                  value={feature}
                  checked={values.propertyDetails?.featuresTransportation?.includes(
                    feature
                  )}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFeaturesChange(e, "featuresTransportation")
                  }
                />
              </span>
              <span className="fw-bolder text-gray-800 fs-7 me-2 ms-2">
                {feature}
              </span>
            </label>
          ))}
        </div>

        <div className="text-danger mt-2">
          <ErrorMessage name="propertyDetails.featuresNeighbourhood" />
        </div>
      </div>

      <div className="fv-row mb-2">
        <label
          className="form-label mb-8"
          data-accordion-toggle="featuresView"
          onClick={(e) => {
            const target = e.target as HTMLElement
            target.classList.toggle("active")
          }}
        >
          Manzara
        </label>

        <div
          className="d-flex row row-gap-8"
          data-accordion-content="featuresView"
        >
          {featuresView.map((feature, index) => (
            <label
              key={index}
              className="d-flex align-items-start cursor-pointer col-4 col-md-3"
            >
              <span className="form-check form-check-custom form-check-solid">
                <Field
                  className="form-check-input"
                  type="checkbox"
                  name="propertyDetails.featuresView"
                  id={`featuresView${index + 1}`}
                  value={feature}
                  checked={values.propertyDetails?.featuresView?.includes(
                    feature
                  )}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFeaturesChange(e, "featuresView")
                  }
                />
              </span>
              <span className="fw-bolder text-gray-800 fs-7 me-2 ms-2">
                {feature}
              </span>
            </label>
          ))}
        </div>

        <div className="text-danger mt-2">
          <ErrorMessage name="propertyDetails.featuresView" />
        </div>
      </div>

      <div className="fv-row mb-2">
        <label
          className="form-label mb-8"
          data-accordion-toggle="featuresRealEstateType"
          onClick={(e) => {
            const target = e.target as HTMLElement
            target.classList.toggle("active")
          }}
        >
          Konut Tipi
        </label>

        <div
          className="d-flex row row-gap-8"
          data-accordion-content="featuresRealEstateType"
        >
          {featuresRealEstateType.map((feature, index) => (
            <label
              key={index}
              className="d-flex align-items-start cursor-pointer col-4 col-md-3"
            >
              <span className="form-check form-check-custom form-check-solid">
                <Field
                  className="form-check-input"
                  type="checkbox"
                  name="propertyDetails.featuresRealEstateType"
                  id={`featuresRealEstateType${index + 1}`}
                  value={feature}
                  checked={values.propertyDetails?.featuresRealEstateType?.includes(
                    feature
                  )}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFeaturesChange(e, "featuresRealEstateType")
                  }
                />
              </span>
              <span className="fw-bolder text-gray-800 fs-7 me-2 ms-2">
                {feature}
              </span>
            </label>
          ))}
        </div>

        <div className="text-danger mt-2">
          <ErrorMessage name="propertyDetails.featuresRealEstateType" />
        </div>
      </div>

      <div className="fv-row mb-2">
        <label
          className="form-label mb-8"
          data-accordion-toggle="featuresForDisabled"
          onClick={(e) => {
            const target = e.target as HTMLElement
            target.classList.toggle("active")
          }}
        >
          Engelliye ve Yaşlıya Uygun
        </label>

        <div
          className="d-flex row row-gap-8"
          data-accordion-content="featuresForDisabled"
        >
          {featuresForDisabled.map((feature, index) => (
            <label
              key={index}
              className="d-flex align-items-start cursor-pointer col-4 col-md-3"
            >
              <span className="form-check form-check-custom form-check-solid">
                <Field
                  className="form-check-input"
                  type="checkbox"
                  name="propertyDetails.featuresForDisabled"
                  id={`featuresForDisabled${index + 1}`}
                  value={feature}
                  checked={values.propertyDetails?.featuresForDisabled?.includes(
                    feature
                  )}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFeaturesChange(e, "featuresForDisabled")
                  }
                />
              </span>
              <span className="fw-bolder text-gray-800 fs-7 me-2 ms-2">
                {feature}
              </span>
            </label>
          ))}
        </div>

        <div className="text-danger mt-2">
          <ErrorMessage name="propertyDetails.featuresForDisabled" />
        </div>
      </div>
    </div>
  )
}

export { Step3 }
