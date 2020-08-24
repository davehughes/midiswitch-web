import { combineReducers } from 'redux';
import { todoReducer } from './todos';
import { diagramReducer } from './diagram';

export const rootReducer = combineReducers({
  todos: todoReducer,
  diagram: diagramReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
