import React from 'react';
import { 
  Grid, FormControl, InputLabel, Select, MenuItem, Button,
  AppBar, Toolbar, IconButton, Typography,
} from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import { NodeModelFactory, JunctionBlockFactory, FilterBlockFactory, ChannelBreakoutBlockFactory, InterchangeBlockFactory } from './blocks';
import { KeySplit, TransposeConfig, ChannelMapConfig, ControlMapConfig, EventMonitor } from './config';
import FilterStack from './FilterStack';
import DiagramCanvas from '@components/DiagramCanvas';
import { SocketClient } from '@components/sockets';
import { NodeModel } from '@components/NodeModel';

export namespace DiagramApp {
  export interface Props {}
  export interface State {
    engine: any;
    addBlockFactory: NodeModelFactory | null;
  }
}

export class DiagramApp extends React.Component<DiagramApp.Props, DiagramApp.State> {
  componentWillMount() {
    this.setState({
      addBlockFactory: null,
    });
  }

  blockFactories: NodeModelFactory[] = [
    new JunctionBlockFactory(),
    new FilterBlockFactory(),
    new ChannelBreakoutBlockFactory(),
    new InterchangeBlockFactory(),
  ];

  blockFactorySelectionChanged = (e: React.ChangeEvent<{ value: number }>) => {
    this.setState({ addBlockFactory: this.blockFactories[e.target.value] });
  }

  get model() {
    return this.state.engine.getModel()
  }

  addBlock = () => {
    if (this.state.addBlockFactory) {
      const blockNode = this.state.addBlockFactory.makeNode(this);
      this.addNode(blockNode);
    }
  }

  addNode = (node: NodeModel) => {
    this.model.addAll(node);
  }

  doAction = () => {
    console.log('TODO: Do custom debug stuff here');
  }


  render() {
    return (
      <div className="container">
        <SocketClient />

        <AppBar position="static">
          <Toolbar variant="dense">
            <IconButton edge="start" color="inherit" aria-label="menu">
              <div style={{ color: 'red' }}>
              <MenuIcon />
              </div>
            </IconButton>
            <Typography variant="h6">
          
              Midiswitch Wiring Canvas
            </Typography>
            <FormControl variant="outlined">
              <InputLabel>Block</InputLabel>
              <Select onChange={ this.blockFactorySelectionChanged }>
                <MenuItem key="none" value="">
                  <em>Choose Block</em>
                </MenuItem>
                { this.blockFactories.map((f, idx) => <MenuItem key={f.key} value={idx}>{f.label}</MenuItem>) }
              </Select>
            </FormControl>
            <Button color="inherit" onClick={ this.addBlock }>Add Block</Button>
            <Button color="inherit" onClick={ this.doAction }>Do Test Action</Button>
          </Toolbar>
        </AppBar>

        <Grid container spacing={3}>
          <Grid item xs={8}>
            <DiagramCanvas />
          </Grid>

          <Grid item xs={8}>
            <FilterStack />
          </Grid>

          <Grid item xs={4}>
            <KeySplit />
            <ControlMapConfig />
            <TransposeConfig />
            <ChannelMapConfig />
          </Grid>

          <Grid item xs={12}>
            <EventMonitor />
          </Grid>
        </Grid>
      </div>
    );
  }
} 
