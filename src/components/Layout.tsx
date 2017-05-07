import * as React from 'react';
import { RouteConfig, renderRoutes } from 'react-router-config';
import { RouteComponentProps } from 'react-router-dom';

export interface ILayoutProps extends RouteComponentProps<void> {
    route?: RouteConfig;
}

export class Layout extends React.Component<ILayoutProps, {}> {
    constructor(props: ILayoutProps) {
        super(props);
    }
    render(): JSX.Element {
        return (
            <div>
                {renderRoutes(this.props.route && this.props.route.routes)}
            </div>
        );
    }
}

export default Layout;
