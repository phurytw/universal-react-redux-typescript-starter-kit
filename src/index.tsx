// tslint:disable-next-line:no-unused-variable
import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import Routes from "./routes";
import { Provider } from "react-redux";
import { Store } from "redux";
import { ReduxState } from "./reducer";
import createStore from "./store";
import "./global.css";
import "normalize.css/normalize.css";
import { setRendered } from "./modules/rendering";

// this is defined with an up-to-state state if we come from a server side rendering context
const initialState: ReduxState = window.__REDUX_STATE__;
const store: Store<ReduxState> = createStore(initialState);

const render: (component: any) => void = (Component) => {
    ReactDOM.render(
        <AppContainer>
            <Provider store={store}>
                <Component />
            </Provider>
        </AppContainer>,
        document.getElementById("root")
    );
};
render(Routes);

// set rendered to false to newly mounted components can load
setRendered(store.dispatch, false);

// this is the bit that is responsible of updating your page in real time
if ((module as any).hot) {
    (module as any).hot.accept("./routes", () => {
        // we need to use require here to get the updated module (import will not work)
        const App: any = require("./routes").default;
        // update !!
        render(App);
    });
}
