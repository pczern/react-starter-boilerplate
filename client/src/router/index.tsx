import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Modals from '../app/modals'

class PageRouter extends React.Component {
  render() {
    return (
      <>
        <Switch>
          <Route path="/" component={Home} />
        </Switch>
        <Modals />
      </>
    )
  }
}
export default PageRouter
