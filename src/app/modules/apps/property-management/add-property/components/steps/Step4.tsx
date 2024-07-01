/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react"
import { GoogleMapStep } from "./GoogleMapStep"

interface Step4Props {
  values: {
    propertyDetails: {
      address: {
        label: string
        lat: number | undefined
        lng: number | undefined
      }
    }
  }
  setFieldValue: (
    field: string,
    value: {
      label: string
      lat: number
      lng: number
    },
    shouldValidate?: boolean
  ) => void
  markerPosition: {
    lat: number
    lng: number
  }
  setMarkerPosition: any
  map: any
}

const Step4: FC<Step4Props> = ({
  values,
  setFieldValue,
  markerPosition,
  setMarkerPosition,
  map
}) => {
  return (
    <div className="w-100">
      <div className="pb-10">
        <h2 className="fw-bolder text-gray-900">Konum</h2>
        <div className="text-gray-500 fw-bold fs-6">
          İlan konumunu haritada işaretleyin.
        </div>
      </div>

      <div className="mb-0">
        <GoogleMapStep
          values={values}
          setFieldValue={setFieldValue}
          markerPosition={markerPosition}
          setMarkerPosition={setMarkerPosition}
          map={map}
        />
      </div>
    </div>
  )
}

export { Step4 }
