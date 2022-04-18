import React from "react";
import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import App from "./containers/App";
import { history, persistor, store } from "./store";
import asyncComponent from "util/hocs/asyncComponent";

const MainApp = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConnectedRouter history={history}>
          <Switch>
            {process.env.NODE_ENV === "development" && (
              <Route
                path="/example/report"
                component={asyncComponent(() => import("app/reports/examples"))}
              />
            )}

            <Route path="/" component={App} />
          </Switch>
        </ConnectedRouter>
      </PersistGate>
    </Provider>
  );
};

export default MainApp;
export { store, persistor };
