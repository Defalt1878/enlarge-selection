import { Enumerable } from './Enumerable/Enumerable.ts'

declare global {
  interface Array<T> {
    asEnumerable: () => Enumerable<T>
  }
}

export {}
