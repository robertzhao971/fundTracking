import React from 'react';
import { Provider } from 'react-redux'
import configureStore from '../redux/store'
import App from './App'

const store = configureStore()

const Root = () => {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    )
}

export default Root;