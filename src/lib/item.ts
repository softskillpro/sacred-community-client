import { ReputationProofStruct, User } from '@/lib/model'
import { BigNumber, ethers } from 'ethers'
import { Identity } from '@semaphore-protocol/identity'
import {
  createNote,
  generateGroth16Proof,
  getBytes32FromIpfsHash,
  getContent,
  getIpfsHashFromBytes32,
  hashBytes,
  parsePost,
  uploadIPFS,
} from '@/lib/utils'
import { forumContract, jsonRPCProvider } from '@/constant/const'
import { createComment, createPost, edit } from '@/lib/api'
import { UnirepUser } from '@/lib/unirep'
import { MIN_REP_POST } from '@/lib/post'
import { MIN_REP_COMMENT } from '@/lib/comment'
import { generateProof } from '@semaphore-protocol/proof'
import { Group } from '@semaphore-protocol/group'
import { mutate } from 'swr'
import { getMCache, removeFromCache, setCache, setCacheAtSpecificPath } from '@/lib/redis'
import { Item, RawItemData } from '@/types/contract/ForumInterface'

export async function handleDeleteItem(address: string, postedByUser: User, itemId) {
  try {
    let signal = ethers.constants.HashZero
    const userPosting = new Identity(`${address}_${this.groupId}_${postedByUser?.name}`)
    const note = await createNote(userPosting)

    const item = await forumContract.itemAt(itemId)
    let input = {
      note: BigInt(item.note.toHexString()),
      trapdoor: userPosting.getTrapdoor(),
      nullifier: userPosting.getNullifier(),
    }

    const { a, b, c } = await generateGroth16Proof(
      input,
      '/circuits/VerifyOwner__prod.wasm',
      '/circuits/VerifyOwner__prod.0.zkey'
    )
    return edit(itemId, signal, note, a, b, c).then(async data => {
      await this.removeFromCache(itemId) //we update redis with a new 'temp' comment here
      return data
    })
  } catch (error) {
    throw error
  }
}

// todo: create works, but it fails in either the caching, or updating the UI after its made - fix currently is refreshing the page.
export async function create(content, type, address, users, postedByUser, groupId, setWaiting, onIPFSUploadSuccess) {
  let currentDate = new Date()
  const message = currentDate.getTime().toString() + '#' + JSON.stringify(content)

  try {
    const cid = await uploadIPFS(message)
    if (!cid) {
      throw Error('Upload to IPFS failed')
    }
    console.log(`IPFS CID: ${cid}`)

    onIPFSUploadSuccess(content, cid)

    const signal = getBytes32FromIpfsHash(cid)
    const userPosting = new Identity(`${address}_${this.groupId}_${postedByUser?.name}`)
    const unirepUser = new UnirepUser(userPosting)
    await unirepUser.updateUserState()
    const userState = await unirepUser.getUserState()

    let minRep = type === 'post' ? MIN_REP_POST : MIN_REP_COMMENT
    let reputationProof = await userState.genProveReputationProof({
      epkNonce: 0,
      minRep: minRep,
      graffitiPreImage: 0,
    })

    const extraNullifier = hashBytes(signal).toString()
    const note = await createNote(userPosting)
    const u = users.filter(u => u?.groupId === +this.groupId)
    const g = new Group(groupId)
    g.addMembers(u.map(u => u?.identityCommitment))
    const { proof, merkleTreeRoot, nullifierHash } = await generateProof(
      userPosting,
      g,
      extraNullifier,
      hashBytes(signal)
    )

    const epochData = unirepUser.getEpochData()
    const epoch: ReputationProofStruct = {
      publicSignals: epochData.publicSignals,
      proof: epochData.proof,
      publicSignalsQ: reputationProof.publicSignals,
      proofQ: reputationProof.proof,
      ownerEpoch: BigNumber.from(epochData.epoch)?.toString(),
      ownerEpochKey: epochData.epochKey,
    }

    if (type === 'post') {
      return await createPost(
        signal,
        note,
        this.groupId,
        merkleTreeRoot.toString(),
        nullifierHash.toString(),
        proof,
        epoch
      ).then(async res => {
        const { data } = res
        const postIdHex = data.args[2].hex
        const postId = parseInt(postIdHex, 16)
        await this.cacheNewPost.call(this, content, postId, groupId, note, cid, setWaiting)
        return res
      })
    } else if (type === 'comment') {
      return await createComment(
        signal.toString(),
        note,
        this.groupId,
        this.postId,
        merkleTreeRoot.toString(),
        nullifierHash.toString(),
        proof,
        epoch
      ).then(async res => {
        const { data } = res
        const commentHex = data.args[2].hex
        const commentId = parseInt(commentHex, 16)
        await this.cacheNewComment.call(this, content, commentId, note, cid, setWaiting)
        return res
      })
    }
  } catch (error) {
    throw error
  }
}

export async function cacheUpdatedContent(type, content, contentId, groupId, note, contentCID, setWaiting) {
  const handleMutation = async updateContentCallback => {
    return await mutate(this.cacheId(), updateContentCallback, { revalidate: false })
  }
  if (type === 'post') {
    await handleMutation(async postFromCache => {
      const updatedPost = { ...postFromCache, ...content, contentCID, note: BigNumber.from(note) }
      await setCacheAtSpecificPath(this.specificId(contentId), updatedPost, '$.data')
      return { ...updatedPost }
    })
  } else if (type === 'comment') {
    await handleMutation(async commentsFromCache => {
      const commentIndex = commentsFromCache.findIndex(p => {
        return +p.id == +contentId || +this.id == BigNumber.from(p.id).toNumber()
      })
      commentsFromCache[commentIndex] = { ...commentsFromCache[commentIndex], ...content, contentCID, note }
      await Promise.allSettled([
        setCacheAtSpecificPath(this.specificId(contentId), commentsFromCache[commentIndex]?.content, '$.data.content'),
        setCacheAtSpecificPath(this.specificId(contentId), JSON.stringify(contentCID), '$.data.contentCID'),
        setCacheAtSpecificPath(this.specificId(contentId), BigNumber.from(note), '$.data.note'),
      ])

      return [...commentsFromCache]
    })
  } else {
    throw Error("Invalid type. Type must be 'post' or 'comment'.")
  }

  setWaiting(false)
}

export async function editContent(
  type,
  content,
  address: string,
  itemId,
  postedByUser: User,
  groupId: string,
  setWaiting: Function
) {
  let currentDate = new Date()
  let messageContent = content
  const message = currentDate.getTime().toString() + '#' + JSON.stringify(messageContent)
  console.log(`Editing your anonymous ${type}...`)
  let cid
  try {
    cid = await uploadIPFS(message)
    if (!cid) {
      throw Error('Upload to IPFS failed')
    }
    console.log(`IPFS CID: ${cid}`)
    const signal = getBytes32FromIpfsHash(cid)

    const userPosting = new Identity(`${address}_${this.groupId}_${postedByUser?.name}`)
    const note = await createNote(userPosting)

    const item = await forumContract.itemAt(itemId)

    let input = {
      trapdoor: userPosting.getTrapdoor(),
      note: BigInt(item.note.toHexString()),
      nullifier: userPosting.getNullifier(),
    }

    const { a, b, c } = await generateGroth16Proof(
      input,
      '/circuits/VerifyOwner__prod.wasm',
      '/circuits/VerifyOwner__prod.0.zkey'
    )

    return await edit(itemId, signal, note, a, b, c).then(async data => {
      await cacheUpdatedContent.call(this, type, content, itemId, groupId, note, cid, setWaiting)
      return data
    })
  } catch (error) {
    throw error
  }
}
type Note = {
  hex: string
  type: string
}

type Block = {
  type: string
  data: {
    text: string
  }
  id: string
}

type Description = {
  blocks: Block[]
  time: number
  version: string
}

type Data = {
  id: string
  note: Note
  title: string
  upvote: number
  contentCID: string
  createdAt: string
  description: Description
  downvote: number
}

type Post = {
  data: Data
  lastCachedAt: string
}

type ResponseArray = (null | Post[])[]

//extend this to specify including certain ids
export async function getAllContent(type, ids = []): Promise<Item[]> {



  const fetchAndParseContent = async (ids: number[]) => {

    const rawContentItems = (await Promise.all(ids.map(i => forumContract.itemAt(i)))) as RawItemData[]
    console.log('rawContentItems', rawContentItems)

    let parsedContentItems = []
    for (const item of rawContentItems) {
      if (!item?.removed && ethers.constants.HashZero !== item?.contentCID) {
        const data = await parseContent(item)
        if (data) parsedContentItems.push(data)
      }
    }
  }

  console.log(ids)

  return await fetchAndParseContent(ids)


}

// Helper function
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const cacheNewContent = async (content, contentId, note, contentCID, setWaiting, type) => {
  let newContent
  if (type === 'post') {
    return console.log('skip post cache', content, contentId, note, contentCID, setWaiting, type)
    const parsedPost = parsePost(content) //todo: is this needed
    newContent = {
      ...parsedPost,
      createdAt: new Date(Date.now()),
      id: contentId, // a non-numeric lets us know it's unconfirmed until registered on the blockchain
      upvote: 0,
      downvote: 0,
      note: BigNumber.from(note),
      contentCID,
    }
  } else if (type === 'comment') {
    newContent = {
      content: content,
      createdAt: new Date(Date.now()),
      id: contentId, // a non-numeric lets us know it's unconfirmed until registered on the blockchain
      upvote: 0,
      downvote: 0,
      note: BigNumber.from(note),
      contentCID,
    }
  }
  if (!this) throw new Error('this not set')
  await setCache(this.specificId(contentId), newContent) // update the cache with the new content
  if (!this.cacheId()) throw new Error('cacheId not set')
  mutate(
    this.cacheId(),
    currentContent => {
      const currentContentCopy = [...currentContent]
      if (type === 'post') {
        currentContentCopy.unshift(newContent)
      } else if (type === 'comment') {
        currentContentCopy.push(newContent)
      }
      return currentContentCopy
    },
    { revalidate: false }
  ) //update react's state

  setWaiting(false)
}

export async function updateContentVote(itemId, voteType, confirmed: boolean, type, revert = false) {
  const modifier = revert ? -1 : 1
  try {
    itemId = itemId.toNumber()
  } catch {
    itemId = +itemId
  }

  let cacheIdMethod
  let specificIdMethod
  if (type === 'post') {
    cacheIdMethod = this.groupCacheId() // list of all posts
  } else if (type === 'comment') {
    cacheIdMethod = this.commentsCacheId() // list of all comments
  }

  specificIdMethod = this.specificId(itemId)

  mutate(
    cacheIdMethod,
    contentList => {
      const contentIndex = contentList.findIndex(p => +p.id === itemId)
      if (contentIndex > -1) {
        const contentToUpdate = { ...contentList[contentIndex] }
        if (voteType === 0 && (!confirmed || revert)) {
          contentToUpdate.upvote += 1 * modifier
        }

        if (voteType === 1 && (!confirmed || revert)) {
          contentToUpdate.downvote += 1 * modifier
        }

        if (confirmed) {
          delete contentToUpdate.voteUnconfirmed
        } else {
          contentToUpdate.voteUnconfirmed = true
        }

        contentList[contentIndex] = contentToUpdate

        if (confirmed) {
          setCacheAtSpecificPath(
            specificIdMethod,
            voteType === 0 ? contentList[contentIndex].upvote : contentList[contentIndex].downvote,
            voteType === 0 ? '$.data.upvote' : '$.data.downvote'
          )
        }
      }
      return [...contentList]
    },
    { revalidate: false }
  )
}
