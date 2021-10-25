// Utils
import { mutation, operationStore, query } from '@urql/svelte'

/** Generates operation store function combo creation functions */
const opFn =
  (queryFn) =>
  /** @typedef {import('@urql/svelte/dist/types').OperationStore} OperationStore
   * @returns {OperationStore} Query func operation store combo. You can subscribe to it or call to query,  */
  (gql, vars) =>
    Object.defineProperties(function q(qVars) {
      qVars && (q.variables = qVars)
      return queryFn(q)
    }, Object.getOwnPropertyDescriptors(operationStore(gql, vars)))

/** Query Operation Store: Creates a query function store from a gql query.
 *
 * usage detailed in https://waa.ai/gist-urql-patterns */
export const queryOp = opFn(query)
/** Mutation Operation Store: Creates a mutation function store from a gql query */
export const mutationOp = opFn(mutation)
