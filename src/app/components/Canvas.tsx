import React, { useReducer } from 'react';
import { CanvasWidget, DeserializeEvent, BaseModel } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

import styled from 'styled-components';

import { NodeModel } from '@components/NodeModel';

export namespace Canvas {
  export interface Props {
    engine: DiagramEngine;
  }
}

// react-diagrams has affordances for recursively serializing and deserializing diagram
// objects, but these seem primarily designed to work for the full contents of the diagram
// at once and not piecemeal for individual objects.  Since we want to use this ser/de
// mechanism for dragging and dropping nodes between components, we create this helper which
// clones how the base CanvasModel creates and dispatches DeserializeEvents to components.
function createDeserializeEvent(data, engine) {
	const models: {
    [id: string]: BaseModel;
  } = {};
  const promises: {
    [id: string]: Promise<BaseModel>;
  } = {};
  const resolvers: {
    [id: string]: (model: BaseModel) => any;
  } = {};

  const event: DeserializeEvent = {
    data: data,
    engine: engine,
    registerModel: (model: BaseModel) => {
      models[model.getID()] = model;
      if (resolvers[model.getID()]) {
        resolvers[model.getID()](model);
      }
    },
    getModel<T extends BaseModel>(id: string): Promise<T> {
      if (models[id]) {
        return Promise.resolve(models[id]) as Promise<T>;
      }
      if (!promises[id]) {
        promises[id] = new Promise((resolve) => {
          resolvers[id] = resolve;
        });
      }
      return promises[id] as Promise<T>;
    }
  };
  return event;
}

export default function Canvas({ engine }: Canvas.Props) {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const onDrop = (event) => {
    const dropPoint = engine.getRelativeMousePoint(event);
    const data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));
    const node: NodeModel = new NodeModel(data);
    node.deserialize(createDeserializeEvent(data, engine));
    node.setPosition(dropPoint);
    console.log('Received drop', data, node);
    engine.getModel().addAll(node);
    forceUpdate();
  };
  const onDragOver = (event) => {
    event.stopPropagation();
    event.preventDefault();
  };

  const SCanvasContainer = styled.div`
    display: flex;
    flex-grow: 1;
  `;

  const SCanvasWidget = styled(CanvasWidget)`
    flex-grow: 1;
    position: relative;
    height: 400px;
    background-color: whitesmoke;
  `;

  return (
    <SCanvasContainer onDrop={onDrop} onDragOver={onDragOver}>
      <SCanvasWidget engine={engine} />
    </SCanvasContainer>
  );
}
