import React, { FC, ReactNode } from 'react'

type TProps = {
  children: ReactNode
}

const StandardLayout: FC<TProps> = ({ children }) => {
  return <div>{children}</div>
}

export default StandardLayout
