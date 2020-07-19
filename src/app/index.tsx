import React from 'react';
import { Route, Switch } from 'react-router';
import { TodoApp } from 'app/containers/TodoApp';
import { hot } from 'react-hot-loader';

export const App = hot(module)(() => (
  <Switch>
    <Route path="/" component={TodoApp} />
  </Switch>
));
