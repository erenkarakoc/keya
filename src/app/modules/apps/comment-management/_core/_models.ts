import { Response } from "../../../../../_metronic/helpers"

export type Comment = {
  id: string
  userId: string
  firstName: string
  lastName: string
  title: string
  text: string
}

export type CommentsQueryResponse = Response<Array<Comment>>
