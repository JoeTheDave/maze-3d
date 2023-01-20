import { useSearchParams } from '@remix-run/react'
import mazeDefaults from '~/lib/mazeDefaults'

export const useQueryStringNavigator = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const getValue = (term: string) => {
    return (searchParams.get(term) || '').toLowerCase()
  }

  const setParam = (term: string, value: string) => {
    if (value) {
      searchParams.set(term, value)
    } else {
      searchParams.delete(term)
    }
  }

  const getMazeWidth = () => {
    try {
      return parseInt(getValue('width') || `${mazeDefaults.defaultWidth}`)
    } catch {
      return mazeDefaults.defaultWidth
    }
  }

  const getMazeHeight = () => {
    try {
      return parseInt(getValue('height') || `${mazeDefaults.defaultHeight}`)
    } catch {
      return mazeDefaults.defaultHeight
    }
  }

  const getSegmentLength = () => {
    try {
      return parseInt(getValue('segmentLength') || `${mazeDefaults.defaultSegmentLength}`)
    } catch {
      return mazeDefaults.defaultSegmentLength
    }
  }

  const getMazeType = () => {
    return (getValue('type') || mazeDefaults.mazeType) as '2d' | '3d'
  }

  interface SetConfigValuesInput {
    width: number
    height: number
    segmentLength: number
    type: '2d' | '3d'
  }

  const setConfigValues = ({ width, height, segmentLength, type }: SetConfigValuesInput) => {
    setParam('width', width === mazeDefaults.defaultWidth ? '' : width.toString())
    setParam('height', height === mazeDefaults.defaultHeight ? '' : height.toString())
    setParam('seg-length', segmentLength === mazeDefaults.defaultSegmentLength ? '' : segmentLength.toString())
    setParam('type', type === mazeDefaults.mazeType ? '' : type)
    setSearchParams(searchParams)
  }

  return {
    getMazeWidth,
    getMazeHeight,
    getSegmentLength,
    getMazeType,
    setConfigValues,
  }
}
