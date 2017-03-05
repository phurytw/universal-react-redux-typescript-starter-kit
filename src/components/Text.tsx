// tslint:disable-next-line:no-unused-variable
import * as React from "react";
import TextForm from "./TextForm";
import { ReduxState } from "../reducer";
import { setText, fetchText } from "../modules/text";
import { Dispatch } from "redux";
import { connect } from "react-redux";

const mapStateToProps: (state: ReduxState, ownProps: TextProps) => TextProps =
    (state: ReduxState, ownProps: TextProps): TextProps => ({
        text: state.text.text,
        hasRendered: state.rendering.hasRendered
    });

const mapDispatchToProps: (dispatch: Dispatch<ReduxState>, ownProps: TextProps) => TextProps =
    (dispatch: Dispatch<ReduxState>, ownProps: TextProps): TextProps => ({
        fetchText: () => fetchText(dispatch),
        setText: (text: string) => setText(dispatch, text)
    });

interface TextProps {
    fetchText?: () => Promise<void>;
    setText?: (text: string) => void;
    text?: string;
    hasRendered?: boolean;
}

class TextComponent extends React.Component<TextProps, {}> {
    constructor(props: TextProps) {
        super(props);
    }
    // this function will be used by the server to fetch data before rendering
    // it must return a Promise
    static fetchData(dispatch: Dispatch<ReduxState>): Promise<void> {
        return fetchText(dispatch);
    }
    componentWillMount(): void {
        // this prevents the data to be fetched on page load by the client (it is fetched by the server)
        if (!this.props.hasRendered) {
            this.props.fetchText();
        }
    }
    render(): JSX.Element {
        const { text }: TextProps = this.props;
        return <div>
            <h2>Below is the text fetched from the API server</h2>
            <p>{text}</p>
            <h3>Set the text manually</h3>
            <TextForm {...this.props} />
        </div>;
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(TextComponent);
