import type { Proof } from '@semaphore-protocol/proof'
import axios from 'axios'
import type { BigNumberish } from 'ethers'
import { RELAYER_URL } from '@/constant/const'
import type { CommunityDetails, ItemCreationRequest, PollRequestStruct } from './model'
import type { CreateGroupSchema } from '@components/form/form.schema'
import type { z } from 'zod'

export async function joinGroup(groupId: BigNumberish, identityCommitment: string, username: string, note: string) {
  return axios.post(`${RELAYER_URL}/join-group`, {
    identityCommitment,
    groupId,
    username,
    note,
  })
}

interface LeaveGroupParams {
  groupId: BigNumberish
  identityCommitment: string
  a: Array<number | string>
  b: [string[], string[]]
  c: Array<number | string>
  siblings: string[]
  pathIndices: number[]
}

export const leaveGroup = async ({ groupId, identityCommitment, a, b, c, siblings, pathIndices }: LeaveGroupParams) =>
  axios.post(`${RELAYER_URL}/leave-group`, {
    identityCommitment,
    groupId,
    a,
    b,
    c,
    siblings,
    pathIndices,
  })

export async function createGroup(
  groupName: string,
  chainId: number,
  details: CommunityDetails,
  note: string,
  requirements?: z.infer<typeof CreateGroupSchema>['tokenRequirements']
) {
  return axios.post(`${RELAYER_URL}/create-group`, {
    groupName,
    requirements,
    chainId,
    details,
    note: note.toString(),
  })
}

interface Post {
  groupId: BigNumberish
  request: ItemCreationRequest
  solidityProof: Proof
  asPoll: boolean
  pollRequest: PollRequestStruct
}

export async function createPost({ groupId, request, solidityProof, asPoll, pollRequest }: Post) {
  return axios.post(`${RELAYER_URL}/post`, {
    groupId,
    request,
    solidityProof,
    asPoll,
    pollRequest,
  })
}

export async function createPostItem({
  groupId,
  request,
  parentId,
  solidityProof,
  asPoll,
  pollRequest,
}: Post & { parentId?: string }) {
  if (parentId) {
    console.log('createComment', groupId, parentId, request, solidityProof, asPoll, pollRequest)
    return axios.post(`${RELAYER_URL}/comment`, {
      groupId,
      parentId,
      request,
      solidityProof,
      asPoll,
      pollRequest,
    })
  } else {
    console.log('createPostItem', groupId, request, solidityProof, asPoll, pollRequest)
    return axios.post(`${RELAYER_URL}/post`, {
      groupId,
      request,
      solidityProof,
      asPoll,
      pollRequest,
    })
  }
}

interface Comment {
  groupId: BigNumberish
  parentId: BigNumberish
  request: ItemCreationRequest
  solidityProof: Proof
  asPoll: boolean
  pollRequest: PollRequestStruct
}

export async function createComment({ groupId, parentId, request, solidityProof, asPoll, pollRequest }: Comment) {
  return axios.post(`${RELAYER_URL}/comment`, {
    groupId,
    parentId,
    request,
    solidityProof,
    asPoll,
    pollRequest,
  })
}

export async function edit(itemId: BigNumberish, contentCID: string, note: bigint, a, b, c) {
  return axios.post(`${RELAYER_URL}/edit`, {
    a,
    b,
    c,
    itemId,
    contentCID,
  })
}

export async function vote(
  itemId: BigNumberish,
  groupId: BigNumberish,
  type: number,
  merkleRoot: string,
  nullifierHash: string,
  solidityProof: Proof
) {
  return axios.post(`${RELAYER_URL}/vote`, {
    itemId,
    groupId,
    type,
    merkleRoot,
    nullifierHash,
    solidityProof,
  })
}

interface AdminGroupDetailsOptions {
  groupId: BigNumberish
  details: any
  isAdmin: true
}

interface RegularGroupDetailsOptions {
  groupId: BigNumberish
  a: any
  b: any
  c: any
  details: any
  isAdmin: false
}

export async function setGroupDetails(options: AdminGroupDetailsOptions | RegularGroupDetailsOptions) {
  return axios.post(`${RELAYER_URL}/set-group-details`, options)
}

export async function setGroupDescription(groupId: BigNumberish, a: any, b: any, c: any, description: string) {
  return axios.post(`${RELAYER_URL}/set-group-description`, {
    groupId,
    a,
    b,
    c,
    description,
  })
}

export async function setGroupTags(groupId: BigNumberish, a: any, b: any, c: any, tags: string[]) {
  return axios.post(`${RELAYER_URL}/set-group-tags`, {
    groupId,
    a,
    b,
    c,
    tags,
  })
}

export async function setGroupBanner(groupId: BigNumberish, a: any, b: any, c: any, bannerCID: string) {
  return axios.post(`${RELAYER_URL}/set-group-banner`, {
    groupId,
    a,
    b,
    c,
    bannerCID,
  })
}

export async function setGroupLogo(groupId: BigNumberish, a: any, b: any, c: any, logoCID: string) {
  return axios.post(`${RELAYER_URL}/set-group-logo`, {
    groupId,
    a,
    b,
    c,
    logoCID,
  })
}

export async function votePoll(
  itemId: BigNumberish,
  groupId: BigNumberish,
  pollData: number[],
  merkleRoot: BigNumberish,
  nullifierHash: BigNumberish,
  solidityProof: Proof
) {
  return axios.post(`${RELAYER_URL}/vote-poll`, {
    itemId,
    groupId,
    pollData,
    merkleRoot,
    nullifierHash,
    solidityProof,
  })
}
