import { createStore, Store } from 'redux';
import { IReduxState, default as reducer } from './reducer';

const configureStore: (initialState?: IReduxState) => Store<IReduxState> =
    (initialState?: IReduxState): Store<IReduxState> => {
        return createStore<IReduxState>(reducer, initialState as IReduxState);
    };

export default configureStore;
