# Prisma Parse Selected Fields [![Build Status](https://github.com/Links2004/arduinoWebSockets/workflows/CI/badge.svg?branch=master)](https://github.com/nqnghia285/prisma-parse-selected-fields.git)

Prisma Parse Selected Fields supports parsing selected fields of AST in GraphQL server and Prisma ORM.

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
 * @method parseSelectedFields Convert AST of info object to select object in Prisma.
 * @param info Info
 * @param options GraphQLFieldsOptions | undefined
 * @returns any
 */
function parseSelectedFields(info: Info, options?: GraphQLFieldsOptions): any
```

### Example:

```typescript
// ES6
...
import { parseSelectedFields, Info } from "prisma-parse-selected-fields";
import { ConnectionDevelopmentENVType, ConnectionProductionENVType, ConnectionType } from "sequelize-connection/dist/lib/interface"

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
