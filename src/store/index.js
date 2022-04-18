import { applyMiddleware, compose, createStore } from "redux";
import reducers from "../reducers/index";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../sagas/index";
import reduxWaitForAction from "redux-wait-for-action";
import {
  SAGA_CONTEXT_API_SERVICE,
  SAGA_CONTEXT_AUTH_SERVICE
} from "@protego/sdk/consts/actions";
import AuthService from "../services/AuthService";
import ApiService from "../services/ApiService";
import { persistStore } from "redux-persist";

const history = createBrowserHistory();
const routeMiddleware = routerMiddleware(history);

// Also register in Saga Context for sharing core services
const sagaMiddleware = createSagaMiddleware({
  context: {
    [SAGA_CONTEXT_API_SERVICE]: ApiService,
    [SAGA_CONTEXT_AUTH_SERVICE]: AuthService
  }
});

const middlewares = [
  reduxWaitForAction(),
  sagaMiddleware,
  routeMiddleware
].filter(Boolean);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(initialState) {
  const store = createStore(
      reducers(history),
      initialState,
      composeEnhancers(applyMiddleware(...middlewares))
    ),
    persistor = persistStore(store);

  let sagaRootTask = sagaMiddleware.run(function* () {
    yield rootSaga();
  });
  // but still using hot reload API to fix saga
  if (module.hot) {
    module.hot.accept("../sagas", () => {
      sagaRootTask.cancel();
      sagaRootTask.toPromise().then(() => {
        console.log("[HMR] reload root sagas completed");
        sagaRootTask = sagaMiddleware.run(function* () {
          yield rootSaga();
        });
      });
    });
  }

  // if (module.hot) {
  //   // Enable Webpack hot module replacement for reducers
  //   module.hot.accept("../reducers/index", () => {
  //     const nextRootReducer = require("../reducers/index");
  //     store.replaceReducer(nextRootReducer);
  //   });
  // }
  ApiService.interceptWithStore(store);
  return { store, persistor };
}

const { store, persistor } = configureStore();
export { store, persistor };

export { history };
