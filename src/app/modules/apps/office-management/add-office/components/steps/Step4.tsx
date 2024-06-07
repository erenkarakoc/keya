import { useState, useEffect } from "react"
import { ErrorMessage } from "formik"
import MultiSelect from "../../../../components/multiselect/MultiSelect"
import { getUsersByRole } from "../../../../user-management/_core/_requests"
import { getUserRoleText } from "../../../../../../../_metronic/helpers/kyHelpers"
import { Link } from "react-router-dom"

const Step4 = () => {
  const [users, setUsers] = useState<{ id: string; label: string }[]>([])

  const fetchUsers = async () => {
    try {
      const agentsPromise = getUsersByRole("agent")
      const assistantsPromise = getUsersByRole("assistant")
      const humanResourcesPromise = getUsersByRole("human-resources")

      const [agents, assistants, humanResources] = await Promise.all([
        agentsPromise,
        assistantsPromise,
        humanResourcesPromise,
      ])

      const usersArr = []

      if (agents) {
        usersArr.push(
          ...agents.map((user) => ({
            id: user.id,
            label:
              user.firstName +
              " " +
              user.lastName +
              " | " +
              getUserRoleText(user.role as string),
          }))
        )
      }

      if (assistants) {
        usersArr.push(
          ...assistants.map((user) => ({
            id: user.id,
            label:
              user.firstName +
              " " +
              user.lastName +
              " | " +
              getUserRoleText(user.role as string),
          }))
        )
      }

      if (humanResources) {
        usersArr.push(
          ...humanResources.map((user) => ({
            id: user.id,
            label:
              user.firstName +
              " " +
              user.lastName +
              " | " +
              getUserRoleText(user.role as string),
          }))
        )
      }

      setUsers(usersArr)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="w-100">
      <div className="pb-10 pb-lg-15">
        <h2 className="fw-bolder text-gray-900">Ekip</h2>

        <div className="text-gray-500 fw-bold fs-6">
          Ofis ekibine kullanıcılar ekleyin.
        </div>
      </div>

      <div className="mb-0">
        <div className="mb-10 fv-row">
          <label className="form-label mb-3">Kullanıcı Adı</label>

          <MultiSelect
            options={users}
            id="users"
            name="users"
            notFoundText="Aramanızla eşleşen bir kullanıcı bulunamadı."
          />
          <div className="text-danger mt-2">
            <ErrorMessage name="users" />
          </div>
          <div className="form-text">
            Lütfen ofis ekibine dahil etmek istediğiniz kullanıcıları seçin.
            Eğer ofisinizde çalışacak kullanıcılar henüz sisteme kayıtlı değilse
            daha sonra{" "}
            <Link
              to="/arayuz/kullanici-yonetimi/kullanici-ekle"
              target="_blank"
            >
              Kullanıcı Ekle
            </Link>{" "}
            bölümünden kaydedebilirsiniz.
          </div>
        </div>
      </div>
    </div>
  )
}

export { Step4 }
