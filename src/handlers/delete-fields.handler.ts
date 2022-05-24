import { ParseFieldsOptions } from '../interface'

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
