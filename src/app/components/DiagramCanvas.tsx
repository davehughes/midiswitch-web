import React from 'react';

import _ from 'lodash';

import { Grid, FormControl, InputLabel, Select, MenuItem, Button, Card, CardActions, CardContent, TextField } from '@material-ui/core';
import { NodeModelFactory, JunctionBlockFactory, FilterBlockFactory, ChannelBreakoutBlockFactory, InterchangeBlockFactory } from './blocks';
import { KeySplit, TransposeConfig, ChannelMapConfig, ControlMapConfig, EventMonitor } from './config';
import FilterStack from './FilterStack';

import createEngine, { DiagramModel } from '@projectstorm/react-diagrams';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { LinkModel, NodeModel, CustomNodeFactory } from './diagrams/NodeModel';

// Design and next steps: // + Allow composition of blocks to build higher-level components //   + e.g. I should be able to create the channel breakout block in this tool // + Add hamburger/menu to node to expose configuration options
// + Nodes have a corresponding detail/config component is shown when highlighted
// + Add basic building blocks from mididings (filters, transposition, routing)
// + Customize node/port/link widgets
//   + Disallow link segments
//   + Only allow links from an output to an input
//   + Add node event indicator
//   + Colors, labels, placement
//   + Fixed placement for input/output blocks?
// + Event monitor/message view
// + How to serialize graph for mididings?


class DiagramState {
  engine: any = null;

  get model() {
    return this.state.engine.getModel()
  }

  get selectedNodes() {
    return _.filter(this.model.activeNodeLayer.models, m => m.options.selected);
  }

  get engine() {
    if (!this.engine) {
      this.engine = this.initEngine();
    }
    return this.engine;
  }

  initEngine() {
    if (!process.browser) {
      return;
    }
    // Basic setup from React Diagrams documentation
    // (https://projectstorm.gitbook.io/react-diagrams/getting-started/using-the-library)

    // create an instance of the engine with all the defaults
    const engine = createEngine();
    const model = new DiagramModel();

    // Register custom node factories
    engine.getNodeFactories().registerFactory(new CustomNodeFactory());
    console.log('registered custom node factory');

    // Sketch of midi input blocks
    const nodeInputs = new NodeModel({
      name: 'Inputs',
      color: 'rgb(0,192,255)',
    });
    nodeInputs.setPosition(100, 300);
    nodeInputs.addOutPort('mpk49');
    nodeInputs.addOutPort('dmc8');
    model.addAll(nodeInputs);

    const nodeOutputs = new NodeModel({
      name: 'Outputs',
      color: 'rgb(0,192,255)',
    });
    nodeOutputs.setPosition(500, 300);
    nodeOutputs.addInPort('out1');
    nodeOutputs.addInPort('out2');
    model.addAll(nodeOutputs);

    engine.setModel(model);
    return engine;
  }
}

interface DiagramPoint {
  x: number;
  y: number;
}

interface DiagramCanvasState {
  diagramState: DiagramState;
  layoutIndex: DiagramPoint;
}

export default class DiagramCanvas extends React.Component {
  state: DiagramCanvasState = {
    diagramState: new DiagramState(),
    layoutIndex: { x: 10, y: 10 },
  };

  blockFactories: NodeModelFactory[] = [
    new JunctionBlockFactory(),
    new FilterBlockFactory(),
    new ChannelBreakoutBlockFactory(),
    new InterchangeBlockFactory(),
  ];

  bumpLayoutCoords() {
    return this.state.layoutIndex = {
      x: this.state.layoutIndex.x + 30,
      y: this.state.layoutIndex.y + 30,
    };
  }

  render() {
    const engine = this.state.diagramState.engine;
    const widget = engine ? React.createElement(CanvasWidget, { engine, className: 'canvas' }) : <p>Engine not initialized.</p>;
    return (
      <div>
        {widget}

        <style global jsx>{`
          .canvas {
              height: 400px;
              background-color: whitesmoke;
          }
        `}</style>
      </div>
    );
  }
} 
