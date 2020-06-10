import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import { isAuthenticated } from "./services/auth";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import App from "./pages/App";
import NotFound from './pages/NotFound'
import MenuSuperior from './components/MenuSuperior';
import CompleteRegistry from "./pages/CompleteRegistry";
import Confirm from "./pages/Confirm";
import ConfirmationError from "./pages/ConfirmationError";

const PrivateRoute = ({ component: Component, ...rest }) => (

    <Route
        {...rest}
        render={props => {
            return isAuthenticated() ? (
                <Component {...props} />
            ) : (
                    <Redirect to={{ pathname: "/", state: { from: props.location } }} />
                )

        }
        }
    />
);

const Routes = () => (
    <BrowserRouter>
        <PrivateRoute path='/app' component={MenuSuperior} />
        <Switch>
            <Route exact path="/" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <Route path="/confirm/:code/:email" component={Confirm} />
            <Route path="/confirmationError" component={ConfirmationError} />
            <Route path="/complete" component={CompleteRegistry} />
            <PrivateRoute path="/app" component={App} />
            <Route path="*" component={NotFound} />
        </Switch>
    </BrowserRouter>
);

export default Routes;