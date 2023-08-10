import { forumContract } from '@/constant/const'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import _ from 'lodash'
import { Item } from '@/types/contract/ForumInterface'
import { formatDistanceToNow, getContent, getIpfsHashFromBytes32 } from '@/lib/utils'
import { PollType } from '@/lib/model'
import { PrimaryButton, VoteDownButton, VoteUpButton } from './buttons'
import { useUserIfJoined } from '@/contexts/CommunityProvider'
import { BigNumber } from 'ethers'
import { usePoll } from '@/hooks/usePoll'
import { toast } from 'react-toastify'

interface PollItemProps {
  post: Item
  address: string
  voteForPost: (postId: number, vote: number) => Promise<void>
}

const PollItem = ({ post, address, voteForPost }: PollItemProps) => {
  const router = useRouter()
  const { postId, groupId } = router.query
  const isJoined = useUserIfJoined(groupId as string)

  const onPostPage = !isNaN(postId)
  const { id, title, upvote, downvote, createdAt } = post
  const isPreview = isNaN(postId)
  const [isLoading, setIsLoading] = React.useState(false)
  const [answers, setAnswers] = React.useState([])
  const [results, setResults] = React.useState([])
  const [pollType, setPollType] = React.useState(PollType.SINGLE_ANSWER)
  const [pollExpiresAt, setPollExpiresAt] = React.useState(0)
  const [duration, setDuration] = React.useState(0) // in hours
  const [pollExpired, setPollExpired] = React.useState(true)
  const [answersToSubmit, setAnswersToSubmit] = React.useState([])
  const [range, setRange] = React.useState({ from: 0, to: 0 })

  const { submitPoll } = usePoll({ groupId })
  useEffect(() => {
    fetchPollDetails()
  }, [id])

  const fetchPollDetails = async () => {
    forumContract.pollAt(id).then(async res => {
      console.log(res)
      const { answerCIDs, pollType, duration, startTime, answerCount, rateScaleFrom, rateScaleTo, results } = res
      const pollExpiration = (Number(startTime) + duration * 60 * 60) * 1000
      setDuration(duration)
      setPollExpiresAt(pollExpiration)
      setPollType(pollType)
      setPollExpired(pollExpiration < Date.now())
      setRange({ from: Number(rateScaleFrom), to: Number(rateScaleTo) })
      const answersFromIPFS = await Promise.all(
        answerCIDs.map(async cid => {
          return await getContent(getIpfsHashFromBytes32(cid))
        })
      )
      setAnswersToSubmit(new Array(Number(answerCount)).fill(0))
      setResults(() => {
        const emptyArray = new Array(Number(answerCount)).fill(0)
        results.forEach((result, index) => {
          emptyArray[index] = Number(result)
        })
        return emptyArray
      })
      setAnswers(answersFromIPFS)
    })
  }

  const handleVote = async (e, vote: 'upvote' | 'downvote') => {
    e.stopPropagation()
    e.preventDefault()
    if (isNaN(id)) {
      throw new Error('postId is undefined, upvote')
      return false
    }
    setIsLoading(true)
    const val = vote === 'upvote' ? 0 : 1
    const voteResponse = await voteForPost(BigNumber.from(id).toNumber(), val)
    if (voteResponse) {
      console.log('voteResponse', voteResponse)
    }
    setIsLoading(false)
  }

  const onSubmitPoll = () => {
    setIsLoading(true);
    submitPoll(
      id,
      answersToSubmit,
      async data => {
        console.log(data);
        await fetchPollDetails();
        setIsLoading(false);
        toast.success('Poll submitted successfully')
      },
      err => {
        setIsLoading(false)
        toast.error(err?.message ?? err)
      }
    )
  }

  const isVoteDisabled = () => {
    if (pollType == PollType.SINGLE_ANSWER || pollType == PollType.MULTI_ANSWER) {
      return !answersToSubmit.some(answer => answer >= 1)
    } else {
      return !answersToSubmit.every(answer => answer >= range.from && answer <= range.to)
    }
  }

  return (
    <div className="relative mx-auto flex w-full items-stretch justify-between overflow-hidden rounded border  bg-gray-100 ">
      <div className="w-full bg-gray-50">
        <div className="border-r px-4 py-2">
          <div>
            <Link
              className="text-2xl font-semibold text-gray-800 hover:text-blue-500"
              href={router.asPath + `/post/${id}`}
              onClick={e => {
                if (onPostPage) {
                  e.preventDefault()
                  return false
                }
              }}
            >
              {_.startCase(title)} - {id}
            </Link>
            <div className="text-sm text-gray-400">{createdAt && formatDistanceToNow(new Date(createdAt))}</div>
          </div>
        </div>
        <div className="border-t bg-gray-100 px-4 py-2 text-black">
          {/* {showDescription && !isFormOpen && postId && (
            <EditorJsRenderer data={post.description} onlyPreview={isPreview} />
          )} */}
          <div className="justify-left flex flex-col justify-items-center">
            {pollType == PollType.SINGLE_ANSWER &&
              answers.map((answer, i) => (
                <div key={`${post.id}_${i}`} className="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]">
                  <input
                    disabled={pollExpired}
                    className="checked:border-primary checked:after:border-primary checked:after:bg-primary checked:focus:border-primary dark:checked:border-primary dark:checked:after:border-primary dark:checked:after:bg-primary dark:checked:focus:border-primary relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                    type="radio"
                    id={`inlineRadioOptions_${post.id}_${i}`}
                    name={`inlineRadioOptions_${post.id}_${i}`}
                    checked={answersToSubmit[i] === 1}
                    onChange={() => {
                      setAnswersToSubmit(prev => {
                        const newAnswers = [...prev.fill(0)]
                        newAnswers[i] = 1
                        return [...newAnswers]
                      })
                    }}
                    value={answer}
                  />
                  <label className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer">
                    {answer} <span className="text-sm text-gray-500">{`(${Number(results[i])} Votes)`}</span>
                  </label>
                </div>
              ))}

            {pollType == PollType.MULTI_ANSWER &&
              answers.map((answer, i) => (
                <div key={`${post.id}_${i}`} className="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]">
                  <input
                    disabled={pollExpired}
                    className="checked:border-primary checked:bg-primary dark:checked:border-primary dark:checked:bg-primary relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                    type="checkbox"
                    id={`inlineCheckboxOptions_${post.id}_${i}`}
                    checked={answersToSubmit[i] === 1}
                    onChange={() => {
                      setAnswersToSubmit(prev => {
                        const newAnswers = [...prev]
                        newAnswers[i] = 1
                        return newAnswers
                      })
                    }}
                  />
                  <label className="inline-block pl-[0.15rem] hover:cursor-pointer">
                    {answer} <span className="text-sm text-gray-500">{`(${Number(results[i])} Votes)`}</span>{' '}
                  </label>
                </div>
              ))}
          </div>
          {pollType == PollType.NUMERIC_RATING &&
            answers.map((answer, i) => (
              <div key={`${post.id}_${i}`} className="text-md my-2 flex flex-row items-center gap-2 text-gray-900">
                <div className="w-80">
                  {answer} <span className="text-sm text-gray-500">{`(${Number(results[i])} Weightage)`}</span>
                </div>
                {!pollExpired && (
                  <input
                    disabled={pollExpired}
                    type="number"
                    min={range.from}
                    max={range.to}
                    onChange={e => {
                      setAnswersToSubmit(prev => {
                        const newAnswers = [...prev]
                        newAnswers[i] = e.target.value
                        return newAnswers
                      })
                    }}
                    placeholder={`Range: ${range.from} - ${range.to}`}
                    className="relative w-60 rounded border-0 bg-white px-2 py-1 text-sm text-slate-600 placeholder-slate-300 shadow outline-none focus:outline-none focus:ring"
                  />
                )}
              </div>
            ))}
          {!pollExpired && (
            <PrimaryButton
              className="mt-3 mr-1 rounded bg-green-500 px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-green-600"
              type="button"
              isLoading={isLoading}
              onClick={onSubmitPoll}
              disabled={isVoteDisabled()}
            >
              Vote
            </PrimaryButton>
          )}

          <br />
          {isPreview
            ? (post?.childIds?.length && <span className="text-gray-600">{post?.childIds?.length} comments</span>) || (
                <span className="text-gray-600">0 comments</span>
              )
            : ''}

          {/* <div className={'text-sm text-gray-900'}>{editor && isPostEditable && editor}</div> */}
        </div>
      </div>

      <div className={'sticky top-0 mx-5  flex items-center justify-around self-start'}>
        <div className={'flex items-center gap-1 pe-2'}>
          <VoteUpButton
            isConnected={!!address}
            isJoined={!!isJoined}
            isLoading={isLoading}
            onClick={e => handleVote(e, 'upvote')}
            disabled={isLoading || !address}
          />
          <span className=" font-bold text-gray-700">{upvote}</span>
        </div>
        <div className={'mb-1 flex items-center gap-1 pe-2'}>
          <VoteDownButton
            isConnected={!!address}
            isJoined={!!isJoined}
            isLoading={isLoading}
            onClick={e => handleVote(e, 'downvote')}
            disabled={isLoading || !address}
          />
          <span className="font-bold text-gray-700">{downvote}</span>
        </div>
      </div>
    </div>
  )
}

export default PollItem
