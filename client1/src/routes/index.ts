
import Home from '../pages/home';
import User from '../pages/user';

interface IRouteType {
  path: string;
  component: any;
  [key: string]: any;
}

const routes: IRouteType[] = [
  {
    path: '/',
    component: Home,
    exact: true,
  },
  {
    path: '/user',
    component: User,
    exact: true,
  },
]
export default routes;
