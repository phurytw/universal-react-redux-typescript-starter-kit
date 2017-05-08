import * as React from 'react';
import { IReduxState } from '../../reducer';
import { fetchUser, IGitHubUserData } from '../modules/user';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import GitHubUserPreview from './GitHubUserPreview';
import { RouteComponentProps } from 'react-router-dom';
import { getError, getUser, isServerSide } from '../selectors';

// :)
const me = 'lith-light-g';

export const mapStateToProps: (state: IReduxState, ownProps: IMainProps) => Partial<IMainProps> =
    (state: IReduxState, ownProps: IMainProps): Partial<IMainProps> => ({
        user: getUser(state),
        error: getError(state),
        isServerSide: isServerSide(state),
    });

export const mapDispatchToProps: (dispatch: Dispatch<IReduxState>, ownProps: IMainProps) => Partial<IMainProps> =
    (dispatch: Dispatch<IReduxState>, ownProps: IMainProps): Partial<IMainProps> => ({
        fetchUser: (username: string) => fetchUser(dispatch, username),
    });

export interface IMainParams {
    username: string;
}

export interface IMainProps extends RouteComponentProps<IMainParams> {
    fetchUser: (username: string) => void;
    user: IGitHubUserData;
    error: string;
    isServerSide: boolean;
}

class MainComponent extends React.Component<IMainProps, {}> {
    static fetchData(dispatch: Dispatch<IReduxState>, { username }: IMainParams): Promise<void> {
        return fetchUser(dispatch, username || me);
    }
    private usernameInput: HTMLInputElement;
    constructor(props: IMainProps) {
        super(props);
    }
    componentWillMount(): void {
        const { isServerSide, fetchUser, match: { params: { username } } }: IMainProps = this.props;
        // this prevents the data to be fetched on page load by the client
        // if it was already loaded server side
        if (!isServerSide) {
            fetchUser(username || me);
        }
    }
    fetchUser: () => void = (): void => {
        this.props.fetchUser(this.usernameInput.value || me);
    }
    fetchMe: () => void = (): void => {
        this.props.fetchUser(me);
    }
    setInputRef: (input: HTMLInputElement) => void = (input: HTMLInputElement): void => {
        this.usernameInput = input;
    }
    render(): JSX.Element {
        return (
            <div>
                <GitHubUserPreview user={this.props.user} error={this.props.error} />
                <h3>Search user</h3>
                <form className="pure-form" onSubmit={this.fetchUser}>
                    <fieldset>
                        <input
                            ref={this.setInputRef}
                            type="text"
                            placeholder="e.g. gaearon"
                        />
                        <button type="submit" className="pure-button pure-button-primary">
                            Search
                        </button>
                        <button type="button" className="pure-button pure-button-primary" onClick={this.fetchMe}>
                            Look at my face again
                        </button>
                    </fieldset>
                </form>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainComponent);
