import { GraphQLResolveInfo as Info } from 'graphql'
import graphqlFields, { Options as GraphQLFieldsOptions } from 'graphql-fields'

export interface ParseFieldsOptions {
   includeFields: string[]
   excludeFields: string[]
}

export interface Options {
   parseFieldsOptions?: ParseFieldsOptions
   graphQLFieldsOptions?: GraphQLFieldsOptions
}

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
 * @method deleteFields Delete specified fields in the object
 * @param obj any
 * @param parseFieldsOptions ParseFieldsOptions
 * @returns any
 */
export function deleteFields(obj: any, parseFieldsOptions?: ParseFieldsOptions) {
   if (obj && parseFieldsOptions) {
      const { excludeFields, includeFields } = parseFieldsOptions
      excludeFields?.forEach((field) => delete obj[field])

      const entries = Object.entries(obj)

      entries.forEach((entry) => {
         if (typeof entry[1] === 'object' && !(entry[1] instanceof Array)) {
            const field = deleteFields(entry[1], { excludeFields, includeFields })

            if (Object.keys(field).length === 0) {
               if (!includeFields || includeFields.length === 0) {
                  delete obj[entry[0]]
               } else {
                  includeFields.forEach((pro) => (field[pro] = true))
               }
            }
         }
      })
   }

   return obj
}

/**
 * @method parseSelectedFields Convert AST of info object to select object in Prisma.
 * @param info Info
 * @param options Options | undefined
 * @returns any
 */
export function parseSelectedFields(info: Info, options?: Options): any {
   if (!options) {
      options = {
         graphQLFieldsOptions: {
            processArguments: false,
            excludedFields: ['__typename'],
         },
      }
   } else if (!options.graphQLFieldsOptions) {
      options.graphQLFieldsOptions = {
         processArguments: false,
         excludedFields: ['__typename'],
      }
   }

   const { graphQLFieldsOptions, parseFieldsOptions } = options

   // @ts-ignore
   const selectFields = graphqlFields(info, {}, graphQLFieldsOptions)
   const select = convertSelectedFields(selectFields)
   if (parseFieldsOptions) {
      deleteFields(select, parseFieldsOptions)

      parseFieldsOptions.includeFields?.forEach((field) => (select[field] = true))
   }

   return select
}
