import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider as ReduxProvider } from "react-redux";
import store from "./redux/store";
import SocketProvider from "./socket/SocketProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <SocketProvider>
        <App />
      </SocketProvider>
    </ReduxProvider>
  </React.StrictMode>
);
