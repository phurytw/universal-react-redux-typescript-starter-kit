# universal-react-redux-typescript-starter-kit

A minimal starter kit with React, Redux, server side rendering, hot module replacement, and Webpack 2. 100% TypeScript.

## Packages used

What you're here for:
* [react](https://github.com/facebook/react)
* [react-dom](https://github.com/facebook/react)
* [react-hot-loader](https://github.com/gaearon/react-hot-loader)
* [redux](https://github.com/reactjs/redux)
* [react-redux](https://github.com/reactjs/react-redux)
* [typescript](https://github.com/Microsoft/TypeScript)
* [webpack](https://github.com/webpack/webpack)
* [react-router](https://github.com/ReactTraining/react-router)

What helps those things above:
* [awesome-typescript-loader](https://github.com/s-panferov/awesome-typescript-loader) - TypeScript loader for Webpack
* [css-loader](https://github.com/webpack-contrib/css-loader) - CSS loader for Webpack
* [express](https://github.com/expressjs/express) - used for server side rendering also serves your bundle
* [extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin) - create a separate CSS file to include it in the server side rendered pages
* [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch) - allows fetch to be used server side
* [serialize-javascript](https://github.com/yahoo/serialize-javascript) - allows to safely pass the redux state from the server to the client
* [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) and [webpack-hot-middleware](https://github.com/glenjamin/webpack-hot-middleware)

What is actually not necessary but will most likely be used:
* [ts-node](https://github.com/TypeStrong/ts-node) - runs TypeScript code without compiling it in your file system
* [tslint](https://github.com/palantir/tslint) - your code linter
* [normalize.css](https://github.com/necolas/normalize.css/) - makes your CSS consitent across all browsers
* [postcss-loader](https://github.com/postcss/postcss) and [autoprefixer](https://github.com/postcss/autoprefixer) - adds vendor prefixes to your CSS code
* [react-helmet](https://github.com/nfl/react-helmet) - easily changes your head tag
* [@types/<your_favourite_package>](https://github.com/DefinitelyTyped/DefinitelyTyped) - type definitions for TypeScript

Tooling:
* [cross-env](https://github.com/kentcdodds/cross-env) - allows to set NODE_ENV on all platforms

## A bit of explanation

Most of the code is just the React/Redux application. The action creators and reducers are located in the `src/modules` directory following the convention proposed [here](https://github.com/erikras/ducks-modular-redux). The root reducer is located in `src/reducer.ts`.

Everything that is server side is located in `src/server.tsx` which has a single `express` application that is responsible for the Hot Module Replacement, the server side rendering, and is also itself a tiny API service for the client app.

### npm scripts

`ts-node` allows TypeScript to be executed without compiling it in the file system. It is used to start the dev server, to compile the webpack bundle, and/or the server application.

### TypeScript configurations

The `tsconfig.json` file is only used for the webpack bundle and debugging. The reason behind this is because we need to define different configurations when compiling webpack or the server or else the server code gets into the webpack bundle and vice versa.
The server *tsconfig* can be found in `scripts/build.ts`:
```typescript
let program = ts.createProgram(["./src/server.tsx"], {
    lib: ["lib.es6.d.ts"],
    jsx: ts.JsxEmit.React,
    noEmitOnError: true,
    noImplicitAny: true,
    noUnusedLocals: true,
    sourceMap: true,
    outDir: "./dist/server",
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS
});
```
**However, you may prefer to use a secondary `tsconfig.json` and run `tsc` in parralel.**

### Hot Module Replacement

In your webpack config you can see that when not in production the following entries are added: `react-hot-loader/patch` and `webpack-hot-middleware/client`. Because of `webpack.optimize.CommonsChunkPlugin` they'll be compiled into a separate JavaScript file that I named `hot.js` *unless I'm mistaken...*

In `src/server.tsx`, when not in production we have `webpack-dev-middleware` and `webpack-hot-middleware` used by the *only* `express` application. They're reponsible of compiling and sending the webpack bundle.

Then finally in `src/index.tsx` you will see:
```typescript
if (module.hot) {
    module.hot.accept("./routes", () => {
        const App: any = require("./routes").default;
        render(App);
    });
}
```
This is what will be called whenever your webpack bundle is updated. This will re-render your application with the changes.

### Server side rendering

In `src/server.tsx`, the final request handler is where server side rendering is done. First the `match` method of `react-router` will get the components to render according to the URL (`req.originalUrl`) and our defined routes.

In each of our components (i.e. `src/components/Main.tsx`) that require data to be fetched we have a `fetchData` static method. These methods will dispatch the necessary data to a newly created Redux store.
This method must return a `Promise` so we can wait for data that needs to be fetched asynchronously with `Promise.all`.

After the data has been fetched we dispatch an action (`setRendered`)that will tell the client not to fetch data again (see `componentWillMount` method in `src/components/Main.tsx`).

The `Helmet.rewind()` call returns an object that we can use to write HTML tags with attributes that will be used by `react-helmet`. If `react-helmet` is used by any of our component the tags will be updated server side.

We can finally render our page using `react-dom`'s `renderToString` with the help of `react-router`'s `RouterContext` and `react-redux`'s `Provider`. In the final page markup we add a [`polyfill.io`](https://qa.polyfill.io/v2/docs) script so we can use `fetch` client-side. And a script containing our Redux state that will be used when initializing the store client side. `serialize-javascript` is needed for safety purposes you can read more about it [here](https://medium.com/node-security/the-most-common-xss-vulnerability-in-react-js-applications-2bdffbcc1fa0#.4nbt3j38f).

Then finally in `/src/index.tsx`, we get our Redux state then we initialize our store with it.

### Visual Studio Code (VSCode) debugging

You can debug in the VSCode editor by using the debug configurations in the `.vscode` directory. Start the application with `npm debug` and start the `Node` debugger VSCode. It will automatically attach the debugger to your application instance. In order to debug the client application you need to install the [vscode-chrome-debug](https://github.com/Microsoft/vscode-chrome-debug) extension, then run Chrome with the `--remote-debugging-port=9222` argument and open client application in `http://localhost:3000`, and then run the `Chrome` debugger in VSCode.

## Now what

### Testing

There is no test in this package to let the choice up to you. If you wish to write tests I recommend that you use [`ts-node`](https://github.com/TypeStrong/ts-node#mocha) with your test framework CLI.

### Babel

There is no any Babel insanity because it is not required if you have set `target` to `es5` and `jsx` to `react` in your `tsconfig.json`. However, if you wish to use Babel (i.e. for plugins or async/await) this is what you can do:

Install Babel and friends:
```
npm i -S babel-core babel-loader babel-preset-es2015 babel-preset-react babel-preset-stage-2
```

Then add it after the `awesome-typescript-loader` like so:
```typescript
    {
        test: /\.tsx?$/,
        use: ["babel-loader", "awesome-typescript-loader"],
        exclude: /node_modules/
    }
```

You'll need to create a `.babelrc` file with this (more explanation [here](https://webpack.js.org/guides/hmr-react/))
```json
{
    "presets": [
        [
            "es2015", { "modules": false }
        ],
        "stage-2",
        "react"
    ],
    "plugins": [
        "react-hot-loader/babel"
    ]
}
```

And you're good to go !

## 
