import React, { useCallback } from 'react'
import clsx from 'clsx'
import { classes } from '@/styles/classes'
import { PlusIcon, TrashIcon } from '@heroicons/react/20/solid'
import { PollType } from '@/lib/model'
import { usePoll } from '@/hooks/usePoll'
import { toast } from 'react-toastify'
import { PrimaryButton } from './buttons'
import dynamic from 'next/dynamic'
import { debounce } from 'lodash'
import { OutputData } from '@editorjs/editorjs'
const Editor = dynamic(() => import('./editor-js/Editor'), {
  ssr: false,
})

interface CreatePollUIProps {
  groupId: string
}

const CreatePollUI = ({ groupId }: CreatePollUIProps) => {
  const [showModal, setShowModal] = React.useState(false)
  const [title, setTitle] = React.useState('Do you like this poll?')
  const [description, setDescription] = React.useState<OutputData | null>(null)
  const [pollType, setPollType] = React.useState(0)
  const [duration, setDuration] = React.useState(168)
  const [rateScaleFrom, setRateScaleFrom] = React.useState(0)
  const [rateScaleTo, setRateScaleTo] = React.useState(0)
  const editorReference = React.useRef(null)

  const [options, setOptions] = React.useState(['Yes', 'No'])
  const [loading, setLoading] = React.useState(false)

  const { createPoll } = usePoll({ groupId })
  const pollTypes = [
    {
      name: PollType.SINGLE_ANSWER.toString(),
      label: 'Single Answer',
      value: 0,
    },
    {
      name: PollType.MULTI_ANSWER.toString(),
      label: 'Multi Answer',
      value: 1,
    },
    {
      name: PollType.NUMERIC_RATING.toString(),
      label: 'Numeric Rating',
      value: 2,
    },
  ]

  const submit = async () => {
    setLoading(true)
    try {
      await createPoll(
        {
          title,
          description,
        },
        pollType,
        duration,
        options,
        pollType == PollType.NUMERIC_RATING ? rateScaleFrom : 0,
        pollType == PollType.NUMERIC_RATING ? rateScaleTo : 0,
        () => {
          toast.success('Poll created successfully')
          setLoading(false)
          setShowModal(false)
        },
        err => {
          toast.error(err)
          setLoading(false)
        }
      )
    } catch (error) {
      toast.error(error?.message ?? error)

      setLoading(false)
    }
  }
  const debouncedSetDescription = useCallback(debounce(setDescription, 300), [])

  const disableSave = () => {
    if (!title || !duration || options.some(option => !option)) {
      return true
    }
  }
  return (
    <>
      <PrimaryButton
        className={clsx(
          'w-fit',
          'border-gray-500 border text-sm text-gray-500 transition-colors duration-150 hover:bg-gray-500 hover:text-white'
        )}
        type="button"
        onClick={() => setShowModal(true)}
      >
        Create Poll
      </PrimaryButton>
      {showModal ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
            <div className="relative   w-[70%] max-w-6xl">
              {/*content*/}
              <div className="relative flex w-full flex-col rounded border-0 bg-white shadow-lg outline-none focus:outline-none dark:bg-gray-800">
                {/*header*/}
                <div className="flex items-start justify-between rounded-t border-b border-solid border-slate-200 p-5">
                  <h3 className="text-3xl font-semibold">Create Poll</h3>
                  <button
                    className="float-right  border-0 bg-transparent p-1 text-3xl font-semibold leading-none text-black opacity-5 outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="block h-6 w-6 bg-transparent text-2xl text-black opacity-5 outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative flex flex-col gap-4 p-6">
                  {/* PollType */}
                  <div className="justify-left flex gap-4">
                    {pollTypes.map((i, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          className="checked:border-primary checked:after:border-primary checked:after:bg-primary checked:focus:border-primary dark:checked:border-primary dark:checked:after:border-primary dark:checked:after:bg-primary dark:checked:focus:border-primary relative float-left  h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                          type="radio"
                          name={`POLL_TYPE`}
                          checked={i.value === pollType}
                          onChange={() => setPollType(i.value)}
                          id={`${i.value}`}
                          value={i.value}
                        />
                        <label htmlFor={`${i.value}`} className="inline-block pl-[0.15rem] hover:cursor-pointer">
                          {i.label}
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Title */}
                  <div className="flex w-full flex-col gap-2">
                    <label htmlFor={'title'} className="text-md">
                      Title (Max 60)
                    </label>
                    <input
                      //highlight on click
                      onClick={e => e.currentTarget.select()}
                      maxLength={60}
                      id={'title'}
                      className={`${clsx(classes.input)}`}
                      placeholder={'Poll Title'}
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="flex w-full flex-col gap-2">
                    <label htmlFor={'content'} className="text-md">
                      Content
                    </label>
                    <Editor
                      divProps={{
                        className: clsx(
                          'z-50 bg-white w-full h-full rounded-md shadow-md overflow-y-scroll max-h-[calc(50vh)]',
                          classes.input
                        ),
                      }}
                      id={'content'}
                      data={description}
                      editorRef={editorReference}
                      onChange={debouncedSetDescription}
                      readOnly={false}
                      placeholder={'Poll Description'}
                      holder={`create-poll`}
                    />
                  </div>

                  {/* Rate Scale */}
                  {pollType == PollType.NUMERIC_RATING && (
                    <div className="flex flex-row gap-4">
                      <div className="flex w-full flex-col gap-4">
                        <div className="text-md">Rate Scale From</div>
                        <input
                          className={`${clsx(classes.input)}`}
                          placeholder={'Rate Scale From'}
                          type="number"
                          value={rateScaleFrom}
                          onChange={e => setRateScaleFrom(+e.target.value)}
                        />
                      </div>
                      <div className="flex w-full flex-col gap-4">
                        <div className="text-md">Rate Scale To</div>
                        <input
                          className={`${clsx(classes.input)}`}
                          placeholder={'Rate Scale To'}
                          type="number"
                          value={rateScaleTo}
                          onChange={e => setRateScaleTo(+e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Options */}
                  <div className="flex w-full flex-col gap-4">
                    <div className="text-md">Options (Minimum 2, Maximum 10)</div>
                    <div className="flex flex-col gap-4">
                      {options.map((option, index) => (
                        <div className="flex items-center gap-2" key={index}>
                          <input
                            tabIndex={index}
                            className={`${clsx(classes.input)}`}
                            placeholder={'Option'}
                            type="text"
                            value={option}
                            onChange={e => {
                              const newOptions = [...options]
                              newOptions[index] = e.target.value
                              setOptions(newOptions)
                            }}
                          />

                          <button
                            onClick={() => {
                              const newOptions = [...options]
                              newOptions.splice(index, 1)
                              setOptions(newOptions)
                            }}
                            disabled={options.length <= 2}
                            className="border-pink-500 rounded border  px-2 py-2 text-xs font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear hover:bg-red-500 hover:text-white focus:outline-none active:bg-red-600 disabled:cursor-not-allowed disabled:opacity-25"
                            type="button"
                          >
                            <TrashIcon width={20} />
                          </button>

                          <button
                            onClick={() => {
                              const newOptions = [...options]
                              newOptions.push('')
                              setOptions(newOptions)
                            }}
                            disabled={options.length >= 10 || index !== options.length - 1}
                            className={clsx(
                              'border-pink-500  rounded border px-2 py-2 text-xs font-bold uppercase text-gray-500 outline-none transition-all duration-150 ease-linear hover:bg-gray-500 hover:text-white focus:outline-none active:bg-gray-600',
                              'mr-1 last:mr-0',
                              options.length >= 10 || index !== options.length - 1 ? 'hidden' : ''
                            )}
                            type="button"
                          >
                            <PlusIcon width={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex w-full flex-col gap-4">
                    <div className="text-md">Duration (In Hours)</div>
                    <input
                      className={`${clsx(classes.input)}`}
                      placeholder={'In Hours, 1 Week = 168 Hours'}
                      type="number"
                      value={duration}
                      onChange={e => setDuration(+e.target.value)}
                    />
                  </div>
                </div>

                {/*footer*/}
                <div className="flex items-center justify-end rounded-b border-t border-solid border-slate-200 p-6">
                  <button
                    className="background-transparent   px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <PrimaryButton
                    className="rounded bg-green-500 p-3 text-white transition-colors duration-150 hover:bg-green-600"
                    type="button"
                    onClick={() => submit()}
                    isLoading={loading}
                    disabled={loading || disableSave()}
                  >
                    Create Poll
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      ) : null}
    </>
  )
}

export default CreatePollUI
