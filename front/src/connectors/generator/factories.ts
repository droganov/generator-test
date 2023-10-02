/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  ClientResolverFactory,
  EndpointConfig,
  RequestInput,
  EndpointOptions,
  ServerResolverFactory,
} from '@yobta/generator'
import { createRequestParams } from '@yobta/generator'
import type { SWRHookFactory } from '@yobta/generator/dist/factories/hooks'
import type { SWRConfiguration } from 'swr'
import useSWR from 'swr'
import { countRequests } from '../../components/RequestIndication/RequestIndicationStore'

const basePath = 'http://localhost:8000'

export const createServerResolver: ServerResolverFactory =
  (config) => async (input, options) => {
    const [url, init] = createRequestParams(config, input, options)
    const response = await fetch(`${basePath}${url}`, init)
    return response.json()
  }

const clientFetch = async <Data>([url, init]: [
  url: RequestInfo,
  init: RequestInit,
]): Promise<Data> => {
  countRequests(1)
  const response = await fetch(`${basePath}${url}`, init).finally(() => {
    countRequests(-1)
  })
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
    fetchOptions?: EndpointOptions
  ) => {
    const [url, init] = createRequestParams(config, requestInput, fetchOptions)
    return useSWR<Output>([url, init], clientFetch, swrOptions)
  }
