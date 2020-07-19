import React from 'react';

import _ from 'lodash';

import { Grid, Button, List, ListItem, ListItemText } from '@material-ui/core';
import { TransposeConfig, ChannelMapConfig } from '@components/config';

export namespace FilterStack {
  export interface Props {
  }
  export interface State {
    filters: any[];
    selectedFilter: any;
  }
}

export default class FilterStack extends React.Component<FilterStack.Props, FilterStack.State> {
  state: FilterStack.State;

  componentWillMount() {
    const filters = [
      new ChannelMapConfig({}),
      new TransposeConfig({}),
    ];
    this.setState({
      filters: filters,
      selectedFilter: filters[0],
    });
  }

  selectFilter(filter) {
    this.setState({ selectedFilter: filter });
  }

  render() {
    const filters = this.state.filters;
    const selectedFilter = this.state.selectedFilter;
    return (
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <div className="list-container" style={{ padding: '1em' }}>
            <List component="nav" aria-label="filter items" style={{ border: '1px solid lightgray' }}>
              {filters.map((filter) => (
               <ListItem button
                  selected={filter === selectedFilter}
                  onClick={() => this.selectFilter(filter)}
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
          <h3>{selectedFilter.label}</h3>
          TODO: detail/editor for selected filter here
        </Grid>
      </Grid>
          
    );
  }
}
