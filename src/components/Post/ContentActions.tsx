import DeleteItemButton from '@components/buttons/DeleteItemButton'
import { PrimaryButton } from '@components/buttons'
import {
  PaperAirplaneIcon,
  PencilIcon,
  XCircleIcon,
} from '@heroicons/react/20/solid'
import React from 'react'
import { useTranslation } from 'react-i18next'
import type { Item } from '@/types/contract/ForumInterface'
import clsx from 'clsx'

export const ContentActions = ({
  isContentEditable,
  onContentPage,
  item,
  groupId,
  contentId,
  isAdminOrModerator,
  setIsContentEditing,
  isEditing,
  onClickCancel,
  save,
  isLoading,
  hidden,
}: {
  isContentEditable: boolean
  onContentPage: boolean
  item: Item
  groupId: number
  contentId: number
  isAdminOrModerator: boolean
  setIsContentEditing: React.Dispatch<React.SetStateAction<boolean>>
  isEditing: boolean
  onClickCancel: () => void
  save: () => void
  isLoading: boolean
  hidden: boolean
}) => {
  const { t } = useTranslation()
  if (hidden) {
    return null
  }
  if (isContentEditable && onContentPage) {
    return (
      <>
        {!isEditing && (
          <>
            <PrimaryButton
              isLoading={isLoading}
              className="bg-blue-500 text-sm text-white hover:bg-blue-600"
              onClick={() => setIsContentEditing(!isEditing)}
              startIcon={<PencilIcon className="h-4 w-4" />}
              loadingPosition={'start'}
            >
              {t('button.edit')}
            </PrimaryButton>

            <DeleteItemButton
              isAdminOrModerator={isAdminOrModerator}
              itemId={item.id}
              itemType={item.kind}
              groupId={groupId}
              postId={contentId}
            />
          </>
        )}

        {isEditing && (
          <>
            <PrimaryButton
              className=" bg-blue-500 text-sm text-white hover:bg-blue-600"
              isLoading={isLoading}
              disabled={
                !item ||
                (!item.description?.blocks?.length && !item.blocks?.length)
              }
              onClick={() => save()}
              startIcon={<PaperAirplaneIcon className="mr-1 h-4 w-4" />}
              loadingPosition={'start'}
            >
              {t('button.save')}
            </PrimaryButton>
            <PrimaryButton
              className={clsx(
                'bg-red-500 hover:bg-red-600',
                'border text-sm transition-colors duration-150 hover:bg-gray-500 hover:text-white',
                'text-slate-200'
              )}
              startIcon={<XCircleIcon className="mr-1 h-4 w-4" />}
              loadingPosition={'start'}
              onClick={() => onClickCancel()}
            >
              {t('button.cancel')}
            </PrimaryButton>
          </>
        )}
      </>
    )
  }
  return null
}
