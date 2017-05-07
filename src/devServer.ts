// tslint:disable:no-console
import * as express from 'express';
import { Express } from 'express-serve-static-core';
import * as webpackDevMiddleware from 'webpack-dev-middleware';
import * as webpackHotMiddleware from 'webpack-hot-middleware';
import * as webpack from 'webpack';
import { Compiler, Configuration, Output } from 'webpack';
import webpackConfig from '../webpack.config';
import { createServer, Server } from 'http';

const app: Express = express();

if (process.env.NODE_ENV !== 'production') {
    const port = 3001;
    const config: Configuration = webpackConfig(process.env.NODE_ENV);

    // add hot middleware to the config with the correct port
    (config.entry as any).hot = [
        'react-hot-loader/patch',
        `webpack-hot-middleware/client?path=http://localhost:${port}/__webpack_hmr`,
    ];
    (config.output as Output).publicPath = `http://localhost:${port}${(config.output as Output).publicPath}`;

    const compiler: Compiler = webpack(config);
    app.use(webpackDevMiddleware(compiler, {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        publicPath: (config.output as Output).publicPath as string,
        stats: {
            colors: true,
        },
    }));
    app.use(webpackHotMiddleware(compiler));
    const server: Server = createServer(app);
    server.listen(port, (err: Error) => {
        if (err) {
            throw err;
        }
        console.info(`Webpack dev server listening on ${port}`);
    });
} else {
    console.info('Webpack dev server cannot be run in production environment');
}
