import { useEffect, useState } from "react"

import { Office } from "../../../modules/apps/office-management/_core/_models"
import { Comment as CommentModel } from "../../../modules/apps/comment-management/_core/_models"
import { getCommentsByOfficeId } from "../../../modules/apps/comment-management/_core/_requests"

import { Comment } from "./Comment"

interface Props {
  office: Office
}

const Comments: React.FC<Props> = ({ office }) => {
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
      <div className="d-flex flex-wrap flex-stack mb-6">
        <h3 className="fw-bolder my-2">
          Müşteri Yorumları
          <span className="fs-6 text-gray-500 fw-bold ms-1">
            {comments ? `(${comments?.length})` : "(0)"}
          </span>
        </h3>
      </div>

      {commentsLoading ? (
        <div className="d-flex align-items-center justify-content-center text-gray-600 fw-semibold fs-7 py-20 w-100">
          <span className="spinner-border spinner-border-lg"></span>
        </div>
      ) : comments.length ? (
        comments.map((comment) => (
          <div className="row g-5 g-xxl-8">
            <div className="col-xl-6">
              <Comment
                comment={comment}
                comments={comments}
                setComments={setComments}
              />
            </div>
          </div>
        ))
      ) : (
        <div className="text-gray-600 fw-semibold fs-7 card py-20 rounded text-center border border-gray-200">
          Ofise ait yorum bulunamadı.
        </div>
      )}
    </>
  )
}

export { Comments }
