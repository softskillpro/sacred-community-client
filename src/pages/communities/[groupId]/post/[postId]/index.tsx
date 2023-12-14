import React, { useEffect } from 'react'
import { Post } from '@/lib/post'
import { ActionType, useCommunityContext } from '@/contexts/CommunityProvider'
import { PostPage } from '@components/Post/PostPage'
import useSWR from 'swr'
import fetcher, { GroupPostCommentAPI } from '@/lib/fetcher'
import { useRouter } from 'next/router'
import LoadingComponent from '@components/LoadingComponent'
import { CommentClass } from '@/lib/comment'
import { useCheckIfUserIsAdminOrModerator } from '@/hooks/useCheckIfUserIsAdminOrModerator'

function PostIndex() {
  const { dispatch } = useCommunityContext()
  const router = useRouter()
  const { groupId, postId } = router.query

  const { data, error, isLoading } = useSWR(
    GroupPostCommentAPI(groupId, postId),
    fetcher
  )
  useCheckIfUserIsAdminOrModerator(true)

  useEffect(() => {
    const { group, post, comments } = data || {}
    if (!group || !post || !comments) {
      return
    }
    dispatch({
      type: ActionType.SET_ACTIVE_COMMUNITY,
      payload: {
        community: group,
        postList: [post],
      },
    })
    dispatch({
      type: ActionType.SET_ACTIVE_POST,
      payload: {
        community: group,
        post: post,
        comments: comments,
      },
    })
  }, [data])

  if (error) {
    return <div>Error: {error.message}</div>
  }
  if (!data || isLoading) {
    return <LoadingComponent />
  }

  const { group, post, comments } = data
  const postInstance = new Post(post.id, group.groupId)
  const commentInstance = new CommentClass(group.groupId, post.id, null)
  return (
    <PostPage
      postInstance={postInstance}
      post={post}
      community={group}
      comments={comments}
      commentInstance={commentInstance}
    />
  )
}

export default PostIndex
