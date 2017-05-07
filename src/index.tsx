/// <reference path="./typings.d.ts" />
import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import Routes from "./routes";
import { Provider } from "react-redux";
import { Store } from "redux";
import { ReduxState } from "./reducer";
import createStore from "./store";
import { setIsServerSide } from "./modules/serverSide";
import { renderRoutes, RouteConfig } from "react-router-config";
import { BrowserRouter } from "react-router-dom";
import "./example/global.css";

// this is defined with an up-to-date state if we come from a server side rendering context
const store: Store<ReduxState> = createStore(window.__REDUX_STATE__);

const render: (routes: RouteConfig[]) => void = (routes: RouteConfig[]) => {
    ReactDOM.render(
        <AppContainer>
            <Provider store={store}>
                <BrowserRouter>
                    {renderRoutes(routes)}
                </BrowserRouter>
            </Provider>
        </AppContainer>,
        document.getElementById("root")
    );
};
render(Routes);

// set rendered to false so newly mounted components can load
setIsServerSide(store.dispatch, false);

// hot reloading
if (module.hot) {
    module.hot.accept("./routes", () => {
        const App: any = require("./routes").default;
        render(App);
    });
}
