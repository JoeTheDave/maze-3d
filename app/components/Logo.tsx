import type { FC } from 'react'

interface LogoProps {
  children?: React.ReactNode
}

const Logo: FC<LogoProps> = ({ children }) => (
  <div className="absolute top-0 right-0 font-heading text-4xl my-2 mx-5 pointer-events-none">{children}</div>
)

export default Logo
