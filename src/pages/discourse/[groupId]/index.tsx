import React, { useEffect, useState } from 'react'
import TopicCommunityCard from '@/components/Discourse/TopicCommunityCard'
import { TopicList } from '@/components/Discourse/types'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useFetchMetadata } from '@/hooks/discourse/useFetchMetadata'
import { CircularLoader } from '@/components/JoinCommunityButton'
import _ from 'lodash'

export const DiscourseCommunityBanner = (loading, community) => (
  (<div className="mx-0 my-4 w-auto rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
    {loading ? (
      <CircularLoader className="mx-auto my-5 h-8 w-8" />
    ) : (
      <>
        <img className="m-auto h-[10%] w-[10%] rounded-t-lg pt-2" src={community?.image} alt="" />
        <div className="p-3 text-center">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{community?.name}</h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{community?.description}</p>
        </div>
      </>
    )}
  </div>
))

const Index = () => {
  const [topicList, setTopicList] = useState<TopicList>()
  const router = useRouter()
  const { groupId } = router.query
  const { community, loading } = useFetchMetadata(groupId)

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get(`/api/discourse/${groupId}/topics`)
        setTopicList(response.data.topic_list)
      } catch (error) {
        console.error(error)
      }
    }
    fetchTopics()
  }, [])

  return (
    <>
      {DiscourseCommunityBanner(loading, community)}
      <div className='flex flex-wrap gap-4 xs:justify-center md:justify-start'>
        {topicList?.topics?.map(topic => (
          <TopicCommunityCard key={topic.id} topic={topic} variant={'default'} />
        ))}
      </div>

    </>
  )
}

export default Index

