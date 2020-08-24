import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import { handleActions, Action } from 'redux-actions';
import createEngine, { DiagramModel } from '@projectstorm/react-diagrams';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { CustomNodeFactory } from '@components/NodeModel';
// import { DiagramActions } from '@store/diagrams/types';
import { DiagramActions, DiagramActionsPayload } from '@actions';
import { Project, ProjectModel } from '@models';

export interface DiagramState {
  diagramEngine: DiagramEngine;
  projects: Project[];
  models: ProjectModel[];
  selectedModel: ProjectModel | null;
}

function initializeEngine(): DiagramEngine {
  const engine = createEngine();
  engine.setModel(new DiagramModel());
  engine.getNodeFactories().registerFactory(new CustomNodeFactory());
  return engine;
}

function getInitialState(): DiagramState {
  const project: Project = {
    key: uuidv4(),
    label: 'New Project',
  };
  
  return {
    diagramEngine: initializeEngine(),
    projects: [project],
    models: [],
    selectedModel: null,
  };
}

export const diagramReducer = handleActions<DiagramState, DiagramActionsPayload>(
  {
    [DiagramActions.Type.ADD_PROJECT]: (state, action: Action<Project>) => {
      console.log('TODO: add project', state, action);
      return state;
    },

    [DiagramActions.Type.ADD_PROJECT_MODEL]: (state, action: Action<ProjectModel>) => {
      return {
        ...state,
        models: [...state.models, action.payload],
      };
    },

    [DiagramActions.Type.SELECT_PROJECT_MODEL]: (state, action: Action<ProjectModel>) => {
      return {
        ...state,
        selectedModel: action.payload,
      };
    },
  },
  getInitialState(),
);

export function selectedNodes(state) {
  const engine = state.diagrams.diagramEngine;
  const model = engine.getModel();
  return _.filter(model.activeNodeLayer.models, m => m.options.selected);
}


export function traverseGraph(state) {
  const engine = state.diagrams.diagramEngine;
  const model = engine.getModel();

  const node0 = model.activeNodeLayer.models[0]; // This doesn't work; this is a dict with UUID keys :-/

  // Inbound ports -> links -> source/target
  node0.portsIn[0].links[0].sourcePort.options.id // source port ID 
  node0.portsIn[0].links[0].sourcePort.parent // source port parent block

  // Nodes have {portsIn, portsOut}, each a port array
  // Ports have {links}, array of port->port edges
  // Links have {sourcePort, targetPort}, pointing to Port objects at either end
  // Generically, objects have `{options}`, the model properties for node/edge/port/etc.
  // Generically, objects have `{parent}` pointing to the next object up in the representation hierarchy
  // + Link parent -> ??
  // + Port parent -> Node
  // + Node parent -> (Node) layer
}
