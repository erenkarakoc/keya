import clsx from "clsx"
import {
  useQueryResponseLoading,
  useQueryResponsePagination,
} from "../../../_core/QueryResponseProvider"
import { useQueryRequest } from "../../../_core/QueryRequestProvider"
import { PaginationState } from "../../../../../../../_metronic/helpers"
import { useMemo } from "react"

const mappedLabel = (label: string): string => {
  if (label === "&laquo; Previous") {
    return "Önceki"
  }

  if (label === "Next &raquo;") {
    return "Sonraki"
  }

  return label
}

const PropertiesListPagination = () => {
  const pagination = useQueryResponsePagination()
  const isLoading = useQueryResponseLoading()
  const { updateState } = useQueryRequest()
  const updatePage = (page: number | undefined | null) => {
    if (!page || isLoading || pagination.page === page) {
      return
    }

    updateState({ page, items_per_page: pagination.items_per_page || 10 })
  }

  const PAGINATION_PAGES_COUNT = 5
  const sliceLinks = (pagination?: PaginationState) => {
    if (!pagination?.links?.length) {
      return []
    }

    const scopedLinks = [...pagination.links]

    let pageLinks: Array<{
      label: string
      active: boolean
      url: string | null
      page: number | null
    }> = []
    const previousLink: {
      label: string
      active: boolean
      url: string | null
      page: number | null
    } = scopedLinks.shift()!
    const nextLink: {
      label: string
      active: boolean
      url: string | null
      page: number | null
    } = scopedLinks.pop()!

    const halfOfPagesCount = Math.floor(PAGINATION_PAGES_COUNT / 2)

    pageLinks.push(previousLink)

    if (
      pagination.page <= Math.round(PAGINATION_PAGES_COUNT / 2) ||
      scopedLinks.length <= PAGINATION_PAGES_COUNT
    ) {
      pageLinks = [
        ...pageLinks,
        ...scopedLinks.slice(0, PAGINATION_PAGES_COUNT),
      ]
    }

    if (
      pagination.page > scopedLinks.length - halfOfPagesCount &&
      scopedLinks.length > PAGINATION_PAGES_COUNT
    ) {
      pageLinks = [
        ...pageLinks,
        ...scopedLinks.slice(
          scopedLinks.length - PAGINATION_PAGES_COUNT,
          scopedLinks.length
        ),
      ]
    }

    if (
      !(
        pagination.page <= Math.round(PAGINATION_PAGES_COUNT / 2) ||
        scopedLinks.length <= PAGINATION_PAGES_COUNT
      ) &&
      !(pagination.page > scopedLinks.length - halfOfPagesCount)
    ) {
      pageLinks = [
        ...pageLinks,
        ...scopedLinks.slice(
          pagination.page - 1 - halfOfPagesCount,
          pagination.page + halfOfPagesCount
        ),
      ]
    }

    pageLinks.push(nextLink)

    return pageLinks
  }

  const paginationLinks = useMemo(() => sliceLinks(pagination), [pagination])

  return (
    <div className="row">
      <div className="col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start"></div>
      <div className="col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end">
        <div id="kt_table_properties_paginate">
          <ul className="pagination">
            {paginationLinks
              ?.map((link) => {
                return { ...link, label: mappedLabel(link.label) }
              })
              .map((link) => (
                <li
                  key={link.label}
                  className={clsx("page-item", {
                    active: pagination.page === link.page,
                    disabled: isLoading,
                    previous: link.label === "Önceki",
                    next: link.label === "Sonraki",
                  })}
                >
                  <a
                    className={clsx("page-link", {
                      "page-text":
                        link.label === "Önceki" || link.label === "Sonraki",
                      "me-5": link.label === "Önceki",
                    })}
                    onClick={() => updatePage(link.page)}
                    style={{ cursor: "pointer" }}
                  >
                    {mappedLabel(link.label)}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export { PropertiesListPagination }
