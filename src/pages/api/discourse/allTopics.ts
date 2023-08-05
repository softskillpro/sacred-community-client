import type { NextApiRequest, NextApiResponse } from 'next'
import { getHandler } from '@pages/api/discourse/helper'

type Topic = {
  id: number
  title: string
  slug: string
  created_at: string
}

type ResponseData = {
  topics: Topic[]
}

export default async function (req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const url = `${process.env.NEXT_PUBLIC_DISCOURSE_API_ENDPOINT}/latest.json`
  await getHandler(res)(url)
}
