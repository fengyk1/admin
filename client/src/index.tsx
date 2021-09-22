import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';

import { store } from './store';

import 'antd/dist/antd.css';

import routes from './routes';

import Layout from './layouts';

import Login from './pages/login';
import Register from './pages/register';

const unlessPath = ['/register', '/login'];

const RouterComponent = () => {
  const { token } = useSelector((state: any) => state.root || {});
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login}></Route>
        <Route path="/register" component={Register}></Route>
        <Layout>
          {routes.map((route) => {
            const { path, component: Component, ...props } = route;
            return (
              <Route
                key={path}
                path={path}
                {...props}
                render={(routeProps) => {
                  const { location } = routeProps;
                  if (!unlessPath.includes(location.pathname) && !token) {
                    return (
                      <Redirect
                        to={{ pathname: '/login', state: { from: location } }}
                      />
                    );
                  }
                  return <Component {...routeProps} />;
                }}
              ></Route>
            );
          })}
        </Layout>
      </Switch>
    </Router>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <RouterComponent />
    </Provider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
