'use strict'

function _extends() {
   _extends =
      Object.assign ||
      function (target) {
         for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i]
            for (var key in source) {
               if (Object.prototype.hasOwnProperty.call(source, key)) {
                  target[key] = source[key]
               }
            }
         }
         return target
      }
   return _extends.apply(this, arguments)
}

function _objectSpread(target) {
   for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {}
      var ownKeys = Object.keys(source)
      if (typeof Object.getOwnPropertySymbols === 'function') {
         ownKeys = ownKeys.concat(
            Object.getOwnPropertySymbols(source).filter(function (sym) {
               return Object.getOwnPropertyDescriptor(source, sym).enumerable
            })
         )
      }
      ownKeys.forEach(function (key) {
         _defineProperty(target, key, source[key])
      })
   }
   return target
}

function _defineProperty(obj, key, value) {
   if (key in obj) {
      Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true })
   } else {
      obj[key] = value
   }
   return obj
}

var options = {}

function getSelections(ast) {
   if (ast && ast.selectionSet && ast.selectionSet.selections && ast.selectionSet.selections.length) {
      return ast.selectionSet.selections
   }

   return []
}

function isFragment(ast) {
   return ast.kind === 'InlineFragment' || ast.kind === 'FragmentSpread'
}

function getAST(ast, info) {
   if (ast.kind === 'FragmentSpread') {
      var fragmentName = ast.name.value
      return info.fragments[fragmentName]
   }

   return ast
}

function getArguments(ast, info) {
   return ast.arguments.map(function (argument) {
      var argumentValue = getArgumentValue(argument.value, info)
      return _defineProperty({}, argument.name.value, {
         kind: argument.value.kind,
         value: argumentValue,
      })
   })
}

function getArgumentValue(arg, info) {
   switch (arg.kind) {
      case 'FloatValue':
         return parseFloat(arg.value)

      case 'IntValue':
         return parseInt(arg.value, 10)

      case 'Variable':
         return info.variableValues[arg.name.value]

      case 'ListValue':
         return arg.values.map(function (argument) {
            return getArgumentValue(argument, info)
         })

      case 'ObjectValue':
         return arg.fields.reduce(function (argValue, objectField) {
            argValue[objectField.name.value] = getArgumentValue(objectField.value, info)
            return argValue
         }, {})

      default:
         return arg.value
   }
}

function getDirectiveValue(directive, info) {
   var arg = directive.arguments[0] // only arg on an include or skip directive is "if"

   if (arg.value.kind !== 'Variable') {
      return !!arg.value.value
   }

   return info.variableValues[arg.value.name.value]
}

function getDirectiveResults(ast, info) {
   var directiveResult = {
      shouldInclude: true,
      shouldSkip: false,
   }
   return ast.directives.reduce(function (result, directive) {
      switch (directive.name.value) {
         case 'include':
            return _objectSpread({}, result, {
               shouldInclude: getDirectiveValue(directive, info),
            })

         case 'skip':
            return _objectSpread({}, result, {
               shouldSkip: getDirectiveValue(directive, info),
            })

         default:
            return result
      }
   }, directiveResult)
}

function flattenAST(ast, info, obj) {
   obj = obj || {}
   return getSelections(ast).reduce(function (flattened, a) {
      if (a.directives && a.directives.length) {
         var _getDirectiveResults = getDirectiveResults(a, info),
            shouldInclude = _getDirectiveResults.shouldInclude,
            shouldSkip = _getDirectiveResults.shouldSkip // field/fragment is not included if either the @skip condition is true or the @include condition is false
         // https://facebook.github.io/graphql/draft/#sec--include

         if (shouldSkip || !shouldInclude) {
            return flattened
         }
      }

      if (isFragment(a)) {
         flattened = flattenAST(getAST(a, info), info, flattened)
      } else {
         var name = a.name.value

         if (options.excludedFields.indexOf(name) !== -1) {
            return flattened
         }

         if (flattened[name] && flattened[name] !== '__arguments') {
            _extends(flattened[name], flattenAST(a, info, flattened[name]))
         } else {
            flattened[name] = flattenAST(a, info)
         }

         if (options.processArguments) {
            // check if the current field has arguments
            if (a.arguments && a.arguments.length) {
               _extends(flattened[name], {
                  __arguments: getArguments(a, info),
               })
            }
         }
      }

      return flattened
   }, obj)
}

export function graphQLParseFields(info) {
   var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
   var opts =
      arguments.length > 2 && arguments[2] !== undefined
         ? arguments[2]
         : {
              processArguments: false,
           }
   var fields = info.fieldNodes || info.fieldASTs
   options.processArguments = opts.processArguments
   options.excludedFields = opts.excludedFields || []
   return (
      fields.reduce(function (o, ast) {
         return flattenAST(ast, info, o)
      }, obj) || {}
   )
}
