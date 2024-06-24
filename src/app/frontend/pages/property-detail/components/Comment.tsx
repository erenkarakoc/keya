import React from "react"
import { Comment as CommentModel } from "../../../../modules/apps/comment-management/_core/_models"

type Props = {
  className?: string
  comment: CommentModel
  comments: CommentModel[]
  setComments: React.Dispatch<React.SetStateAction<CommentModel[] | []>>
}

const Comment: React.FC<Props> = ({ className, comment }) => {
  return (
    <div className={`ky-card ${className}`}>
      <div className="d-flex align-items-center mb-5">
        <div className="d-flex align-items-center flex-grow-1">
          <div className="d-flex flex-column">
            <span className="text-gray-800 fs-6 fw-bold">
              {comment.firstName} {comment.lastName}
            </span>

            <span className="text-gray-500 fw-semibold">{comment.title}</span>
          </div>
        </div>
      </div>

      <p className="text-gray-800 fw-normal">{comment.text}</p>
    </div>
  )
}

export { Comment }
