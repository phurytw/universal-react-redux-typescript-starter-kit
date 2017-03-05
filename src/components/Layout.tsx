// tslint:disable-next-line:no-unused-variable
import * as React from "react";
import { connect } from "react-redux";
import { ReduxState } from "../reducer";
import { Link } from "react-router";
import Logos from "./Logos";
import { fetchText } from "../modules/text";
import { Dispatch } from "redux";
import * as Helmet from "react-helmet";

const mapStateToProps: (state: ReduxState, ownProps: MainProps) => MainProps =
    (state: ReduxState, ownProps: MainProps): MainProps => ({
        hasRendered: state.rendering.hasRendered
    });
const mapDispatchToProps: (dispatch: Dispatch<ReduxState>, ownProps: MainProps) => MainProps =
    (dispatch: Dispatch<ReduxState>, ownProps: MainProps): MainProps => ({
        fetchText: () => fetchText(dispatch)
    });

interface MainProps {
    fetchText?: () => Promise<void>;
    hasRendered?: boolean;
}

class Layout extends React.Component<MainProps, {}> {
    constructor(props: MainProps) {
        super(props);
    }
    render(): JSX.Element {
        return <div>
            <Helmet
                htmlAttributes={{ lang: "en" }}
                title="Universal React Redux with TypeScript and Webpack 2"
                link={[
                    { rel: "stylesheet", href: "styles.css" },
                    { rel: "stylesheet", href: "https://unpkg.com/purecss@0.6.2/build/buttons-min.css" },
                    { rel: "stylesheet", href: "https://unpkg.com/purecss@0.6.2/build/forms-min.css" }
                ]}
            />
            <a href="https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit"><img style={{
                position: "absolute",
                top: 0,
                right: 0,
                border: 0
            }} src="https://camo.githubusercontent.com/652c5b9acfaddf3a9c326fa6bde407b87f7be0f4/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6f72616e67655f6666373630302e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_orange_ff7600.png" /></a>
            <header className="header">
                <Logos />
                <div className="container">
                    <h1>Universal React Redux starter kit with TypeScript and Webpack 2</h1>
                </div>
            </header>
            <nav role="navigation" className="navbar">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                </ul>
            </nav>
            <div className="container">
                {this.props.children}
            </div>
        </div>;
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
