import React from 'react'
import { connect } from 'react-redux'

import { showModal } from '../../app/actions/modals'
import { ModalType } from '../../app/modals'

type Props = {
  dispatch: Function
}
class Home extends React.Component<Props> {
  openErrorModal = () => {
    this.props.dispatch(
      showModal({
        type: ModalType.ERROR
      })
    )
  }

  render() {
    return (
      <div>
        <button type="button" onClick={this.openErrorModal}>
          Start
        </button>
      </div>
    )
  }
}

export default connect()(Home)
