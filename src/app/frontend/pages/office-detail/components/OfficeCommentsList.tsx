import { useEffect, useState } from "react"

import { Comment as CommentModel } from "../../../../modules/apps/comment-management/_core/_models"
import { getCommentsByOfficeId } from "../../../../modules/apps/comment-management/_core/_requests"
import { Comment } from "./Comment"
import { Office } from "../../../../modules/apps/office-management/_core/_models"

interface Props {
  office: Office
}

const OfficeCommentsList: React.FC<Props> = ({ office }) => {
  const [comments, setComments] = useState<CommentModel[]>([])
  const [commentsLoading, setCommentsLoading] = useState(true)

  useEffect(() => {
    const fetchComments = async () => {
      const commentsArr: CommentModel[] = await getCommentsByOfficeId(office.id)

      if (commentsArr.length) setComments(commentsArr)

      setCommentsLoading(false)
    }

    fetchComments()
  }, [office])

  return (
    <>
      {commentsLoading ? (
        <div className="d-flex align-items-center justify-content-center text-gray-600 fw-semibold fs-7 py-20 w-100">
          <span className="spinner-border spinner-border-lg"></span>
        </div>
      ) : comments.length ? (
        <>
          <div className="d-flex flex-wrap flex-stack mb-6">
            <h3 className="fw-bolder my-2 text-white">
              Müşteri Yorumları
              <span className="fs-6 opacity-50 fw-bold ms-1">
                {comments ? `(${comments?.length})` : "(0)"}
              </span>
            </h3>
          </div>
          {comments.map((comment) => (
            <div className="row g-5 g-xxl-8">
              <div className="col-xl-6">
                <Comment
                  comment={comment}
                  comments={comments}
                  setComments={setComments}
                />
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="row">
          <div className="text-white opacity-50 fw-semibold fs-7 py-20 rounded text-center border border-2 border-gray-200">
            Ofise ait yorum bulunamadı.
          </div>
        </div>
      )}
    </>
  )
}

export { OfficeCommentsList }
