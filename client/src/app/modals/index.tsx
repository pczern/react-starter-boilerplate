import React from 'react'
// redux
import { connect } from 'react-redux'
import { getModals } from '../selectors/modals'

// modals
import ErrorModal from './ErrorModal'

// eslint-disable
export const ModalType = {
  ERROR: 'MODAL_TYPE_ERROR'
}

const MODAL_COMPONENTS = {
  [ModalType.ERROR]: ErrorModal
}

const ModalRoot = ({ modals }) => {
  if (!modals || modals.length < 1) return null

  return modals.map(modal => {
    const { type, props, id } = modal
    const SpecificModal = MODAL_COMPONENTS[type]
    return <SpecificModal {...props} key={id} id={id} />
  })
}

export default connect(state => ({ modals: getModals(state) }))(ModalRoot)
