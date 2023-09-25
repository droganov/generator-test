/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  ClientResolverFactory,
  EndpointConfig,
  RequestInput,
  SchemaOptions,
  ServerResolverFactory,
} from '@yobta/generator'
import { createRequestParams } from '@yobta/generator'
import type { SWRHookFactory } from '@yobta/generator/dist/factories/hooks'
import type { SWRConfiguration } from 'swr'
import useSWR from 'swr'

export const createServerResolver: ServerResolverFactory =
  (config) => async (input, options) => {
    const [url, init] = createRequestParams(config, input, options)
    const response = await fetch(url, init)
    return response.json()
  }

const clientFetch = async <Data>([url, init]: [
  url: RequestInfo,
  init: RequestInit,
]): Promise<Data> => {
  const response = await fetch(url, init)
  if (!response.ok) {
    throw new Error('Error fetching data')
  }
  try {
    return response.json()
  } catch (error) {
    throw new Error('Error parsing data')
  }
}

export const createClientResolver: ClientResolverFactory =
  (config) => async (requestInput, requestConfig) => {
    const params = createRequestParams(config, requestInput, requestConfig)
    return clientFetch(params)
  }

export const createSwrHook: SWRHookFactory =
  <Input extends RequestInput, Output>(config: EndpointConfig) =>
  (
    requestInput: Input,
    swrOptions?: SWRConfiguration<Output>,
    fetchOptions?: SchemaOptions
  ) => {
    const [url, init] = createRequestParams(config, requestInput, fetchOptions)
    return useSWR<Output>([url, init], clientFetch, swrOptions)
  }