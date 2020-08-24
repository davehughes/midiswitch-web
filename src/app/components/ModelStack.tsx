import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import React from 'react';
import { RootState } from '@reducers';
import { useDispatch, useSelector } from 'react-redux';
import { useDiagramActions } from '@actions';

import { Project, ProjectModel } from '@models';
import { DiagramModel } from '@projectstorm/react-diagrams';

import { Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import { Edit as EditIcon } from '@material-ui/icons';

export namespace ModelStack {
  export interface Props {}
}

export default function ModelStack(props: ModelStack.Props) {

  // App state
  const project: Project = useSelector((state: RootState) => state.diagram.projects[0]);
  const items: ProjectModel[] = useSelector((state: RootState) => state.diagram.models);
  const selectedItem: ProjectModel | null = useSelector((state: RootState) => state.diagram.selectedModel);

  const dispatch = useDispatch();
  const { addProjectModel, selectProjectModel } = useDiagramActions(dispatch);

  const selectItem = selectProjectModel;
  const addItemText = '+ Add Model Layer';
  const addItem = () => {
    addProjectModel({
      key: uuidv4(),
      label: 'New Model',
      project: project,
      parentModel: null,
      diagramModel: new DiagramModel(),
    });
  };

  return (
    <div className="list-container" style={{ padding: '1em' }}>
      <List component="nav" aria-label="filter items" style={{ border: '1px solid lightgray' }}>
        {items.map((item) => (
         <ListItem button selected={item === selectedItem} onClick={() => selectItem(item)}>
          <ListItemText primary={ item.label } />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="rename">
              <EditIcon />
            </IconButton>
          </ListItemSecondaryAction>
         </ListItem>
         ))}
      </List>
      <Button variant="contained" color="primary" style={{ width: '100%' }} onClick={ addItem }>
        {addItemText}
      </Button>
    </div>
  );
}
