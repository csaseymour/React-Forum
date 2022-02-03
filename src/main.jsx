import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import {configureStore} from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import userReducer from './features/user'

const store = configureStore({
  reducer: {
    user: userReducer,
  }
})

ReactDOM.render(
  <Provider store={store}>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </Provider>,
  document.getElementById('root')
)
