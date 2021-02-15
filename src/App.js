import React from 'react';
import Router from './routes/router';
import './App.css';
import 'toastr/build/toastr.min.js';
import 'toastr/build/toastr.css';
import store from '../src/redux';
import { Provider } from 'react-redux';
function App() {
  return (
    <>
      <Provider store={store}>
        <Router />
      </Provider>
    </>
  );
}

export default App;
