import { Dispatch, Action } from "redux";

// default state
export interface TextState {
    text: string;
}
const defaultState: TextState = {
    text: "Waiting for data ..."
};

// types
type SetTextAction = { text: string } & Action;

// actions
const SET_TEXT: string = "text/SET_TEXT";

// action creators
export const fetchText: (dispatch: Dispatch<TextState>) => Promise<void> =
    (dispatch: Dispatch<TextState>): Promise<void> => {
        dispatch<SetTextAction>({
            type: SET_TEXT,
            text: "Waiting for data ..."
        });
        return fetch("http://localhost:3000/api").then((response: Response) => response.text()).then((text: string) => {
            dispatch<SetTextAction>({
                type: SET_TEXT,
                text
            });
        });
    };
export const setText: (dispatch: Dispatch<TextState>, text: string) => void =
    (dispatch: Dispatch<TextState>, text: string): void => {
        dispatch<SetTextAction>({
            type: SET_TEXT,
            text
        });
    };

// reducer
const reducer: (state: TextState, action: Action) => TextState =
    (state: TextState = defaultState, action: Action): TextState => {
        switch (action.type) {
            case SET_TEXT:
                return {
                    ...state,
                    text: (action as SetTextAction).text
                };
            default:
                return state;
        }
    };

export default reducer;
