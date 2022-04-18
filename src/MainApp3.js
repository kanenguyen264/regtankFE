import { ConnectedRouter } from "connected-react-router";
import React from "react";
import { Provider } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import App from "./containers/App";
import { KYTArchiveService } from "./services/KYTService";
import { history, persistor, store } from "./store";

export { store, persistor };

if (window.Cypress) {
  window.store = store;
  window.KYTArchiveService = KYTArchiveService;
}

const MainApp = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/" component={App} />
        </Switch>
      </ConnectedRouter>
    </PersistGate>
  </Provider>
);

export default MainApp;
