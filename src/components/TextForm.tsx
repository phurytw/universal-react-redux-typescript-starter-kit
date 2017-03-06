// tslint:disable-next-line:no-unused-variable
import * as React from "react";

interface TextFormProps {
    setText: (text: string) => void;
    fetchText: () => Promise<void>;
}

export default class TextForm extends React.Component<TextFormProps, {}> {
    private textInput: HTMLInputElement;
    constructor(props: TextFormProps) {
        super(props);
    }
    setText(): void {
        this.props.setText(this.textInput.value);
    }
    fetchText(): void {
        this.props.fetchText();
    }
    render(): JSX.Element {
        return <form className="pure-form">
            <fieldset>
                <input ref={(input: HTMLInputElement) => this.textInput = input} type="text" placeholder="New text" />
                <button type="button" className="pure-button pure-button-primary" onClick={this.setText.bind(this)}>Set</button>
                <button type="button" className="pure-button pure-button-primary" onClick={this.fetchText.bind(this)}>Set from the server</button>
            </fieldset>
        </form>;
    }
};
