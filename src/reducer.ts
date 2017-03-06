import { combineReducers } from "redux";
import { GitHubUserState, default as user } from "./modules/user";
import { RenderingState, default as rendering } from "./modules/rendering";

export interface ReduxState {
    user?: GitHubUserState;
    rendering?: RenderingState;
}

export default combineReducers<ReduxState>({
    user,
    rendering
});
