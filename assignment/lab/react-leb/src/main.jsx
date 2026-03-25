import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { RecoilRoot } from "recoil";

import ThemeProvider from "./components/ThemeContext";
import AuthProvider from "./components/AuthContext";

import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <RecoilRoot>
        <ThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </RecoilRoot>
    </Provider>
  </BrowserRouter>
);