import React from 'react';
import { Route, Switch } from 'react-router';
import { TodoApp } from '@containers/TodoApp';
import { DiagramApp } from '@components/DiagramApp';
import { hot } from 'react-hot-loader';

export const App = hot(module)(() => (
  <Switch>
    <Route path="/" component={DiagramApp} />
    <Route path="/todo" component={TodoApp} />
  </Switch>
));
