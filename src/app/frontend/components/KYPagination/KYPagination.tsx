import "./KYPagination.css"

interface KYPaginationProps {
  currentPage: number
  setCurrentPage: (pageNumber: number) => void
  totalPages: number
}

const KYPagination: React.FC<KYPaginationProps> = ({
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
  const pages = []

  const handleClickPage = (pageNumber: number) => {
    document.querySelector(".ky-layout")?.scroll(0, 0)
    setCurrentPage(pageNumber)
  }

  pages.push(
    <button
      key="prev"
      className="ky-pagination-prev"
      disabled={currentPage === 1}
      onClick={() => handleClickPage(currentPage - 1)}
    ></button>
  )

  for (let i = 1; i <= totalPages; i++) {
    pages.push(
      <button
        key={i}
        className={`ky-pagination-page${
          currentPage === i ? " ky-pagination-current" : ""
        }`}
        onClick={() => handleClickPage(i)}
      >
        {i}
      </button>
    )
  }

  pages.push(
    <button
      key="next"
      className="ky-pagination-next"
      disabled={currentPage === totalPages}
      onClick={() => handleClickPage(currentPage + 1)}
    ></button>
  )

  return <div className="ky-pagination">{pages}</div>
}

export { KYPagination }
