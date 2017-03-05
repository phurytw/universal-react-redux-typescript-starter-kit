import * as express from "express";
import * as webpackDevMiddleware from "webpack-dev-middleware";
import * as webpackHotMiddleware from "webpack-hot-middleware";
import * as webpack from "webpack";
import { Compiler, Configuration } from "webpack";
import webpackConfig from "../webpack.config";
import { Express, Request, Response } from "express-serve-static-core";
import { match } from "react-router";
import { RouterContext } from "react-router";
// tslint:disable-next-line:no-unused-variable
import * as React from "react";
import { renderToString, renderToStaticMarkup } from "react-dom/server";
import * as Helmet from "react-helmet";
import routes from "./routes";
import { Provider } from "react-redux";
import createStore from "./store";
import { ReduxState } from "./reducer";
import { Store, Dispatch } from "redux";
import "isomorphic-fetch";
import * as serialize from "serialize-javascript";
import { setRendered } from "./modules/rendering";

const config: Configuration = webpackConfig(process.env.NODE_ENV);
const app: Express = express();
const compiler: Compiler = webpack(config);
const port: number = 3000;

// this is what allows hot module replacement
if (process.env.NODE_ENV !== "production") {
    // the webpack dev middleware watches files, compiles the bundle in memory, and makes it available via this middleware
    app.use(webpackDevMiddleware(compiler, {
        index: "index.html",
        publicPath: config.output.publicPath,
        stats: {
            colors: true
        },
    }));
    // the webpack hot middleware connects to your application and emits changes
    app.use(webpackHotMiddleware(compiler));
}

// this is here for demo purposes
// feel free to remove it and use your own server
app.get("/api", (req: Request, res: Response) => setTimeout(() => res.send("Hey this is some text that is supposed to be obtained asynchronously. If you see this right away it means that server side rendering is working properly. This message is also present in your Redux store !!"), 1000));

// this is where the server side rendering happens !!
app.get("*", (req: Request, res: Response) => {
    // react-router will automatically get the components to render from our client-side app (routes) and the requested url (req.originalUrl)
    match({ location: req.originalUrl, routes: routes() } as any, (err: Error, redirectionLocation: Location, renderProps: any) => {
        if (err) {
            res.status(500).send(err.message);
        } else if (redirectionLocation) {
            res.redirect(302, `${redirectionLocation.pathname}${redirectionLocation.search}`);
        } else if (renderProps) {
            // we initialize a Redux store
            const store: Store<ReduxState> = createStore();
            const dispatch: Dispatch<ReduxState> = store.dispatch;

            // fetch async data here
            let promises: Promise<void>[] = [];
            for (const component of (renderProps.components as any[])) {
                // check if there's an async promise to await
                // for each component that needs to have data fetched asynchronously there's a fetchData static method that we can use here
                if (component && component.fetchData && typeof component.fetchData === "function") {
                    const promise: Promise<void> = component.fetchData(dispatch);
                    if (typeof promise.then === "function") {
                        promises = [...promises, promise];
                    }
                }
            }

            // wait for the data to be fetched
            Promise.all(promises).then(() => {
                // at this point the necessary data is fetched and the Redux store is up to date with the needed data
                // dispatch this action to prevent data from being fetched right after page load
                setRendered(dispatch, true);

                // react-helmet is used in various part of the application to rewrite HTML tags that are outside of our application's scope
                const head: Helmet.HelmetData = Helmet.rewind();
                // react-router's RouterContext component uses what we got from the match function (renderProps) to render our page
                // react-redux's Provider will pass the Redux state to the components
                const reactAppElement: string = renderToString(<Provider store={store}>
                    <RouterContext {...renderProps} />
                </Provider>);
                // the whole page is rendered to a string that we send as a response
                // we pass the scripts that are available thanks to the webpack dev middleware
                // the hot.js script is the bit relevant to HMR (as you can see in the webpack config)
                // in order to have an up-to-date Redux state on the client we pass the state via a script tag
                res.send(`<!DOCTYPE html>${renderToStaticMarkup(<html {...head.htmlAttributes.toComponent() }>
                    <head>
                        {head.base.toComponent()}
                        {head.title.toComponent()}
                        {head.meta.toComponent()}
                        {head.link.toComponent()}
                    </head>
                    <body>
                        <div id="root" dangerouslySetInnerHTML={{ __html: reactAppElement }}>
                        </div>
                        <script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
                        <script dangerouslySetInnerHTML={{ __html: `window.__REDUX_STATE__=${serialize(store.getState())}` }} charSet="UTF-8"></script>
                        <script src="manifest.js"></script>
                        {process.env.NODE_ENV === "production" ? "" : <script src="hot.js"></script>}
                        <script src="main.js"></script>
                    </body>
                </html>)}`);
            }, (err: Error) => res.status(500).send(err.message));
        } else {
            res.sendStatus(404);
        }
    });
});
app.listen(port, (err: Error) => {
    if (err) {
        throw err;
    }
    console.log(`Webpack dev server listening on ${port}`);
});
