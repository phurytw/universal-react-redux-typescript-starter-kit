import { combineReducers } from "redux";
import { GitHubUserState, default as user } from "./example/modules/user";
import { RenderingState, default as serverSide } from "./example/modules/serverSide";

export interface ReduxState {
    user?: GitHubUserState;
    serverSide?: RenderingState;
}

export default combineReducers<ReduxState>({
    user,
    serverSide
});
