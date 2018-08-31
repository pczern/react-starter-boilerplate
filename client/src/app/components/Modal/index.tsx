import React, { ReactNode, ReactNodeArray } from 'react'
import css from './index.scss'

type Props = {
  children: ReactNode | ReactNodeArray
}
export default (props: Props) => (
  <div className={css.modal}>{props.children}</div>
)
