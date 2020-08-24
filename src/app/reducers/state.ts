import { TodoModel } from '@models';
import { DiagramState as IDiagramState } from '@reducers/diagram';

export namespace RootState {
  export type TodoState = TodoModel[];
  export type DiagramState = IDiagramState;
}

export interface RootState {
  todos: RootState.TodoState;
  diagram: RootState.DiagramState;
  router?: any;
}
