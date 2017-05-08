import { createStore, Store, applyMiddleware } from 'redux';
import { IReduxState, default as reducer } from './reducer';
import reduxThunk from 'redux-thunk';

const configureStore: (initialState?: IReduxState, cookie?: { Cookie?: string }) => Store<IReduxState> =
    (initialState?: IReduxState, cookie: { Cookie?: string } = {}): Store<IReduxState> => {
        return createStore<IReduxState>(reducer,
            initialState as IReduxState,
            applyMiddleware(reduxThunk.withExtraArgument(cookie)));
    };

export default configureStore;
