/// <reference types="node" />
// This page can also be used to define interfaces and types that are available globally in your application

interface Window {
    __REDUX_STATE__: any;
}

// Remove those when type definitions are available
interface NodeModule {
    hot: {
        accept: (pathToRootComponent: string, callback: () => void) => void
    };
}

declare module "react-hot-loader" {
    const AppContainer: (props?: { children: JSX.Element }) => JSX.Element;
}
