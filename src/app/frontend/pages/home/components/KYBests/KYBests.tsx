import "./KYBests.css"
import { useEffect, useState } from "react"

import { KYText } from "../../../../components/KYText/KYText"

import { motion } from "framer-motion"

import { toAbsoluteUrl } from "../../../../../../_metronic/helpers"
import { KYOfficeImage } from "../../../../components/KYOfficeImage/KYOfficeImage"
import { getCurrentMonthTurkishName } from "../../../../../../_metronic/helpers/kyHelpers"

import { User } from "../../../../../modules/apps/user-management/_core/_models"
import { Transaction } from "../../../../../modules/apps/transactions-management/_core/_models"
import { getAllTransactions } from "../../../../../modules/apps/transactions-management/_core/_requests"
import { getUserById } from "../../../../../modules/apps/user-management/_core/_requests"
import { Office } from "../../../../../modules/apps/office-management/_core/_models"
import { getOfficeById } from "../../../../../modules/apps/office-management/_core/_requests"

const KYBests = () => {
  const bestsHidden = { opacity: 0, y: 20 }
  const bestsVisible = { opacity: 1, y: 0 }

  const [bestAgentOfTheMonth, setBestAgentOfTheMonth] = useState<User>()
  const [bestAgentOfTheMonthOffice, setBestAgentOfTheMonthOffice] =
    useState<Office>()

  const [bestOfficeOfTheMonth, setBestOfficeOfTheMonth] =
    useState<Office | null>()

  const [transactions, setTransactions] = useState<Transaction[]>()

  const [currentMonth, setCurrentMonth] = useState("")

  const calculateBestAgent = async (txn: Transaction[]) => {
    const agentFees = txn.map((transaction) => ({
      userIds: transaction.userIds,
      agentFee: Number(transaction.agentProfit),
    }))

    const feeTotals: { [userId: string]: number } = {}

    agentFees.forEach((entry) => {
      const userIds = entry.userIds
      const agentFee = entry.agentFee

      userIds.forEach((userId) => {
        feeTotals[userId] = (feeTotals[userId] || 0) + agentFee
      })
    })

    let maxUserId: string | null = null
    let maxAgentFee = -Infinity

    for (const userId in feeTotals) {
      if (feeTotals[userId] > maxAgentFee) {
        maxAgentFee = feeTotals[userId]
        maxUserId = userId
      }
    }

    if (maxUserId) {
      const user = await getUserById(maxUserId)
      if (user) {
        setBestAgentOfTheMonth(user)

        const officeId = user.officeId
        if (officeId) {
          const office = await getOfficeById(officeId)
          setBestAgentOfTheMonthOffice(office)
        } else {
          setBestAgentOfTheMonthOffice(undefined)
        }
      } else {
        setBestAgentOfTheMonth(undefined)
        setBestAgentOfTheMonthOffice(undefined)
      }
    } else {
      setBestAgentOfTheMonth(undefined)
      setBestAgentOfTheMonthOffice(undefined)
    }
  }

  const calculateBestOffice = async (txn: Transaction[]) => {
    const officeFees = txn.map((transaction) => ({
      officeId: transaction.officeId,
      officeProfit: Number(transaction.officeProfit),
    }))

    const feeTotals: { [officeId: string]: number } = {}

    officeFees.forEach((entry) => {
      const officeId = entry.officeId
      const agentFee = entry.officeProfit

      feeTotals[officeId] = (feeTotals[officeId] || 0) + agentFee
    })

    let maxOfficeId: string | null = null
    let maxOfficeFee = -Infinity

    for (const userId in feeTotals) {
      if (feeTotals[userId] > maxOfficeFee) {
        maxOfficeFee = feeTotals[userId]
        maxOfficeId = userId
      }
    }

    if (maxOfficeId) {
      const office = await getOfficeById(maxOfficeId)
      if (office) {
        setBestOfficeOfTheMonth(office)
      } else {
        setBestAgentOfTheMonth(undefined)
      }
    } else {
      setBestAgentOfTheMonth(undefined)
    }
  }
  useEffect(() => {
    setCurrentMonth(getCurrentMonthTurkishName())

    const fetchTransactions = async () => {
      setTransactions(await getAllTransactions())
    }

    fetchTransactions()
  }, [])

  useEffect(() => {
    if (transactions) {
      calculateBestAgent(transactions)
      calculateBestOffice(transactions)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions])

  return (
    <section className="ky-bests-section">
      <div className="ky-bests-wrapper">
        <motion.div
          className="ky-bests-item-wrapper"
          initial={bestsHidden}
          whileInView={bestsVisible}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <a
            href={`/ofis-detayi/${
              bestOfficeOfTheMonth ? bestOfficeOfTheMonth.id : ""
            }`}
            className="ky-bests-item"
          >
            <KYText className="ky-bests-title" variant="subtitle">
              <span className="ky-text-highlight">{currentMonth} Ayının</span>{" "}
              En Başarılı Ofisi
            </KYText>
            <div className="ky-bests-content">
              <KYOfficeImage
                height={57}
                width={57}
                officeName={
                  bestOfficeOfTheMonth ? bestOfficeOfTheMonth.name : "Yıldız"
                }
              />
              <div className="ky-bests-info">
                <div className="ky-bests-name">
                  {import.meta.env.VITE_APP_NAME}{" "}
                  {bestOfficeOfTheMonth ? bestOfficeOfTheMonth.name : "Yıldız"}
                </div>
              </div>
            </div>
          </a>
        </motion.div>

        <motion.div
          className="ky-bests-item-wrapper"
          initial={bestsHidden}
          whileInView={bestsVisible}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <a
            href={`/kullanici-detayi/${bestAgentOfTheMonth?.id}/`}
            className="ky-bests-item"
          >
            <KYText className="ky-bests-title" variant="subtitle">
              <span className="ky-text-highlight">{currentMonth} Ayının</span>{" "}
              En Başarılı Danışmanı
            </KYText>
            <div className="ky-bests-content">
              <div className="ky-bests-image">
                <img
                  src={
                    bestAgentOfTheMonth?.photoURL
                      ? bestAgentOfTheMonth?.photoURL
                      : toAbsoluteUrl("media/avatars/blank.jpg")
                  }
                  alt="Görkem Aysert"
                />
              </div>
              <div className="ky-bests-info">
                <div className="ky-bests-name">
                  {bestAgentOfTheMonth
                    ? bestAgentOfTheMonth?.firstName +
                      " " +
                      bestAgentOfTheMonth.lastName
                    : "Görkem Aysert"}
                </div>
                <div className="ky-bests-desc">
                  {import.meta.env.VITE_APP_NAME}{" "}
                  {bestAgentOfTheMonthOffice
                    ? bestAgentOfTheMonthOffice.name
                    : "Yıldız"}
                </div>
              </div>
            </div>
          </a>
        </motion.div>

        <motion.div
          className="ky-bests-item-wrapper"
          initial={bestsHidden}
          whileInView={bestsVisible}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <a
            href="/kullanici-detayi/GdnjRpbbbGhMcTa9RoKtsI1ostM2/"
            className="ky-bests-item"
          >
            <KYText className="ky-bests-title" variant="subtitle">
              <span className="ky-text-highlight">Geçen Haftanın</span> En
              Başarılı Danışmanı
            </KYText>
            <div className="ky-bests-content">
              <div className="ky-bests-image">
                <img
                  src={toAbsoluteUrl("media/avatars/gulnur.jpg")}
                  alt="Gülnur Karabacak"
                />
              </div>
              <div className="ky-bests-info">
                <div className="ky-bests-name">Gülnur Karabacak</div>
                <div className="ky-bests-desc">Keya Yıldız</div>
              </div>
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export { KYBests }
