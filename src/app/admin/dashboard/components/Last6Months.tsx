import { useEffect, useRef, FC, useState } from "react"
import ApexCharts, { ApexOptions } from "apexcharts"
import { getCSSVariableValue } from "../../../../_metronic/assets/ts/_utils"
import { useThemeMode } from "../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider"
import { Transaction } from "../../../modules/apps/transactions-management/_core/_models"
import {
  calculatePercentageChange,
  formatPrice,
  formatPriceToShort,
} from "../../../../_metronic/helpers/kyHelpers"

type Props = {
  className: string
  chartHeight: string
  backgroundColor: string
  transactions: Transaction[] | undefined
}

const Last6Months: FC<Props> = ({
  transactions,
  className,
  backgroundColor,
  chartHeight,
}) => {
  const [thisMonthsTotalIncome, setThisMonthsTotalIncome] = useState(0)
  const [lastMonthsTotalIncome, setLastMonthsTotalIncome] = useState(0)
  const [last6MonthsTotalIncome, setLast6MonthsTotalIncome] = useState(0)

  const [thisMonthsTransactions, setThisMonthsTransactions] = useState<
    Transaction[]
  >([])
  const [lastMonthsTransactions, setLastMonthsTransactions] = useState<
    Transaction[]
  >([])

  const [last6MonthsProfits, setLast6MonthsProfits] = useState([
    0, 0, 0, 0, 0, 0,
  ])

  const chartRef = useRef<HTMLDivElement | null>(null)
  const { mode } = useThemeMode()

  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const chart = new ApexCharts(chartRef.current, chartOptions(chartHeight))
    if (chart) {
      chart.render()
    }

    return chart
  }

  const chartOptions = (chartHeight: string): ApexOptions => {
    const labelColor = getCSSVariableValue("--bs-gray-800")
    const strokeColor = getCSSVariableValue("--bs-gray-300") as string

    const monthNames = [
      "Oca",
      "Şub",
      "Mar",
      "Nis",
      "May",
      "Haz",
      "Tem",
      "Ağu",
      "Eyl",
      "Eki",
      "Kas",
      "Ara",
    ]

    const currentDate = new Date()
    const last6Months = []

    for (let i = 0; i < 6; i++) {
      const monthIndex = (currentDate.getMonth() - i + 12) % 12
      last6Months.unshift(monthNames[monthIndex])
    }

    return {
      series: [
        {
          name: "Net Kâr",
          data: last6MonthsProfits,
        },
      ],
      grid: {
        show: false,
        padding: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },
      },
      chart: {
        fontFamily: "inherit",
        type: "area",
        height: chartHeight,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        sparkline: {
          enabled: true,
        },
      },
      plotOptions: {},
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.4,
          opacityTo: 0,
          stops: [0, 0, 0, 0, 0, 0],
        },
      },
      stroke: {
        curve: "smooth",
        show: true,
        width: 3,
        colors: ["#FFFFFF"],
      },
      xaxis: {
        categories: last6Months,
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          style: {
            colors: labelColor,
            fontSize: "12px",
          },
        },
        crosshairs: {
          show: false,
          position: "front",
          stroke: {
            color: strokeColor,
            width: 1,
            dashArray: 3,
          },
        },
        tooltip: {
          enabled: true,
          formatter: undefined,
          offsetY: 0,
          style: {
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        min: 0,
        max: Math.max(...last6MonthsProfits),
        labels: {
          show: false,
          style: {
            colors: labelColor,
            fontSize: "12px",
          },
        },
      },
      states: {
        normal: {
          filter: {
            type: "none",
            value: 0,
          },
        },
        hover: {
          filter: {
            type: "none",
            value: 0,
          },
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: "none",
            value: 0,
          },
        },
      },
      tooltip: {
        style: {
          fontSize: "12px",
        },
        y: {
          formatter: function (val) {
            return formatPrice(val.toString())
          },
        },
      },
      colors: ["#ffffff"],
      markers: {
        colors: [labelColor],
        strokeColors: [strokeColor],
        strokeWidth: 3,
      },
    }
  }

  const calculateLast6MonthsProfits = (transactions: Transaction[]) => {
    const profitsByMonth: Record<string, number> = {}

    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()

    transactions.forEach((transaction) => {
      const { createdAt, totalProfit } = transaction
      const [year, month] = createdAt.split("-").map(Number)

      const isRecent =
        (year === currentYear && month > currentMonth - 6) ||
        (year === currentYear - 1 && month > 12 - (6 - currentMonth))

      if (isRecent) {
        const key = `${year}-${month.toString().padStart(2, "0")}`
        profitsByMonth[key] =
          (profitsByMonth[key] || 0) + parseFloat(totalProfit)
      }
    })

    const result: number[] = []

    for (let i = 0; i < 6; i++) {
      const month = currentMonth - i
      const year = month < 0 ? currentYear - 1 : currentYear
      const actualMonth = (month + 12) % 12
      const key = `${year}-${(actualMonth + 1).toString().padStart(2, "0")}`
      result.unshift(profitsByMonth[key] || 0)
    }

    setLast6MonthsProfits(result)
    setLast6MonthsTotalIncome(result.reduce((acc, val) => acc + val, 0))
  }

  const calculateLastMonthsTotalIncome = (transactions: Transaction[]) => {
    const income =
      transactions?.reduce(
        (acc, transaction) => acc + Number(transaction.totalProfit),
        0
      ) || 0
    setLastMonthsTotalIncome(income)
  }

  const calculateThisMonthsTotalIncome = (transactions: Transaction[]) => {
    const income =
      transactions?.reduce(
        (acc, transaction) => acc + Number(transaction.totalProfit),
        0
      ) || 0

    setThisMonthsTotalIncome(income)
  }

  useEffect(() => {
    if (transactions) {
      const calculateTransactions = async () => {
        const now = new Date()
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const lastMonthStart = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        )
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

        const parseDate = (dateString: string) => new Date(dateString)

        const thisMonthTransactions = transactions.filter((transaction) => {
          const transactionDate = parseDate(transaction.createdAt)
          return transactionDate >= thisMonthStart && transactionDate < now
        })

        const lastMonthTransactions = transactions.filter((transaction) => {
          const transactionDate = parseDate(transaction.createdAt)
          return (
            transactionDate >= lastMonthStart && transactionDate <= lastMonthEnd
          )
        })

        setThisMonthsTransactions(thisMonthTransactions)
        setLastMonthsTransactions(lastMonthTransactions)
        calculateLast6MonthsProfits(transactions)
      }

      calculateTransactions()
    }
  }, [transactions])

  useEffect(() => {
    calculateLastMonthsTotalIncome(lastMonthsTransactions)
  }, [lastMonthsTransactions])

  useEffect(() => {
    calculateThisMonthsTotalIncome(thisMonthsTransactions)
  }, [thisMonthsTransactions])

  useEffect(() => {
    const chart = refreshChart()

    return () => {
      if (chart) {
        chart.destroy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartRef, mode, last6MonthsProfits])

  return (
    <div
      className={`card ${className} theme-dark-bg-body`}
      style={{ backgroundColor }}
    >
      <div className="card-body d-flex flex-column">
        <div className="d-flex flex-column flex-grow-1">
          <h4 className="text-gray-900 fw-bolder fs-3">Son 6 Ay</h4>

          <div
            ref={chartRef}
            className="mixed-widget-13-chart mb-5"
            style={{ height: chartHeight, minHeight: chartHeight }}
          ></div>
        </div>

        <div>
          <span className="text-gray-900 fw-bolder fs-2x">₺</span>

          <span className="text-gray-900 fw-bolder fs-3x me-2">
            {formatPriceToShort(last6MonthsTotalIncome.toString()).replace(
              "₺",
              ""
            )}
          </span>
        </div>

        <span className="text-gray-700 fw-bold fs-6">
          Geçen aya göre{" "}
          {lastMonthsTotalIncome > thisMonthsTotalIncome ? "-" : "+"}
          {lastMonthsTotalIncome === 0
            ? "100"
            : calculatePercentageChange(
                lastMonthsTotalIncome,
                thisMonthsTotalIncome
              ).replace("-", "")}
          % {lastMonthsTotalIncome > thisMonthsTotalIncome ? "düşüş" : "artış"}
        </span>
      </div>
    </div>
  )
}

export { Last6Months }
