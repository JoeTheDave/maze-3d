import { useLoaderData } from '@remix-run/react'
import { mazeGenerator } from '~/lib/mazeGenerator'
import mazeDefaults from '~/lib/mazeDefaults'
import Maze2D from '~/components/Maze2D'

import type { MazeData } from '~/lib/mazeGenerator'
import type { LoaderFunction } from '@remix-run/server-runtime'

export const loader: LoaderFunction = async ({ params, request }) => {
  const url = new URL(request.url)
  const seed = params.seed || ''
  const width = parseInt(url.searchParams.get('width') || `${mazeDefaults.defaultWidth}`)
  const height = parseInt(url.searchParams.get('height') || `${mazeDefaults.defaultHeight}`)
  const segLength = parseInt(url.searchParams.get('seg-length') || `${mazeDefaults.defaultSegmentLength}`)
  const mazeType = url.searchParams.get('type') || `${mazeDefaults.mazeType}`

  const mazeData = mazeGenerator.generate({
    seed,
    width,
    height,
    segLength,
  })

  return {
    maze: mazeData,
    meta: {
      seed,
      width,
      height,
      segLength,
      mazeType,
    },
  }
}

export default function SeedRoute() {
  const { maze, meta } = useLoaderData<{
    maze: MazeData[]
    meta: { seed: string; width: number; height: number; segLength: number; mazeType: string }
  }>()

  return meta.mazeType === '2d' ? (
    <Maze2D
      maze={maze as MazeData[]}
      mazeHeight={meta.height}
      mazeWidth={meta.width}
      mazeSegLength={meta.segLength}
      mazeSeed={meta.seed}
    />
  ) : (
    <div></div>
  )
}
