import { useState } from 'react'
import HoverControls from '~/components/HoverControls'
import Logo from '~/components/Logo'
import SettingsModal from '~/components/SettingsModal'

import type { FC } from 'react'

interface ContainerProps {
  children?: React.ReactNode
}

const Container: FC<ContainerProps> = ({ children }) => {
  const [showModal, setShowModal] = useState<boolean>(false)

  return (
    <div className="w-full h-full flex items-center justify-center relative w-">
      <HoverControls openConfigModalHandler={() => setShowModal(true)} />
      {children}
      <Logo>Maze 3D</Logo>

      <SettingsModal show={showModal} closeHandler={() => setShowModal(false)} />
    </div>
  )
}

export default Container
