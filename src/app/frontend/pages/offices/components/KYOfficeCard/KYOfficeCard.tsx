/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import "./KYOfficeCard.css"

import {
  getCountryById,
  getStatesByCountry,
  getUserNameInitials,
  getCitiesByState,
  getStateById,
  getCityById,
} from "../../../../../../_metronic/helpers/kyHelpers"

import { Office } from "../../../../../modules/apps/office-management/_core/_models"
import { User } from "../../../../../modules/apps/user-management/_core/_models"
import { getUserById } from "../../../../../modules/apps/user-management/_core/_requests"

interface KYOfficeCardProps {
  office: Office
}

const KYOfficeCard: React.FC<KYOfficeCardProps> = ({ office }) => {
  const [opacity, setOpacity] = useState(0)
  const [officeUsers, setOfficeUsers] = useState<User[]>([])
  const [imagesLoaded, setImagesLoaded] = useState(false)

  const [countryName, setCountryName] = useState("")
  const [stateName, setStateName] = useState("")
  const [cityName, setCityName] = useState("")

  const [countries, setCountries] = useState<any>([])
  const [states, setStates] = useState<any>([])
  const [cities, setCities] = useState<any>([])

  const handleImageLoad = () => {
    setImagesLoaded(true)
  }

  useEffect(() => {
    const fetchUsers = async (ids: string[]): Promise<User[]> => {
      try {
        const usersArr: (User | undefined)[] = await Promise.all(
          ids.map(async (id) => {
            return await getUserById(id)
          })
        )

        const filteredUsers: User[] = usersArr.filter(
          (user): user is User => user !== undefined
        )

        return filteredUsers
      } catch (error) {
        console.error("Error fetching users:", error)
        return []
      }
    }

    const fetchOfficeUsers = async () => {
      try {
        if (office && office.users) {
          const userIds = office.users.slice(0, 5)
          const users = await fetchUsers(userIds)
          setOfficeUsers(users)
          setOpacity(1)
        }
      } catch (error) {
        console.error("Error fetching office users:", error)
      }
    }

    fetchOfficeUsers()
  }, [office])

  useEffect(() => {
    const countriesArr = getCountryById(parseInt(office.country ?? ""))
    const statesArr = getStatesByCountry(parseInt(office.country ?? ""))
    const citiesArr = getCitiesByState(parseInt(office.state ?? ""))

    setCountries(countriesArr)
    setStates(statesArr)
    setCities(citiesArr)
  }, [office])

  useEffect(() => {
    if (office.country && countries) {
      const country: any = getCountryById(parseInt(office.country ?? ""))
      if (country.translations.tr) {
        setCountryName(country.translations.tr)
      } else {
        setCountryName(country.name)
      }
    }
    if (office.state && states) {
      const state: any = getStateById(parseInt(office.state ?? ""))
      setStateName(state.name)
    }
    if (office.city && cities) {
      const city: any = getCityById(parseInt(office.city ?? ""))
      setCityName(city.name)
    }
  }, [office, countries, states, cities])

  return (
    <div className="ky-office-card">
      <div className="ky-office-card-image">
        <span>KEYA</span>
        <span className="ky-office-card-image-name">{office.name}</span>
      </div>

      {officeUsers.length ? (
        <div
          className={`ky-office-card-users${
            imagesLoaded ? " images-loaded" : ""
          }`}
        >
          <div className="ky-office-card-user-images">
            {officeUsers.map((user) => (
              <div className="ky-office-card-user-image" key={user.id}>
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={`${user.firstName} ${user.lastName}`}
                    style={{ opacity: opacity }}
                    onLoad={handleImageLoad}
                    loading="lazy"
                  />
                ) : (
                  <span className="ky-office-card-user-initials">
                    {getUserNameInitials(user.firstName, user.lastName)}
                  </span>
                )}
              </div>
            ))}
          </div>
          <span>{officeUsers.length}+ Danışman</span>
        </div>
      ) : (
        ""
      )}

      <div className="ky-office-card-footer">
        <div className="ky-office-card-info">
          <div className="ky-office-card-name">Keya {office.name}</div>
          <div className="ky-office-card-title">
            {(() => {
              const locationString = `${cityName ? cityName + ", " : ""}${
                stateName ? stateName + ", " : ""
              }${countryName || ""}`
              const locationLength = locationString.length

              if (locationLength <= 50) {
                return locationString
              } else {
                return countryName || ""
              }
            })()}
          </div>
        </div>
        <div className="ky-office-card-actions">
          <Link to="/" className="ky-office-card-action">
            Profile Git
          </Link>
          <a
            href={`mailto:${office.email}`}
            className="ky-office-card-action ky-office-card-action-square"
          >
            <svg
              width="25"
              height="20"
              viewBox="0 0 25 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.16"
                d="M1.20801 1.20813L10.3728 10.373C10.826 10.8259 11.4404 11.0804 12.0811 11.0804C12.7218 11.0804 13.3363 10.8259 13.7894 10.373L22.9543 1.20813V15.7056C22.9543 16.3465 22.6997 16.961 22.2466 17.4142C21.7934 17.8673 21.1788 18.1219 20.538 18.1219H3.62426C2.98343 18.1219 2.36885 17.8673 1.91571 17.4142C1.46258 16.961 1.20801 16.3465 1.20801 15.7056V1.20813Z"
                fill="#F5F5F5"
              />
              <path
                d="M1.20812 1.20812V0C0.88771 0 0.580419 0.127284 0.353852 0.353852C0.127284 0.580419 0 0.88771 0 1.20812H1.20812ZM22.9544 1.20812H24.1625C24.1625 0.88771 24.0352 0.580419 23.8086 0.353852C23.5821 0.127284 23.2748 0 22.9544 0V1.20812ZM1.20812 2.41625H22.9544V0H1.20812V2.41625ZM21.7463 1.20812V15.7056H24.1625V1.20812H21.7463ZM20.5381 16.9137H3.62437V19.33H20.5381V16.9137ZM2.41625 15.7056V1.20812H0V15.7056H2.41625ZM3.62437 16.9137C3.30396 16.9137 2.99667 16.7865 2.7701 16.5599C2.54353 16.3333 2.41625 16.026 2.41625 15.7056H0C0 16.6669 0.381853 17.5887 1.06156 18.2684C1.74126 18.9481 2.66313 19.33 3.62437 19.33V16.9137ZM21.7463 15.7056C21.7463 16.026 21.619 16.3333 21.3924 16.5599C21.1658 16.7865 20.8585 16.9137 20.5381 16.9137V19.33C21.4994 19.33 22.4212 18.9481 23.1009 18.2684C23.7806 17.5887 24.1625 16.6669 24.1625 15.7056H21.7463Z"
                fill="#F5F5F5"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.353852 0.353852C0.825654 -0.117951 1.5906 -0.117951 2.0624 0.353852L12.0812 10.3727L22.1001 0.353852C22.5719 -0.117951 23.3368 -0.117951 23.8086 0.353852C24.2805 0.825654 24.2805 1.5906 23.8086 2.0624L12.9355 12.9355C12.4637 13.4073 11.6988 13.4073 11.227 12.9355L0.353852 2.0624C-0.117951 1.5906 -0.117951 0.825654 0.353852 0.353852Z"
                fill="#F5F5F5"
              />
            </svg>
          </a>
          <a
            href={`tel:${office.phoneNumber?.replace(/\s+/g, "")}`}
            className="ky-office-card-action ky-office-card-action-square"
          >
            <svg
              width="23"
              height="23"
              viewBox="0 0 23 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.16"
                d="M7.4106 15.5762L7.74444 15.91L8.17017 15.7059C11.4668 14.1257 14.1252 11.4673 15.7055 8.17066L15.9095 7.74493L15.5757 7.41109L13.9383 5.77367C14.3004 4.75432 14.5376 3.69423 14.6442 2.61662L14.6443 2.61614C14.6837 2.21482 14.9975 1.94352 15.32 1.94352H16.5967C19.1114 1.94352 20.9853 3.97206 20.427 6.16747C19.546 9.60413 17.7577 12.7409 15.2491 15.2495C12.7404 17.7582 9.60364 19.5465 6.16698 20.4274C3.97157 20.9858 1.94303 19.1119 1.94303 16.5972V15.3205C1.94303 14.9986 2.21509 14.6837 2.61681 14.6434C3.6941 14.5371 4.75392 14.3003 5.77307 13.9386L7.4106 15.5762Z"
                fill="#F5F5F5"
                stroke="#F5F5F5"
                strokeWidth="1.33333"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.3008 2.56724C15.2783 2.58911 15.2564 2.62763 15.2517 2.67559L15.2516 2.67652C15.1529 3.67447 14.9471 4.65807 14.6382 5.61042L16.0074 6.97957C16.3904 7.36262 16.49 7.9457 16.2559 8.43419C14.6156 11.8562 11.8562 14.6156 8.43419 16.2559C7.9457 16.49 7.36262 16.3904 6.97957 16.0074L5.6102 14.638C4.65773 14.9465 3.67407 15.152 2.67608 15.2504L2.55084 13.9798L2.67811 15.2502C2.63007 15.255 2.5905 15.2772 2.56771 15.3007C2.55747 15.3113 2.55401 15.3186 2.55338 15.3201C2.55323 15.3204 2.5534 15.3194 2.5534 15.3204V16.5971C2.5534 18.8309 4.31308 20.2689 6.01631 19.8362C9.34688 18.9824 12.3868 17.2493 14.818 14.818C17.2493 12.3868 18.9824 9.34688 19.8362 6.01631C20.2689 4.31308 18.8309 2.5534 16.5971 2.5534H15.3204C15.319 2.5534 15.3198 2.55332 15.3195 2.55345C15.3181 2.55405 15.311 2.55737 15.3008 2.56724ZM12.7106 2.42517C12.8365 1.1472 13.8842 0 15.3204 0H16.5971C20.0057 0 23.2684 2.88415 22.3104 6.64737L22.3099 6.6494C21.3426 10.4236 19.3786 13.8685 16.6236 16.6236C13.8685 19.3786 10.4236 21.3426 6.6494 22.3099L6.64737 22.3104C2.88415 23.2684 0 20.0057 0 16.5971V15.3204C0 13.8826 1.14989 12.8371 2.42358 12.7095L2.42561 12.7093C3.47112 12.6063 4.4974 12.3593 5.47538 11.9756C5.94797 11.7901 6.48554 11.9023 6.84452 12.2613L8.12453 13.5413C10.395 12.2701 12.2701 10.395 13.5413 8.12453L12.2613 6.84452C11.9022 6.48541 11.7901 5.94763 11.9757 5.47495C12.3598 4.49731 12.6071 3.47135 12.7105 2.42609"
                fill="#F5F5F5"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

export { KYOfficeCard }
