import { OutputData } from '@editorjs/editorjs'
import { BigNumberish } from 'ethers'
import { Requirement as ContractRequirement } from '@/types/contract/ForumInterface'

export interface Requirement extends ContractRequirement {
  name?: string
  symbol?: string
  decimals?: number
}

export interface CommunityDetails {
  description: string
  tags: string[]
  bannerCID: string
  logoCID: string
}
export interface User {
  name: string
  identityCommitment: string
  id: number | string
  groupId: number
}

export interface Post {
  parentId: number
  id: number
  contentCID: string
  downvote: number
  upvote: number
  kind: 0 | 1
  groupId: number
  createdAt: number
}

export interface PostContent {
  title: string
  description: OutputData
}

export type ReputationProofStruct = {
  publicSignals: BigNumberish[]
  proof: BigNumberish[]
  publicSignalsQ: BigNumberish[]
  proofQ: BigNumberish[]
  ownerEpoch: BigNumberish
  ownerEpochKey: BigNumberish
}
