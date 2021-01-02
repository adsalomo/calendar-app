import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import { startChecking } from '../actions/auth';
import { LoginScreen } from '../components/auth/LoginScreen';
import { CalendarScreen } from '../components/calendar/CalendarScreen';
import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';

export const AppRouter = () => {

    const dispatch = useDispatch();
    const { checking, uid } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(startChecking());
    }, [dispatch]);

    if (checking) {
        return <h5 className="text-center">Por Favor espere...</h5>
    }

    return (
        <Router>
            <div>
                <Switch>
                    <PublicRoute
                        isAuth={uid ? true : false}
                        exact
                        path="/login"
                        component={LoginScreen}
                    />

                    <PrivateRoute
                        isAuth={uid ? true : false}
                        exact
                        path="/"
                        component={CalendarScreen}
                    />

                    <Redirect to="/login" />
                </Switch>
            </div>
        </Router>
    )
}
