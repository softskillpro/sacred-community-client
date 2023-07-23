import React, { useEffect, useState } from 'react'
import { ToolTip } from './HOC/ToolTip'
import { useTranslation } from 'next-i18next'

import { createNote } from '@/lib/utils'
import { Identity } from '@semaphore-protocol/identity'
import { useAccount } from 'wagmi'
import Link from 'next/link'

function EditGroupModal({ community, hidden = false }) {
  const { address } = useAccount()
  const { t } = useTranslation()

  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    checkIsOwner().then(setIsOwner)
  }, [address])

  const checkIsOwner = async () => {
    if (!address) return false
    if (!community?.note) return false
    const user = new Identity(address as string)
    const note = await createNote(user)
    return community.note.toString() === note.toString()
  }

  if (hidden) return null
  return (
    <>
      <ToolTip
        type="primary"
        title={t('toolTip.editCommunity.title')}
        message={t('toolTip.editCommunity.message') || ''}
      >
        <Link
          id="edit-community-button"
          className={`absolute right-0 mr-2 mt-2 rounded-full bg-gray-100 p-2 ring-1 ring-white transition duration-100 hover:bg-purple-600 hover:text-white ${
            !isOwner || hidden ? 'hidden' : ''
          }`}
          aria-label="edit community"
          href={`/communities/${community.groupId}/edit`}
        >
          <svg
            fill="none"
            stroke="currentColor"
            className={'h-5 w-5'}
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </Link>
      </ToolTip>
    </>
  )
}

export default EditGroupModal
