import { combineReducers } from 'redux';
import { IRenderingState, default as serverSide } from './modules/serverSide';
import { IGitHubUserState, default as user } from './example/modules/user';
import { ISessionState, default as session } from './example/modules/session';

export interface IReduxState {
    user: IGitHubUserState;
    serverSide: IRenderingState;
    session: ISessionState;
}

export default combineReducers<IReduxState>({
    user,
    serverSide,
    session,
});
