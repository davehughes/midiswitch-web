import React from 'react';

import { FormControl, InputLabel, Select, MenuItem, Button, Card, CardContent, TextField } from '@material-ui/core';

export interface Editor {
  editorComponent(): JSX.Element;
}

export interface ChannelMapProps {
  type: 'channel-map-config';
  label: string;
}

export const ChannelMapDefaultProps: (ChannelMapProps & Editor) = {
  type: 'channel-map-config',
  label: 'Channel Map',
  editorComponent: () => <ChannelMapConfig {...this as any} />,
};

export function ChannelMapConfig(props: ChannelMapProps): JSX.Element {
  const { label } = props;
  const channel = 1;
  const handleChange = (e) => {
    console.log('TODO: handle ChannelMapConfig channel change', e);
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <h2>{label}</h2>
        <FormControl variant="outlined">
          <InputLabel id="demo-simple-select-outlined-label">Channel</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={channel}
            onChange={handleChange}
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

export interface TransposeProps {
  type: 'transpose';
  label: string;
}

export const TransposeDefaultProps: (TransposeProps & Editor) = {
  type: 'transpose',
  label: 'Transpose',
  editorComponent: () => <TransposeEditor {...this as any} />,
}

export function TransposeEditor(props: TransposeProps): JSX.Element {
  const { label } = props;
  const offset = 12;
  const units = 'semitones';

  const handleOffsetChange = (e) => {
    console.log('TODO: handle TransposeConfig offset change', e);
  };

  const handleUnitChange = (e) => {
    console.log('TODO: handle TransposeConfig unit change', e);
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <h2>{label}</h2>
        <FormControl variant="outlined">
          <TextField
            id="outlined-basic"
            type="number"
            label="Offset"
            variant="outlined"
            value={offset}
            onChange={handleOffsetChange}
            />
        </FormControl>

        <FormControl variant="outlined">
          <InputLabel id="demo-simple-select-outlined-label">Unit</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={units}
            onChange={handleUnitChange}
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


export interface ControlMapProps {
  type: 'control-map';
  label: string;
}

export const ControlMapDefaultProps: (ControlMapProps & Editor) = {
  type: 'control-map',
  label: 'Control Map',
  editorComponent: () => <ControlMapEditor {...this as any} />,
}

export function ControlMapEditor(props: ControlMapProps): JSX.Element {
  const { label } = props;
  const inputControl = 1;
  const outputControl = 64;
  return (
    <Card variant="outlined">
      <CardContent>
        <h2>{label}</h2>
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

export interface KeySplitProps {
  type: 'key-split';
  label: string;
  splits: KeySplitItems[];
}

interface KeySplitItems {
  label: string;
  lowKey: string;
  highKey: string;
}

export const KeySplitDefaultProps: (KeySplitProps & Editor) = {
  type: 'key-split',
  label: 'Key Split',
  splits: [],
  editorComponent: () => <KeySplitEditor {...this as any} />,
}

export function KeySplitEditor(props: KeySplitProps): JSX.Element {
  const { label } = props;
  const [splits, setSplits] = React.useState([{
      lowKey: '',
      highKey: '',
      label: 'split1',
  }]);
  const keys = defineKeys();
  const addKeySplit = (atIndex) => {
    setSplits(splits => splits.splice(atIndex, 0, {
      lowKey: '',
      highKey: '',
      label: `split${ splits.length + 1 }`,
    }));
  };
  const removeKeySplit = (atIndex) => {
    setSplits(splits => splits.splice(atIndex, 1));
  };

  // if (splits.length === 0) {
  //   addKeySplit(0);
  // }

  return (
    <Card variant="outlined">
      <CardContent>
        <h2>{label} ({ splits.length })({ keys.length })</h2>
        {splits.map((split, idx) => (
          <div>
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
                  value={split.label}
                />
            </FormControl>
            <Button onClick={() => addKeySplit(idx)}>+</Button>
            <Button onClick={() => removeKeySplit(idx)}>-</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
