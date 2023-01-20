import cc from 'classcat'
import { useState, useEffect } from 'react'
import { useLoaderData } from '@remix-run/react'
import { useWindowSize } from '@react-hook/window-size'
import { mazeGenerator } from '~/lib/mazeGenerator'
import { useKeyPress } from '~/lib/useKeyPress'
import mazeDefaults from '~/lib/mazeDefaults'

import type { MazeData } from '~/lib/mazeGenerator'
import type { LoaderFunction } from '@remix-run/server-runtime'

export const loader: LoaderFunction = async ({ params, request }) => {
  const url = new URL(request.url)
  const seed = params.seed || ''

  const width = parseInt(url.searchParams.get('width') || `${mazeDefaults.defaultWidth}`)
  const height = parseInt(url.searchParams.get('height') || `${mazeDefaults.defaultHeight}`)
  const segLength = parseInt(url.searchParams.get('seg-length') || `${mazeDefaults.defaultSegmentLength}`)

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
    },
  }
}

export default function SeedRoute() {
  const { maze, meta } = useLoaderData<{
    maze: MazeData[]
    meta: { seed: string; width: number; height: number; segLength: number }
  }>()
  const [windowWidth, windowHeight] = useWindowSize()
  const [position, setPosition] = useState<MazeData>(maze.find(d => d.isEntrance) as MazeData)
  const upPressed = useKeyPress('ArrowUp')
  const rightPressed = useKeyPress('ArrowRight')
  const downPressed = useKeyPress('ArrowDown')
  const leftPressed = useKeyPress('ArrowLeft')

  useEffect(() => {
    if (upPressed && position.nNeighbor && !position.nWall) {
      setPosition(maze.find(c => c.id === position.nNeighbor) as MazeData)
    }
    if (rightPressed && position.eNeighbor && !position.eWall) {
      setPosition(maze.find(c => c.id === position.eNeighbor) as MazeData)
    }
    if (downPressed && position.sNeighbor && !position.sWall) {
      setPosition(maze.find(c => c.id === position.sNeighbor) as MazeData)
    }
    if (leftPressed && position.wNeighbor && !position.wWall) {
      setPosition(maze.find(c => c.id === position.wNeighbor) as MazeData)
    }
  }, [upPressed, rightPressed, downPressed, leftPressed])

  useEffect(() => {
    setPosition(maze.find(d => d.isEntrance) as MazeData)
  }, [meta.height, meta.width, meta.segLength, meta.seed])

  const mazeSectionSize = Math.min(
    Math.floor((windowWidth - 100) / meta.width),
    Math.floor((windowHeight - 100) / meta.height),
  )
  const mazeContainerWidth = mazeSectionSize * meta.width

  return (
    <>
      <div style={{ width: mazeContainerWidth }} className={cc(['flex', 'flex-wrap', 'mx-auto'])}>
        {maze.map(section => {
          const styles: any = { width: mazeSectionSize, height: mazeSectionSize }
          styles.borderTop = `solid 1px ${section.nWall ? '#444' : 'transparent'}`
          styles.borderRight = `solid 1px ${section.eWall ? '#444' : 'transparent'}`
          styles.borderBottom = `solid 1px ${section.sWall ? '#444' : 'transparent'}`
          styles.borderLeft = `solid 1px ${section.wWall ? '#444' : 'transparent'}`

          if (section.isExit) {
            styles.backgroundColor = 'rgba(0, 200, 0, 0.075)'
          }
          if (position.id === section.id) {
            styles.backgroundColor = 'rgba(50, 200, 200, 0.2)'
          }

          return <div key={section.id} style={styles}></div>
        })}
      </div>
    </>
  )
}
