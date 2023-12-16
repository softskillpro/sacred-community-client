import {
  useCommunityContext,
  useUserIfJoined,
} from '@/contexts/CommunityProvider'
import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { Identity } from '@semaphore-protocol/identity'
import { commentIsConfirmed, createNote } from '@/lib/utils'
import { BigNumber } from 'ethers'
import { PollUI } from '@components/PollIUI'
import { ContentActions } from '@components/Post/ContentActions'
import { PostTitle } from '@components/Post/PostTitle'
import type { User } from '@/lib/model'
import { ContentType } from '@/lib/model'
import { useContentManagement } from '@/hooks/useContentManagement'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useEditItem } from '@/hooks/useEditItem'
import dynamic from 'next/dynamic'
import type { Group, Item } from '@/types/contract/ForumInterface'
import EditorJsRenderer from '@components/editor-js/EditorJSRenderer'
import type { Address } from '@/types/common'
import AnimalAvatar from '@components/AnimalAvatar'
import { VoteForItemUI } from '@components/Post/PostPage'
import { formatDistanceToNow } from 'date-fns'
import { DropdownCommunityCard } from '@components/CommunityCard/DropdownCommunityCard'

const Editor = dynamic(() => import('../editor-js/Editor'), {
  ssr: false,
})

interface PostItemProps {
  post: Item
  group: Group
  showAvatar?: boolean
  refreshData?: () => void
}

export const PostItem = ({
  post,
  group,
  showAvatar = true,
  refreshData,
}: PostItemProps) => {
  const { groupId, parentId, id } = post

  const postId = parentId && +parentId > 0 ? parentId : id

  const user = useUserIfJoined(post.groupId)
  const address = useAccount().address
  const {
    state: { isAdmin, isModerator },
  } = useCommunityContext()
  const [isLoading, setIsLoading] = useState(false)

  const { t } = useTranslation()

  const isAdminOrModerator = isAdmin || isModerator

  const isTypeOfPost = post.kind == ContentType.POST
  const isTypeOfPoll = post.kind == ContentType.POLL

  const { editItem } = useEditItem({
    item: post,
    isAdminOrModerator: isAdminOrModerator,
    setIsLoading,
  })

  const saveEditedPost = async () => {
    if (!address || !user) {
      return
    }

    try {
      if (isTypeOfPost || isTypeOfPoll) {
        if (!contentTitle) {
          toast.error(t('alert.emptyTitle'))
        }
        if (!contentDescription || !contentDescription.blocks?.length) {
          toast.error(t('alert.emptyContent'))
        }
        if (
          !contentTitle ||
          !contentDescription ||
          !contentDescription.blocks?.length
        ) {
          return toast.error(t('alert.emptyContent'))
        }
      }

      setIsLoading(true)
      console.log({ title: contentTitle, description: contentDescription })
      await editItem({
        content: { title: contentTitle, description: contentDescription },
        itemId: Number(id),
        itemType: post.kind,
        note: post.note,
      }).then(async value => {
        refreshData && refreshData()
        setIsContentEditing(false)
      })

      toast.success(t('alert.postEditSuccess'))
    } catch (error) {
      console.log(error)
      toast.error(t('alert.editFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const {
    contentDescription,
    setContentDescription,
    isContentEditable,
    setIsContentEditing,
    isContentEditing,
    setIsContentEditable,
    contentTitle,
    setContentTitle,
    clearContent,
  } = useContentManagement({
    isPostOrPoll: isTypeOfPost || isTypeOfPoll,
    defaultContentDescription: post.description || { blocks: post.blocks },
    defaultContentTitle: post.title,
  })

  useEffect(() => {
    updateIsPostEditable({
      post,
      user,
      address,
      setIsPostEditable: setIsContentEditable,
      canDelete: isAdminOrModerator,
    })
  }, [user, post, isAdminOrModerator, address, groupId])

  const isPostPage = !isNaN(postId)

  return (
    <div>
      <div className="flex flex-col gap-2">
        {(isTypeOfPost || isTypeOfPoll) && (
          <div className="flex flex-col gap-4">
            {isContentEditing && (
              <input
                name="title"
                className="focus:ring-primary-dark rounded bg-gray-100 p-4 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400"
                placeholder={t('placeholder.enterPostTitle') as string}
                type="text"
                value={contentTitle}
                onChange={e => setContentTitle(e.target.value)}
              />
            )}

            {!isContentEditing && post.title && (
              <PostTitle
                title={post.title}
                id={post.id}
                onPostPage={isPostPage}
                post={post}
              />
            )}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {!isContentEditing ? (
            <EditorJsRenderer
              data={
                isTypeOfPost || isTypeOfPoll
                  ? post.description
                  : { blocks: post.blocks || post?.description?.blocks }
              }
            />
          ) : (
            <Editor
              holder={`${post?.id}_${isTypeOfPost ? 'post' : 'comment'}`}
              readOnly={!isContentEditing}
              onChange={val => setContentDescription(val)}
              placeholder={t('placeholder.enterPostContent') as string}
              data={post?.description ? post.description : post}
              divProps={{
                className:
                  'rounded-md bg-gray-100 dark:bg-gray-800 dark:!text-white p-4 focus:outline-none focus:ring-2 focus:ring-primary-dark',
              }}
            />
          )}
        </div>

        {isTypeOfPoll && <PollUI group={group} post={post} />}
        <div className="flex items-center justify-between border-t pt-2">
          <div
            className="flex items-center justify-between gap-4"
            style={{
              visibility: commentIsConfirmed(post.id) ? 'visible' : 'hidden',
            }}
          >
            <AnimalAvatar
              seed={`${post.note}_${Number(post.groupId)}`}
              options={{ size: 30 }}
            />

            <VoteForItemUI post={post} group={group} onSuccess={refreshData} />

            <p className="inline-block text-sm">
              🕛{' '}
              {post?.description?.time || post?.time
                ? formatDistanceToNow(
                    new Date(post?.description?.time || post?.time).getTime()
                  )
                : '-'}
            </p>
          </div>
          <DropdownCommunityCard
            actions={[
              <ContentActions
                group={group}
                item={post}
                refreshData={refreshData}
                contentId={post.id}
                isContentEditable={isContentEditable}
                isEditing={isContentEditing}
                onContentPage={isPostPage}
                save={() => saveEditedPost()}
                groupId={groupId}
                isAdminOrModerator={isAdminOrModerator}
                setIsContentEditing={value => {
                  setIsContentEditing(value)
                  if (value) {
                    setContentDescription(post.description)
                    setContentTitle && setContentTitle(post.title)
                  }
                }}
                onClickCancel={() => setIsContentEditing(false)}
                isLoading={isLoading}
                hidden={false}
              />,
            ]}
          />
        </div>
      </div>
    </div>
  )
}

const updateIsPostEditable = async ({
  post,
  user,
  address,
  setIsPostEditable,
  canDelete,
}: {
  post: Item
  user: User
  address: Address
  setIsPostEditable: React.Dispatch<React.SetStateAction<boolean>>
  canDelete: boolean
}) => {
  if (user && post) {
    const isEditable = await checkIfPostIsEditable({
      post,
      address,
      userName: user.name,
      canDelete,
    })
    setIsPostEditable(isEditable)
  } else {
    setIsPostEditable(false)
  }
}

// Function to check if the post is editable
const checkIfPostIsEditable = async ({
  post,
  address,
  userName,
  canDelete,
}: {
  post: Item
  address: Address
  userName: string
  canDelete: boolean
}): Promise<boolean> => {
  const userPosting = new Identity(address)
  const generatedNote = await createNote(userPosting)
  const generatedNoteAsBigNumber = BigNumber.from(generatedNote).toString()
  const noteBigNumber = BigNumber.from(post.note).toString()
  return generatedNoteAsBigNumber === noteBigNumber || canDelete
}
