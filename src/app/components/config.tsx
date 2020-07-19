import React from 'react';

import { FormControl, InputLabel, Select, MenuItem, Button, Card, CardContent, TextField } from '@material-ui/core';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';

export class ChannelMapConfig extends React.Component {
  label = 'Channel Map';

  handleChange(e) {
    console.log('TODO: handle ChannelMapConfig channel change', e);
  }

  render() {
    const channel = 1;
    return (
      <Card variant="outlined">
        <CardContent>
          <h2>{this.label}</h2>
          <FormControl variant="outlined">
            <InputLabel id="demo-simple-select-outlined-label">Channel</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={channel}
              onChange={this.handleChange}
              label="Channel"
            >
              <MenuItem key="none" value="">
                <em>None</em>
              </MenuItem>
              { Array.from(Array(16).keys()).map(idx => <MenuItem key={idx + 1} value={idx + 1}>{idx + 1}</MenuItem>) }
            </Select>
          </FormControl>
        </CardContent>
      </Card>
    );
  }
}

export class TransposeConfig extends React.Component {
  label = 'Transpose';

  handleOffsetChange(e) {
    console.log('TODO: handle TransposeConfig offset change', e);
  }

  handleUnitChange(e) {
    console.log('TODO: handle TransposeConfig unit change', e);
  }

  render() {
    const offset = 12;
    const units = 'semitones';
    return (
      <Card variant="outlined">
        <CardContent>
          <h2>{this.label}</h2>
          <FormControl variant="outlined">
            <TextField
              id="outlined-basic"
              type="number"
              label="Offset"
              variant="outlined"
              value={offset}
              onChange={this.handleOffsetChange}
              />
          </FormControl>

          <FormControl variant="outlined">
            <InputLabel id="demo-simple-select-outlined-label">Unit</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={units}
              onChange={this.handleUnitChange}
              label="Unit"
            >
              <MenuItem value="semitones">Semitones</MenuItem>
              <MenuItem value="octaves">Octaves</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>
    );
  }
}

export class ControlMapConfig extends React.Component {
  label = 'Control Map'
  render() {
    const inputControl = 1;
    const outputControl = 64;
    return (
      <Card variant="outlined">
        <CardContent>
          <h2>{this.label}</h2>
          <FormControl variant="outlined">
            <TextField id="outlined-basic" label="Input CC (0-127)" variant="outlined"
                value={inputControl}
              />
          </FormControl>
          <FormControl variant="outlined">
            <TextField id="outlined-basic" label="Output CC (0-127)" variant="outlined"
                value={outputControl}
              />
          </FormControl>
          <Button>+</Button>
        </CardContent>
      </Card>
    );
  }
}


// See: http://www.midisolutions.com/chapter3.htm
function defineKeys() {
  // C-2 -> 0
  // C-1 -> 12
  // C0 -> 24
  const steps = [
    'C',
    'D♭',
    'D',
    'D♭',
    'E',
    'F',
    'F♯',
    'G',
    'A♭',
    'A',
    'B♭',
    'B',
  ];
  const keys = [];
  for (let i = 0; i < 128; i++) {
    let key = steps[i % steps.length];
    keys.push({
      idx: i,
      key: key,
      label: `${key}:${Math.floor(i / 12) - 2}`,
    });
  }
  return keys;
}

export class KeySplit extends React.Component {
  label = 'Key Split';

  render() {
    const defaultName = 'port1';
    const keys = defineKeys();
    return (
      <Card variant="outlined">
        <CardContent>
          <h2>{this.label}</h2>
          <FormControl variant="outlined">
            <Select label="Range Start">
              <MenuItem value="">
                <em>Choose Range Start</em>
              </MenuItem>
              <MenuItem>Low Limit</MenuItem>
              {keys.map((key) => (
                <MenuItem key={key.idx}>{key.label}</MenuItem>
               ))}
              <MenuItem>High Limit</MenuItem>
            </Select>
          </FormControl>

          <FormControl variant="outlined">
            <Select label="Range End">
              <MenuItem value="">
                <em>Choose Range Start</em>
              </MenuItem>
              <MenuItem>Low Limit</MenuItem>
              {keys.map((key) => (
                <MenuItem key={key.idx}>{key.label}</MenuItem>
               ))}
              <MenuItem>High Limit</MenuItem>
            </Select>
          </FormControl>

          <FormControl variant="outlined">
            <TextField id="outlined-basic" label="Name" variant="outlined" 
                value={defaultName}
              />
          </FormControl>
          <Button>+</Button>
        </CardContent>
      </Card>
    );
  }
}

export class EventMonitor extends React.Component {
  render() {
    const rows = [
      { id: 1, channel: 1, event_type: 'Control Change', input_port: 'mpk49', data1: 1, data2: 127 },
      { id: 2, channel: 1, event_type: 'Program Change', input_port: 'dmc8', data1: 1, data2: 127 },
      { id: 3, channel: 1, event_type: 'Note On', input_port: 'mpk49', data1: 1, data2: 127 },
    ];
    return (
      <TableContainer>
        <Table aria-label="customized table" size="small">
          <TableHead>
            <TableRow>
              <TableCell>Channel</TableCell>
              <TableCell>Event Type</TableCell>
              <TableCell>Input Port</TableCell>
              <TableCell>Data1</TableCell>
              <TableCell>Data2</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">{row.channel}</TableCell>
                <TableCell>{row.event_type}</TableCell>
                <TableCell>{row.input_port}</TableCell>
                <TableCell>{row.data1}</TableCell>
                <TableCell>{row.data2}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}


