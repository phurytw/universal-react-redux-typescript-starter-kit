/// <reference path="./typings.d.ts" />
// tslint:disable-next-line:no-unused-variable
import * as React from "react";
import { renderToString, renderToStaticMarkup } from "react-dom/server";
import * as express from "express";
import * as webpackDevMiddleware from "webpack-dev-middleware";
import * as webpackHotMiddleware from "webpack-hot-middleware";
import * as webpack from "webpack";
import { Compiler, Configuration } from "webpack";
import webpackConfig from "../webpack.config";
import { Express, Request, Response } from "express-serve-static-core";
import { match } from "react-router";
import { RouterContext } from "react-router";
import * as Helmet from "react-helmet";
import routes from "./routes";
import { Provider } from "react-redux";
import createStore from "./store";
import { ReduxState } from "./reducer";
import { Store, Dispatch } from "redux";
import "isomorphic-fetch";
import * as serialize from "serialize-javascript";
import { setRendered } from "./modules/rendering";

const app: Express = express();
const port: number = 3000;

// hot module replacement
if (process.env.NODE_ENV !== "production") {
    const config: Configuration = webpackConfig(process.env.NODE_ENV);
    const compiler: Compiler = webpack(config);
    app.use(webpackDevMiddleware(compiler, {
        index: "index.html",
        publicPath: config.output.publicPath,
        stats: {
            colors: true
        },
    }));
    app.use(webpackHotMiddleware(compiler));
}

// needed to serve our application in production
app.use(express.static("./dist/static"));

app.get("*", (req: Request, res: Response) => {
    match({ location: req.originalUrl, routes: routes() } as any, (err: Error, redirectionLocation: Location, renderProps: any) => {
        if (err) {
            res.status(500).send(err.message);
        } else if (redirectionLocation) {
            res.redirect(302, `${redirectionLocation.pathname}${redirectionLocation.search}`);
        } else if (renderProps) {
            const store: Store<ReduxState> = createStore();
            const dispatch: Dispatch<ReduxState> = store.dispatch;

            // fetch async data here
            let promises: Promise<void>[] = [];
            for (const component of (renderProps.components as any[])) {
                if (component && component.fetchData && typeof component.fetchData === "function") {
                    const promise: Promise<void> = component.fetchData(dispatch);
                    if (typeof promise.then === "function") {
                        promises = [...promises, promise];
                    }
                }
            }

            Promise.all(promises).then(() => {
                // dispatch this action to prevent data from being fetched right after page load
                setRendered(dispatch, true);

                const head: Helmet.HelmetData = Helmet.rewind();
                const reactAppElement: string = renderToString(<Provider store={store}>
                    <RouterContext {...renderProps} />
                </Provider>);
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
                        <script src="common.js"></script>
                        <script src="vendor.js"></script>
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
