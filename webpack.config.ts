import { resolve } from 'path';
import {
    Configuration,
    optimize,
    HotModuleReplacementPlugin,
    NamedModulesPlugin,
    Entry,
    DefinePlugin,
    Plugin,
    LoaderOptionsPlugin,
    Rule,
} from 'webpack';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';

export const cssModulePattern = '[name]__[local]___[hash:base64:8]';

export default (env: string): Configuration => {
    // add hot module replacement if not in production
    let entry: Entry = {
        main: './src/index.tsx',
        vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            'react-router-config',
            'redux',
            'react-helmet',
            'react-redux',
            'serialize-javascript',
        ],
    };
    entry = env !== 'production' ? {
        hot: ['react-hot-loader/patch', 'webpack-hot-middleware/client'],
        ...entry,
    } : entry;
    // set devtool according to the environment
    const devtool: 'source-map' | 'eval-source-map' = env === 'production' ? 'source-map' : 'eval-source-map';
    let plugins: Plugin[] = [new optimize.CommonsChunkPlugin({
        names: ['vendor', 'common'],
    }), new ExtractTextPlugin('styles.css')];
    // set plugins hot module replacement plugins if not in production
    plugins = env === 'production' ? [
        ...plugins,
        new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        new LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        }),
        new optimize.UglifyJsPlugin({
            compress: {
                screw_ie8: true,
                warnings: false,
            },
            sourceMap: true,
        }),
    ] : [
            ...plugins,
            new HotModuleReplacementPlugin(),
            new NamedModulesPlugin(),
        ];
    const cssRule: Rule = env === 'production' ? {
        test: /\.css$/,
        use: ExtractTextPlugin.extract([{
            loader: 'css-loader',
            options: {
                modules: true,
                sourceMap: true,
                importLoaders: 1,
                localIdentName: cssModulePattern,
            },
        }, 'postcss-loader']),
    } : {
            test: /\.css$/,
            use: ['style-loader', {
                loader: 'css-loader',
                options: {
                    modules: true,
                    sourceMap: true,
                    importLoaders: 1,
                    localIdentName: cssModulePattern,
                },
            }, 'postcss-loader'],
        };

    return {
        entry,
        output: {
            filename: '[name].js',
            path: resolve(__dirname, 'dist', 'static'),
            publicPath: '/',
        },
        devtool,
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.css'],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: ['awesome-typescript-loader'],
                    exclude: /node_modules/,
                },
                cssRule,
            ],
        },
        plugins,
    };
};
