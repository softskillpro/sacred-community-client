import React, { useRef, useState } from 'react'
import { NewPostForm, NewPostFormProps } from '@components/NewPostForm'
import axios from 'axios'
import { toast } from 'react-toastify'
import { getDiscourseData } from '@/lib/fetcher'
import useSWR, { mutate } from 'swr'
import { OutputDataToMarkDown } from '@components/Discourse/OutputDataToMarkDown'
import { useTranslation } from 'react-i18next'
import EditorJS, { OutputData } from '@editorjs/editorjs'
import { Post, Topic } from '@components/Discourse/types'

interface NewPostResponse {
  action: string
  post: Post
  success: boolean
}

const ReplyToPost = ({
  post,
  formProps,
  addReplyToPosts,
}: {
  post: Topic['post_stream']['posts'][0]
  formProps?: Partial<NewPostFormProps>
  addReplyToPosts?: (newPost: Topic['post_stream']['posts'][0]) => void
}) => {
  const { t } = useTranslation()
  const [description, setDescription] = useState<OutputData>(null)
  const editorReference = useRef<EditorJS>()

  const onSubmit = async () => {
    if (!description) return toast.error(t('error.emptyPost'))
    const raw = OutputDataToMarkDown(description)
    try {
      const newPost = await axios.post('/api/discourse/postToTopic', {
        topic_id: post.topic_id,
        reply_to_post_number: post.post_number,
        raw: raw,
        unlist_topic: false,
        nested_post: true,
        archetype: 'regular',
        whisper: false,
        is_warning: false,
        category: 4,
      })

      if (newPost.data.post) {
        toast.success(t('alert.postCreateSuccess'))
        addReplyToPosts?.(newPost.data.post)
      }
    } catch (error) {
      toast.error(t('alert.postCreateFailed'))
      console.error(error)
    }
  }

  return (
    <NewPostForm
      editorId={`${post.id}_post`}
      editorReference={editorReference}
      title={false}
      setTitle={() => {}}
      description={description}
      setDescription={setDescription}
      resetForm={() => {
        // @ts-ignore
        editorReference.current.clear()
        setDescription(null)
      }}
      isReadOnly={false}
      isEditable={true}
      handleSubmit={onSubmit}
      openFormButtonText={'Reply'}
      actionType={'new'}
      showButtonWhenFormOpen={true}
      submitButtonText={'Submit'}
      {...formProps}
      classes={{
        formBody: 'flex flex-col gap-4 text-primary-500',
        editor: 'border  rounded py-1 px-2 bg-white text-primary-500',
        submitButton: 'bg-green-500 text-white border-none rounded',
        cancelButton: ' text-gray-500 border-none rounded active:bg-gray-100',
        formContainerOpen: 'bg-white p-4 border border-gray-300 rounded shadow-lg w-full  max-w-3xl ',
        openFormButtonOpen: 'bg-primary-500 text-white opacity-0',
        openFormButtonClosed: 'contents text-white ',
        rootClosed: 'flex h-full !flex-row items-end w-full ',
        rootOpen:
          'z-[50] fixed inset-0 bg-gray-900/50 flex justify-center flex l flex-row w-full !flex-row items-center ',
        ...formProps?.classes,
      }}
    />
  )
}

export default ReplyToPost
