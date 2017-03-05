import { combineReducers } from "redux";
import { TextState, default as text } from "./modules/text";
import { RenderingState, default as rendering } from "./modules/rendering";

export interface ReduxState {
    text?: TextState;
    rendering?: RenderingState;
}

export default combineReducers<ReduxState>({
    text,
    rendering
});
