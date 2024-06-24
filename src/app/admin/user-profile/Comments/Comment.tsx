import React, { useState } from "react"
import { Comment as CommentModel } from "../../../modules/apps/comment-management/_core/_models"
import { deleteComment } from "../../../modules/apps/comment-management/_core/_requests"
import toast from "react-hot-toast"
import { Modal } from "react-bootstrap"

type Props = {
  className?: string
  comment: CommentModel
  comments: CommentModel[]
  setComments: React.Dispatch<React.SetStateAction<CommentModel[] | []>>
}

const Comment: React.FC<Props> = ({
  className,
  comment,
  comments,
  setComments,
}) => {
  const [show, setShow] = useState(false)

  const handleShow = () => setShow(true)
  const handleHide = () => setShow(false)

  return (
    <div className={`card ${className}`}>
      <div className="card-body">
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

        <div className="mb-5">
          <p className="text-gray-800 fw-normal">{comment.text}</p>
        </div>

        <button
          type="button"
          className="btn btn-sm btn-danger mt-4"
          style={{ marginRight: "auto" }}
          onClick={handleShow}
        >
          Yorumu Sil
        </button>

        <Modal show={show} onHide={handleHide}>
          <Modal.Header closeButton>
            <Modal.Title>Emin misiniz?</Modal.Title>
          </Modal.Header>
          <Modal.Body>Bu yorumu silmek istediğinize emin misiniz?</Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn" onClick={() => handleHide}>
              İptal
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={async () => {
                await deleteComment(comment.id)
                const updatedComments = comments.filter(
                  (cm) => cm.id !== comment.id
                )
                setComments(updatedComments)
                toast.success("Yorum silindi.")
                handleHide()
              }}
            >
              Sil
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  )
}

export { Comment }
