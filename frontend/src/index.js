import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import {persistor, store} from "./redux/store";
import { PersistGate } from 'redux-persist/integration/react';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistGate loading = {null} persistor = {persistor}>
      <App />
    </PersistGate>
  </Provider>,
);

reportWebVitals();