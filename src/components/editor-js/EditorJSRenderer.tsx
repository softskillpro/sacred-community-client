import { OutputData } from '@editorjs/editorjs'
import React from 'react'
import clsx from 'clsx'

const editorJsHtml = require('editorjs-html')
const EditorJsToHtml = editorJsHtml()

interface Props {
  data: OutputData | string
  onlyPreview?: boolean
  isHtml?: boolean
  className?: string
}

type ParsedContent = string | JSX.Element

const EditorJsRenderer = ({ data, onlyPreview = false, isHtml = false, className }: Props) => {
  if (!data) {
    return null
  }

  const html = isHtml ? [data as string] : (EditorJsToHtml.parse(data as OutputData) as ParsedContent[])

  return (
    <div className={clsx("prose max-w-full",
        onlyPreview && 'prose-sm line-clamp-4',
        )}>
      {html.map((item, index) => {
        if (typeof item === 'string') {
          return <div className={className} dangerouslySetInnerHTML={{ __html: item }} key={index}></div>
        }
        if (typeof item === 'object') {
          return <div key={index}>{Object.keys(item)}</div>
        }
      })}
    </div>
  )
}

export default EditorJsRenderer
