import { GraphQLResolveInfo } from 'graphql'
import { Options } from '../interface'
import { convertSelectedFields } from './convert-selected-fields.handler'
import { deleteFields } from './delete-fields.handler'
import { graphQLParseFields } from './graphql-parse-fields.handler'

/**
 * @method parseSelectedFields Convert AST of info object to select object in Prisma.
 * @param info Info
 * @param options Options | undefined
 * @returns any
 */
export function parseSelectedFields(info: GraphQLResolveInfo, options?: Options): any {
   if (!options) {
      options = {
         graphQLParseFieldsOptions: {
            processArguments: false,
            excludedFields: ['__typename'],
         },
      }
   } else if (!options.graphQLParseFieldsOptions) {
      options.graphQLParseFieldsOptions = {
         processArguments: false,
         excludedFields: ['__typename'],
      }
   }

   const { graphQLParseFieldsOptions, parseFieldsOptions } = options

   const selectFields = graphQLParseFields(info, {}, graphQLParseFieldsOptions)
   const select = convertSelectedFields(selectFields)
   if (parseFieldsOptions) {
      deleteFields(select, parseFieldsOptions)

      parseFieldsOptions.includeFields?.forEach((field) => (select[field] = true))
   }

   return select
}
