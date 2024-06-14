import { KYOfficeImage } from "../../../../../../frontend/components/KYOfficeImage/KYOfficeImage"

interface OfficeInfoCellProps {
  office: {
    name: string
  }
}

const OfficeInfoCell: React.FC<OfficeInfoCellProps> = ({ office }) => {
  return (
    <div className="d-flex align-items-center">
      {/* begin:: Avatar */}
      <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
        <a href="#">
          <KYOfficeImage height={50} width={50} officeName={office.name} />
        </a>
      </div>
      <div className="d-flex flex-column">
        <a href="#" className="text-gray-800 text-hover-primary mb-1">
          Keya {office.name}
        </a>
      </div>
    </div>
  )
}

export { OfficeInfoCell }
