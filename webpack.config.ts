import { resolve } from "path";
import { Configuration, optimize, HotModuleReplacementPlugin, NamedModulesPlugin, Entry, DefinePlugin, Plugin, LoaderOptionsPlugin } from "webpack";
import * as ExtractTextPlugin from "extract-text-webpack-plugin";

export default (env: string): Configuration => {
    // add hot module replacement if not in production
    let entry: Entry = {
        main: "./src/index.tsx"
    };
    entry = env !== "production" ? {
        hot: ["react-hot-loader/patch", "webpack-hot-middleware/client"],
        ...entry
    } : entry;
    // set devtool according to the environment
    const devtool: "source-map" | "eval-source-map" = env === "production" ? "source-map" : "eval-source-map";
    let plugins: Plugin[] = [new optimize.CommonsChunkPlugin({
        names: ["manifest"]
    }), new ExtractTextPlugin("styles.css")];
    // set plugins hot module replacement plugins if not in production
    plugins = env === "production" ? [...plugins, new DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify("production")
    }),
    new LoaderOptionsPlugin({
        minimize: true,
        debug: false
    }),
    new optimize.UglifyJsPlugin({
        compress: {
            screw_ie8: true,
            warnings: false
        }
    })] : [...plugins,
    new HotModuleReplacementPlugin(),
    new NamedModulesPlugin()];

    return {
        entry,
        output: {
            filename: "[name].js",
            path: resolve(__dirname, "dist"),
            publicPath: "/"
        },
        devtool,
        devServer: {
            hot: true,
            contentBase: resolve(__dirname, "dist"),
            publicPath: "/"
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js", ".css"]
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: ["awesome-typescript-loader"],
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract(["css-loader", "postcss-loader"]),
                }
            ]
        },
        plugins
    };
};
