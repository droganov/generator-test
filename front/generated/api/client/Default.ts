/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

'use client'

import * as Types from '../factories/types'
import { createClientResolver } from '../../../src/connectors/generator/factories'

/**
 * Add Expense
 * @returns any Successful Response
 */
export const addExpense = createClientResolver<
  Types.DefaultAddExpenseInput,
  Types.DefaultAddExpenseOutput
>({
  path: '/expense/add',
  method: 'POST',
  mediaType: 'multipart/form-data',
})
