/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from 'react';
import {
    Redirect,
    Route,
    RouteProps as ReactDOMRouteProps,
} from 'react-router-dom';

interface RouteProps extends ReactDOMRouteProps {
    component: React.ComponentType;
}

const PrivateRoute: React.FC<RouteProps> = ({
    component: Component,
    ...rest
}) => (
    <Route
        {...rest}
        render={props =>
            localStorage.getItem('userToken') ? (
                <Component />
            ) : (
                <Redirect
                    to={{
                        pathname: '/',
                        state: { from: props.location },
                    }}
                />
            )
        }
    />
);

export default PrivateRoute;
