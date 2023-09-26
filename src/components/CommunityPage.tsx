import React, { useRef, useState } from 'react'
import { Post } from '@/lib/post'
import { useActiveUser, useUserIfJoined, useUsers } from '@/contexts/CommunityProvider'
import { useAccount } from 'wagmi'
import { useTranslation } from 'react-i18next'
import SortBy, { SortByOption } from '@components/SortBy'
import { useUnirepSignUp } from '@/hooks/useUnirepSignup'
import { User } from '@/lib/model'
import { useValidateUserBalance } from '@/utils/useValidateUserBalance'
import { useLoaderContext } from '@/contexts/LoaderContext'
import { toast } from 'react-toastify'
import { useItemsSortedByVote } from '@/hooks/useItemsSortedByVote'
import clsx from 'clsx'
import { NewPostForm } from '@components/NewPostForm'
import { PostList } from '@components/Post/postList'
import { NoPosts } from '@components/Post/NoPosts'
import { Group, Item } from '@/types/contract/ForumInterface'
import CreatePollUI from './CreatePollUI'
import ReputationCard from '@components/ReputationCard'
import { useContentManagement } from '@/hooks/useContentManagement'
import { CommunityActionTabs } from '@components/CommunityActionTabs'
import { CommunityCardHeader, CommunityLogo } from '@components/CommunityCard/CommunityCardHeader'
import { CommunityCardContext } from '@components/CommunityCard/CommunityCard'
import EditGroupNavigationButton, { useCheckIsOwner } from '@components/EditGroupNavigationButton'
import { Avatar } from '@components/Avatar'
import Image from 'next/image'
import { useValidatedImage } from '@components/CommunityCard/UseValidatedImage'

export function CommunityPage({
  children,
  postInstance,
  community,
  posts,
  post,
}: {
  children?: React.ReactNode
  postId: string | undefined
  community: Group
  posts?: Item[]
  post?: Item
  postInstance: Post
}) {
  const groupId = postInstance.groupId
  const user = useUserIfJoined(groupId as string)
  useUnirepSignUp({ groupId: groupId, name: (user as User)?.name })
  const activeUser = useActiveUser({ groupId })
  const { address } = useAccount()
  const users = useUsers()
  const { t } = useTranslation()

  const [sortBy, setSortBy] = useState<SortByOption>('highest')

  const { checkUserBalance } = useValidateUserBalance(community, address)
  const { setIsLoading, isLoading: isContextLoading } = useLoaderContext()
  const postEditorRef = useRef<any>()

  const validateRequirements = () => {
    if (!address) return toast.error(t('alert.connectWallet'), { toastId: 'connectWallet' })
    if (!user) return toast.error(t('toast.error.notJoined'), { type: 'error', toastId: 'min' })

    return true
  }

  const { contentDescription, setContentDescription, tempContents, contentTitle, setTempContents, setContentTitle } =
    useContentManagement({
      isPost: true,
      defaultContentDescription: post?.description,
      defaultContentTitle: post?.title,
    })

  const addPost: () => Promise<void> = async () => {
    if (validateRequirements() !== true) return

    if (!contentTitle || !contentDescription) {
      console.log('Please enter a title and description')
      toast.error('Please enter a title and description', { toastId: 'missingTitleOrDesc' })
      return
    }

    let ipfsHash

    const hasSufficientBalance = await checkUserBalance()
    if (!hasSufficientBalance) return

    setIsLoading(true)

    try {
      const { status } = await postInstance?.create(
        {
          title: contentTitle,
          description: contentDescription,
        },
        address,
        users,
        activeUser,
        groupId as string,
        setIsLoading,
        (post, cid) => {
          ipfsHash = cid
          setTempContents([
            {
              id: cid,
              ...post,
            },
            ...tempContents,
          ])
        }
      )

      if (status === 200) {
        clearInput()
        setIsLoading(false)
      } else {
        setIsLoading(false)
        console.log('Some error occurred, please try again!')
      }
    } catch (error) {
      console.log('Some error occurred, please try again!', error)
      setIsLoading(false)

      // toast({
    } finally {
      // setLoading.off()
      setTempContents(prevPosts => {
        const tempPostIndex = prevPosts.findIndex(t => t.id === ipfsHash)
        if (tempPostIndex > -1) {
          const tempPostsCopy = [...prevPosts]
          tempPostsCopy.splice(tempPostIndex, 1)
          return tempPostsCopy
        }
      })
    }
  }

  const handleSortChange = (newSortBy: SortByOption) => {
    setSortBy(newSortBy)
  }

  const sortedData = useItemsSortedByVote(tempContents, posts, sortBy)

  const clearInput = isEdit => {
    if (isEdit) {
      // setPostEditing(false)
      setContentTitle(post?.title)
      setContentDescription(post?.description)
      return
    } else {
      setContentTitle('')
      setContentDescription(undefined)
      postEditorRef?.current?.clear?.()
    }
  }

  const bannerSrc = useValidatedImage(community?.groupDetails?.bannerCID)

  return (
    <CommunityCardContext.Provider value={community}>
      <Image
          src={bannerSrc}
          alt={'community Banner Image'}
          width={500}
          height={500}
          unoptimized
          priority
      />
      <div className={clsx('h-fit min-h-screen !text-gray-900 ')}>
        <div className={'group relative flex flex-col'}>

          <div className={'relative z-50'}>
            <EditGroupNavigationButton community={community} />
          </div>

          <div className={'relative flex  w-full items-center gap-4'}>
            <CommunityLogo />
            {community.groupDetails.description}
          </div>

          <CommunityActionTabs
            defaultTab={'chat'}
            tabs={{
              chat: {
                hidden: false,
                onClick: () => {},
                panel: (
                  <>
                    <div className={'relative col-span-10 flex items-center gap-4'}>
                      <CreatePollUI groupId={groupId} />
                      <NewPostForm
                        editorId={`${groupId}_post`}
                        submitButtonText={t('button.submit') as string}
                        openFormButtonText={t('button.newPost') as string}
                        description={contentDescription}
                        setDescription={setContentDescription}
                        handleSubmit={addPost}
                        editorReference={postEditorRef}
                        showButtonWhenFormOpen={true}
                        setTitle={setContentTitle}
                        resetForm={() => clearInput(true)}
                        isReadOnly={false}
                        isSubmitting={isContextLoading}
                        title={contentTitle as string}
                        isEditable={true}
                        itemType={'post'}
                        actionType={'new'}
                        classes={{
                          rootClosed: '!w-fit !p-0',
                          rootOpen:
                            'fixed z-50 inset-0  p-12 bg-gray-900 bg-opacity-50 flex justify-center items-center ',
                          formBody: 'w-full h-full  flex flex-col gap-4',
                          editor: 'border  rounded py-1 px-2 bg-white',
                          submitButton: 'bg-green-500 text-white border-none rounded',
                          formContainerOpen: 'bg-white p-4 border border-gray-300 rounded shadow-lg w-full  max-w-3xl ',
                          openFormButtonOpen: 'self-end bg-primary-500 text-white hidden',
                        }}
                      />
                      <div className={'flex-grow'} />
                      <SortBy onSortChange={handleSortChange} targetType="posts" />
                    </div>
                    <PostList posts={sortedData} />
                    {sortedData?.length === 0 && <NoPosts />}
                  </>
                ),
              },
              community: {
                hidden: true,
                onClick: () => {},
                panel: <div className={'w-1/2'}>Not needed on community page</div>,
              },
              gas: {
                hidden: true,
                onClick: () => {},
                panel: (
                  <div className={'flex w-1/2'}>
                    <ReputationCard />
                  </div>
                ),
              },
            }}
          />

          {children}
        </div>
      </div>
    </CommunityCardContext.Provider>
  )
}

export const PostNavigator = ({
  posts,
  visiblePostIds,
  scrollIntoView,
}: {
  posts: Item[]
  visiblePostIds: Item['id'][]
  scrollIntoView: (id) => void
}) => {
  return (
    <>
      <div
        className={
          'sticky top-24 flex select-none flex-col gap-4 rounded  '
        }
      >
        <div className={'text-base font-bold '}>Posts</div>

        <ul className={'flex flex-col gap-4'}>
          {posts.map(post => {
            return (
              <button
                onClick={() => scrollIntoView(post.id)}
                key={post.id}
                className={clsx(
                  'border-b text-left text-sm  font-bold hover:cursor-pointer',
                  visiblePostIds.includes(post.id) && 'text-primary-600'
                )}
              >
                {post.title}
              </button>
            )
          })}
        </ul>
      </div>
    </>
  )
}
