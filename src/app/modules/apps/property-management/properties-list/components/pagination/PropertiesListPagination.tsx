import clsx from "clsx"
import React from "react"

interface PaginationProps {
  propertiesLength: number
  paginatedPropertiesLength: number
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const PropertiesListPagination: React.FC<PaginationProps> = ({
  propertiesLength,
  paginatedPropertiesLength,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrevious = () => onPageChange(currentPage - 1)
  const handleNext = () => onPageChange(currentPage + 1)
  const handleFirstPage = () => onPageChange(1)
  const handleLastPage = () => onPageChange(totalPages)

  const paginationLinks = Array.from(
    { length: totalPages },
    (_, i) => i + 1
  ).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))

  return (
    <div id="kt_table_properties_paginate" className="mt-10">
      <ul className="pagination items-center flex-end">
        <li className="me-auto">
          <span className="text-muted fs-7 fw-bold">
            {propertiesLength} ilan arasından {paginatedPropertiesLength}{" "}
            gösteriliyor.
          </span>
        </li>
        <li className={clsx("page-item", { disabled: currentPage === 1 })}>
          <a
            onClick={handleFirstPage}
            style={{ cursor: "pointer" }}
            className="page-link"
          >
            İlk Sayfa
          </a>
        </li>
        <li className={clsx("page-item", { disabled: currentPage === 1 })}>
          <a
            onClick={handlePrevious}
            style={{ cursor: "pointer" }}
            className="page-link"
          >
            Önceki
          </a>
        </li>
        {paginationLinks.map((page) => (
          <li
            key={page}
            className={clsx("page-item", { active: currentPage === page })}
          >
            <a
              onClick={() => onPageChange(page)}
              style={{ cursor: "pointer" }}
              className="page-link"
            >
              {page}
            </a>
          </li>
        ))}
        <li
          className={clsx("page-item", {
            disabled: currentPage === totalPages,
          })}
        >
          <a
            onClick={handleNext}
            style={{ cursor: "pointer" }}
            className="page-link"
          >
            Sonraki
          </a>
        </li>
        <li
          className={clsx("page-item", {
            disabled: currentPage === totalPages,
          })}
        >
          <a
            onClick={handleLastPage}
            style={{ cursor: "pointer" }}
            className="page-link"
          >
            Son Sayfa
          </a>
        </li>
      </ul>
    </div>
  )
}

export { PropertiesListPagination }
