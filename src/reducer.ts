import { combineReducers } from "redux";
import { RenderingState, default as serverSide } from "./modules/serverSide";
import { GitHubUserState, default as user } from "./example/modules/user";

export interface ReduxState {
    user?: GitHubUserState;
    serverSide?: RenderingState;
}

export default combineReducers<ReduxState>({
    user,
    serverSide
});
