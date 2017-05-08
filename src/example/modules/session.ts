import { Dispatch, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

// default state
export interface ISessionState {
    value?: string | undefined;
}
const defaultState: ISessionState = {
};

// types
type SetValue = { value: string | undefined } & Action;

// actions
const SET_VALUE = 'session/SET_VALUE';

// action creators
export function fetchValue(): ThunkAction<Promise<SetValue>, ISessionState, { Cookie?: string }> {
    return (
        dispatch: Dispatch<ISessionState>,
        getState: () => ISessionState,
        extra: { Cookie?: string }) => fetch('http://localhost:3000/api', {
            credentials: 'include',
            headers: {
                ...extra,
            },
        })
            .then<{ value: string | undefined }>((response: Response) => response.json())
            .then<SetValue>((result: { value: string | undefined }) => dispatch({
                type: SET_VALUE,
                value: result.value,
            }));
}
export function postValue(value: string): ThunkAction<Promise<SetValue>, ISessionState, { Cookie?: string }> {
    return (
        dispatch: Dispatch<ISessionState>,
        getState: () => ISessionState,
        extra: { Cookie?: string }) => fetch(`http://localhost:3000/api/${value}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                ...extra,
            },
        })
            .then<SetValue>(() => dispatch({
                type: SET_VALUE,
                value,
            }));
}

// reducer
const reducer: (state: ISessionState, action: Action) => ISessionState =
    (state: ISessionState = defaultState, action: Action): ISessionState => {
        switch (action.type) {
            case SET_VALUE:
                return {
                    ...state,
                    value: (action as SetValue).value,
                };
            default:
                return state;
        }
    };

export default reducer;
