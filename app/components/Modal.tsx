import cc from 'classcat'

import type { FC } from 'react'

interface ModalProps {
  children?: React.ReactNode
  show: React.ReactNode
}

const Modal: FC<ModalProps> = ({ show, children }) => {
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
        {children}
      </div>
    </div>
  )
}

export default Modal
