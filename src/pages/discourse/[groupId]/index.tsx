import React, { useEffect } from 'react'
import WithStandardLayout from '@components/HOC/WithStandardLayout'
import { useRouter } from 'next/router'
import TopicCommunityCard from '@components/Discourse/TopicCommunityCard'
import clsx from 'clsx'
import TopicPosts from '@components/Discourse/TopicPosts'
import { Topic } from '@components/Discourse/types'
import { useCommunityContext } from '@/contexts/CommunityProvider'
import useSWR from 'swr'
import fetcher, { getDiscourseData, getGroupWithPostData } from '@/lib/fetcher'
import PostToTopic from '@components/Discourse/PostToTopic'

const Index = ({ topic }: { topic: Topic }) => {
  const router = useRouter()
  const { groupId } = router.query
  const { data, error, isValidating, isLoading } = useSWR<Topic>(getDiscourseData(groupId), fetcher)
  const { dispatch } = useCommunityContext()

  useEffect(() => {
    if (data && !isValidating && !error) {
      console.log('data', data)
      dispatch({
        type: 'SET_ACTIVE_COMMUNITY',
        payload: {
          community: data,
        },
      })
    }
  }, [data, isValidating])


  if (isLoading) return <div>Loading...</div>
  return (
    <div className={clsx('mx-auto mb-64 w-full max-w-screen-xl  sm:p-8 md:p-24 ')}>
      <div className="flex flex-col space-y-4">
        {data && <TopicCommunityCard topic={data} variant={'banner'} />}
        {data && <PostToTopic topic={data} />}
        <div className={' h flex items-center justify-between'}>{data && <TopicPosts topic={data} />}</div>
      </div>
    </div>
  )
}

export default WithStandardLayout(Index)
