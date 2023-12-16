import type { Dispatch, SetStateAction } from 'react'
import React, { useState } from 'react'
import { Post } from '@/lib/post'
import {
  useActiveUser,
  useCommunityContext,
  useUserIfJoined,
  useUsers,
} from '@/contexts/CommunityProvider'
import { useAccount } from 'wagmi'
import { useTranslation } from 'react-i18next'
import type { SortByOption } from '@components/SortBy'
import { useValidateUserBalance } from '@/utils/useValidateUserBalance'
import { toast } from 'react-toastify'
import { useItemsSortedByVote } from '@/hooks/useItemsSortedByVote'
import type { NewPostFormProps } from '@components/NewPostForm'
import { NewPostForm } from '@components/NewPostForm'
import { PostList } from '@components/Post/PostList'
import type { Group, Item } from '@/types/contract/ForumInterface'
import CreatePollUI from './CreatePollUI'
import { useContentManagement } from '@/hooks/useContentManagement'
import { NewPostModal } from '@components/Post/PostComments'
import LoadingComponent from '@components/LoadingComponent'
import { CommunityCard } from './CommunityCard/CommunityCard'
import type { User } from '@/lib/model'
import { ShowConnectIfNotConnected } from '@components/Connect/ConnectWallet'

export function CommunityPage({
  community,
  posts,
  refreshData,
}: {
  community: Group
  posts?: Item[]
  refreshData?: () => void
}) {
  const [sortBy, setSortBy] = useState<SortByOption>('highest')

  const sortedData = useItemsSortedByVote([], posts, sortBy)
  const {
    state: { isAdmin },
  } = useCommunityContext()

  if (!community) {
    return <LoadingComponent />
  }

  return (
    <div>
      <div className="relative flex min-h-screen gap-6 rounded-lg  p-6 transition-colors ">
        <div className="sticky top-0 flex w-full flex-col gap-6">
          <CommunityCard
            variant="banner"
            community={community}
            isAdmin={isAdmin}
          />

          <div className="flex w-fit gap-4 rounded-lg ">
            <ShowConnectIfNotConnected>
              <CreatePollUI group={community} onSuccess={refreshData} />
              <CreatePostUI group={community} onSuccess={refreshData} />
            </ShowConnectIfNotConnected>
          </div>
          <PostList
            posts={sortedData}
            group={community}
            refreshData={refreshData}
          />
        </div>
      </div>
    </div>
  )
}

const CreatePostUI = ({
  group,
  onSuccess,
}: {
  group: Group
  onSuccess?: () => void
}) => {
  const groupId = group.groupId
  const user = useUserIfJoined(group.id.toString())
  const activeUser = useActiveUser({ groupId: group.id.toString() })
  const { t } = useTranslation()
  const { address } = useAccount()
  const { checkUserBalance } = useValidateUserBalance(group, address)
  const users = useUsers()
  const postInstance = group && new Post(undefined, group.id.toString())

  const [isLoading, setIsLoading] = useState(false)

  const validateRequirements = () => {
    if (!address) {
      return toast.error(t('alert.connectWallet'), { toastId: 'connectWallet' })
    }
    if (!user) {
      return toast.error(t('toast.error.notJoined'), {
        type: 'error',
        toastId: 'min',
      })
    }

    return true
  }

  const {
    contentDescription,
    setContentDescription,
    contentTitle,
    setContentTitle,
    clearContent,
  } = useContentManagement({
    isPostOrPoll: true,
    defaultContentDescription: undefined,
    defaultContentTitle: undefined,
  })

  const addPost: () => Promise<void> = async () => {
    if (validateRequirements() !== true) {
      return
    }

    if (!contentTitle || !contentDescription) {
      console.log('Please enter a title and description')
      toast.error('Please enter a title and description', {
        toastId: 'missingTitleOrDesc',
      })
      return
    }

    const hasSufficientBalance = await checkUserBalance()
    if (!hasSufficientBalance) {
      return
    }

    setIsLoading(true)

    try {
      if (postInstance === undefined) {
        return
      }
      const response = await postInstance?.create({
        postContent: {
          title: contentTitle,
          description: contentDescription,
        },
        address: address,
        users: users,
        postedByUser: activeUser as User,
        groupId: groupId as string,
        setWaiting: setIsLoading,
        onIPFSUploadSuccess: post => {
          console.log('post', post)
        },
      })
      try {
        if (response?.status === 200) {
          setIsLoading(false)
          clearContent()
          onSuccess && onSuccess()
          console.log('post created successfully')
        } else {
          console.log('error', response)
          setIsLoading(false)
        }
      } catch (error) {
        console.log('error', error)
        setIsLoading(false)
      }
    } catch (error) {
      console.log('error', error)
      setIsLoading(false)
    }
  }

  const propsForNewPost: NewPostFormProps = {
    editorId: `${groupId}_post`,
    submitButtonText: t('button.submit') as string,
    openFormButtonText: t('button.newPost') as string,
    description: contentDescription,
    setDescription: setContentDescription,
    handleSubmit: addPost,
    showButtonWhenFormOpen: false,
    setTitle: setContentTitle as Dispatch<SetStateAction<string | null>>,
    resetForm: () => {},
    isReadOnly: false,
    isSubmitting: isLoading,
    title: contentTitle as string,
    isEditable: true,
    itemType: 'post',
    actionType: 'new',
    classes: NewPostModal,
  }

  return <NewPostForm {...propsForNewPost} />
}
