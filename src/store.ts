import { createStore, Store } from "redux";
import { ReduxState, default as reducer } from "./reducer";

const configureStore: (initialState?: ReduxState) => Store<ReduxState> =
    (initialState?: ReduxState): Store<ReduxState> => {
        return createStore<ReduxState>(reducer, initialState);
    };

export default configureStore;
