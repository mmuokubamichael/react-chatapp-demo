import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { legacy_createStore as createStore} from 'redux'
import { compose,applyMiddleware,combineReducers } from 'redux'
import thunk from 'redux-thunk'
import {Provider} from 'react-redux'

import reportWebVitals from "./reportWebVitals";
import reducer from './store/reducers/auth';
import nav_reducer from './store/reducers/nav';
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const rootReducer = combineReducers({
  auth:reducer,
  nav:nav_reducer
})
const store = createStore(rootReducer,composeEnhancer(
    applyMiddleware(thunk)
))

const app =(
  <Provider store={store}>
      <App />
  </Provider>
)



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {app}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

reportWebVitals();