import { RouteConfig } from 'react-router-config';
import Layout from './components/Layout';
import GitHubSearchLayout from './example/components/GitHubSearchLayout';
import Main from './example/components/Main';
import About from './example/components/About';
import Session from './example/components/Session';

const routeConfig: RouteConfig[] = [
    {
        component: Layout,
        routes: [{
            component: GitHubSearchLayout,
            routes: [{
                component: About,
                path: '/about',
            }, {
                component: Session,
                path: '/session',
            }, {
                component: Main,
                path: '/:username?',
            }],
        }],
    },
];

export default routeConfig;
