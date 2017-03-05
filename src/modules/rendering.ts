import { Dispatch, Action } from "redux";

// default state
export interface RenderingState {
    hasRendered: boolean;
}
const defaultState: RenderingState = {
    hasRendered: false
};

// types
type SetRenderedAction = { hasRendered: boolean } & Action;

// actions
const SET_RENDERED: string = "rendering/SET_RENDERED";

// action creators
export const setRendered: (dispatch: Dispatch<RenderingState>, hasRendered: boolean) => void =
    (dispatch: Dispatch<RenderingState>, hasRendered: boolean): void => {
        dispatch<SetRenderedAction>({
            type: SET_RENDERED,
            hasRendered
        });
    };

// reducer
const reducer: (state: RenderingState, action: Action) => RenderingState =
    (state: RenderingState = defaultState, action: Action): RenderingState => {
        switch (action.type) {
            case SET_RENDERED:
                return {
                    hasRendered: (action as SetRenderedAction).hasRendered
                };
            default:
                return state;
        }
    };

export default reducer;
