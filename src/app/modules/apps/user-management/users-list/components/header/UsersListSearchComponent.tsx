/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react"
import {
  initialQueryState,
  KTIcon,
  useDebounce,
} from "../../../../../../../_metronic/helpers"
import { useQueryRequest } from "../../../_core/QueryRequestProvider"

const UsersListSearchComponent = () => {
  const { updateState } = useQueryRequest()
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [inputHasFocus, setInputHasFocus] = useState(false)
  // Debounce search term so that it only gives us latest value ...
  // ... if searchTerm has not been updated within last 500ms.
  // The goal is to only have the API call fire when user stops typing ...
  // ... so that we aren't hitting our API rapidly.
  const debouncedSearchTerm = useDebounce(searchTerm, 150)
  // Effect for API call
  useEffect(
    () => {
      if (debouncedSearchTerm !== undefined && searchTerm !== undefined) {
        updateState({ search: debouncedSearchTerm, ...initialQueryState })
      }
    },
    [debouncedSearchTerm] // Only call effect if debounced search term changes
    // More details about useDebounce: https://usehooks.com/useDebounce/
  )

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault()

        const inputElement = document.getElementById(
          "users_list_search_user_input"
        ) as HTMLInputElement | null

        inputElement?.focus()
        inputElement?.select()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <div className="card-title">
      {/* begin::Search */}
      <div className="d-flex align-items-center position-relative my-1 position-relative">
        <KTIcon iconName="magnifier" className="fs-1 position-absolute ms-6" />
        <input
          type="text"
          id="users_list_search_user_input"
          data-kt-user-table-filter="search"
          className="form-control form-control-solid w-250px ps-14"
          placeholder="Kullanıcı Ara"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setInputHasFocus(true)}
          onBlur={() => setInputHasFocus(false)}
        />
        <span
          className={`position-absolute p-1 rounded-1 bg-gray-300 text-gray-600 fw-bolder${
            inputHasFocus ? " d-none" : ""
          }`}
          style={{
            pointerEvents: "none",
            top: "50%",
            right: "10px",
            transform: "translateY(-50%)",
            fontSize: "8px",
          }}
        >
          CTRL+K
        </span>
      </div>
      {/* end::Search */}
    </div>
  )
}

export { UsersListSearchComponent }
