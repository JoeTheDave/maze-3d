import cc from 'classcat'
import Modal from '~/components/Modal'

import type { FC } from 'react'

interface MazeCompleteModalProps {
  show: React.ReactNode
  restartHandler: () => void
  newMazeHandler: () => void
}

const MazeCompleteModal: FC<MazeCompleteModalProps> = ({ show, restartHandler, newMazeHandler }) => {
  return (
    <Modal show={show}>
      <div className={cc(['font-heading', 'text-4xl', 'mb-5', 'text-center'])}>Maze Complete</div>
      <div className="flex justify-around mt-20">
        <button className="btn btn-lg btn-primary" onClick={() => restartHandler}>
          Restart
        </button>
        <button className="btn btn-lg btn-primary" onClick={() => newMazeHandler}>
          New Maze
        </button>
      </div>
    </Modal>
  )
}

export default MazeCompleteModal
