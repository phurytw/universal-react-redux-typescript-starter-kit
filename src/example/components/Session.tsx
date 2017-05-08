import * as React from 'react';
import { IReduxState } from '../../reducer';
import { fetchValue, postValue } from '../modules/session';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { isServerSide, getSessionValue } from '../selectors';

export const mapStateToProps: (state: IReduxState, ownProps: ISessionProps) => Partial<ISessionProps> =
    (state: IReduxState, ownProps: ISessionProps): Partial<ISessionProps> => ({
        isServerSide: isServerSide(state),
        value: getSessionValue(state),
    });

export const mapDispatchToProps: (dispatch: Dispatch<IReduxState>, ownProps: ISessionProps) => Partial<ISessionProps> =
    (dispatch: Dispatch<IReduxState>, ownProps: ISessionProps): Partial<ISessionProps> => ({
        fetchValue: () => dispatch(fetchValue()),
        postValue: (value: string) => dispatch(postValue(value)),
    });

export interface ISessionProps extends RouteComponentProps<void> {
    fetchValue: () => Promise<any>;
    postValue: (value: string) => Promise<any>;
    value: string;
    isServerSide: boolean;
}

class MainComponent extends React.Component<ISessionProps, {}> {
    static fetchData(dispatch: Dispatch<IReduxState>): Promise<any> {
        return dispatch(fetchValue());
    }
    private input: HTMLInputElement;
    constructor(props: ISessionProps) {
        super(props);
    }
    componentWillMount(): void {
        const { isServerSide, fetchValue }: ISessionProps = this.props;
        if (!isServerSide) {
            fetchValue();
        }
    }
    fetchValue: () => void = (): void => {
        this.props.fetchValue();
    }
    setValue: (event: React.FormEvent<HTMLFormElement>) => void = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        this.props.postValue(this.input.value);
    }
    setInputRef: (input: HTMLInputElement) => void = (input: HTMLInputElement): void => {
        this.input = input;
    }
    render(): JSX.Element {
        return (
            <div>
                <h3>Value stored in session</h3>
                <p>{this.props.value}</p>
                <form className="pure-form" onSubmit={this.setValue}>
                    <fieldset>
                        <input
                            ref={this.setInputRef}
                            type="text"
                        />
                        <input type="submit" className="pure-button pure-button-primary" value="Set" />
                    </fieldset>
                </form>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainComponent);
