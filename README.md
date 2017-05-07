# Universal React Redux starter kit with TypeScript and Webpack 2

A minimal starter kit with React, Redux, server side rendering with React-Router 4, hot reloading, and Webpack 2. 100% TypeScript.

## Quick start

```
git clone https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit.git
npm install
npm start
```

This will start the demo application. At this point you can delete the `src/example` directory and you will get a blank page ! (and a few errors you will have to fix 😔)

## Packages used

* [react](https://github.com/facebook/react) and [react-dom](https://github.com/facebook/react) - your favourite JavaScript library !
* [react-hot-loader](https://github.com/gaearon/react-hot-loader) - used for hot reloading
* [redux](https://github.com/reactjs/redux) - store for the application state
* [react-redux](https://github.com/reactjs/react-redux) - use Redux with React
* [typescript](https://github.com/Microsoft/TypeScript) - your favourite language !
* [webpack](https://github.com/webpack/webpack) - module bundler
* [react-router-dom](https://github.com/ReactTraining/react-router) - routing !
* [react-router-config](https://github.com/ReactTraining/react-router) - helpful for server side rendering
* [express](https://github.com/expressjs/express) - used for server side rendering also serves the Webpack bundle
* [awesome-typescript-loader](https://github.com/s-panferov/awesome-typescript-loader) - TypeScript loader for Webpack
* [css-loader](https://github.com/webpack-contrib/css-loader) - CSS loader for Webpack
* [style-loader](https://github.com/webpack-contrib/css-loader) - load CSS from the Webpack bundle
* [extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin) - create a separate CSS file to include it in the server side rendered pages
* [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch) - allows fetch to be used server side
* [serialize-javascript](https://github.com/yahoo/serialize-javascript) - allows to safely pass the redux state from the server to the client
* [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) and [webpack-hot-middleware](https://github.com/glenjamin/webpack-hot-middleware) - hot module replacement and serve the bundle
* [ts-node](https://github.com/TypeStrong/ts-node) - runs TypeScript code without compiling it in your file system
* [tslint](https://github.com/palantir/tslint) - TypeScript code linter
* [postcss-loader](https://github.com/postcss/postcss) and [autoprefixer](https://github.com/postcss/autoprefixer) - adds vendor prefixes to your CSS code
* [react-helmet](https://github.com/nfl/react-helmet) - easily changes your head tag
* [@types/<your_favourite_package>](https://github.com/DefinitelyTyped/DefinitelyTyped) - type definitions for TypeScript
* [cross-env](https://github.com/kentcdodds/cross-env) - allows to set NODE_ENV on all platforms

And that's about it !

## Explanation

Most of the code is just the React/Redux application. The action creators and reducers are located in the `src/example/modules` directory following the convention proposed [here](https://github.com/erikras/ducks-modular-redux). The root reducer is located in `src/reducer.ts`.

Everything that is server side is located in `src/server.tsx` which has a single `express` application that is responsible for serving the webpack bundle, HMR, and server side rendering.

### npm scripts and compiled JavaScript files

`ts-node` allows TypeScript to be executed without compiling it in the file system. It is used to start the dev server, to compile the webpack bundle, and/or the server application using only Webpack. It also allows us to have a Webpack config in TypeScript. The only JavaScript files we get are for the production environment when building the application.

### Hot Module Replacement and Hot reloading

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

### CSS Styles

In production we use a separate CSS file that we get thanks to `extract-text-webpack-plugin`. It allows us to send the CSS from a simple `link` tag rather than via the bundle avoiding [having to wait for the bundle to load](https://en.wikipedia.org/wiki/Flash_of_unstyled_content).

However, since the HMR updates the bundle it wouldn't reflect your style changes if you used a separate CSS file so we use `style-loader` in development in order to enable hot reloading with CSS.

### Server side rendering with async data fetching

In short this is how server side rendering is done:
1. Find matched Route components
2. Fetch data
3. Render the components as HTML code
4. Send the HTML code as the HTTP response

It's very similar to what is explained in [`react-router`'s documentation](https://reacttraining.com/react-router/web/guides/server-rendering).

#### Routes

In the `routes.tsx` we have a bunch of routes in an array as [plain JS objects](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config#route-configuration-shape). They will be used by `react-router-config`'s [`matchRoutes`](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config#matchroutesroutes-pathname) and [`renderRoutes`](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config#renderroutesroutes).

Of course, we can still use the [Route component](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Route.md) in our application they will be rendered server side but we won't be able to retrieve them for server side data fetching.

#### Initializing the Redux store and async data fetching

In `src/server.tsx`, the final request handler is where server side rendering is done.

We start by creating a store that will hold our application's data which we will eventually pass to the client.
The `setIsServerSide` call allows us to notify the components that we are in a server side context.

We get the matched routes with `react-router-config`'s [`matchRoutes`](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config#matchroutesroutes-pathname).

In each of our components that require data to be fetched we have a `fetchData` static method. These methods will dispatch the necessary data to the Redux store.

i.e. in `src/example/components/Main.tsx` we fetch the matched GitHub user by passing the dispatch method of our store and the Route params. Obviously, the `fetchData` parameters need to be the same across all components.

This method must return a `Promise` so we can wait for data that needs to be fetched asynchronously with `Promise.all`.
After async data fetching has been done we can finally render the application.

Keep in mind that the `componentWillMount` method of each component will be called when rendering. But because we can't await promises created in there we can't use it for async actions. Awaiting the `fetchData` calls also allows us to have an up-to-date store before rendering.

#### Rendering

We can now render the application as a string with an up-to-date store.

Since our routes (previously obtained with `matchRoutes`) are not real Route components but `react-router-config` routes, [`renderRoutes`](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config#renderroutesroutes) is needed to get the components. The components are wrapped in a [`StaticRouter`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/StaticRouter.md) component to pass the request URL and get catch any redirections and then wrapped in a [`Provider`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#provider-store) to pass the application's state to our components. The whole thing is passed as a parameter in a [`renderToString`](https://facebook.github.io/react/docs/react-dom-server.html#rendertostring) call.

#### Redirections

After rendering if a single [`Redirect`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Redirect.md) component has been rendered the context object passed in the `StaticRouter` will have an url which allows us to know if the user needs to be redirected and where to redirect. Otherwise we can send the rendered application to the client.

#### Head tag and React-Helmet

We have only rendered the application just like we would with a `ReactDOM.render` but this doesn't set the `<head>` tag. In order to set the `<head>` tag server side we need to use `react-helmet`.

We start by calling [`renderStatic`](https://github.com/nfl/react-helmet#server-usage) before rendering which will return an object. When rendering every Helmet usage will update this object.

After rendering we can use the object that has updated head tags (such as `<title>`, `<link>`, etc.) in the final markup.

#### Final HTML code and sending it

We just have to put everything together and send it back to the client. I choose to create the HTML code with the JSX syntax but then we need to use [`renderToStaticMarkup`](https://facebook.github.io/react/docs/react-dom-server.html#rendertostaticmarkup) with it.

We fill the `<head>` tag with the help of the Helmet object and the application's HTML in the root element. We add a [`polyfill.io`](https://qa.polyfill.io/v2/docs) script so we can use `fetch` client-side and a script containing our Redux state that will be used when initializing the store client side. `serialize-javascript` is needed for safety purposes you can read more about it [here](https://medium.com/node-security/the-most-common-xss-vulnerability-in-react-js-applications-2bdffbcc1fa0#.4nbt3j38f).

The webpack generated scripts are also added note that we don't add the `hot.js` in production since it is the bit relevant to HMR and hot reloading and we don't want that in production.

Then finally in `/src/index.tsx`, we get our Redux state then we initialize our store with it.

## More stuff

### Testing

If you wish to write tests I recommend that you use [`ts-node`](https://github.com/TypeStrong/ts-node#mocha) with your test framework.

#### Example with mocha

## Separate webpack dev server

## Separate back-end / Proxying requests

## CSS Modules

## Server side redirection (i.e authentication required pages)

### Visual Studio Code (VSCode) debugging

You can debug in the VSCode editor adding those configurations to your`.vscode/launch.json` file:
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node2",
            "request": "attach",
            "name": "Node",
            "address": "localhost",
            "port": 9229,
            "restart": true,
            "localRoot": "${workspaceRoot}"
        },
        {
            "name": "Chrome",
            "type": "chrome",
            "request": "attach",
            "port": 9222,
            "url": "http://localhost:3000",
            "webRoot": "${workspaceRoot}"
        }
    ]
}
```

Start the application with `ts-node --inspect <file>` and launch the `Node` VSCode debugger. It will automatically attach the debugger to your application instance.

In order to debug the client application you need to install the [vscode-chrome-debug](https://github.com/Microsoft/vscode-chrome-debug) extension, then run Chrome with the `--remote-debugging-port=9222` argument and open client application in `http://localhost:3000`, and then run the `Chrome` debugger in VSCode.

### Babel

There is no any Babel insanity because it is not required if you have set `target` to `es5` and `jsx` to `react` in your `tsconfig.json`. However, if you wish to use Babel (i.e. for plugins) this is what you can do:

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
