import { describe, expect, test } from 'vitest'
import {
  setIndexOf,
  setMoveElementAfterAnother,
  setSliceFromIndex
} from './set.js'

describe('misc', () => {
  describe('Functions for Set', () => {
    test('index of element', () => {
      const fn = setIndexOf
      const set = new Set([1, 2, 3, 4])

      expect(fn(set, 1)).toBe(0)
      expect(fn(set, 2)).toBe(1)
      expect(fn(set, 4)).toBe(3)
      expect(fn(set, 20)).toBe(-1)
    })

    test('move element after another', () => {
      const fn = setMoveElementAfterAnother
      const set = new Set([1, 2, 3, 4])

      expect(() => fn(set, 1, 1)).toThrow(Error)
      expect(() => fn(set, 0, 1)).toThrow(Error)
      expect(fn(set, 1, 2)).toMatchObject(new Set([2, 1, 3, 4]))
      expect(fn(set, 1, 4)).toMatchObject(new Set([2, 3, 4, 1]))
      expect(fn(set, 3, 4)).toMatchObject(new Set([2, 1, 4, 3]))
    })

    test('slice from index', () => {
      const fn = setSliceFromIndex
      const set = new Set([1, 2, 3, 4])

      expect(fn(set, -1)).toMatchObject(new Set([1, 2, 3, 4]))
      expect(fn(set, 0)).toMatchObject(new Set([1, 2, 3, 4]))
      expect(fn(set, 1)).toMatchObject(new Set([2, 3, 4]))
      expect(fn(set, 4)).toMatchObject(new Set([]))
      expect(fn(set, 40)).toMatchObject(new Set([]))
    })
  })
})
