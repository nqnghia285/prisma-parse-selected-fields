import { GraphQLResolveInfo } from 'graphql'
import { GraphQLParseFieldsOptions } from '../interface'
declare function graphQLParseFields(info: GraphQLResolveInfo, obj?: object, opts?: GraphQLParseFieldsOptions): any

export default graphQLParseFields
