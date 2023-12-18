/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from 'ethers'
import type {
  EventFragment,
  FunctionFragment,
  Result,
} from '@ethersproject/abi'
import { JsonRpcProvider, Listener } from '@ethersproject/providers'
import type {
  OnEvent,
  PromiseOrValue,
  TypedEvent,
  TypedEventFilter,
  TypedListener,
} from '../common'

export interface ForumInterface extends utils.Interface {
  functions: {
    'addComment(uint256,uint256,bytes32,uint256,uint256,uint256[8])': FunctionFragment
    'addPost(uint256,bytes32,uint256,uint256,uint256[8])': FunctionFragment
    'createGroup(string,uint256)': FunctionFragment
    'getCommentIdList(uint256)': FunctionFragment
    'getPostIdList(uint256)': FunctionFragment
    'groupCount()': FunctionFragment
    'groups(uint256)': FunctionFragment
    'itemAt(uint256)': FunctionFragment
    'itemCount()': FunctionFragment
    'items(uint256)': FunctionFragment
    'joinGroup(uint256,uint256,bytes32)': FunctionFragment
    'semaphore()': FunctionFragment
  }

  getFunction(
    nameOrSignatureOrTopic:
      | 'addComment'
      | 'addPost'
      | 'createGroup'
      | 'getCommentIdList'
      | 'getPostIdList'
      | 'groupCount'
      | 'groups'
      | 'itemCount'
      | 'itemAt'
      | 'items'
      | 'joinGroup'
      | 'semaphore'
  ): FunctionFragment

  encodeFunctionData(
    functionFragment: 'addComment',
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>[],
    ]
  ): string
  encodeFunctionData(
    functionFragment: 'addPost',
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>[],
    ]
  ): string
  encodeFunctionData(
    functionFragment: 'createGroup',
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string
  encodeFunctionData(
    functionFragment: 'getCommentIdList',
    values: [PromiseOrValue<BigNumberish>]
  ): string
  encodeFunctionData(
    functionFragment: 'getPostIdList',
    values: [PromiseOrValue<BigNumberish>]
  ): string
  encodeFunctionData(functionFragment: 'groupCount', values?: undefined): string
  encodeFunctionData(
    functionFragment: 'groups',
    values: [PromiseOrValue<BigNumberish>]
  ): string
  encodeFunctionData(functionFragment: 'itemCount', values?: undefined): string
  encodeFunctionData(
    functionFragment: 'items',
    values: [PromiseOrValue<BigNumberish>]
  ): string
  encodeFunctionData(
    functionFragment: 'joinGroup',
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>,
    ]
  ): string
  encodeFunctionData(functionFragment: 'semaphore', values?: undefined): string

  decodeFunctionResult(functionFragment: 'addComment', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'addPost', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'createGroup', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'getCommentIdList',
    data: BytesLike
  ): Result
  decodeFunctionResult(
    functionFragment: 'getPostIdList',
    data: BytesLike
  ): Result
  decodeFunctionResult(functionFragment: 'groupCount', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'groups', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'itemCount', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'itemAt', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'items', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'joinGroup', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'semaphore', data: BytesLike): Result

  events: {
    'NewGroupCreated(uint256,string,uint256)': EventFragment
    'NewItem(uint8,uint256,uint256,uint256,bytes32)': EventFragment
    'NewUser(uint256,uint256,bytes32)': EventFragment
  }

  getEvent(nameOrSignatureOrTopic: 'NewGroupCreated'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'NewItem'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'NewUser'): EventFragment
}

export interface NewGroupCreatedEventObject {
  groupId: BigNumber
  name: string
  creatorIdentityCommitment: BigNumber
}
export type NewGroupCreatedEvent = TypedEvent<
  [BigNumber, string, BigNumber],
  NewGroupCreatedEventObject
>

export type NewGroupCreatedEventFilter = TypedEventFilter<NewGroupCreatedEvent>

export interface NewItemEventObject {
  itemType: number
  groupId: BigNumber
  id: BigNumber
  parentId: BigNumber
  contentCID: string
}
export type NewItemEvent = TypedEvent<
  [number, BigNumber, BigNumber, BigNumber, string],
  NewItemEventObject
>

export type NewItemEventFilter = TypedEventFilter<NewItemEvent>

export interface NewUserEventObject {
  groupId: BigNumber
  identityCommitment: BigNumber
  username: string
}
export type NewUserEvent = TypedEvent<
  [BigNumber, BigNumber, string],
  NewUserEventObject
>

export type NewUserEventFilter = TypedEventFilter<NewUserEvent>

export interface Forum extends BaseContract {
  itemAt(itemId: any): unknown
  connect(signerOrProvider: Signer | JsonRpcProvider | string): this
  attach(addressOrName: string): this
  deployed(): Promise<this>

  interface: ForumInterface

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>
  listeners(eventName?: string): Array<Listener>
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this
  removeAllListeners(eventName?: string): this
  off: OnEvent<this>
  on: OnEvent<this>
  once: OnEvent<this>
  removeListener: OnEvent<this>

  functions: {
    addComment(
      groupId: PromiseOrValue<BigNumberish>,
      parentId: PromiseOrValue<BigNumberish>,
      contentCID: PromiseOrValue<BytesLike>,
      merkleTreeRoot: PromiseOrValue<BigNumberish>,
      nullifierHash: PromiseOrValue<BigNumberish>,
      proof: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>

    addPost(
      groupId: PromiseOrValue<BigNumberish>,
      contentCID: PromiseOrValue<BytesLike>,
      merkleTreeRoot: PromiseOrValue<BigNumberish>,
      nullifierHash: PromiseOrValue<BigNumberish>,
      proof: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>

    createGroup(
      groupName: PromiseOrValue<string>,
      identityCommitment: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>

    getCommentIdList(
      postId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>

    getPostIdList(
      groupId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>

    groupCount(overrides?: CallOverrides): Promise<[BigNumber]>

    groups(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, string, BigNumber, BigNumber] & {
        id: BigNumber
        name: string
        creatorIdentityCommitment: BigNumber
        userCount: BigNumber
      }
    >

    itemCount(overrides?: CallOverrides): Promise<[BigNumber]>

    itemAt(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [number, BigNumber, BigNumber, BigNumber, BigNumber, string] & {
        kind: number
        id: BigNumber
        parentId: BigNumber
        childIds: BigNumber[]
        groupId: BigNumber
        createdAtBlock: BigNumber
        contentCID: string
        removed: boolean
        note: BigNumber
        downvote: BigNumber
        upvote: BigNumber
      }
    >

    items(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [number, BigNumber, BigNumber, BigNumber, BigNumber, string] & {
        kind: number
        id: BigNumber
        parentId: BigNumber
        groupId: BigNumber
        createdAtBlock: BigNumber
        contentCID: string
      }
    >

    joinGroup(
      groupId: PromiseOrValue<BigNumberish>,
      identityCommitment: PromiseOrValue<BigNumberish>,
      username: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>

    semaphore(overrides?: CallOverrides): Promise<[string]>
  }

  addComment(
    groupId: PromiseOrValue<BigNumberish>,
    parentId: PromiseOrValue<BigNumberish>,
    contentCID: PromiseOrValue<BytesLike>,
    merkleTreeRoot: PromiseOrValue<BigNumberish>,
    nullifierHash: PromiseOrValue<BigNumberish>,
    proof: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>

  addPost(
    groupId: PromiseOrValue<BigNumberish>,
    contentCID: PromiseOrValue<BytesLike>,
    merkleTreeRoot: PromiseOrValue<BigNumberish>,
    nullifierHash: PromiseOrValue<BigNumberish>,
    proof: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>

  createGroup(
    groupName: PromiseOrValue<string>,
    identityCommitment: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>

  getCommentIdList(
    postId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber[]>

  getPostIdList(
    groupId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber[]>

  groupCount(overrides?: CallOverrides): Promise<BigNumber>

  groups(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, string, BigNumber, BigNumber] & {
      id: BigNumber
      name: string
      creatorIdentityCommitment: BigNumber
      userCount: BigNumber
    }
  >

  itemCount(overrides?: CallOverrides): Promise<BigNumber>

  items(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [number, BigNumber, BigNumber, BigNumber, BigNumber, string] & {
      kind: number
      id: BigNumber
      parentId: BigNumber
      groupId: BigNumber
      createdAtBlock: BigNumber
      contentCID: string
    }
  >

  joinGroup(
    groupId: PromiseOrValue<BigNumberish>,
    identityCommitment: PromiseOrValue<BigNumberish>,
    username: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>

  semaphore(overrides?: CallOverrides): Promise<string>

  callStatic: {
    addComment(
      groupId: PromiseOrValue<BigNumberish>,
      parentId: PromiseOrValue<BigNumberish>,
      contentCID: PromiseOrValue<BytesLike>,
      merkleTreeRoot: PromiseOrValue<BigNumberish>,
      nullifierHash: PromiseOrValue<BigNumberish>,
      proof: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<void>

    addPost(
      groupId: PromiseOrValue<BigNumberish>,
      contentCID: PromiseOrValue<BytesLike>,
      merkleTreeRoot: PromiseOrValue<BigNumberish>,
      nullifierHash: PromiseOrValue<BigNumberish>,
      proof: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<void>

    createGroup(
      groupName: PromiseOrValue<string>,
      identityCommitment: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>

    getCommentIdList(
      postId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>

    getPostIdList(
      groupId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>

    groupCount(overrides?: CallOverrides): Promise<BigNumber>

    groups(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, string, BigNumber, BigNumber] & {
        id: BigNumber
        name: string
        creatorIdentityCommitment: BigNumber
        userCount: BigNumber
      }
    >

    itemCount(overrides?: CallOverrides): Promise<BigNumber>

    items(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [number, BigNumber, BigNumber, BigNumber, BigNumber, string] & {
        kind: number
        id: BigNumber
        parentId: BigNumber
        groupId: BigNumber
        createdAtBlock: BigNumber
        contentCID: string
      }
    >

    joinGroup(
      groupId: PromiseOrValue<BigNumberish>,
      identityCommitment: PromiseOrValue<BigNumberish>,
      username: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>

    semaphore(overrides?: CallOverrides): Promise<string>
  }

  filters: {
    'NewGroupCreated(uint256,string,uint256)'(
      groupId?: null,
      name?: null,
      creatorIdentityCommitment?: null
    ): NewGroupCreatedEventFilter
    NewGroupCreated(
      groupId?: null,
      name?: null,
      creatorIdentityCommitment?: null
    ): NewGroupCreatedEventFilter

    'NewItem(uint8,uint256,uint256,uint256,bytes32)'(
      itemType?: null,
      groupId?: null,
      id?: null,
      parentId?: null,
      contentCID?: null
    ): NewItemEventFilter
    NewItem(
      itemType?: null,
      groupId?: null,
      id?: null,
      parentId?: null,
      contentCID?: null
    ): NewItemEventFilter

    'NewUser(uint256,uint256,bytes32)'(
      groupId?: null,
      identityCommitment?: null,
      username?: null
    ): NewUserEventFilter
    NewUser(
      groupId?: null,
      identityCommitment?: null,
      username?: null
    ): NewUserEventFilter
  }

  estimateGas: {
    addComment(
      groupId: PromiseOrValue<BigNumberish>,
      parentId: PromiseOrValue<BigNumberish>,
      contentCID: PromiseOrValue<BytesLike>,
      merkleTreeRoot: PromiseOrValue<BigNumberish>,
      nullifierHash: PromiseOrValue<BigNumberish>,
      proof: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>

    addPost(
      groupId: PromiseOrValue<BigNumberish>,
      contentCID: PromiseOrValue<BytesLike>,
      merkleTreeRoot: PromiseOrValue<BigNumberish>,
      nullifierHash: PromiseOrValue<BigNumberish>,
      proof: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>

    createGroup(
      groupName: PromiseOrValue<string>,
      identityCommitment: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>

    getCommentIdList(
      postId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>

    getPostIdList(
      groupId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>

    groupCount(overrides?: CallOverrides): Promise<BigNumber>

    groups(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>

    itemCount(overrides?: CallOverrides): Promise<BigNumber>

    items(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>

    joinGroup(
      groupId: PromiseOrValue<BigNumberish>,
      identityCommitment: PromiseOrValue<BigNumberish>,
      username: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>

    semaphore(overrides?: CallOverrides): Promise<BigNumber>
  }

  populateTransaction: {
    addComment(
      groupId: PromiseOrValue<BigNumberish>,
      parentId: PromiseOrValue<BigNumberish>,
      contentCID: PromiseOrValue<BytesLike>,
      merkleTreeRoot: PromiseOrValue<BigNumberish>,
      nullifierHash: PromiseOrValue<BigNumberish>,
      proof: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>

    addPost(
      groupId: PromiseOrValue<BigNumberish>,
      contentCID: PromiseOrValue<BytesLike>,
      merkleTreeRoot: PromiseOrValue<BigNumberish>,
      nullifierHash: PromiseOrValue<BigNumberish>,
      proof: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>

    createGroup(
      groupName: PromiseOrValue<string>,
      identityCommitment: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>

    getCommentIdList(
      postId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>

    getPostIdList(
      groupId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>

    groupCount(overrides?: CallOverrides): Promise<PopulatedTransaction>

    groups(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>

    itemCount(overrides?: CallOverrides): Promise<PopulatedTransaction>

    items(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>

    joinGroup(
      groupId: PromiseOrValue<BigNumberish>,
      identityCommitment: PromiseOrValue<BigNumberish>,
      username: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>

    semaphore(overrides?: CallOverrides): Promise<PopulatedTransaction>
  }
}
