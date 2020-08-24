import { useMemo } from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { createAction } from 'redux-actions';
import { Project, ProjectModel } from '@models';

export namespace DiagramActions {
  export enum Type {
    ADD_PROJECT = 'ADD_PROJECT',
    ADD_PROJECT_MODEL = 'ADD_PROJECT_MODEL',
    SELECT_PROJECT_MODEL = 'SELECT_PROJECT_MODEL',
  };

  export const addProject = createAction<Project>(DiagramActions.Type.ADD_PROJECT);
  export const addProjectModel = createAction<ProjectModel>(DiagramActions.Type.ADD_PROJECT_MODEL);
  export const selectProjectModel = createAction<ProjectModel | null>(DiagramActions.Type.SELECT_PROJECT_MODEL);
}

export type DiagramActionsPayload = Project | ProjectModel | null;
export type DiagramActions = Omit<typeof DiagramActions, 'Type'>;
export const useDiagramActions = (dispatch: Dispatch) => {
  const { Type, ...actions } = DiagramActions;
  return useMemo(() => bindActionCreators(actions as any, dispatch), [dispatch]) as DiagramActions;
};
