import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { StatelessComponent } from 'react'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

type Props = {
  src: IconProp
  onClick?: () => void
  className?: string
}

const Icon: StatelessComponent<Props> = props => (
  <FontAwesomeIcon icon={props.src} {...props} />
)
export default Icon
