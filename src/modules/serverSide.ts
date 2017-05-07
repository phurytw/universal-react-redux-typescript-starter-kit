import { Dispatch, Action } from 'redux';

// default state
export interface IRenderingState {
    isServerSide: boolean;
}
const defaultState: IRenderingState = {
    isServerSide: false,
};

// types
type SetRenderedAction = { isServerSide: boolean } & Action;

// actions
const SET_RENDERED = 'rendering/SET_RENDERED';

// action creators
export const setIsServerSide: (dispatch: Dispatch<IRenderingState>, isServerSide: boolean) => void =
    (dispatch: Dispatch<IRenderingState>, isServerSide: boolean): void => {
        dispatch<SetRenderedAction>({
            type: SET_RENDERED,
            isServerSide,
        });
    };

// reducer
const reducer: (state: IRenderingState, action: Action) => IRenderingState =
    (state: IRenderingState = defaultState, action: Action): IRenderingState => {
        switch (action.type) {
            case SET_RENDERED:
                return {
                    isServerSide: (action as SetRenderedAction).isServerSide,
                };
            default:
                return state;
        }
    };

export default reducer;
