import React, { Dispatch, SetStateAction } from "react"
import { KTIcon } from "../../../../../_metronic/helpers"

type Props = {
  about: { title?: string; description?: string }
  className: string
  setShowAddAboutModal: Dispatch<SetStateAction<boolean>>
}

const About: React.FC<Props> = ({ about, className, setShowAddAboutModal }) => {
  return (
    <div className={`card ${className}`}>
      <div className="card-body">
        <div className="d-flex align-items-center mb-5">
          <div className="d-flex align-items-center justify-content-between flex-grow-1">
            <div className="d-flex flex-column">
              <span className="text-gray-900 fs-5 fw-bold">{about.title}</span>
            </div>

            <button
              type="button"
              className="btn btn-sm bg-gray-100 bg-hover-gray-100 text-hover-primary p-0 h-30px w-30px"
              onClick={() => setShowAddAboutModal(true)}
            >
              <KTIcon iconName="pencil" iconType="solid" className="p-0 fs-5" />
            </button>
          </div>
        </div>

        <p className="text-gray-800 fw-normal">{about.description}</p>
      </div>
    </div>
  )
}

export { About }
