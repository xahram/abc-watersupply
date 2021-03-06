import React, { Suspense, Fragment } from "react";
import { Switch, Route } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";
import { AnimatePresence, motion } from "framer-motion";
import {useLocation} from 'react-router-dom'
import AuthGuard from "../components/Guards/AuthGuard";
import MainLayout from "../layout/MainLayout";

const renderRoutes = (routes) =>
  routes ? (
    <Suspense fallback={<LoadingScreen />}>
      <AnimatePresence>
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
      </AnimatePresence>
    </Suspense>
  ) : null;

export default function NestedRoutes({ routesConfig }) {
  return renderRoutes(routesConfig);
}
