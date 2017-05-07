import { Dispatch, Action } from 'redux';

// default state
export interface IGitHubUserState {
    user?: IGitHubUserData | undefined;
    error?: string | undefined;
}
const defaultState: IGitHubUserState = {
};

// types
type SetUserAction = { user: IGitHubUserData | undefined } & Action;
type SetUserError = { error: string | undefined } & Action;
export interface IGitHubUserData {
    avatar_url?: string;
    bio?: string;
    blog?: string;
    company?: string;
    created_at?: string;
    updated_at?: string;
    email?: string;
    location?: string;
    public_gists?: number;
    public_repos?: number;
    followers?: number;
    following?: number;
    login?: string;
    name?: string;
}

// actions
const SET_USER_DATA = 'user/SET_USER_DATA';
const SET_USER_ERROR = 'user/SET_USER_ERROR';

// action creators
export function fetchUser(dispatch: Dispatch<IGitHubUserState>, username: string): Promise<any> {
    dispatch<SetUserAction>({
        type: SET_USER_DATA,
        user: undefined,
    });
    dispatch<SetUserError>({
        type: SET_USER_ERROR,
        error: undefined,
    });
    return fetch(`https://api.github.com/users/${username}`)
        .then<SetUserAction | SetUserError>((response: Response) => {
            if (response.status >= 400) {
                return dispatch<SetUserError>({
                    type: SET_USER_ERROR,
                    error: response.status === 404 ? `User '${username}' could not be found` : 'An error occurred',
                });
            } else {
                return response.json().then((user: IGitHubUserData) => dispatch<SetUserAction>({
                    type: SET_USER_DATA,
                    user,
                }));
            }
        });
}

// reducer
const reducer: (state: IGitHubUserState, action: Action) => IGitHubUserState =
    (state: IGitHubUserState = defaultState, action: Action): IGitHubUserState => {
        switch (action.type) {
            case SET_USER_DATA:
                return {
                    ...state,
                    user: (action as SetUserAction).user,
                };
            case SET_USER_ERROR:
                return {
                    ...state,
                    error: (action as SetUserError).error,
                };
            default:
                return state;
        }
    };

export default reducer;
