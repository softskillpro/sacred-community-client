import { BigNumber } from 'ethers'
import HomePage from '../components/HomePage'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import useSWR from 'swr'
import { useCommunityContext } from '@/contexts/CommunityProvider'
import { useCheckIfUserIsAdminOrModerator } from '@/hooks/useCheckIfUserIsAdminOrModerator'
import { useAccount } from 'wagmi'

function Home({ communitiesData, users, discourseCommunities }) {
  const router = useRouter()
  const pageRef = React.useRef(null);
  const { address } = useAccount()
  const { isAdmin, isModerator } = useCheckIfUserIsAdminOrModerator(address, true)

  useEffect(() => {
    if (pageRef.current) {
      pageRef.current.scrollIntoView({ behavior: 'smooth' })
      console.log('scrolling to top')
    }
  }, [router.pathname])

  const { data, error, isLoading } = useSWR('/api/data')
  console.log(data)
  const { dispatch } = useCommunityContext()

  useEffect(() => {
    if (!data) return
    const { communitiesData, users } = data

    if (!communitiesData || !users) return
    // convert id back to bignumber
    dispatch({ type: 'SET_COMMUNITIES', payload: communitiesData.map(c => ({ ...c, id: BigNumber.from(c.id) })) })
    dispatch({
      type: 'SET_USERS',
      payload: users,
    })
  }, [data])

  if (error) {
    return <div>Error: {error.message}</div>
  }
  // if (!communitiesData) return <LoadingComponent/>
  return <HomePage isAdmin={isAdmin || isModerator || false} discourseCommunities={discourseCommunities} />
}

export const getServerSideProps = async () => {
  const data = await axios.get(process.env.NEXT_PUBLIC_DISCOURSE_GOOGLE_SHEET_API_URL as string)
  return {
    props: {
      discourseCommunities: data.data?.communities,
    },
  }
}

export default Home
