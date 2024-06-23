import { Enumerable } from '../Enumerable/Enumerable.ts'

Object.defineProperty(Array.prototype, 'asEnumerable', {
  value: function <T = never>() {
    return Enumerable(this as T[])
  },
})
