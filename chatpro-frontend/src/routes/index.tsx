import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Chat from '../pages/Chat';
import Home from '../pages/Home';

const Routes: React.FC = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/chat" component={Chat} />
            </Switch>
        </Router>
    );
};

export default Routes;
