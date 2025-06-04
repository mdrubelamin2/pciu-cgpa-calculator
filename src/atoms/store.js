import { getDefaultStore } from 'jotai'

export const store = getDefaultStore()
export const getAtom = store.get
export const setAtom = store.set
