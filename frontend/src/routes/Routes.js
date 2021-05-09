import React, { lazy, Suspense, Fragment } from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";
import AuthGuard from "../components/Guards/AuthGuard";
import MainLayout from "../layout/MainLayout";
// import GuestGuard from "src/components/GuestGuard";

const routesConfig = [
  {
    exact: true,
    path: "/",
    component: () => <Redirect to="/login" />,
  },
  {
    // exact: true,
    path: "/dashboard",
    guard: AuthGuard,
    layout: MainLayout,
    component: lazy(() => import("../components/Dashboard/Dashboard")),
  },
  //   {
  //     exact: true,
  //     path: "/404",
  //     component: lazy(() => import("src/views/pages/Error404View")),
  //   },
  {
    exact: true,
    // guard: GuestGuard,
    path: "/login",
    component: lazy(() => import("../components/Auth/LoginView/LoginView")),
  },
  //   {
  //     exact: true,
  //     guard: GuestGuard,
  //     path: "/register",
  //     component: lazy(() => import("src/views/auth/RegisterView")),
  //   }
  //   {
  //     path: '*',
  //     layout: MainLayout,
  //     routes: [
  //       {
  //         exact: true,
  //         path: '/pricing',
  //         component: lazy(() => import('src/views/pages/PricingView'))
  //       },
  //       {
  //         component: () => <Redirect to="/404" />
  //       }
  //     ]
  //   }
];

const renderRoutes = (routes) =>
  routes ? (
    <Suspense fallback={<LoadingScreen />}>
      <Switch>
        {routes.map((route, i) => {
          const Guard = route.guard || Fragment;
          const Layout = route.layout || Fragment;
          const Component = route.component;

          return (
            <Route
              key={i}
              path={route.path}
              exact={route.exact}
              render={(props) => (
                <Guard>
                  <Layout>
                    {route.routes ? (
                      renderRoutes(route.routes)
                    ) : (
                      <Component {...props} />
                    )}
                  </Layout>
                </Guard>
              )}
            />
          );
        })}
      </Switch>
    </Suspense>
  ) : null;

function Routes() {
  return renderRoutes(routesConfig);
}

export default Routes;
