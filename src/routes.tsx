import { RouteConfig } from "react-router-config";
import Layout from "./components/Layout";
import GitHubSearchLayout from "./example/components/GitHubSearchLayout";
import Main from "./example/components/Main";
import About from "./example/components/About";

const routeConfig: RouteConfig[] = [
    {
        component: Layout,
        routes: [{
            component: GitHubSearchLayout,
            routes: [{
                component: About,
                path: "/about"
            }, {
                component: Main,
            }]
        }]
    }
];

export default routeConfig;
