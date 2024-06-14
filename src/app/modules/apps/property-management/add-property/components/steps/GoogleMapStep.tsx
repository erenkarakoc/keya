/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState, useRef } from "react"

import { Field, ErrorMessage } from "formik"

import { Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps"

interface GoogleMapStepProps {
  height?: number
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
}

const GoogleMapStep: FC<GoogleMapStepProps> = ({
  height,
  values,
  setFieldValue,
}) => {
  const searchWrapperRef = useRef<HTMLDivElement>(null)
  const [searchedAddress, setSearchedAddress] = useState("")
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([])

  const [markerPosition, setMarkerPosition] = useState({
    lat: 0,
    lng: 0,
  })

  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | undefined>(
    undefined
  )

  const map = useMap()

  const getAddressFromLatLng = async (
    lat: number,
    lng: number
  ): Promise<string> => {
    return new Promise((resolve) => {
      const latlng = { lat, lng }

      if (geocoder) {
        geocoder.geocode({ location: latlng }, (results, status) => {
          if (status === "OK") {
            if (results && results.length > 0) {
              const formattedAddresses = results
                .filter((result) => !result.formatted_address.includes("+"))
                .map((result) => result.formatted_address)

              if (formattedAddresses.length > 0) {
                resolve(formattedAddresses[0])
              } else {
                resolve(results[0].formatted_address)
              }
            } else {
              resolve("")
            }
          } else {
            resolve("")
          }
        })
      }
    })
  }

  const setAddressFieldValue = async (lat: number, lng: number) => {
    const label: string = await getAddressFromLatLng(lat, lng)
    const selectedAddress = { label, lat, lng }

    setFieldValue("propertyDetails.address", selectedAddress)
  }

  const setCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: any) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        setMarkerPosition({ lat, lng })

        map?.setCenter({ lat, lng })
        map?.setZoom(14)

        setAddressFieldValue(lat, lng)
      })
    } else {
      console.error("Your browser does not support geolocation services.")
    }
  }

  const handleMapClick = (e: any) => {
    setMarkerPosition({ lat: e.detail.latLng.lat, lng: e.detail.latLng.lng })
    setAddressFieldValue(e.detail.latLng.lat, e.detail.latLng.lng)
  }

  const handleMarkerDragEnd = async (e: any) => {
    setMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() })
    setAddressFieldValue(e.latLng.lat(), e.latLng.lng())
  }

  const handlePlaceSelect = (place: any) => {
    const location = place.geometry.location
    setMarkerPosition({
      lat: location.lat(),
      lng: location.lng(),
    })
    map?.setCenter({
      lat: location.lat(),
      lng: location.lng(),
    })
    map?.setZoom(14)
    setSuggestions([])

    setAddressFieldValue(location.lat(), location.lng())
  }

  const fetchSuggestions = async (input: string) => {
    const {
      AutocompleteService,
    }: { AutocompleteService: typeof google.maps.places.AutocompleteService } =
      (await google.maps.importLibrary("places")) as any
    const service = new AutocompleteService()

    service.getPlacePredictions({ input }, (predictions, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        setSuggestions(predictions || [])
      } else {
        setSuggestions([])
      }
    })
  }

  const fetchPlaceDetails = (placeId: string) => {
    const service = new google.maps.places.PlacesService(map as any)
    service.getDetails({ placeId }, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        handlePlaceSelect(place)
      }
    })
  }

  useEffect(() => {
    if (map) {
      map.setOptions({
        mapTypeControl: true,
        fullscreenControl: true,
        zoomControl: true,
      })

      setGeocoder(new google.maps.Geocoder())

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: any) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude

          setMarkerPosition({ lat, lng })

          map?.setCenter({ lat, lng })
          map?.setZoom(14)
        })
      } else {
        console.error("Your browser does not support geolocation services.")
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  useEffect(() => {
    const handleClickOutsideSearchWrapper = (event: MouseEvent) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target as Node)
      ) {
        setSuggestions([])
      }
    }

    document.addEventListener("mousedown", handleClickOutsideSearchWrapper)
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideSearchWrapper)
    }
  }, [])

  return (
    <>
      <div className="fv-row mb-10">
        <div className="ky-map-wrapper">
          <Map
            mapId="ky-property-map"
            style={{ width: "100%", height: height ? height + "px" : "400px" }}
            defaultCenter={markerPosition}
            defaultZoom={14}
            gestureHandling={"greedy"}
            disableDefaultUI={true}
            onClick={handleMapClick}
          >
            <AdvancedMarker
              position={markerPosition}
              draggable={true}
              onDragEnd={handleMarkerDragEnd}
            />
          </Map>
        </div>

        <div className="d-flex justify-content-between gap-2 mt-2">
          <div className="text-danger">
            <ErrorMessage name="propertyDetails.address.lng" />
          </div>

          <button
            type="button"
            className="ky-map-type-button"
            onClick={setCurrentLocation}
          >
            Mevcut Konum
          </button>
        </div>
      </div>

      <div className="fv-row mb-10">
        <div className="col-md-12 ky-map-search-wrapper" ref={searchWrapperRef}>
          <Field
            type="text"
            placeholder="Adres ara..."
            value={searchedAddress}
            onChange={(e: any) => {
              setSearchedAddress(e.target.value)
              fetchSuggestions(e.target.value)
            }}
            className="form-control form-control-lg form-control-solid ky-map-search-input"
          />
          {suggestions.length > 0 && (
            <ul
              className={`ky-map-search-list${
                searchedAddress ? " active" : ""
              }`}
            >
              {suggestions.map((suggestion: any) => (
                <li
                  key={suggestion.place_id}
                  onClick={() => fetchPlaceDetails(suggestion.place_id)}
                >
                  {suggestion.description}
                </li>
              ))}
            </ul>
          )}

          <div className="ky-map-search-address-label mt-2">
            {values.propertyDetails.address.label}
          </div>
        </div>
      </div>

      <input
        type="hidden"
        value={values.propertyDetails.address.lng}
        name="lng"
      />
    </>
  )
}

export { GoogleMapStep }
