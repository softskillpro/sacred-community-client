import { useActiveUser, useCommunityContext, useUserIfJoined } from '@/contexts/CommunityProvider'
import { useAccount } from 'wagmi'
import { useLoaderContext } from '@/contexts/LoaderContext'
import { useCheckIfUserIsAdminOrModerator } from '@/hooks/useCheckIfUserIsAdminOrModerator'
import { forumContract, ForumContractAddress } from '@/constant/const'
import ForumABI from '@/constant/abi/Forum.json'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useRef, useState } from 'react'
import { OutputData } from '@editorjs/editorjs'
import { useValidateUserBalance } from '@/utils/useValidateUserBalance'
import { Identity } from '@semaphore-protocol/identity'
import { commentIsConfirmed, createNote, formatDistanceToNow } from '@/lib/utils'
import { BigNumber } from 'ethers'
import { toast } from 'react-toastify'
import { SortByOption } from '@components/SortBy'
import { useItemsSortedByVote } from '@/hooks/useItemsSortedByVote'
import { NewPostForm } from '@components/NewPostForm'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useRemoveItemFromForumContract } from '@/hooks/useRemoveItemFromForumContract'
import { CommunityCard } from '@components/CommunityCard/CommunityCard'
import { PostItem } from './postList'
import { NoComments } from './NoPosts'
import { useUnirepSignUp } from '@/hooks/useUnirepSignup'
import { User } from '@/lib/model'

import clsx from 'clsx'
import { CancelButton, PrimaryButton } from '@components/buttons'

const Editor = dynamic(() => import('@/components/editor-js/Editor'), {
  ssr: false,
})

interface PostProps {
  users: any[]
}

interface CommentsMap {
  [key: string]: {
    comment: any
    isSaving: boolean
    isEditable: boolean
    isEditing: boolean
  }
}

interface TempComment {
  id: string
  createdAt: Date
  content: string
}

export function PostPage({ postInstance, postId, groupId, comments, post, community, commentInstance }) {
  const member = useUserIfJoined(groupId)
  const activeUser = useActiveUser({ groupId })
  const { state } = useCommunityContext()
  const { users } = state

  const { address } = useAccount()
  const { isLoading, setIsLoading } = useLoaderContext()

  const { isAdmin, isModerator, fetchIsAdmin, fetchIsModerator } = useCheckIfUserIsAdminOrModerator(address)

  const canDelete = isAdmin || isModerator
  //
  useEffect(() => {
    fetchIsAdmin()
  }, [groupId, postId])

  const { data, write } = useRemoveItemFromForumContract(
    ForumContractAddress,
    ForumABI,
    forumContract,
    postInstance,
    commentInstance,
    setIsLoading
  )

  const { t } = useTranslation()

  const [comment, setComment] = useState<OutputData>(null)
  const [commentsMap, setCommentsMap] = useState<CommentsMap>({} as any)
  const [tempComments, setTempComments] = useState<TempComment[]>([])

  const [isPostEditable, setIsPostEditable] = useState(false)
  const [editableComments, setEditableComments] = useState<string[]>([])

  const [tempPostTitle, setTempPostTitle] = useState('')
  const [tempPostDescription, setTempPostDescription] = useState<OutputData>(null)

  const commentEditorRef = useRef<any>()
  const postEditorRef = useRef<any>()

  const identityCommitment = member ? BigInt(member?.identityCommitment?.toString()) : null

  useEffect(() => {
    if (member && identityCommitment && comments) {
      checkIfCommentsAreEditable()
    }
  }, [member, comments, identityCommitment])

  useEffect(() => {
    // check if checkIfPostIsEditable
    if (member && identityCommitment && post) {
      checkIfPostIsEditable(post.note, post.contentCID)
    }
  }, [member, post, identityCommitment])

  const { validationResult, checkUserBalance } = useValidateUserBalance(community, address)

  const checkIfPostIsEditable = async (note, contentCID) => {
    const userPosting = new Identity(`${address}_${groupId}_${member?.name}`)
    const generatedNote = await createNote(userPosting)
    const generatedNoteAsBigNumber = BigNumber.from(generatedNote).toString()
    const noteBigNumber = BigNumber.from(note).toString()

    setIsPostEditable(noteBigNumber === generatedNoteAsBigNumber)
  }

  const onClickEditPost = async () => {
    const hasSufficientBalance = await checkUserBalance()
    if (!hasSufficientBalance) return
  }

  const deleteItem = async (itemId, itemType: number) => {
    if (itemType !== 0 && itemType !== 1) return toast.error(t('alert.deleteFailed'))
    if (validateRequirements() !== true) return
    setIsLoading(true)
    await fetchIsAdmin()
    if (canDelete) {
      write({
        recklesslySetUnpreparedArgs: [+itemId],
      })
    } else {
      try {
        const { status } =
          itemType === 0
            ? await postInstance?.delete(address, itemId, users, member, groupId, setIsLoading)
            : await commentInstance?.delete(address, itemId, users, member, groupId, setIsLoading)
        if (status === 200) {
          toast.success(t('alert.deleteSuccess'))
          if (itemType === 0) {
            // navigate('../../', { relative: 'path' })
          }
          setIsLoading(false)
        }
      } catch (error) {
        console.log(error)
        toast.error(t('alert.deleteFailed'))
        if (itemType === 0) {
          // navigate('../../', { relative: 'path' })
        }
        setIsLoading(false)
      }
    }
  }

  const clearInput = () => {
    setComment({
      blocks: [],
    })
    commentEditorRef?.current?.clear()
  }

  const validateRequirements = () => {
    if (!address) return toast.error(t('toast.error.notLoggedIn'), { type: 'error', toastId: 'min' })
    if (!member) return toast.error(t('toast.error.notJoined'), { type: 'error', toastId: 'min' })

    return true
  }

  // Helper function for updating the comments map
  const updateCommentMap = (id: string, updates: Partial<CommentsMap[string]>) => {
    setCommentsMap(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...updates,
      },
    }))
  }

  const addComment = async () => {
    if (validateRequirements() !== true) return
    const hasSufficientBalance = await checkUserBalance()
    if (!hasSufficientBalance) return
    let ipfsHash = ''

    try {
      setIsLoading(true)
      const response = await commentInstance?.create(
        comment,
        address,
        users,
        member,
        groupId,
        setIsLoading,
        (comment, cid) => {
          ipfsHash = cid
          setTempComments([
            {
              id: cid,
              createdAt: new Date(),
              content: comment,
            },
            ...tempComments,
          ])
        }
      )

      if (response?.status === 200) {
        clearInput()

        // const newMessage = await getContent(getIpfsHashFromBytes32(signal))
        console.log(response)
        console.log(`Your greeting was posted 🎉`)
        toast.success(t('alert.addCommentSuccess'))
      } else {
        console.log('Some error occurred, please try again!')
        toast.error(t('alert.addCommentFailed'))
      }
    } catch (error) {
      clearInput()
      console.error(error)
      if (error?.message?.includes('ProveReputation_227')) {
        toast.error(t('error.notEnoughReputation'), { toastId: 'notEnoughReputation' })
      } else {
        toast.error(t('alert.addCommentFailed'))
      }

      console.log('Some error occurred, please try again!', error)
    } finally {
      setIsLoading(false)
      setTempComments(prevComments => {
        const tempCommentIndex = prevComments.findIndex(t => t.id === ipfsHash)
        if (tempCommentIndex > -1) {
          const tempCommentsCopy = [...prevComments]
          tempCommentsCopy.splice(tempCommentIndex, 1)
          return tempCommentsCopy
        }
        return prevComments
      })
    }
  }

  const checkIfCommentsAreEditable = async () => {
    for (const c of comments) {
      const note = c?.note
      const contentCID = c?.contentCID
      if (note && contentCID) {
        const noteBigNumber = BigNumber.from(note).toString()
        const userPosting = new Identity(`${address}_${groupId}_${member?.name}`)
        const generatedNote = await createNote(userPosting)
        const generatedNoteAsBigNumber = BigNumber.from(generatedNote).toString()

        if (generatedNoteAsBigNumber === noteBigNumber) {
          setEditableComments(prev => [...prev, c.id])
          updateCommentMap(c.id, {
            comment: { ...(commentsMap[c.id]?.comment || c) },
            isEditable: true,
          })
        }
      }
    }
  }

  const onClickEditComment = comment => {
    updateCommentMap(comment.id, {
      isSaving: false,
      isEditing: true,
    })
  }

  const setOnEditCommentContent = (comment, content) => {
    updateCommentMap(comment.id, {
      comment: { ...comment, content },
    })
  }

  const onClickCancelComment = comment => {
    updateCommentMap(comment.id, {
      isEditing: false,
    })
  }

  const saveEditedPost = async () => {
    if (!postInstance || !address || !member) return
    setIsLoading(true)

    try {
      const { status } = await postInstance.edit(
        { title: tempPostTitle, description: tempPostDescription },
        address,
        post.id,
        member,
        groupId,
        setIsLoading
      )

      if (status === 200) {
        toast.success(t('alert.postEditSuccess'))
        setIsLoading(false)
      }
    } catch (error) {
      console.log(error)
      toast.error(t('alert.editFailed'))
      setIsLoading(false)
    }
  }

  const saveEditedComment = async comment => {
    if (!commentInstance || !address || !member) return
    updateCommentMap(comment.id, {
      isSaving: true,
      comment: { ...comment },
    })
    setIsLoading(true)

    try {
      const { status } = await commentInstance.edit(
        commentsMap[comment.id]?.comment,
        address,
        comment.id,
        member,
        groupId,
        setIsLoading
      )

      if (status === 200) {
        toast.success(t('alert.commentEditSuccess'))
        setIsLoading(false)
        updateCommentMap(comment.id, {
          isSaving: false,
          isEditing: false,
        })
      }
    } catch (error) {
      console.log(error)
      toast.error(t('alert.editFailed'))
      setIsLoading(false)
      updateCommentMap(comment.id, {
        isSaving: false,
      })
    }
  }

  const voteForPost = async (postId, voteType: 0 | 1) => {
    if (!member) return
    const hasSufficientBalance = await checkUserBalance()
    if (!hasSufficientBalance) return
    setIsLoading(true)

    try {
      const { status } = await postInstance?.vote(voteType, address, users, activeUser, postId, groupId)
      console.log(status)

      if (status === 200) {
        setIsLoading(false)
        postInstance?.updatePostsVote(postInstance, postId, voteType, false)
      } else {
        toast(t('alert.voteFailed'))
      }
    } catch (error) {
      console.log(error)
      toast(t('alert.voteFailed'))
      setIsLoading(false)
    }
  }

  const [commentsSortBy, setCommentsSortBy] = useState<SortByOption>('highest')

  const handleCommentsSortChange = (newSortBy: SortByOption) => {
    setCommentsSortBy(newSortBy)
  }

  const CommentActions = ({ comment, canDelete }) => {
    const isEditable = editableComments.includes(comment.id)
    const currentCommentMap = commentsMap[comment.id]
    const isEditing = currentCommentMap?.isEditing
    const commentContent = currentCommentMap?.comment?.content

    return (
      <div className="mt-3 flex flex-row gap-4">
        {comment.id}
        {isEditable && !isEditing && <button onClick={() => onClickEditComment(comment)}>{t('button.edit')}</button>}
        {isEditing && (
          <>
            <CancelButton onClick={() => onClickCancelComment(comment)}>{t('button.cancel')}</CancelButton>
            <PrimaryButton
              disabled={!commentContent || !commentContent.blocks?.length}
              onClick={() => saveEditedComment(comment)}
            >
              {t('button.save')}
            </PrimaryButton>
          </>
        )}
        {(currentCommentMap?.isEditable || canDelete) && !isEditing && (
          <button className="text-small color-[red.500]" onClick={() => deleteItem(comment.id, 1)}>
            {t('button.delete')}
          </button>
        )}
      </div>
    )
  }

  const sortedCommentsData = useItemsSortedByVote(tempComments, comments, commentsSortBy)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const user = useUserIfJoined(groupId as string)
  const unirepUser = useUnirepSignUp({ groupId: groupId, name: (user as User)?.name })
  return (
    <div
      className={clsx(
        'mx-auto h-screen w-full max-w-screen-2xl space-y-4 overflow-y-auto !text-gray-900 sm:p-8 md:p-24'
      )}
    >
      <CommunityCard community={community} index={0} isAdmin={false} variant={'banner'} />

      <PostItem
        post={post}
        address={address as string}
        isPostEditable={isPostEditable}
        setIsFormOpen={setIsFormOpen}
        isFormOpen={isFormOpen}
        voteForPost={voteForPost}
        showDescription={true}
        editor={
          <NewPostForm
            editorId={postInstance.specificPostId(postId)}
            description={tempPostDescription || post?.description}
            setDescription={setTempPostDescription}
            handleSubmit={saveEditedPost}
            editorReference={postEditorRef}
            setTitle={setTempPostTitle}
            resetForm={() => {
              setTempPostDescription(null)
              setTempPostTitle('')
            }}
            isEditable={isPostEditable}
            isReadOnly={false}
            isSubmitting={isLoading}
            title={tempPostTitle || post?.title}
            itemType={'post'}
            handlerType={'edit'}
            formVariant={'default'}
          />
        }
      />

      <NewPostForm
        editorId={`post_comment${groupId}`}
        description={comment}
        setDescription={setComment}
        handleSubmit={addComment}
        editorReference={postEditorRef}
        setTitle={() => {}}
        resetForm={() => setComment(null)}
        isEditable={true}
        isReadOnly={false}
        isSubmitting={isLoading}
        title={''}
        itemType={'comment'}
        handlerType={'new'}
        formVariant={'default'}
        submitButtonText={t('button.comment')}
        placeholder={t('placeholder.comment')}
        openFormButtonText={t('button.comment')}
      />

      {sortedCommentsData.length === 0 && <NoComments />}
      {sortedCommentsData.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="p-4" // Tailwind class for padding
        >
          <div key={c.id} className=" flex flex-col">
            <div
              className={`rounded-md bg-gray-100 p-4 dark:bg-transparent ${
                commentIsConfirmed(c.id) || commentsMap[c?.id]?.isSaving
                  ? 'border border-green-400'
                  : 'border border-red-400'
              }`}
            >
              {c && (
                <div
                  className={`mt-4 ${
                    commentsMap[c?.id]?.isEditing ? 'min-h-[150px] rounded-md border border-solid pl-4' : ''
                  }`}
                >
                  <Editor
                    editorRef={commentEditorRef}
                    holder={'comment' + '_' + c?.id}
                    readOnly={!commentsMap[c?.id]?.isEditing}
                    onChange={val => setOnEditCommentContent(c, val)}
                    placeholder={t('placeholder.enterComment') as string}
                    data={c}
                  />
                  {(identityCommitment || canDelete) && <CommentActions comment={c} canDelete={canDelete} />}
                </div>
              )}
            </div>
            <div className="pt-3 text-gray-500">
              <div
                className="flex gap-3"
                style={{
                  visibility: commentIsConfirmed(c.id) ? 'visible' : 'hidden',
                }}
              >
                <p className="my-auto inline-block text-sm">
                  🕛 {c?.time ? formatDistanceToNow(new Date(c?.time).getTime(), { addSuffix: true }) : '-'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
