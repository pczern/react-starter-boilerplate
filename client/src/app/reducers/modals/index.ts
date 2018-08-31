import _ from 'lodash'
import uuid from 'uuid/v4'
import { SHOW_MODAL, HIDE_MODAL } from '../../actions/modals'

const defaultState = []

export default (state = defaultState, action) => {
  switch (action.type) {
    case SHOW_MODAL:
      return [
        ...state,
        {
          props: action.modal,
          type: action.modal.type,
          id: uuid(),
          isOpen: true
        }
      ]
    case HIDE_MODAL:
      return _.reject(state, { id: action.id })
    default:
      return state
  }
}
