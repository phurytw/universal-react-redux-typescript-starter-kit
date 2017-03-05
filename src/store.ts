import { createStore, Store } from "redux";
import { ReduxState, default as reducer } from "./reducer";

// this is exactly the same as createStore alone but you may want to add Redux middlewares here
const configureStore: (initialState?: ReduxState) => Store<ReduxState> =
    (initialState?: ReduxState): Store<ReduxState> => {
        return createStore<ReduxState>(reducer, initialState);
    };

export default configureStore;
