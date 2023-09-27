import { useEffect, useState } from 'react'

export const useFetchRepliesForPosts = posts => {
  const [postsWithReplies, setPostsWithReplies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReplies = async () => {
      console.log('original posts', posts)
      if (!posts) return
      try {
        const postsWithReplyCount = posts.filter(post => !post.hidden && !post.deleted_at && post.reply_count > 0)
        const fetchRepliesPromises = postsWithReplyCount.map(post =>
            fetch(`/api/discourse/${post.id}/replies`).then(res => res.json())
        )
        const repliesArrays = await Promise.all(fetchRepliesPromises)
        repliesArrays.forEach((replies, index) => {
          postsWithReplyCount[index].replies = replies
        })
        const mergedPosts = posts.map(post => {
          const updatedPost = postsWithReplyCount.find(p => p.id === post.id)
          return updatedPost || post
        })
        console.log(mergedPosts)
        setPostsWithReplies(mergedPosts)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchReplies()
  }, [posts])

  return { postsWithReplies, loading, error }
}
