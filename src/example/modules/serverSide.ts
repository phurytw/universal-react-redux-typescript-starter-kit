import { Dispatch, Action } from "redux";

// default state
export interface RenderingState {
    isServerSide: boolean;
}
const defaultState: RenderingState = {
    isServerSide: false
};

// types
type SetRenderedAction = { isServerSide: boolean } & Action;

// actions
const SET_RENDERED: string = "rendering/SET_RENDERED";

// action creators
export const setIsServerSide: (dispatch: Dispatch<RenderingState>, isServerSide: boolean) => void =
    (dispatch: Dispatch<RenderingState>, isServerSide: boolean): void => {
        dispatch<SetRenderedAction>({
            type: SET_RENDERED,
            isServerSide
        });
    };

// reducer
const reducer: (state: RenderingState, action: Action) => RenderingState =
    (state: RenderingState = defaultState, action: Action): RenderingState => {
        switch (action.type) {
            case SET_RENDERED:
                return {
                    isServerSide: (action as SetRenderedAction).isServerSide
                };
            default:
                return state;
        }
    };

export default reducer;
