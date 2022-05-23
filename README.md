# Prisma Parse Selected Fields [![Build Status](https://github.com/Links2004/arduinoWebSockets/workflows/CI/badge.svg?branch=master)](https://github.com/nqnghia285/prisma-parse-selected-fields.git)

Prisma Parse Selected Fields supports parsing selected fields of AST in GraphQL server and Prisma ORM.

### Interfaces:

```typescript
interface ParseFieldsOptions {
   includeFields: string[]
   excludeFields: string[]
}
```

```typescript
interface Options {
   parseFieldsOptions?: ParseFieldsOptions
   graphQLParseFieldsOptions?: GraphQLParseFieldsOptions
}
```

### Functions:

```typescript
/**
 * @method convertSelectedFields Convert AST object to select object in Prisma.
 * @param selectFields any
 * @returns any
 */
function convertSelectedFields(selectFields: any): any
```

```typescript
/**
 * @method deleteFields Delete specified fields in the object
 * @param obj any
 * @param parseFieldsOptions ParseFieldsOptions
 * @returns any
 */
function deleteFields(obj: any, parseFieldsOptions?: ParseFieldsOptions): any
```

```typescript
/**
 * @method parseSelectedFields Convert AST of info object to select object in Prisma.
 * @param info GraphQLResolveInfo
 * @param options Options | undefined
 * @returns any
 */
function parseSelectedFields(info: GraphQLResolveInfo, options?: Options): any
```

### Example:

```typescript
// ES6
...
import { GraphQLResolveInfo as Info } from 'graphql'
import { parseSelectedFields } from "prisma-parse-selected-fields";

async function resolver(root: any, args: any, { prisma }: any, info: Info): Promise<prisma.User> {
   const select = parseSelectedFields(info)

   return await prisma.user.findMany({
      ....
      where: {...},
      select: select,
      ...
   })
}
```
