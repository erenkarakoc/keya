/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx"
import { FC, useEffect, useRef, useState } from "react"
import { SearchComponent } from "../../../assets/ts/components"
import { KTIcon, toAbsoluteUrl } from "../../../helpers"
import { User } from "../../../../app/modules/apps/user-management/_core/_models"
import { Office } from "../../../../app/modules/apps/office-management/_core/_models"
import { Property } from "../../../../app/modules/apps/property-management/_core/_models"
import { searchUsers } from "../../../../app/modules/apps/user-management/_core/_requests"
import { getUserRoleText } from "../../../helpers/kyHelpers"
import { searchProperties } from "../../../../app/modules/apps/property-management/_core/_requests"
import { searchOffices } from "../../../../app/modules/apps/office-management/_core/_requests"
import { KYOfficeImage } from "../../../../app/frontend/components/KYOfficeImage/KYOfficeImage"

type Props = {
  className?: string
  mobileToggleBtnClass?: string
}
const Search: FC<Props> = ({ className = "", mobileToggleBtnClass = "" }) => {
  const element = useRef<HTMLDivElement | null>(null)
  const wrapperElement = useRef<HTMLDivElement | null>(null)
  const resultsElement = useRef<HTMLDivElement | null>(null)
  const suggestionsElement = useRef<HTMLDivElement | null>(null)
  const emptyElement = useRef<HTMLDivElement | null>(null)

  const [isSearching, setIsSearching] = useState(false)
  const [inputHasFocus, setInputHasFocus] = useState(false)

  const [users, setUsers] = useState<User[]>([])
  const [offices, setOffices] = useState<Office[]>([])
  const [properties, setProperties] = useState<Property[]>([])

  const process = async (search: SearchComponent) => {
    const query = search.inputElement.value

    // Hide recently viewed
    suggestionsElement.current!.classList.add("d-none")

    setIsSearching(true)
    setUsers(await searchUsers(query))
    setOffices(await searchOffices(query))
    setProperties(await searchProperties(query))
    setIsSearching(false)

    if (users.length || offices.length || properties?.length) {
      // Hide results
      resultsElement.current!.classList.add("d-none")
      // Show empty message
      emptyElement.current!.classList.remove("d-none")
    } else {
      // Show results
      resultsElement.current!.classList.remove("d-none")
      // Hide empty message
      emptyElement.current!.classList.add("d-none")
    }

    // Complete search
    search.complete()
  }

  const clear = () => {
    // Show recently viewed
    suggestionsElement.current!.classList.remove("d-none")
    // Hide results
    resultsElement.current!.classList.add("d-none")
    // Hide empty message
    emptyElement.current!.classList.add("d-none")
  }

  useEffect(() => {
    // Initialize search handler
    const searchObject = SearchComponent.createInstance("#kt_header_search")

    // Search handler
    searchObject!.on("kt.search.process", process)

    // Clear handler
    searchObject!.on("kt.search.clear", clear)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault()

        const inputElement = document.getElementById(
          "quick_search_input"
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
    <div
      id="kt_header_search"
      className={clsx("d-flex align-items-center", className)}
      data-kt-search-keypress="true"
      data-kt-search-min-length="2"
      data-kt-search-enter="enter"
      data-kt-search-layout="menu"
      data-kt-search-responsive="lg"
      data-kt-menu-trigger="auto"
      data-kt-menu-permanent="true"
      data-kt-menu-placement="bottom-end"
      data-kt-search="true"
      ref={element}
    >
      <div
        className={clsx("d-flex d-lg-none align-items-center")}
        data-kt-search-element="toggle"
      >
        <div className={mobileToggleBtnClass}>
          <KTIcon iconName="magnifier" className="fs-1" />
        </div>
      </div>

      <form
        data-kt-search-element="form"
        className="d-none align-items-center d-lg-flex w-100 mb-5 mb-lg-0 position-relative"
        autoComplete="off"
      >
        {isSearching ? (
          <span className="position-absolute top-50 translate-middle-y lh-0 ms-4">
            <span className="spinner-border h-15px w-15px align-middle text-gray-500" />
          </span>
        ) : (
          <KTIcon
            iconName="magnifier"
            className=" fs-2 text-gray-700 position-absolute top-50 translate-middle-y ms-4"
          />
        )}

        <input
          type="text"
          className="form-control bg-transparent ps-13 fs-7 h-40px"
          name="search"
          placeholder="Hızlı Arama"
          data-kt-search-element="input"
          id="quick_search_input"
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

        <span
          className="btn btn-flush btn-active-color-primary position-absolute top-50 end-0 translate-middle-y lh-0 d-none me-4"
          data-kt-search-element="clear"
        >
          <KTIcon iconName="cross" className="fs-2 text-lg-1 me-0" />
        </span>
      </form>

      <div
        data-kt-search-element="content"
        data-kt-menu="true"
        className="menu menu-sub menu-sub-dropdown w-300px w-md-350px py-7 px-7 overflow-hidden"
      >
        <div
          className="main"
          ref={wrapperElement}
          data-kt-search-element="wrapper"
        >
          <div
            ref={resultsElement}
            data-kt-search-element="results"
            className="d-none"
          >
            <div className="scroll-y mh-200px mh-lg-350px">
              <div className="d-flex flex-column row-gap-5">
                {users && users.length ? (
                  <div>
                    <h3
                      className="fs-5 text-muted m-0"
                      data-kt-search-element="category-title"
                    >
                      Kullanıcılar
                    </h3>

                    {users.map((user) => (
                      <a
                        href={`/arayuz/kullanici-detayi/${user.id}/genel`}
                        key={user.id}
                        className="d-flex text-gray-900 text-hover-primary align-items-center mt-5"
                      >
                        <div className="symbol symbol-40px me-4">
                          <img
                            src={
                              user.photoURL ??
                              toAbsoluteUrl("/media/avatars/blank.jpg")
                            }
                            alt={`${user.firstName} ${user.lastName}`}
                            className="object-fit-cover"
                          />
                        </div>

                        <div className="d-flex flex-column justify-content-start fw-bold">
                          <span className="fs-6 fw-bold">
                            {user.firstName} {user.lastName}
                          </span>
                          <span className="fs-7 fw-bold text-muted">
                            {getUserRoleText(user.role)}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  ""
                )}

                {offices && offices.length ? (
                  <div>
                    <h3
                      className="fs-5 text-muted m-0"
                      data-kt-search-element="category-title"
                    >
                      Ofisler
                    </h3>

                    {offices.map((office) => (
                      <a
                        href={`/arayuz/ofis-detayi/${office.id}`}
                        className="d-flex text-gray-900 text-hover-primary align-items-center mt-5"
                        key={office.id}
                      >
                        <div className="symbol symbol-40px me-4">
                          <KYOfficeImage officeName={office.name} />
                        </div>

                        <div className="d-flex flex-column justify-content-start fw-bold">
                          <span className="fs-6 fw-bold">
                            {import.meta.env.VITE_APP_NAME} {office.name}
                          </span>
                          <span className="fs-7 fw-bold text-muted">
                            {office.address.state?.split("|")[0]},{" "}
                            {office.address.country?.split("|")[0]}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  ""
                )}

                {properties && properties.length ? (
                  <div>
                    <h3
                      className="fs-5 text-muted m-0"
                      data-kt-search-element="category-title"
                    >
                      İlanlar
                    </h3>

                    {properties.map((property) => (
                      <a
                        href={`/arayuz/ilan-detayi/${property.id}/genel`}
                        className="d-flex text-gray-900 text-hover-primary align-items-center mt-5 overflow-hidden w-100"
                        target="_blank"
                        key={property.id}
                      >
                        <div className="symbol symbol-40px me-4">
                          {property.propertyDetails.photoURLs[0] ? (
                            <img
                              src={`${property.propertyDetails.photoURLs[0]}`}
                              alt={property.title}
                            />
                          ) : (
                            <img className="bg-gray-500 w-40 h-40" />
                          )}
                        </div>

                        <div className="fw-bold">
                          <span
                            className="fs-6 fw-bold d-block"
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              width: 220,
                            }}
                          >
                            {property.title}
                          </span>
                          <span
                            className="fs-7 fw-bold text-muted d-block"
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              width: 220,
                            }}
                          >
                            {property.propertyDetails.address.label}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          <div ref={suggestionsElement} data-kt-search-element="main">
            <div className="d-flex flex-stack fw-bold mb-4">
              <span className="text-muted fs-6 me-2">Arama yapın</span>
            </div>

            <div className="d-flex align-items-center text-muted fw-normal">
              Site genelinde kullanıcı, ilan, ofis veya işlem arayabilirsiniz.
            </div>
          </div>

          <div
            ref={emptyElement}
            data-kt-search-element="empty"
            className="text-center d-none"
          >
            <div className="pt-10 pb-10">
              <KTIcon iconName="search-list" className="fs-4x opacity-50" />
            </div>

            <div className="pb-15 fw-bold">
              <h3 className="text-gray-600 fs-5 mb-2">Sonuç yok</h3>
              <div className="text-muted fs-7">
                Aradığınız kelimeye uygun bir şey bulunamadı.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Search }
