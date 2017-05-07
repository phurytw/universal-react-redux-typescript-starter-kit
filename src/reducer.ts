import { combineReducers } from 'redux';
import { IRenderingState, default as serverSide } from './modules/serverSide';
import { IGitHubUserState, default as user } from './example/modules/user';

export interface IReduxState {
    user: IGitHubUserState;
    serverSide: IRenderingState;
}

export default combineReducers<IReduxState>({
    user,
    serverSide,
});
