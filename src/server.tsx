/// <reference path="./typings.d.ts" />
import * as React from "react";
import { renderToString, renderToStaticMarkup } from "react-dom/server";
import * as express from "express";
import * as webpackDevMiddleware from "webpack-dev-middleware";
import * as webpackHotMiddleware from "webpack-hot-middleware";
import * as webpack from "webpack";
import { Compiler, Configuration } from "webpack";
import webpackConfig from "../webpack.config";
import { Express, Request, Response } from "express-serve-static-core";
import { StaticRouter } from "react-router-dom";
import { matchRoutes, renderRoutes, MatchedRoute } from "react-router-config";
import { Helmet, HelmetData } from "react-helmet";
import routeConfig from "./routes";
import { Provider } from "react-redux";
import createStore from "./store";
import { ReduxState } from "./reducer";
import { Store, Dispatch } from "redux";
import "isomorphic-fetch";
import * as serialize from "serialize-javascript";
import { setIsServerSide } from "./example/modules/serverSide";

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
    const store: Store<ReduxState> = createStore();
    const dispatch: Dispatch<ReduxState> = store.dispatch;
    const context: { url?: string } = {};

    // dispatch this action to prevent data from being fetched from componentWillMount
    setIsServerSide(dispatch, true);

    // fetch async data here
    let promises: Promise<void>[] = [];
    const matchedRoutes: MatchedRoute<{}>[] = matchRoutes<{}>(routeConfig, req.originalUrl);
    for (const { route, match } of matchedRoutes) {
        const component: any = route.component;
        if (component && component.fetchData && typeof component.fetchData === "function") {
            const promise: Promise<void> = component.fetchData(dispatch, match.params);
            if (typeof promise.then === "function") {
                promises = [...promises, promise];
            }
        }
    }

    Promise.all(promises).then(() => {
        const scripts: string[] = process.env.NODE_ENV === "production" ?
            ["common.js", "vendor.js", "main.js"] : ["common.js", "vendor.js", "hot.js", "main.js"];
        const head: HelmetData = Helmet.renderStatic();
        const reactAppElement: string = renderToString(<Provider store={store}>
            <StaticRouter location={req.originalUrl} context={context}>
                {renderRoutes(routeConfig)}
            </StaticRouter>
        </Provider>);

        // if redirect has been used
        if (context.url) {
            res.redirect(302, context.url);
            return;
        }

        res.send(`<!DOCTYPE html>${renderToStaticMarkup(<html lang="fr">
            <head>
                {head.base.toComponent()}
                {head.title.toComponent()}
                {head.meta.toComponent()}
                {head.link.toComponent()}
                <link rel="stylesheet" href="styles.css" />
            </head>
            <body>
                <div id="root" dangerouslySetInnerHTML={{ __html: reactAppElement }}>
                </div>
                <script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
                <script dangerouslySetInnerHTML={{ __html: `window.__REDUX_STATE__=${serialize(store.getState())}` }} charSet="UTF-8"></script>
                {scripts.map<JSX.Element>((src: string, i: number) => <script src={src} key={i}></script>)}
            </body>
        </html>)}`);
    }, (err: Error) => res.status(500).send(err.message));
});
app.listen(port, (err: Error) => {
    if (err) {
        throw err;
    }
    console.log(`Webpack dev server listening on ${port}`);
});
