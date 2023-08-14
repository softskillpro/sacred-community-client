import React, { useRef, useState } from 'react'
import { NewPostForm, NewPostFormProps } from '@components/NewPostForm'
import axios from 'axios'
import { toast } from 'react-toastify'
import { getDiscourseData } from '@/lib/fetcher'
import { mutate } from 'swr'
import { OutputDataToMarkDown } from '@components/Discourse/OutputDataToMarkDown'
import { useTranslation } from 'react-i18next'
import EditorJS, { OutputData } from '@editorjs/editorjs'
import { Topic } from '@components/Discourse/types'

const ReplyToPost = ({
  post,
  formProps,
}: {
  post: Topic['post_stream']['posts'][0]
  formProps?: Partial<NewPostFormProps>
}) => {
  const { t } = useTranslation()
  const [description, setDescription] = useState<OutputData>(null)
  const editorReference = useRef<EditorJS>()

  const onSubmit = async () => {
    if (!description) return toast.error(t('error.emptyPost'))
    const raw = OutputDataToMarkDown(description)
    try {
      await axios.post('/api/discourse/postToTopic', {
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
      toast.success(t('alert.postCreateSuccess'))
      await mutate(getDiscourseData(post.topic_id, [post.id]))
      // @ts-ignore
      editorReference.current.clear()
      setDescription(null)
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
      handlerType={'new'}
      submitButtonText={'Submit'}
      {...formProps}
      classes={{
        openFormButton: 'border-gray-300 bg-gray-600 text-white hover:bg-gray-700 transition-colors duration-150 ',
        formContainer: 'bg-white p-4 border border-gray-300 rounded shadow-lg absolute z-20  ',
        rootClosed: '!p-0 !m-0 absolute ',
        formContainerOpen: 'w-full max-w-3xl mx-auto z-50 -top-1/2 right-0 sticky bottom-0',
        cancelButton: 'text-gray-500 hover:text-gray-700',
        openFormButtonClosed: 'self-end mr-3 bg-primary-500',
        root: '!z-50 relative',
        ...formProps?.classes,
      }}
    />
  )
}

export default ReplyToPost
