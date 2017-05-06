import * as React from "react";
import { RouteConfig, renderRoutes } from "react-router-config";
import { RouteComponentProps } from "react-router-dom";

export interface LayoutProps extends RouteComponentProps<void> {
    route?: RouteConfig;
}

export class Layout extends React.Component<LayoutProps, {}> {
    constructor(props: LayoutProps) {
        super(props);
    }
    render(): JSX.Element {
        return <div>
            {renderRoutes(this.props.route && this.props.route.routes)}
        </div>;
    }
};

export default Layout;
