/**
 * @file Builds the webpack bundle
 */
import * as webpack from "webpack";
import webpackConfig from "../webpack.config";

webpack(webpackConfig(process.env.NODE_ENV)).run((err: Error, stats: webpack.Stats) => {
    if (err) {
        throw err;
    }
    console.log(stats.toString({
        colors: true
    }));
});
