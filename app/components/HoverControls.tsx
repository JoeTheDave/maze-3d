import { useNavigate } from '@remix-run/react'
import { v4 as uuidv4 } from 'uuid'
import cc from 'classcat'
import { Cog6ToothIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

import type { FC } from 'react'

interface HoverControlsProps {
  openConfigModalHandler: () => void
}

const HoverControls: FC<HoverControlsProps> = ({ openConfigModalHandler }) => {
  const navigate = useNavigate()

  return (
    <>
      <div
        className={cc([
          'w-[150px]',
          'h-[150px]',
          'rounded-[75px]',
          'absolute',
          'top-[-100px]',
          'left-[-100px]',
          'transition-all',
          'duration-500',
          'bg-gray-300',
          'hover:bg-gray-100',
          'hover:pt-[100px]',
          'hover:pl-[100px]',
          'hover:rounded-[10px]',
          'hover:w-[190px]',
          'flex',
          'justify-around',
          'items-center',
        ])}
      >
        <button
          className="hover:bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center"
          onClick={() => navigate(`/${uuidv4()}/${location.search}`)}
        >
          <ArrowPathIcon className="h-6 w-6 text-gray-700" />
        </button>
        <button
          className="hover:bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center"
          onClick={openConfigModalHandler}
        >
          <Cog6ToothIcon className="h-6 w-6 text-gray-700" />
        </button>
      </div>
    </>
  )
}

export default HoverControls
