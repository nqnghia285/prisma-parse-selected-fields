import { GraphQLResolveInfo as Info } from 'graphql'
import graphqlFields, { Options } from 'graphql-fields'

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
 * @param options Options | undefined
 * @returns any
 */
export function parseSelectedFields(info: Info, options: Options = { processArguments: false, excludedFields: ['__typename'] }): any {
   // @ts-ignore
   const selectFields = graphqlFields(info, {}, options)
   return convertSelectedFields(selectFields)
}
