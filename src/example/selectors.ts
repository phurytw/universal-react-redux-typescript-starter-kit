import { ReduxState } from "../reducer";
import { GitHubUserData } from "./modules/user";

export const getUser: (state: ReduxState) => GitHubUserData =
    (state: ReduxState): GitHubUserData => state.user.user;

export const getError: (state: ReduxState) => string =
    (state: ReduxState): string => state.user.error;

export const isServerSide: (state: ReduxState) => boolean =
    (state: ReduxState): boolean => state.serverSide.isServerSide;
