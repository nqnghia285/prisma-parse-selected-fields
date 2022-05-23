export interface GraphQLParseFieldsOptions {
   processArguments?: boolean
   excludedFields?: string[]
}

export interface ParseFieldsOptions {
   includeFields: string[]
   excludeFields: string[]
}

export interface Options {
   parseFieldsOptions?: ParseFieldsOptions
   graphQLParseFieldsOptions?: GraphQLParseFieldsOptions
}
