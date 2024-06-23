export function firstOrDefault<T>(source: Iterable<T>, filter?: (element: T) => boolean) {
  if (Array.isArray(source) && !filter) {
    return (source[0] as T) ?? undefined
  }
  if (filter) {
    source = where(source, filter)
  }

  const result = source[Symbol.iterator]().next()
  return result.done ? undefined : result.value
}

export function lastOrDefault<T>(source: Iterable<T>) {
  if (Array.isArray(source)) {
    return (source[source.length - 1] as T) ?? undefined
  }

  const iterator = source[Symbol.iterator]()
  let result = iterator.next()
  let value: T | undefined = undefined

  while (!result.done) {
    value = result.value
    result = iterator.next()
  }

  return value
}

export function defaultIfEmpty<T, TDefault extends T | undefined = undefined>(
  source: Iterable<T>,
  defaultValue?: TDefault,
) {
  if (!Array.isArray(source)) {
    return defaultIfEmptyIterable(source, defaultValue)
  }

  if (source.length > 0) {
    return source as T[]
  }
  return [defaultValue as TDefault]
}

export function* defaultIfEmptyIterable<T, TDefault extends T | undefined = undefined>(
  source: Iterable<T>,
  defaultValue?: TDefault,
) {
  const iterator = source[Symbol.iterator]()
  let result = iterator.next()

  if (result.done) {
    yield defaultValue as TDefault
  }

  while (!result.done) {
    yield result.value
    result = iterator.next()
  }
}

export function minBy<T, TKey>(source: Iterable<T>, selector: (element: T) => TKey) {
  if (Array.isArray(source) && source.length === 0) {
    return undefined
  }

  const iterator = source[Symbol.iterator]()
  let result = iterator.next()

  if (result.done) {
    return undefined
  }

  let min = result.value
  let minKey = selector(min)

  result = iterator.next()
  while (!result.done) {
    const curKey = selector(result.value)
    if (curKey < minKey) {
      min = result.value
      minKey = curKey
    }
    result = iterator.next()
  }

  return min
}

export function* where<T>(source: Iterable<T>, filter: (element: T) => boolean) {
  for (const e of source) {
    if (filter(e)) {
      yield e
    }
  }
}

export function* select<T, TResult>(source: Iterable<T>, selector: (element: T) => TResult) {
  for (const e of source) {
    yield selector(e)
  }
}

export function whereNotNull<T>(source: Iterable<T>) {
  return where(source, e => e != null) as Iterable<Exclude<T, null | undefined>>
}