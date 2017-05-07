import { IReduxState } from '../reducer';
import { IGitHubUserData } from './modules/user';

export const getUser: (state: IReduxState) => IGitHubUserData | undefined =
    (state: IReduxState): IGitHubUserData | undefined => state.user.user;

export const getError: (state: IReduxState) => string | undefined =
    (state: IReduxState): string | undefined => state.user.error;

export const isServerSide: (state: IReduxState) => boolean =
    (state: IReduxState): boolean => state.serverSide.isServerSide;
