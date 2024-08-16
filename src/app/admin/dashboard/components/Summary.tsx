import { KTIcon } from "../../../../_metronic/helpers"

type Props = {
  className: string
  backGroundColor: string
  thisMonthsTransactionsLength: number | undefined
  officesLength: number | undefined
  propertiesLength: number | undefined
  usersLength: number | undefined
}

const Summary: React.FC<Props> = ({
  className,
  backGroundColor,
  thisMonthsTransactionsLength,
  officesLength,
  propertiesLength,
  usersLength,
}) => (
  <div
    className={`card ${className} theme-dark-bg-body`}
    style={{ backgroundColor: backGroundColor }}
  >
    <div className="card-body d-flex flex-column">
      <div className="d-flex flex-column mb-7">
        <h4 className="text-gray-900 fw-bolder fs-3">Özet</h4>
      </div>

      <div className="row g-0">
        <div className="col-6">
          <div className="d-flex align-items-center mb-9 me-2">
            <div className="symbol symbol-40px me-3">
              <div className="symbol-label bg-body bg-opacity-50">
                <KTIcon iconName="shop" className="fs-1 text-gray-900" />
              </div>
            </div>

            <div>
              <div className="fs-5 text-gray-900 fw-bolder lh-1">
                {officesLength ? officesLength : 0}
              </div>
              <div className="fs-7 text-gray-600 fw-bold">Ofis</div>
            </div>
          </div>
        </div>

        <div className="col-6">
          <div className="d-flex align-items-center mb-9 ms-2">
            <div className="symbol symbol-40px me-3">
              <div className="symbol-label bg-body bg-opacity-50">
                <KTIcon iconName="home-2" className="fs-1 text-gray-900" />
              </div>
            </div>

            <div>
              <div className="fs-5 text-gray-900 fw-bolder lh-1">
                {propertiesLength ? propertiesLength : 0}
              </div>
              <div className="fs-7 text-gray-600 fw-bold">Portföy</div>
            </div>
          </div>
        </div>

        <div className="col-6">
          <div className="d-flex align-items-center me-2">
            <div className="symbol symbol-40px me-3">
              <div className="symbol-label bg-body bg-opacity-50">
                <KTIcon
                  iconName="profile-user"
                  className="fs-1 text-gray-900"
                />
              </div>
            </div>

            <div>
              <div className="fs-5 text-gray-900 fw-bolder lh-1">
                {usersLength ? usersLength : 0}
              </div>
              <div className="fs-7 text-gray-600 fw-bold">Danışman</div>
            </div>
          </div>
        </div>

        <div className="col-6">
          <div className="d-flex align-items-center ms-2">
            <div className="symbol symbol-40px me-3">
              <div className="symbol-label bg-body bg-opacity-50">
                <KTIcon iconName="cheque" className="fs-1 text-gray-900" />
              </div>
            </div>

            <div>
              <div className="fs-5 text-gray-900 fw-bolder lh-1">
                {thisMonthsTransactionsLength
                  ? thisMonthsTransactionsLength
                  : 0}
              </div>
              <div className="fs-7 text-gray-600 fw-bold">Bu ayki işlem</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export { Summary }
