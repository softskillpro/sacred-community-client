import { Contract, ethers } from 'ethers'
import type { Chain } from 'wagmi/chains'
import {
  arbitrum,
  arbitrumGoerli,
  avalanche,
  avalancheFuji,
  goerli,
  mainnet,
  polygonMumbai,
  sepolia,
} from 'wagmi/chains'
import ForumABI from '../constant/abi/Forum.json'
import type { Forum } from '@/types/contract/Forum'
import { SemaphoreEthers } from '@semaphore-protocol/data'
import type { Address } from '@/types/common'

export const mumbaiTestnetMaticContractAddress = `0x0000000000000000000000000000000000001010`

export const SemaphoreContractAddress = process.env
  .NEXT_PUBLIC_SEMAPHORE_CONTRACT_ADDRESS as `0x${string}`
export const ForumContractAddress: Address = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as Address
export const unirepAddress = process.env.NEXT_PUBLIC_UNIREP_ADDRESS

export const attesterAddress = process.env.NEXT_PUBLIC_ATTESTER_ADDRESS

export const RELAYER_URL =
  process.env.NEXT_PUBLIC_RELAYER_URL ?? 'http://127.0.0.1:3000'

export const erc20dummyABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'authorizer',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'nonce',
        type: 'bytes32',
      },
    ],
    name: 'AuthorizationCanceled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'authorizer',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'nonce',
        type: 'bytes32',
      },
    ],
    name: 'AuthorizationUsed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Blacklisted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'userAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address payable',
        name: 'relayerAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'functionSignature',
        type: 'bytes',
      },
    ],
    name: 'MetaTransactionExecuted',
    type: 'event',
  },
  { anonymous: false, inputs: [], name: 'Pause', type: 'event' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'newRescuer',
        type: 'address',
      },
    ],
    name: 'RescuerChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'previousAdminRole',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'newAdminRole',
        type: 'bytes32',
      },
    ],
    name: 'RoleAdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleGranted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleRevoked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'UnBlacklisted',
    type: 'event',
  },
  { anonymous: false, inputs: [], name: 'Unpause', type: 'event' },
  {
    inputs: [],
    name: 'APPROVE_WITH_AUTHORIZATION_TYPEHASH',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'BLACKLISTER_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'CANCEL_AUTHORIZATION_TYPEHASH',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'DECREASE_ALLOWANCE_WITH_AUTHORIZATION_TYPEHASH',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'DEPOSITOR_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'EIP712_VERSION',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'INCREASE_ALLOWANCE_WITH_AUTHORIZATION_TYPEHASH',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'META_TRANSACTION_TYPEHASH',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'PAUSER_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'PERMIT_TYPEHASH',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'RESCUER_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'TRANSFER_WITH_AUTHORIZATION_TYPEHASH',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'WITHDRAW_WITH_AUTHORIZATION_TYPEHASH',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'uint256', name: 'validAfter', type: 'uint256' },
      { internalType: 'uint256', name: 'validBefore', type: 'uint256' },
      { internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
      { internalType: 'uint8', name: 'v', type: 'uint8' },
      { internalType: 'bytes32', name: 'r', type: 'bytes32' },
      { internalType: 'bytes32', name: 's', type: 'bytes32' },
    ],
    name: 'approveWithAuthorization',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'authorizer', type: 'address' },
      { internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
    ],
    name: 'authorizationState',
    outputs: [
      {
        internalType: 'enum GasAbstraction.AuthorizationState',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'blacklist',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'blacklisters',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'authorizer', type: 'address' },
      { internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
      { internalType: 'uint8', name: 'v', type: 'uint8' },
      { internalType: 'bytes32', name: 'r', type: 'bytes32' },
      { internalType: 'bytes32', name: 's', type: 'bytes32' },
    ],
    name: 'cancelAuthorization',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'decrement', type: 'uint256' },
      { internalType: 'uint256', name: 'validAfter', type: 'uint256' },
      { internalType: 'uint256', name: 'validBefore', type: 'uint256' },
      { internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
      { internalType: 'uint8', name: 'v', type: 'uint8' },
      { internalType: 'bytes32', name: 'r', type: 'bytes32' },
      { internalType: 'bytes32', name: 's', type: 'bytes32' },
    ],
    name: 'decreaseAllowanceWithAuthorization',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'bytes', name: 'depositData', type: 'bytes' },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'userAddress', type: 'address' },
      { internalType: 'bytes', name: 'functionSignature', type: 'bytes' },
      { internalType: 'bytes32', name: 'sigR', type: 'bytes32' },
      { internalType: 'bytes32', name: 'sigS', type: 'bytes32' },
      { internalType: 'uint8', name: 'sigV', type: 'uint8' },
    ],
    name: 'executeMetaTransaction',
    outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'uint256', name: 'index', type: 'uint256' },
    ],
    name: 'getRoleMember',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
    name: 'getRoleMemberCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'increment', type: 'uint256' },
      { internalType: 'uint256', name: 'validAfter', type: 'uint256' },
      { internalType: 'uint256', name: 'validBefore', type: 'uint256' },
      { internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
      { internalType: 'uint8', name: 'v', type: 'uint8' },
      { internalType: 'bytes32', name: 'r', type: 'bytes32' },
      { internalType: 'bytes32', name: 's', type: 'bytes32' },
    ],
    name: 'increaseAllowanceWithAuthorization',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: 'newName', type: 'string' },
      { internalType: 'string', name: 'newSymbol', type: 'string' },
      { internalType: 'uint8', name: 'newDecimals', type: 'uint8' },
      { internalType: 'address', name: 'childChainManager', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'initialized',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'isBlacklisted',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'nonces',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pausers',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
      { internalType: 'uint8', name: 'v', type: 'uint8' },
      { internalType: 'bytes32', name: 'r', type: 'bytes32' },
      { internalType: 'bytes32', name: 's', type: 'bytes32' },
    ],
    name: 'permit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IERC20',
        name: 'tokenContract',
        type: 'address',
      },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'rescueERC20',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'rescuers',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'recipient', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'sender', type: 'address' },
      { internalType: 'address', name: 'recipient', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'uint256', name: 'validAfter', type: 'uint256' },
      { internalType: 'uint256', name: 'validBefore', type: 'uint256' },
      { internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
      { internalType: 'uint8', name: 'v', type: 'uint8' },
      { internalType: 'bytes32', name: 'r', type: 'bytes32' },
      { internalType: 'bytes32', name: 's', type: 'bytes32' },
    ],
    name: 'transferWithAuthorization',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'unBlacklist',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: 'newName', type: 'string' },
      { internalType: 'string', name: 'newSymbol', type: 'string' },
    ],
    name: 'updateMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'uint256', name: 'validAfter', type: 'uint256' },
      { internalType: 'uint256', name: 'validBefore', type: 'uint256' },
      { internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
      { internalType: 'uint8', name: 'v', type: 'uint8' },
      { internalType: 'bytes32', name: 'r', type: 'bytes32' },
      { internalType: 'bytes32', name: 's', type: 'bytes32' },
    ],
    name: 'withdrawWithAuthorization',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // // Read-Only Functions
  // "function balanceOf(address owner) view returns (uint256)",
  // "function decimals() view returns (uint8)",
  // // "function symbol() view returns (string)",
  // "function name() view returns (string)",
  // "function implementation() view returns (address)",

  // // Authenticated Functions
  // "function transfer(address to, uint amount) returns (bool)",

  // // Events
  // "event Transfer(address indexed from, address indexed to, uint amount)"
]

export const supportedChains: { [key: string]: Chain } = {
  [polygonMumbai.id]: polygonMumbai,
  [goerli.id]: goerli,
  [sepolia.id]: sepolia,
  [mainnet.id]: mainnet,
  [avalanche.id]: avalanche,
  [arbitrum.id]: arbitrum,
  [avalancheFuji.id]: avalancheFuji,
  [arbitrumGoerli.id]: arbitrumGoerli,
}

export const chainLogos: { [key: string]: string } = {
  [polygonMumbai.id]: '/poly.png',
  [goerli.id]: '/goerli.png',
  [sepolia.id]: '/eth.png',
  [avalancheFuji.id]: '/avax.png',
  [mainnet.id]: '/eth.png',
  [avalanche.id]: '/avax.png',
  [arbitrum.id]: '/arbitrum.png',
  [arbitrumGoerli.id]: '/arbitrum.png',
}

export const supportedChainsArray = Object.keys(supportedChains).map(
  k => supportedChains[k]
)

/** PROVIDERS */

export const getRpcProvider = (chainId: number) => providerMap[chainId]

export const jsonRPCProvider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_POLYGON_MUMBAI_URL,
  {
    name: polygonMumbai.name,
    chainId: polygonMumbai.id,
  }
)

export const jsonRPCProviderGoerli = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_GOERLI_URL,
  {
    name: goerli.name,
    chainId: goerli.id,
  } as any
)

export const jsonRPCProviderSepolia = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_SEPOLIA_URL,
  {
    name: sepolia.name,
    chainId: sepolia.id,
  }
)

export const jsonRPCProviderMainnet = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_MAINNET_URL,
  {
    name: mainnet.name,
    chainId: mainnet.id,
  }
)

export const jsonRPCProviderAvalancheMainnet =
  new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_AVALANCHE_MAINNET_URL,
    {
      name: avalanche.name,
      chainId: avalanche.id,
    }
  )

export const jsonRPCProviderAvalancheFuji =
  new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_AVALANCHE_FUJI_URL,
    {
      name: avalancheFuji.name,
      chainId: avalancheFuji.id,
    }
  )

export const jsonRPCProviderArbitrumMainnet =
  new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_ARBITRUM_MAINNET_URL,
    {
      name: arbitrum.name,
      chainId: arbitrum.id,
    }
  )

export const jsonRPCProviderArbitrumGoerli =
  new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_ARBITRUM_GOERLI_URL,
    {
      name: arbitrumGoerli.name,
      chainId: arbitrumGoerli.id,
    }
  )

export const providerMap = {
  [polygonMumbai.id]: jsonRPCProvider,
  [avalancheFuji.id]: jsonRPCProviderAvalancheFuji,
  [sepolia.id]: jsonRPCProviderSepolia,
  [goerli.id]: jsonRPCProviderGoerli,
  [mainnet.id]: jsonRPCProviderMainnet,
  [avalanche.id]: jsonRPCProviderAvalancheMainnet,
  [arbitrum.id]: jsonRPCProviderArbitrumMainnet,
  [arbitrumGoerli.id]: jsonRPCProviderArbitrumGoerli,
}
/** */

const abiInterface = new ethers.utils.Interface(ForumABI.abi).functions

/** CONTRACTS */

export const forumContract = new Contract(
  ForumContractAddress,
  ForumABI.abi,
  jsonRPCProvider
) as Forum

export const semaphoreContract = new SemaphoreEthers(
  process.env.NEXT_PUBLIC_POLYGON_MUMBAI_URL,
  {
    address: SemaphoreContractAddress,
  }
)
/** */
