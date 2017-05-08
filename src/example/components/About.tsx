import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

export default (props: RouteComponentProps<void>) => (
    <div>
        <h2>About</h2>
        <p>
            Find more about this starter kit on <a
                href="https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit"
            >
                GitHub
            </a>.
    </p>
    </div>
);
