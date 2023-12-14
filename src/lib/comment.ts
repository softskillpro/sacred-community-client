import type { User } from './model'
import { create, editContent, handleDeleteItem } from '@/lib/item'
import type { Address } from '@/types/common'

interface CreateParams {
  commentContent: string
  address: Address
  users: User[]
  postedByUser: User
  groupId: string
  setWaiting: (waiting: boolean) => void
  onIPFSUploadSuccess: (comment, cid) => void
}

export class CommentClass {
  id?: string
  groupId: string
  postId: string

  constructor(groupId: string, postId: string, id?: string) {
    this.groupId = groupId
    this.postId = postId
    this.id = id
  }

  commentsCacheId() {
    return this.postId + '_comments'
  }

  specificId(commentId?: any) {
    return `${this.postId}_comment_${this.id ?? commentId}`
  }

  async create({
    commentContent,
    address,
    users,
    postedByUser,
    groupId,
    setWaiting,
    onIPFSUploadSuccess,
  }: CreateParams) {
    return await create.call(
      this,
      commentContent,
      'comment',
      address,
      users,
      postedByUser,
      groupId,
      setWaiting,
      onIPFSUploadSuccess
    )
  }

  async edit(
    commentContent,
    address: Address,
    itemId,
    postedByUser: User,
    groupId: string,
    setWaiting: Function
  ) {
    return await editContent.call(
      this,
      'comment',
      commentContent,
      address,
      itemId,
      postedByUser,
      groupId,
      setWaiting
    )
  }

  async delete(address: Address, itemId, postedByUser: User) {
    return await handleDeleteItem.call(this, address, postedByUser, itemId)
  }
}
