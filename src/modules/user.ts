import { Dispatch, Action } from "redux";

// default state
export interface GitHubUserState {
    user?: GitHubUserData;
    error?: string;
}
const defaultState: GitHubUserState = {
};

// types
type SetUserAction = { user: GitHubUserData } & Action;
type SetUserError = { error: string } & Action;
export interface GitHubUserData {
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
const SET_USER_DATA: string = "user/SET_USER_DATA";
const SET_USER_ERROR: string = "user/SET_USER_ERROR";

// action creators
export function fetchUser(dispatch: Dispatch<GitHubUserState>, username: string): Promise<void> {
    dispatch<SetUserAction>({
        type: SET_USER_DATA,
        user: undefined
    });
    dispatch<SetUserError>({
        type: SET_USER_ERROR,
        error: undefined
    });
    return fetch(`https://api.github.com/users/${username}`).then((response: Response) => {
        if (response.status >= 400) {
            return dispatch<SetUserError>({
                type: SET_USER_ERROR,
                error: response.status === 404 ? `User '${username}' could not be found` : "An error occurred"
            });
        } else {
            return response.json().then((user: GitHubUserData) => {
                console.log(user);
                return dispatch<SetUserAction>({
                    type: SET_USER_DATA,
                    user
                });
            });
        }
    });
}

// reducer
const reducer: (state: GitHubUserState, action: Action) => GitHubUserState =
    (state: GitHubUserState = defaultState, action: Action): GitHubUserState => {
        switch (action.type) {
            case SET_USER_DATA:
                return {
                    ...state,
                    user: (action as SetUserAction).user
                };
            case SET_USER_ERROR:
                return {
                    ...state,
                    error: (action as SetUserError).error
                };
            default:
                return state;
        }
    };

export default reducer;
