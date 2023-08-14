import React, { useState, useRef, useEffect, memo, useMemo } from 'react'
import { Topic } from '@components/Discourse/types'
import parse from 'html-react-parser'
import './topic-post.scss'
import { formatDistanceToNow } from '@/lib/utils'
import _ from 'lodash'
import ReplyToPost from '@components/Discourse/ReplyToPost'
import pluralize from 'pluralize'
import { motion, useAnimation } from 'framer-motion'
import { FingerPrintIcon, HandThumbDownIcon, HandThumbUpIcon } from '@heroicons/react/20/solid'
import { PrimaryButton } from '@components/buttons'
import { useFetchReplies } from '@/hooks/useFetchReplies'

const TopicPosts = ({ topic, onPageChange }: { topic: Topic; onPageChange: (newPage: number) => void }) => {
  const postRefs = useRef<{ [key: number]: React.RefObject<HTMLDivElement> }>({})
  const [targetPostNumber, setTargetPostNumber] = useState<number | null>(null)
  const [postsInView, setPostsInView] = useState([])

  const [posts, setPosts] = useState(topic.post_stream.posts)

  useEffect(() => {
    const filteredPosts = topic.post_stream.posts.filter(post => !post.hidden && !post.deleted_at)
    setPosts(filteredPosts)
  }, [topic])


  const addReplyToPosts = (newPost: Topic['post_stream']['posts'][0]) => {
    setPosts(posts => [...posts, newPost])
  }

  useEffect(() => {
    if (targetPostNumber) {
      const postRef = postRefs.current[targetPostNumber]
      if (postRef && postRef.current) {
        postRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        // handleScrollToPost(targetPostNumber, postRefs)
        setTargetPostNumber(null) // Clear the target post number
      }
    }
  }, [targetPostNumber, topic])

  const controls = useAnimation()

  const { postsWithReplies, loading } = useFetchReplies(posts)

  if (!topic || loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="relative flex w-full">
      <div className="topic-post relative flex w-full flex-col gap-4">

        {postsWithReplies?.map(post => (
          <RenderPost
            key={post.id}
            post={post}
            postRefs={postRefs}
            setPostsInView={setPostsInView}
            controls={controls}
            onPageChange={onPageChange}
            setTargetPostNumber={setTargetPostNumber}
            addToPosts={addReplyToPosts}
          />
        ))}
      </div>
    </div>
  )
}

const StatsBadge = memo(
  ({
    label,
    value,
    icon,
    pluralizeLabel,
  }: {
    label?: string
    value?: string
    icon?: any
    pluralizeLabel?: boolean
  }) => (
    <div className="flex h-full cursor-auto items-center space-x-2 px-2 text-sm">
      {label && <span>{_.startCase(pluralizeLabel ? pluralize(label, value) : label)}</span>}
      {icon}
      {value && <span>{value}</span>}
    </div>
  )
)
StatsBadge.displayName = 'StatsBadge'

const UserInfo = ({ post }) => (
  <div className="mb-4 flex items-center space-x-4">
    <Avatar post={post} size={80} />
    <div className="flex-1">
      <div className="text-lg font-semibold text-gray-500">{_.startCase(post.username)}</div>
      <div className="text-sm text-gray-500">
        {_.startCase(formatDistanceToNow(new Date(post.created_at).getTime()))}
      </div>
    </div>
  </div>
)

const PostContent = ({ post }) => (
  <div className="mt-4 rounded border border-gray-200 bg-gray-100 p-4 transition-colors duration-1000">
    <Cooked post={post} />

    {post?.link_counts?.length > 0 && (
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Links:</h3>
        <ul className="list-inside list-disc space-y-1 text-blue-500">
          {post.link_counts.map((link, linkIndex) => (
            <li key={linkIndex}>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {link.title || link.url}
              </a>
              <span className="px-2 text-sm text-gray-500">({link.clicks} clicks)</span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
)
const RenderPost = ({ post, postRefs, setPostsInView, controls, onPageChange, setTargetPostNumber, addReplyToPosts: addReplyToPosts }) => {
  if (!postRefs.current[post.post_number]) {
    postRefs.current[post.post_number] = React.createRef<HTMLDivElement>()
  }

  const onViewportEnter = async () => {
    setPostsInView(postsInView => [...postsInView, post.post_number])
  }
  const onViewportLeave = async () => {
    setPostsInView(postsInView => postsInView.filter(postInView => postInView !== post.post_number))
  }

  const postRef = postRefs.current[post.post_number]
  const replyToPostRef = post.reply_to_post_number ? postRefs.current[post.reply_to_post_number] : null

  return (
    <motion.div
      id={`post-${post.post_number}`}
      ref={postRefs.current[post.post_number]}
      animate={controls}
      initial={{ backgroundColor: '' }}
      onViewportEnter={onViewportEnter}
      onViewportLeave={onViewportLeave}
      viewport={{
        amount: 0.5,
      }}
      className="mb-16 grid w-full gap-4"
    >
      <div className="relative col-span-4 flex w-full flex-col ">
        <div className="z-10 flex items-center justify-between  rounded-t bg-primary-500 py-1 text-center text-white">
          <StatsBadge label="#" value={post.post_number} icon={<FingerPrintIcon width={20} />} />
          <div className="me-4 flex items-center text-base text-white">
            {_.startCase(formatDistanceToNow(new Date(post.created_at).getTime()))}
          </div>
        </div>
        <div
          id={`post-${post.post_number}`}
          ref={postRef}
          className="relative flex flex-col  border-primary-500 bg-white py-4 shadow-lg"
        >
          <PostHeader
            post={post}
            replyToPostRef={replyToPostRef}
            postRefs={postRefs}
            onPageChange={onPageChange}
            setTargetPostNumber={setTargetPostNumber}
          />
          <PostContent post={post} />
          <div className={'mt-4 flex w-full justify-between'}>
            <div />
            <ReplyToPost post={post} addReplyToPosts={addReplyToPosts} />
          </div>
        </div>
        <PostFooter post={post} />
      </div>
    </motion.div>
  )
}

const PostFooter = ({ post }) => (
  <div className="z-10 flex w-full items-center rounded-b bg-graySlate-800 px-3 py-1 text-white sm:justify-start md:justify-center">
    <div className="flex items-center space-x-2">
      <StatsBadge label="score" value={post.score.toString()} />
      <StatsBadge label="reads" value={post.reads.toString()} />
      <StatsBadge pluralizeLabel label={'Reply'} value={post.reply_count.toString()} />
    </div>

    <div className={'absolute right-0 mx-2 flex gap-4 self-end justify-self-end'}>
      <PrimaryButton resetClasses disabled>
        <HandThumbUpIcon width={20} />
      </PrimaryButton>

      <PrimaryButton resetClasses disabled>
        <HandThumbDownIcon width={20} />
      </PrimaryButton>
    </div>
  </div>
)


const LinkedPostButton = ({ postNumber, onPageChange, setTargetPostNumber }) => (
  <button
    className="rounded-full border text-xs hover:bg-gray-700 hover:text-white"
    onClick={() => {
      const page = Math.ceil(postNumber / 20) - 1
      onPageChange(page)
      setTargetPostNumber(postNumber)
    }}
  >
    <StatsBadge value={postNumber} />
  </button>
)

const PostHeader = ({ post, replyToPostRef, postRefs, onPageChange, setTargetPostNumber }) => (
  <header className="mb-4 flex w-full justify-between">
    {post.reply_to_post_number ? (
      <div className="flex gap-2">
        Reply to:
        <LinkedPostButton
          postNumber={post.reply_to_post_number}
          postRefs={replyToPostRef || postRefs}
          onPageChange={onPageChange}
          setTargetPostNumber={setTargetPostNumber}
        />
      </div>
    ) : (
      <UserInfo post={post} />
    )}

    {post?.replies?.length > 0 && (
      <div className="flex items-center gap-2 justify-self-end ">
        Replies:
        {post.replies.map(reply => (
          <LinkedPostButton
            key={`${post.id}-${reply.id}`}
            postNumber={reply.post_number}
            setTargetPostNumber={setTargetPostNumber}
            onPageChange={onPageChange}
          />
        ))}
      </div>
    )}
  </header>
)

function Avatar({ post, size }: { post: Topic['post_stream']['posts'][0]; size?: number }) {
  return post.avatar_template ? (
    <img
      className="rounded-full"
      src={`https://sea1.discourse-cdn.com/basic10${post.avatar_template.replace(
        '{size}',
        size ? size.toString() : '90'
      )}`}
      alt={post.username}
    />
  ) : (
    <div className="h-16 w-16 rounded-full bg-gray-500" />
  )
}

function Cooked(props: { post: any }) {
  return <span className="cooked text-base leading-normal">{parse(props.post.cooked)}</span>
}

export default TopicPosts
