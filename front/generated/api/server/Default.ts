/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import * as Types from '../factories/types'
import { createServerResolver } from '../../../src/connectors/generator/factories'

/**
 * Add Expense
 * @returns any Successful Response
 */
export const addExpense = createServerResolver<
  Types.DefaultAddExpenseInput,
  Types.DefaultAddExpenseOutput
>({
  path: '/expense/add',
  method: 'POST',
  mediaType: 'multipart/form-data',
})
