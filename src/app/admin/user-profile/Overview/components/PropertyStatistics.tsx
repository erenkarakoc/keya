import React, { useEffect, useRef, useState, FC } from "react"
import ApexCharts, { ApexOptions } from "apexcharts"
import {
  getCSS,
  getCSSVariableValue,
} from "../../../../../_metronic/assets/ts/_utils"
import { useThemeMode } from "../../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider"
import { Property } from "../../../../modules/apps/property-management/_core/_models"

type Props = {
  className?: string
  properties: Property[]
}

const PropertyStatistics: FC<Props> = ({ className, properties }) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const { mode } = useThemeMode()
  const [timeFrame, setTimeFrame] = useState("year")

  const refreshChart = (data: {
    categories: string[]
    properties: number[]
  }) => {
    if (!chartRef.current) {
      return
    }

    const height = parseInt(getCSS(chartRef.current, "height"))

    const chart = new ApexCharts(
      chartRef.current,
      getChartOptions(height, data)
    )

    if (chart) {
      chart.render()
    }

    return chart
  }

  const getDataForTimeFrame = (timeFrame: string) => {
    const currentDate = new Date()
    switch (timeFrame) {
      case "month": {
        const daysInMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        ).getDate()
        return {
          categories: Array.from({ length: daysInMonth }, (_, i) =>
            (i + 1).toString()
          ),
          properties: [
            1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2,
            2, 2, 2, 2, 2, 3, 2,
          ],
        }
      }
      case "week":
        return {
          categories: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
          properties: [2, 2, 2, 2, 2, 2, 2],
        }
      case "year":
      default:
        return {
          categories: [
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
          ],
          properties: [1, 2, 2, 2, 4, 4, 4, 3, 3, 2, 2, 2],
        }
    }
  }

  useEffect(() => {
    const data = getDataForTimeFrame(timeFrame)
    const chart = refreshChart(data)
    return () => {
      if (chart) {
        chart.destroy()
      }
    }
  }, [chartRef, mode, timeFrame])

  useEffect(() => {
    console.log(properties)
  }, [properties])

  return (
    <div className={`card${className ? " " + className : ""}`}>
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">Portföy</span>

          <span className="text-muted fw-semibold fs-7">
            Zaman bazında kullanıcı portföyleri
          </span>
        </h3>

        <div className="card-toolbar" data-kt-buttons="true">
          <a
            className={`btn btn-sm btn-color-muted btn-active btn-active-primary px-4 me-1 ${
              timeFrame === "year" ? "active" : ""
            }`}
            id="kt_charts_widget_2_year_btn"
            onClick={() => setTimeFrame("year")}
          >
            Bu Yıl
          </a>

          <a
            className={`btn btn-sm btn-color-muted btn-active btn-active-primary px-4 me-1 ${
              timeFrame === "month" ? "active" : ""
            }`}
            id="kt_charts_widget_2_month_btn"
            onClick={() => setTimeFrame("month")}
          >
            Bu Ay
          </a>

          <a
            className={`btn btn-sm btn-color-muted btn-active btn-active-primary px-4 ${
              timeFrame === "week" ? "active" : ""
            }`}
            id="kt_charts_widget_2_week_btn"
            onClick={() => setTimeFrame("week")}
          >
            Bu Hafta
          </a>
        </div>
      </div>

      <div className="card-body">
        <div
          ref={chartRef}
          id="kt_charts_widget_2_chart"
          style={{ height: "350px" }}
        ></div>
      </div>
    </div>
  )
}

export { PropertyStatistics }

function getChartOptions(
  height: number,
  data: {
    categories: string[]
    properties: number[]
  }
): ApexOptions {
  const labelColor = getCSSVariableValue("--bs-gray-500")
  const borderColor = getCSSVariableValue("--bs-gray-200")
  const baseColor = getCSSVariableValue("--bs-info")
  const lightColor = getCSSVariableValue("--bs-info-light")

  return {
    series: [
      {
        name: "",
        data: data.properties,
      },
    ],
    chart: {
      fontFamily: "inherit",
      type: "area",
      height: height,
      toolbar: {
        show: false,
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
      type: "solid",
      opacity: 1,
    },
    stroke: {
      curve: "smooth",
      show: true,
      width: 3,
      colors: [baseColor],
    },
    xaxis: {
      categories: data.categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: "12px",
        },
      },
      crosshairs: {
        position: "front",
        stroke: {
          color: baseColor,
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
      show: false,
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
          return val + " adet portföy"
        },
      },
    },
    colors: [lightColor],
    grid: {
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    markers: {
      strokeColors: baseColor,
      strokeWidth: 3,
    },
  }
}
