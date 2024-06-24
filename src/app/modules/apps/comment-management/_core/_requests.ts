import { ID } from "../../../../../_metronic/helpers"
import { Comment } from "./_models"

import { firebaseConfig } from "../../../../../firebase/BaseConfig"
import { initializeApp } from "firebase/app"
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  CollectionReference,
  query,
  where,
} from "firebase/firestore"

initializeApp(firebaseConfig)
const db = getFirestore()

const getAllComments = async (): Promise<Comment[]> => {
  try {
    const db = getFirestore()
    const commentCollectionRef = collection(db, "comments")
    const commentDocSnapshot = await getDocs(commentCollectionRef)

    const comments: Comment[] = []

    commentDocSnapshot.forEach((doc) => {
      const commentData = doc.data() as Comment
      comments.push({ ...commentData, id: doc.id })
    })

    return comments
  } catch (error) {
    console.error("Error fetching comments:", error)
    return []
  }
}

const getCommentById = async (id: string): Promise<Comment | undefined> => {
  try {
    const db = getFirestore()
    const commentDocRef = doc(db, "comments", id)
    const commentDocSnapshot = await getDoc(commentDocRef)

    if (commentDocSnapshot.exists()) {
      return commentDocSnapshot.data() as Comment
    } else {
      return undefined
    }
  } catch (error) {
    console.error("Error fetching comments:", error)
    return undefined
  }
}

const getCommentsByUserId = async (userId: string): Promise<Comment[]> => {
  try {
    const db = getFirestore()
    const commentsRef = collection(
      db,
      "comments"
    ) as CollectionReference<Comment>
    const q = query(commentsRef, where("userId", "==", userId))
    const querySnapshot = await getDocs(q)

    const comments: Comment[] = []
    querySnapshot.forEach((doc) => {
      comments.push(doc.data())
    })

    return comments
  } catch (error) {
    console.error("Error fetching comments:", error)
    return []
  }
}

const getCommentsByOfficeId = async (officeId: string): Promise<Comment[]> => {
  try {
    const db = getFirestore()
    const commentsRef = collection(
      db,
      "comments"
    ) as CollectionReference<Comment>
    const q = query(commentsRef, where("officeId", "==", officeId))
    const querySnapshot = await getDocs(q)

    const comments: Comment[] = []
    querySnapshot.forEach((doc) => {
      comments.push(doc.data())
    })

    return comments
  } catch (error) {
    console.error("Error fetching comments:", error)
    return []
  }
}

const getCommentsByPropertyId = async (
  propertyId: string
): Promise<Comment[]> => {
  try {
    const db = getFirestore()
    const commentsRef = collection(
      db,
      "comments"
    ) as CollectionReference<Comment>
    const q = query(commentsRef, where("propertyId", "==", propertyId))
    const querySnapshot = await getDocs(q)

    const comments: Comment[] = []
    querySnapshot.forEach((doc) => {
      comments.push(doc.data())
    })

    return comments
  } catch (error) {
    console.error("Error fetching comments:", error)
    return []
  }
}

const updateComment = async (
  comment: Comment
): Promise<Comment | undefined> => {
  const commentDocRef = doc(db, "comment", comment.id)
  await updateDoc(commentDocRef, comment)
  return comment
}

const deleteComment = async (commentId: string): Promise<void> => {
  try {
    const commentRef = doc(db, "comments", commentId)
    await deleteDoc(commentRef)
  } catch (error) {
    console.error("Error deleting comment documents:", error)
    throw error
  }
}

const deleteSelectedComments = async (commentIds: Array<ID>): Promise<void> => {
  try {
    await Promise.all(
      commentIds.map(async (commentId) => {
        if (typeof commentId === "string") {
          await deleteComment(commentId)
        } else {
          console.error("Invalid commentId")
        }
      })
    )
  } catch (error) {
    console.error("Error deleting comments:", error)
    throw error
  }
}

export {
  getAllComments,
  getCommentById,
  getCommentsByUserId,
  getCommentsByOfficeId,
  getCommentsByPropertyId,
  updateComment,
  deleteComment,
  deleteSelectedComments,
}
