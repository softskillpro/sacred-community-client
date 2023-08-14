import axios from 'axios'
import { Topic } from '@components/Discourse/types'
import dynamic from 'next/dynamic'
import React, { useEffect, useRef, useState } from 'react'
import EditorJS, { OutputData } from '@editorjs/editorjs'
import { useTranslation } from 'react-i18next'
import { NewPostForm } from '@components/NewPostForm'
import { toast } from 'react-toastify'
import { mutate } from 'swr'
import { getDiscourseData } from '@/lib/fetcher'
import { OutputDataToMarkDown } from '@components/Discourse/OutputDataToMarkDown'

const PostToTopic = ({ topic }: { topic: Topic }) => {
  const { t } = useTranslation()
  const [description, setDescription] = useState<OutputData>(null)
  const editorReference = useRef<EditorJS>()

  const onSubmit = async () => {
    if (!description) return toast.error(t('error.emptyPost'))
    const raw = OutputDataToMarkDown(description)

    try {
      const newPost = await axios.post('/api/discourse/postToTopic', {
        topic_id: topic.id,
        raw: raw,
        unlist_topic: false,
        nested_post: true,
        archetype: 'regular',
        whisper: false,
        is_warning: false,
        category: 4,
      })
      toast.success(t('alert.postCreateSuccess'))
      await mutate(getDiscourseData(topic.id, [newPost.data.id]))
    } catch (error) {
      toast.error(t('alert.postCreateFailed'))
      console.error(error)
    }
  }

  if (topic?.details?.created_by?.id === -1) return null

  return (
    <>
      <NewPostForm
        isReadOnly={false}
        classes={{
          // root open needs to have content centered perfectly
          // we need to gray out the background
          rootClosed: '!m-0 !p-0 !h-0' ,
          rootOpen:
            'fixed inset-0 z-50 mt-0 !bg-black/60 !w-full !h-full bg-opacity-50 left-0 top-0 right-0 bottom-0 inset-0  ' +
            'flex flex-col justify-center items-center' +
            ' overflow-y-auto ',
          formContainerOpen: 'bg-white  rounded-lg shadow-lg p-6 w-full max-w-3xl mx-auto',
          openFormButton: 'text-white z-60 !bg-gray-900 fixed bottom-4 right-4 z-50',
        }}
        editorId={`${topic.id}_post`}
        description={description}
        setDescription={setDescription}
        handleSubmit={onSubmit}
        editorReference={editorReference}
        resetForm={() => {
          // @ts-ignore
          editorReference.current.clear()
          setDescription(null)
        }}
        isSubmitting={false}
        title={false}
        isEditable={true}
        itemType={'post'}
        handlerType={'new'}
        formVariant={'default'}
        submitButtonText={t('button.post') as string}
        openFormButtonText={t('button.newPost') as string}
      />
    </>
  )
}

export default PostToTopic
