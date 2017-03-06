// tslint:disable-next-line:no-unused-variable
import * as React from "react";
import { Router, Route, browserHistory, IndexRoute } from "react-router";
import Layout from "./components/Layout";
import Main from "./components/Main";
import About from "./components/About";

export default () => <Router history={browserHistory}>
    <Route path="/" component={Layout}>
        <IndexRoute component={Main} />
        <Route path="/about" component={About} />
    </Route>
</Router>;
