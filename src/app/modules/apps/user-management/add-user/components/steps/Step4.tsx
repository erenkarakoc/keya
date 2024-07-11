import { FC } from "react"
import { KTIcon } from "../../../../../../../_metronic/helpers"
interface Step4Props {
  values: {
    phoneNumber: string
    email: string
    password: string
  }
}

const Step4: FC<Step4Props> = ({ values }) => {
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
                  href={`https://api.whatsapp.com/send?phone=${values.phoneNumber.replace(
                    /\D/g,
                    ""
                  )}&text=${import.meta.env.VITE_APP_NAME}%20ailesine%20ho%C5%9F%20geldiniz!%20${import.meta.env.VITE_APP_NAME}%20hesab%C4%B1n%C4%B1z%C4%B1%20y%C3%B6netece%C4%9Finiz%20aray%C3%BCz%C3%BCn%C3%BCze%20%22keya.com.tr%2Fgiris%22%20adresinden%2C%20a%C5%9Fa%C4%9F%C4%B1daki%20bilgileri%20kullanarak%20giri%C5%9F%20yapabilirsiniz%3A%0A%0AE-posta%3A%20${
                    values.email
                  }%0A%C5%9Eifre%3A%20${values.password}`}
                  className="link-primary fw-bolder"
                  target="_blank"
                >
                  buraya tıklayın
                </a>
                .
              </div>
              <input type="hidden" name="empty" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Step4 }
