// tslint:disable-next-line:no-unused-variable
import * as React from "react";
import { ReduxState } from "../reducer";
import { fetchUser, GitHubUserData } from "../modules/user";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import GitHubUserPreview from "./GitHubUserPreview";

const me: string = "lith-light-g";

const mapStateToProps: (state: ReduxState, ownProps: MainProps) => MainProps =
    (state: ReduxState, ownProps: MainProps): MainProps => ({
        user: state.user.user,
        error: state.user.error,
        hasRendered: state.rendering.hasRendered
    });

const mapDispatchToProps: (dispatch: Dispatch<ReduxState>, ownProps: MainProps) => MainProps =
    (dispatch: Dispatch<ReduxState>, ownProps: MainProps): MainProps => ({
        fetchUser: (username: string) => fetchUser(dispatch, username)
    });

interface MainProps {
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
    static fetchData(dispatch: Dispatch<ReduxState>): Promise<void> {
        // This is the fetchUser action creator
        return fetchUser(dispatch, me);
    }
    componentWillMount(): void {
        // this prevents the data to be fetched on page load by the client (if it has been already fetched by the server)
        const { hasRendered, fetchUser }: MainProps = this.props;
        if (!hasRendered) {
            // This is the fetchUser method from the props
            fetchUser(me);
        }
    }
    fetchUser(): void {
        this.props.fetchUser(this.usernameInput.value);
    }
    fetchMe(): void {
        this.props.fetchUser(me);
    }
    render(): JSX.Element {
        return <div>
            <GitHubUserPreview {...this.props} />
            <h3>Search user</h3>
            <form className="pure-form">
                <fieldset>
                    <input ref={(input: HTMLInputElement) => this.usernameInput = input} type="text" placeholder="e.g. gaearon" />
                    <button type="button" className="pure-button pure-button-primary" onClick={this.fetchUser.bind(this)}>Search</button>
                    <button type="button" className="pure-button pure-button-primary" onClick={this.fetchMe.bind(this)}>Look at my face again</button>
                </fieldset>
            </form>
        </div>;
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MainComponent);
