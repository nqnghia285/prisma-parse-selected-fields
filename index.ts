import { GraphQLResolveInfo } from 'graphql'
import graphqlFields, { Options } from 'graphql-fields'

export interface GraphQLFieldsOptions extends Options {}
export interface Info extends GraphQLResolveInfo {}

/**
 * @method convertSelectedFields Convert AST object to select object in Prisma.
 * @param selectFields any
 * @returns any
 */
export function convertSelectedFields(selectFields: any): any {
   const entries = Object.entries(selectFields)

   entries.forEach((e) => {
      if (e[1] instanceof Array || !(e[1] instanceof Object && Object.keys(e[1]).length > 0)) {
         selectFields[e[0]] = true
      } else {
         selectFields[e[0]] = {
            select: convertSelectedFields(selectFields[e[0]]),
         }
      }
   })

   return selectFields
}

/**
 * @method parseSelectedFields Convert AST of info object to select object in Prisma.
 * @param info Info
 * @param options GraphQLFieldsOptions | undefined
 * @returns any
 */
export function parseSelectedFields(info: Info, options?: GraphQLFieldsOptions): any {
   const selectFields = graphqlFields(info, {}, options)
   return convertSelectedFields(selectFields)
}
