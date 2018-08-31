import React from 'react'
import Modal from '../../components/Modal'

type Props = {
  title: string
}
export default (props: Props) => (
  <Modal>
    <header>{props.title}</header>
    <div className="content">Content</div>
    <footer>heyo</footer>
  </Modal>
)
