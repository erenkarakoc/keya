import React, { FC } from "react"
import { KTIcon } from "../../../../../../../_metronic/helpers"

const Step4: FC = () => {
  return (
    <div className="w-100">
      <div className="mb-0">
        <div className="notice d-flex bg-light rounded border-primary border border-dashed p-6">
          <KTIcon iconName="badge" className="fs-2tx text-primary me-4" />
          <div className="d-flex flex-stack flex-grow-1">
            <div className="fw-bold">
              <h4 className="text-gray-800 fw-bolder">Son bir adım!</h4>
              <div className="fs-6 text-gray-600">
                Kullanıcı formunu başarıyla doldurdunuz. Kaydet butonuna
                basmadan önce giriş bilgilerini kullanıcıya WhatsApp üzerinden
                iletmek için{" "}
                <a
                  href={`https://api.whatsapp.com/send?phone=905435390665&text=Keya%20ailesine%20ho%C5%9F%20geldiniz!%20Keya%20ser%C3%BCveninizi%20y%C3%B6netece%C4%9Finiz%20aray%C3%BCz%C3%BCn%C3%BCze%20%22keya.com.tr%2Fgiris%22%20adresinden%2C%20a%C5%9Fa%C4%9F%C4%B1daki%20bilgileri%20kullanarak%20giri%C5%9F%20yapabilirsiniz%3A%0A%0AE-posta%3A%20erenkarakoc%40keya.com.tr%0A%C5%9Eifre%3A%202023!*eren`}
                  className="link-primary fw-bolder"
                  target="_blank"
                >
                  buraya tıklayın
                </a>
                .
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Step4 }
