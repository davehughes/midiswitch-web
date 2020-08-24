import React, { useState, useRef, useEffect } from 'react';
import { RootState } from '@reducers';
import { useSelector } from 'react-redux';

import { 
  Grid, AppBar, Toolbar, IconButton, Typography,
} from '@material-ui/core';
import { Menu as MenuIcon, ChevronRight, ExpandMore } from '@material-ui/icons';
import Canvas from '@components/Canvas';

import EventMonitor from '@components/EventMonitor';
import FilterStack from '@components/FilterStack';
import ModelStack from '@components/ModelStack';
import Library from '@components/Library';

import createEngine, { DiagramModel } from '@projectstorm/react-diagrams';
import { CustomNodeFactory } from '@components/NodeModel';

export namespace DiagramApp {
  export interface Props {}
}

function createDiagramEngine() {
  const engine = createEngine();
  engine.setModel(new DiagramModel());
  engine.getNodeFactories().registerFactory(new CustomNodeFactory());
  return engine;
}

export function DiagramApp(props: DiagramApp.Props) {
  const [engine] = useState(createDiagramEngine());  // useSelector((state: RootState) => state.diagram.diagramEngine);
  const model = useSelector((state: RootState) => state.diagram.selectedModel?.diagramModel);
  const previousModel = useRef<DiagramModel>();

  useEffect(() => {
    if (model && model != previousModel.current) {
      engine.setModel(model);
    }
  });

  return (
    <div className="container">
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">
            Midiswitch Wiring Canvas
          </Typography>
          <ChevronRight />
          <Typography variant="h6">
             New Project
          </Typography>
          <ExpandMore />
          <ChevronRight />
          <Typography variant="h6">
            Block Detail
          </Typography>
          <ExpandMore />
        </Toolbar>
      </AppBar>

      <Grid container spacing={3}>
        <Grid item xs={2}>
          <Library />
          <ModelStack />
        </Grid>
        <Grid item xs={10}>
          <Canvas engine={engine} />
          <FilterStack />
          <EventMonitor />
        </Grid>
      </Grid>
    </div>
  );
}
