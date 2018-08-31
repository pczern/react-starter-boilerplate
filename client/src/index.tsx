import React from 'react'
import ReactDOM from 'react-dom'

import createSagaMiddleware from 'redux-saga'
import reduxLogger from 'redux-logger'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createBrowserHistory } from 'history'
import {
  connectRouter,
  routerMiddleware,
  ConnectedRouter
} from 'connected-react-router'
import App from './app'
import RootSaga from './app/actions/sagas'
import reducers from './app/reducers'
import { init } from './app/actions/init'

const history = createBrowserHistory()
const sagaMiddleware = createSagaMiddleware()
const composeEnhancers = composeWithDevTools({})
const initialStore = {}
const store = createStore(
  connectRouter(history)(reducers),
  initialStore,
  composeEnhancers(
    applyMiddleware(reduxLogger, sagaMiddleware, routerMiddleware(history))
  )
)

sagaMiddleware.run(RootSaga)

if (module.hot) {
  module.hot.accept('./app', () => {
    store.dispatch(init())
  })
}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)
