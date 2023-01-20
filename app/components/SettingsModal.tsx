import { useState } from 'react'
import cc from 'classcat'
import { useQueryStringNavigator } from '~/lib/useQueryStringNavigator'

import type { FC } from 'react'

interface ContainerProps {
  show: React.ReactNode
  closeHandler: () => void
}

const Container: FC<ContainerProps> = ({ show, closeHandler }) => {
  const queryStringNavigator = useQueryStringNavigator()
  const [mazeWidth, setMazeWidth] = useState<number>(queryStringNavigator.getMazeWidth())
  const [mazeHeight, setMazeHeight] = useState<number>(queryStringNavigator.getMazeHeight())
  const [segmentLength, setSegmentLength] = useState<number>(queryStringNavigator.getSegmentLength())
  const [mazeType, setMazeType] = useState<'2d' | '3d'>(queryStringNavigator.getMazeType())

  const modalSettingsHeader = cc(['font-heading', 'text-2xl', 'mt-10', 'mb-2'])

  return (
    <div
      className={cc([
        'absolute',
        'w-full',
        'h-full',
        'top-0',
        'left-0',
        'bg-slate-500/75',
        'backdrop-blur-[5px]',
        'transition-all',
        'duration-500',
        'flex',
        'items-center',
        'justify-center',
        {
          visible: show,
          'opacity-100': show,
          invisible: !show,
          'opacity-0': !show,
        },
      ])}
    >
      <div
        className={cc([
          'w-[600px]',
          'bg-white',
          'rounded-lg',
          'p-10',
          'shadow-lg',
          'shadow-black/50',
          'border-[3px]',
          'border-gray-600',
        ])}
      >
        <div className={cc(['font-heading', 'text-4xl', 'mb-5'])}>Maze Config</div>

        <div className={modalSettingsHeader}>Maze Width - {mazeWidth}</div>
        <input
          type="range"
          min="5"
          max="200"
          value={mazeWidth}
          className="range range-primary"
          step="1"
          onChange={e => {
            const width = parseInt(e.target.value)
            setMazeWidth(width)
          }}
        />

        <div className={modalSettingsHeader}>Maze Height - {mazeHeight}</div>
        <input
          type="range"
          min="5"
          max="200"
          value={mazeHeight}
          className="range range-primary"
          step="1"
          onChange={e => {
            const height = parseInt(e.target.value)
            setMazeHeight(height)
          }}
        />

        <div className={modalSettingsHeader}>Segment Length - {segmentLength}</div>
        <input
          type="range"
          min="1"
          max="10"
          value={segmentLength}
          className="range range-primary"
          step="1"
          onChange={e => {
            const segLength = parseInt(e.target.value)
            setSegmentLength(segLength)
          }}
        />

        <div className={modalSettingsHeader}>Maze Type</div>

        <div className="flex">
          <div className="form-control w-16 mr-10">
            <label className="label cursor-pointer">
              <span className="label-text text-lg font-heading">3D</span>
              <input
                type="radio"
                name="maze-type-selection"
                className="radio checked:bg-[#5702F8]"
                checked={mazeType === '3d'}
                value="3d"
                onChange={e => setMazeType(e.target.value as any)}
              />
            </label>
          </div>
          <div className="form-control w-16 mr-10">
            <label className="label cursor-pointer">
              <span className="label-text text-lg font-heading">2D</span>
              <input
                type="radio"
                name="maze-type-selection"
                className="radio checked:bg-[#5702F8]"
                checked={mazeType === '2d'}
                value="2d"
                onChange={e => setMazeType(e.target.value as any)}
              />
            </label>
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <div className="ml-4">
            <button className="btn btn-sm" onClick={closeHandler}>
              Close
            </button>
          </div>
          <div className="ml-4">
            <button
              className="btn btn-sm btn-primary"
              onClick={() => {
                closeHandler()
                queryStringNavigator.setConfigValues({
                  width: mazeWidth,
                  height: mazeHeight,
                  segmentLength: segmentLength,
                  type: mazeType,
                })
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Container
