interface PropertyInfoCellProps {
  property: {
    name: string
    city?: string
    state?: string
    country?: string
  }
}

const PropertyInfoCell: React.FC<PropertyInfoCellProps> = ({ property }) => {
  return (
    <div className="d-flex align-items-center">
      {/* begin:: Avatar */}
      <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
        <a href="#"></a>
      </div>
      <div className="d-flex flex-column">
        <a href="#" className="text-gray-800 text-hover-primary mb-1">
          Keya {property.name}
        </a>
      </div>
    </div>
  )
}

export { PropertyInfoCell }
