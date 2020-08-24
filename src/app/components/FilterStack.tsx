import React from 'react';

import _ from 'lodash';

import { Grid, Button, List, ListItem, ListItemText } from '@material-ui/core';
// import { TransposeConfig, ChannelMapConfig, ChannelMapDefaultProps } from '@components/config';
import { TransposeDefaultProps, ChannelMapDefaultProps, ControlMapDefaultProps, KeySplitDefaultProps } from '@components/config';

export namespace FilterStack {
  export interface Props {
  }
}

export default function FilterStack(props: FilterStack.Props) {
  const [filters] = React.useState([
    ChannelMapDefaultProps,
    TransposeDefaultProps,
    ControlMapDefaultProps,
    KeySplitDefaultProps,
  ]);
  const [selectedFilter, setSelectedFilter] = React.useState(filters[0]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <div className="list-container" style={{ padding: '1em' }}>
          <List component="nav" aria-label="filter items" style={{ border: '1px solid lightgray' }}>
            {filters.map((filter) => (
             <ListItem button
                selected={filter === selectedFilter}
                onClick={() => setSelectedFilter(filter)}
              >
              <ListItemText primary={filter.label} />
             </ListItem>
             ))}
          </List>
          <Button variant="contained" color="primary" style={{ width: '100%' }}>
            + Add Filter
          </Button>
        </div>
      </Grid>
      <Grid item xs={8}>
       {selectedFilter.editorComponent()}
      </Grid>
    </Grid>
  );
}
