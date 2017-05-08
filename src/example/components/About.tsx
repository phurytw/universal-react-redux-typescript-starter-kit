import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

const projectURL = 'https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit';

export default (props: RouteComponentProps<void>) => (
    <div>
        <h2>About</h2>
        <p>Find more about this starter kit on <a href={projectURL}>GitHub</a>.</p>
    </div>
);
