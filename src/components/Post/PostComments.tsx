import React from 'react'
import type { Group, Item } from '@/types/contract/ForumInterface'
import { PostItem } from '@components/Post/PostItem'
import { useCommunityContext } from '@/contexts/CommunityProvider'

export const NewPostModal: {
  openFormButtonClosed: string
  editor: string
  submitButton: string
  formBody: string
  rootOpen: string
  formContainerOpen: string
  rootClosed: string
  openFormButtonOpen: string
} = {
  rootClosed: '!w-fit !p-0',
  rootOpen: 'fixed z-50 inset-0 p-12 bg-gray-900/50 flex justify-center items-center ',
  formBody: 'w-full h-full flex flex-col gap-4 min-h-[400px] justify-between ',
  editor:
    'border rounded-md py-2 px-3 min-h-[300px] transition-shadow focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 dark:text-dark-100 ',
  submitButton:
    'bg-green-500 text-white border-none rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 ',
  formContainerOpen:
    'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg w-full max-w-3xl ',
  openFormButtonOpen: 'self-end hidden',
  openFormButtonClosed:
    'h-full bg-primary text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600',
}

export const PostComment = ({
  comment,
}: {
  comment: Item & { time?: Date } // where is time added!?
}) => {
  const { state } = useCommunityContext()
  const community = state?.activeCommunity?.community as Group
  return <>{comment && <PostItem post={comment} group={community} showAvatar={false} />}</>
}
