import * as React from "react";
import { ReduxState } from "../../reducer";
import { fetchUser, GitHubUserData } from "../modules/user";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import GitHubUserPreview from "./GitHubUserPreview";
import { RouteComponentProps } from "react-router-dom";
import { getError, getUser, isServerSide } from "../selectors";

// :)
const me: string = "lith-light-g";

export const mapStateToProps: (state: ReduxState, ownProps: MainProps) => Partial<MainProps> =
    (state: ReduxState, ownProps: MainProps): Partial<MainProps> => ({
        user: getUser(state),
        error: getError(state),
        hasRendered: isServerSide(state)
    });

export const mapDispatchToProps: (dispatch: Dispatch<ReduxState>, ownProps: MainProps) => Partial<MainProps> =
    (dispatch: Dispatch<ReduxState>, ownProps: MainProps): Partial<MainProps> => ({
        fetchUser: (username: string) => fetchUser(dispatch, username)
    });

export interface MainParams {
    username?: string;
}

export interface MainProps extends RouteComponentProps<MainParams> {
    fetchUser?: (username: string) => void;
    user?: GitHubUserData;
    error?: string;
    hasRendered?: boolean;
}

class MainComponent extends React.Component<MainProps, {}> {
    private usernameInput: HTMLInputElement;
    constructor(props: MainProps) {
        super(props);
    }
    static fetchData(dispatch: Dispatch<ReduxState>, { username }: MainParams): Promise<void> {
        return fetchUser(dispatch, username || me);
    }
    componentWillMount(): void {
        const { hasRendered, fetchUser, match: { params: { username } } }: MainProps = this.props;
        // this prevents the data to be fetched on page load by the client (if it has been already fetched by the server)
        if (!hasRendered) {
            fetchUser(username || me);
        }
    }
    fetchUser: () => void = (): void => {
        this.props.fetchUser(this.usernameInput.value || me);
    }
    fetchMe: () => void = (): void => {
        this.props.fetchUser(me);
    }
    render(): JSX.Element {
        return <div>
            <GitHubUserPreview user={this.props.user} error={this.props.error} />
            <h3>Search user</h3>
            <form className="pure-form" onSubmit={this.fetchUser}>
                <fieldset>
                    <input ref={(input: HTMLInputElement) => this.usernameInput = input} type="text" placeholder="e.g. gaearon" />
                    <button type="submit" className="pure-button pure-button-primary">Search</button>
                    <button type="button" className="pure-button pure-button-primary" onClick={this.fetchMe}>Look at my face again</button>
                </fieldset>
            </form>
        </div>;
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MainComponent);
