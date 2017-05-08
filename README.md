# Universal React Redux starter kit with TypeScript and Webpack 2

A minimal starter kit with React, Redux, server side rendering with React-Router 4, hot reloading, and Webpack 2. 100% TypeScript.

## Table of contents

* [Demo](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit#demo)
* [Quick start](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit#quick-start)
* [Packages used](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit#packages-used)
* [How it works / Explanation / Deep dive](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit#deep-dive)
    * [npm scripts and compiled JavaScript files](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit#npm-scripts-and-compiled-javascript-files)
    * [Hot Module Replacement and hot reloading](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit#hot-module-replacement-and-hot-reloading)
    * [CSS loaders](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit#css-loaders)
    * [Server side rendering and async data fetching](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit#server-side-rendering-with-async-data-fetching)
    * [tslint](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit#tslint)
    * [Possible improvements](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit#improvements)
* [Extras](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit#extras)
    * [How to run tests](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit#testing)
    * [How to separate the Webpack dev server](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit#separate-webpack-dev-server)
    * [How to use this project with a separate API server](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit#separate-back-end--proxying-requests)
    * [How to use CSS Modules](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit#css-modules)
    * [VSCode debugging](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit#visual-studio-code-vscode-debugging)
    * [Add Babel](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit#babel)

## Demo

[https://universal-react-typescript.herokuapp.com](https://universal-react-typescript.herokuapp.com)

## Quick start

```
git clone https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit.git <directory_name>
cd <directory_name>
npm install
npm start:dev
```

This will start the demo application available at [http://localhost:3000](http://localhost:3000) with Hot Module Replacement and hot reloading enabled. At this point you can delete the `src/example` directory and you will get a blank page! (and a few errors you will have to fix 😔 in `src/index.tsx`, `src/reducer.ts` and `src/routes.tsx`)

## Packages used

* [react](https://github.com/facebook/react) and [react-dom](https://github.com/facebook/react) - your favourite JavaScript library!
* [react-hot-loader](https://github.com/gaearon/react-hot-loader) - used for hot reloading
* [redux](https://github.com/reactjs/redux) - store for the application state
* [react-redux](https://github.com/reactjs/react-redux) - use Redux with React
* [typescript](https://github.com/Microsoft/TypeScript) - your favourite language!
* [webpack](https://github.com/webpack/webpack) - module bundler
* [react-router-dom](https://github.com/ReactTraining/react-router) - routing
* [react-router-config](https://github.com/ReactTraining/react-router) - helpful for server side rendering
* [express](https://github.com/expressjs/express) - used for server side rendering also serves the Webpack bundle
* [awesome-typescript-loader](https://github.com/s-panferov/awesome-typescript-loader) - TypeScript loader for Webpack
* [css-loader](https://github.com/webpack-contrib/css-loader) - CSS loader for Webpack
* [style-loader](https://github.com/webpack-contrib/css-loader) - load CSS from the Webpack bundle
* [extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin) - create a separate CSS file from your Webpack config
* [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch) - allows fetch to be used server side
* [serialize-javascript](https://github.com/yahoo/serialize-javascript) - allows to safely pass the redux state from the server to the client
* [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) and [webpack-hot-middleware](https://github.com/glenjamin/webpack-hot-middleware) - hot module replacement and serve the bundle
* [ts-node](https://github.com/TypeStrong/ts-node) - runs TypeScript code without compiling it in your file system
* [tslint](https://github.com/palantir/tslint) and [tslint-react](https://github.com/palantir/tslint-react) - TypeScript code linter
* [postcss-loader](https://github.com/postcss/postcss) and [autoprefixer](https://github.com/postcss/autoprefixer) - adds vendor prefixes to your CSS code
* [react-helmet](https://github.com/nfl/react-helmet) - easily changes your head tag
* [@types/<your_favourite_package>](https://github.com/DefinitelyTyped/DefinitelyTyped) - type definitions for TypeScript
* [cross-env](https://github.com/kentcdodds/cross-env) - allows to set NODE_ENV on all platforms

And that's about it!

## Deep dive

Most of the code is just the React/Redux application. The action creators and reducers are located in the `src/example/modules` and `src/modules` directories following the convention proposed [here](https://github.com/erikras/ducks-modular-redux). The root reducer is located in `src/reducer.ts`.

Everything that is server side is located in `src/server.tsx` which has a single `express` application that is responsible for serving the webpack bundle, HMR, and server side rendering.

*You will see a lot of links but they just point to the relevant code or the relevant documentation. Sorry in advance!*

### npm scripts and compiled JavaScript files

`ts-node` allows TypeScript to be executed without compiling it in the file system. It is used to start the dev server, to compile the webpack bundle, and/or the server application using only Webpack. It also allows us to have a Webpack config in TypeScript. The only JavaScript files we get are for the production environment when building the application.

**In order to have everything in a single script without adding any extra package the [`scripts/build.ts`](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/master/scripts/build.ts) compiles the Webpack bundle *and* the server application. I recommend that you remove the TypeScript compilation at [lines 16-39](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/master/scripts/build.ts#L16-L39) and compile it via [`tsc`](https://www.typescriptlang.org/docs/tutorial.html#compiling-your-code). Doing so will use `tsconfig.json` and make things more consistent.**

### Hot Module Replacement and Hot reloading

[In your webpack config](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/master/webpack.config.ts#L31) you can see that when not in production the following entries are added: `react-hot-loader/patch` and `webpack-hot-middleware/client`. Because of `webpack.optimize.CommonsChunkPlugin` they'll be compiled into a separate JavaScript file that I named `hot.js`.

[In `src/server.tsx`](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/master/src/server.tsx#L26-L37), when not in production we have `webpack-dev-middleware` and `webpack-hot-middleware` used by the *only* `express` application. They're reponsible of compiling, serving the webpack bundle and hot module replacement.

Then finally in [`src/index.tsx`](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/master/src/index.tsx#L35-L40) you will see:
```typescript
if (module.hot) {
    module.hot.accept("./routes", () => {
        const App: any = require("./routes").default;
        render(App);
    });
}
```
This is what will be called whenever your webpack bundle is updated. This will re-render your application with the changes.

### CSS Loaders

In production we use a separate CSS file that we get thanks to `extract-text-webpack-plugin`. It allows us to send the CSS from a simple `link` tag rather than via the bundle avoiding [having to wait for the bundle to load](https://en.wikipedia.org/wiki/Flash_of_unstyled_content).

However, since the HMR updates the bundle it wouldn't reflect your style changes if you used a separate CSS file [so we use `style-loader` in development in order to enable hot reloading with CSS](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/master/webpack.config.ts#L66).

### Server side rendering with async data fetching

In short this is how server side rendering is done:
1. Find matched Route components
2. Fetch data
3. Render the components as HTML code
4. Send the HTML code as the HTTP response

It's very similar to what is explained in [`react-router`'s documentation](https://reacttraining.com/react-router/web/guides/server-rendering).

#### Routes

In the `routes.tsx` we have [a bunch of routes](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/master/src/routes.tsx#L7-L21) in an array as [plain JS objects](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config#route-configuration-shape). They will be used by `react-router-config`'s [`matchRoutes`](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config#matchroutesroutes-pathname) and [`renderRoutes`](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config#renderroutesroutes).

Of course, we can still use the [Route component](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Route.md) in our application they will be rendered server side but we won't be able to retrieve them for server side data fetching.

#### Initializing the Redux store and async data fetching

In `src/server.tsx`, [the final request handler](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/master/src/server.tsx#L42-L102) is where server side rendering is done.

We start by [creating a store](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/master/src/server.tsx#L43) that will hold our application's data which we will eventually pass to the client.
The [`setIsServerSide` call](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/master/src/server.tsx#L48) allows us to notify the components that we are in a server side context. It just sets a boolean in the Redux store.

We [get the matched routes](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/master/src/server.tsx#L52) with `react-router-config`'s [`matchRoutes`](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config#matchroutesroutes-pathname).

In each of our [components that require data to be fetched we have a `fetchData` static method](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/master/src/example/components/Main.tsx#L37-L39). These methods will dispatch the necessary data to the Redux store.

i.e. in `src/example/components/Main.tsx` we fetch the matched GitHub user by passing the dispatch method of our store and the Route params. The `fetchData` parameters need to be the same across all components because they'll be [called in a loop](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/master/src/server.tsx#L55-L60).

This method must return a `Promise` so we can [wait for data that needs to be fetched asynchronously with `Promise.all`](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/master/src/server.tsx#L63).
After async data fetching has been done we can finally render the application.

Keep in mind that the `componentWillMount` method of each component will be called when rendering. But because we can't await promises created in there we can't use it for async actions. Awaiting the `fetchData` calls also allows us to have an up-to-date store before rendering. Notice that because of this we might not want to call some functions server side. In `src/example/components/Main.tsx` [we also fetch data in `componentWillMount`](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/master/src/example/components/Main.tsx#L48-L50) (for the case where render client side) to prevent fetching twice I use [the boolean we have previously set](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/master/src/server.tsx#L48).

#### Rendering

We can now render the application as a string with an up-to-date store.

Since our routes (previously obtained with `matchRoutes`) are not real Route components but `react-router-config` routes, [`renderRoutes`](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config#renderroutesroutes) is needed to get the components. The components are wrapped in a [`StaticRouter`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/StaticRouter.md) component to pass the request URL and get catch any redirections and then wrapped in a [`Provider`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#provider-store) to pass the application's state to our components. [The whole thing](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/master/src/server.tsx#L67-L73) is passed as a parameter in a [`renderToString`](https://facebook.github.io/react/docs/react-dom-server.html#rendertostring) call.

#### Redirections

After rendering if a single [`Redirect`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Redirect.md) component has been rendered the context object passed in the `StaticRouter` will [have an url which allows us to know if the user needs to be redirected and where to redirect](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/master/src/server.tsx#L76-L79). Otherwise we can send the rendered application to the client.

#### Head tag and React-Helmet

We have only rendered the application just like we would with a `ReactDOM.render` but this doesn't set the `<head>` tag. In order to set the `<head>` tag server side we need to use `react-helmet`.

We start by calling [`renderStatic`](https://github.com/nfl/react-helmet#server-usage) before rendering [which will return an object](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/master/src/server.tsx#L66). When rendering every Helmet usage will update this object.

After rendering we can use the object that has updated head tags (such as `<title>`, `<link>`, etc.) in the final HTML code.

#### Final HTML code and sending it

We just have to put everything together and send it back to the client. I choose to create the HTML code with the JSX syntax but then we need to use [`renderToStaticMarkup`](https://facebook.github.io/react/docs/react-dom-server.html#rendertostaticmarkup) with it.

[We fill the `<head>` tag with the help of the Helmet object](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/master/src/server.tsx#L83-L89) and the [application's HTML in the root element](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/master/src/server.tsx#L91). We add a [`polyfill.io`](https://qa.polyfill.io/v2/docs) script so we can use `fetch` client-side and [a script containing our Redux state](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/master/src/server.tsx#L93-L96) that will be used when initializing the store client side. `serialize-javascript` is needed for safety purposes you can read more about it [here](https://medium.com/node-security/the-most-common-xss-vulnerability-in-react-js-applications-2bdffbcc1fa0#.4nbt3j38f).

The [webpack generated scripts are also added](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/master/src/server.tsx#L97) note that we don't add [the `hot.js` in production](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/master/src/server.tsx#L64-L65) since it is the bit relevant to HMR and hot reloading and we don't want that in production.

Then finally in `/src/index.tsx`, we get our Redux state then [we initialize our store with it](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/master/src/index.tsx#L15-L16).

### tslint

The `tslint.json` config is taken from [piotrwitek's React & Redux in TypeScript - Static Typing Guide](https://github.com/piotrwitek/react-redux-typescript-guide#tslintjson).

### Improvements

I recommend that you [use `tsc` for building the server application](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit#npm-scripts-and-compiled-javascript-files).

You may also want to improve the production build by [separating the webpack dev server](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit#separate-webpack-dev-server) and use an `src/index.tsx` file [without `react-hot-loader`](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/master/src/index.tsx#L19).

## Extras

I have put below some tips regarding universal React and/or TypeScript.

### Testing

If you wish to write tests I recommend that you use [`ts-node`](https://github.com/TypeStrong/ts-node#mocha) with your test framework.

#### Example with mocha

* Example code: [https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/tree/mocha](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/tree/mocha)

We can run [`mocha`](https://mochajs.org) tests with [`ts-node`](https://github.com/TypeStrong/ts-node#mocha) with this command:
```
mocha --compilers ts:ts-node/register,tsx:ts-node/register <files>
```

We can also use the [--fast fast option in `ts-node`](https://github.com/TypeStrong/ts-node#configuration-options) for faster compilation. For this we need to create a register JavaScript file similar to `ts-node` that you should be located at `node_modules/ts-node/register.js` except that we will add the `fast` option:
```js
require("ts-node").register({
    fast: true
});
```
You can find this file [at the root of the project](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/mocha/ts-node-register.js).

You can find an example of an unit test in file a located at [`src/example/components/__tests__/About.test.tsx`](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/mocha/src/example/components/__tests__/About.test.tsx). I added a [`test` script in `package.json`](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/mocha/package.json#L12) with the **updated command to run mocha with the new register file (that I named `ts-node-register.js`)**:
```
mocha --compilers ts:./ts-node-register.js,tsx:./ts-node-register.js src/**/__tests__/*.ts*
```

In order to run the tests I need the required packages:
```
npm i -D mocha chai enzyme react-test-renderer @types/mocha @types/chai @types/enzyme
```

Then we can simply run the test script:
```
npm test
```

### Separate webpack dev server

* Example code: [https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/tree/separate-dev-server](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/tree/separate-dev-server)

In the current setup the webpack dev server is located in [the server application](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/mocha/src/server.tsx#L26-L37). Although it is not run in production they are still required to be installed in order to build the application. And running the file will always trigger a Webpack compilation.

You can create a separate webpack dev server and point the `<script>` tags to it. Let's say we want to server the webpack bundle from `http://localhost:3001`. First we're going to add [that to the script tags in `src/server.tsx`](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/separate-dev-server/src/server.tsx#L45-L55).

Then we're going to create the [new webpack dev server `src/devServer.ts`](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/separate-dev-server/src/devServer.ts). In that file we have an express application listening on port **3001**. We're going to serve the webpack bundle with `webpack-dev-middleware` and `webpack-hot-middleware`. But if we only do so it's not going to work very well. So we'll have to change a few things:
- We need to allow CORS because the webpack HMR is going to poll that server from another domain (`http://localhost:3000`). In order to do that we added [a `headers: { 'Access-Control-Allow-Origin': '*' }` to the webpack dev middleware options](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/separate-dev-server/src/devServer.ts#L26-L28).
- With the current webpack configuration the HMR is going to poll on the same domain which is `http://localhost:3000` in our case but we want it to poll `http://localhost:3001` instead. In order to do that we modify our webpack config by [adding the URL to this server to the `webpack-hot-middleware` entry](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/separate-dev-server/src/devServer.ts#L18-L21).
- And at last, since the application is going to request the bundle at `http://localhost:3001` (instead of `/`) we need to [adjust the `output.publicPath` accordingly](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/separate-dev-server/src/devServer.ts#L22).

I added a [new npm script `start:webpack`](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/separate-dev-server/package.json#L9) that starts this server. We can now start both `start:dev` and `start:webpack` and have the webpack bundle served from another server while retaining HMR and Hot reloading!

### Separate back-end / Proxying requests

* Example code: [https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/tree/proxy-requests](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/tree/proxy-requests)

#### Proxying requests

If your application queries a server from another domain it might get cookies that will not be used when doing the first page request (since it wouldn't be on the same domain). In order to use the same domain we can use [`http-proxy`](https://github.com/nodejitsu/node-http-proxy) and pass the requests to another server.
```
npm i -S http-proxy
```

Unfortunately there is no type definitions available for it via `@types`. So I have used [type definitions](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/proxy-requests/src/http-proxy.d.ts) that I found [there](https://github.com/typed-contrib/node-http-proxy).

I have setup [a simple express app located at `src/api.ts`](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/proxy-requests/src/api.ts) that stores a string in memory (via session) and we can retrieve it on page load. That server listens to port **8000**. This is its API:
* `GET /api`: retrieves the stored string
* `POST /api/:string`: stores a string in session

We also need to install `express-session`:
```
npm i -S express-session @types/express-session
```

[In `src/server.tsx`](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/proxy-requests/src/server.tsx#L41-L46) we are going to create a proxy server with `http-proxy` that proxies every request that starts with `/api` to `http://localhost:8000`:
```ts
const apiProxy: httpProxy = httpProxy.createProxyServer({
    target: 'http://localhost:8000',
});
app.all('/api*', (req: Request, res: Response) => {
    apiProxy.web(req, res);
});
```

#### Redux-Thunk and server side requests

Now we can perform requests to `http://localhost:3000` and it will use the API server located at `http://localhost:8000` and set the cookies for `http://localhost:3000`. But let's not do that now.

What happens when we perform the first page request? The request might send a nice cookie but the code still remain a simple `fetch` call. The server fetches data one the behalf of the server and does not pass the cookie which is not what we want. We need to find a way to pass the proper cookie depending on the context.

An elegant solution would be to use [`redux-thunk` with the extra argument](https://github.com/gaearon/redux-thunk#injecting-a-custom-argument). In this extra argument we're going to set the cookie and we'll know by its presence if we're coming from a server side context. First let's install `redux-thunk`:
```
npm i -S redux-thunk  @types/redux-thunk
```

Then add it to [our store factory](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/proxy-requests/src/store.ts#L9) with the extra argument:
```ts
import reduxThunk from 'redux-thunk';
const configureStore: (initialState?: IReduxState, cookie?: { Cookie?: string }) => Store<IReduxState> =
    (initialState?: IReduxState, cookie: { Cookie?: string } = {}): Store<IReduxState> => {
        return createStore<IReduxState>(reducer,
            initialState as IReduxState,
            applyMiddleware(reduxThunk.withExtraArgument(cookie)));
    };
```

And finally we can create [action creators](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/proxy-requests/src/example/modules/session.ts#L18-L49) like so:
```ts
export function fetchValue(): ThunkAction<Promise<SetValue>, ISessionState, { Cookie?: string }> {
    return (
        dispatch: Dispatch<ISessionState>,
        getState: () => ISessionState,
        extra: { Cookie?: string }) => fetch('http://localhost:3000/api', {
            credentials: 'include',
            headers: {
                ...extra,
            },
        })
            .then<{ value: string | undefined }>((response: Response) => response.json())
            .then<SetValue>((result: { value: string | undefined }) => dispatch({
                type: SET_VALUE,
                value: result.value,
            }));
}
```

Now we just need to [pass the cookie](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/proxy-requests/src/server.tsx#L52) in the new store factory when we create the store in `src/server.tsx`:
```ts
const store: Store<IReduxState> = createStore(undefined, req.get('Cookie'));
```

This is what happens in the first page request:
1. If the browser has a cookie for `http://localhost:3000` it will send it to the server.
2. The server initiates a new store with a `redux-thunk` extra argument containing the cookie.
3. When performing async data fetching the action creators will be called and we pass the cookie to the `fetch` options.
4. The async request is proxied to the API server at `http://localhost:8000` that receives the request with the cookie.
5. The API server responds with the correct data.

After the first page request subsequent requests are done client side:
1. In the client side the store is not initialized with a cookie.
2. When performing an async request the cookie is not present.
3. `fetch` will use the browser's cookie.

You can find all relevant code in:
* `src/example/session.ts`: a Redux module with action creators, action types and reducer relevant to our application.
* `src/example/components/Session.tsx`: a component that fetch the stored value and displays a form to change it.
* `src/store.ts`: the new store factory using the `redux-thunk` middleware with an extra argument
* `src/server.tsx`: uses the new store factory by passing the cookie and a request handler that uses a proxy server.
* `src/api.ts`: an express application listening to port **8000**.

You can now start both servers with `npm run start:dev` and `npm run start:api` and open `http://localhost:3000/session`.

### CSS Modules

* Example code: [https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/tree/css-modules](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/tree/css-modules)

#### CSS Modules in TypeScript

Let's say we would like to import styles from a CSS file named `styles.css`. The TypeScript compiler will throw an error because the `styles.css` module does not exist! The compiler is unaware of that technology so we must teach it... by simply adding a `.d.ts` file alongside it.

In the example, I exported styles from the `src/example/global.css` files into separate CSS modules located at [`src/example/components/layout.css`](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/css-modules/src/example/components/layout.css) and [`src/example/components/user.css`](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/css-modules/src/example/components/user.css) with [theirs respectives `.d.ts` files](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/css-modules/src/example/components/layout.css.d.ts). The `.d.ts` files just tell the compiler that those modules exist but it's still Webpack that is going to handle those CSS modules.

We have a `webpack.config.ts` file with [an updated CSS loader options to enable CSS modules](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/css-modules/webpack.config.ts#L63-L85). You can notice that I have [exported the class name pattern](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/css-modules/webpack.config.ts#L15). It will be used to compute class names server side.

#### CSS Modules server side

In fact, webpack does not compile the server application so the CSS modules do not exist. Compiling the server application with Webpack would actually make it work (you need to set the `target` option to `node`). However you won't be able to use it with `ts-node` in development. In order to solve that problem we can use [`css-modules-require-hook`](https://github.com/css-modules/css-modules-require-hook) instead:
```
npm i -S css-modules-require-hook @types/css-modules-require-hook
```

I created [a `src/cssHook.ts` file](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/css-modules/src/cssHook.ts) that uses it.
```ts
hook({
    prepend: postCssConfig.plugins,
    generateScopedName: cssModulePattern,
    rootDir: resolve(__dirname, '..'),
});
```

And [use it in `src/server.tsx`](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/css-modules/src/server.tsx#L20-L22):
```ts
import hook from './cssHook';
hook();
import routeConfig from './routes';
```
**Note that I use it before importing my routes so I CSS modules server side enabled before importing components that make use of CSS modules**

We can find the class name pattern that I exported from the webpack config. The PostCSS plugins (that is only autoprefixer in this case). And a `rootDir`.
We import the PostCSS plugins directly from the configuration that is a JavaScript file. We need to set `allowJs` compiler option to `true` in our `tsconfig.json` for it to work. The `rootDir` is necessary because we use the `outDir` compiler option in `tsconfig.json`. And `outDir` is necessary in our case because TypeScript would refuse to compile JavaScript at the same location as the source. But because we use `outDir` in our production environment the generated class names are going to be different (since the hash is based on the absolute path the class names will be different from those generated by Webpack) so we use `rootDir` to solve the issue.

#### Compiling CSS modules in production

When compiling TypeScript files into JavaScript the application will be located in `dist`. But TypeScript only compiles TypeScript files (crazy right?). So when we run the server application in production it is unable to create CSS class names (because the CSS files are not there!). In order to solve the issue we need to create a separate script that copies CSS files over the `dist` directory. I have used [`glob`](https://github.com/isaacs/node-glob) in order to retrieve CSS files and copy them. You can find [the script in `scripts/css.ts`](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/css-modules/scripts/css.ts) and I have also added an [npm script `build:css`](https://github.com/lith-light-g/universal-react-redux-typescript-starter-kit/blob/css-modules/package.json#L11).

You can now build in production and run the application with CSS modules:
```
npm run build:prod
npm run build:css
npm run start:prod
```

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
