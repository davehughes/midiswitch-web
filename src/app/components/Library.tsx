import React from 'react';

import { BLOCK_FACTORIES } from '@components/blocks';
import { List, ListItem, ListItemText } from '@material-ui/core';

export namespace Library {
  export interface Props {}
}

export default function Library(props: Library.Props) {
  const items = BLOCK_FACTORIES;

  const startDrag = (event, factory) => {
    console.log('Library.startDrag', event);
    // event.dataTransfer.setData('storm-diagram-node', JSON.stringify({ test: 123 }));
    const message = factory.makeNode().serialize();
    console.log('drag message', message);
    event.dataTransfer.setData('storm-diagram-node', JSON.stringify(message));
  };

  return (
    <List component="nav" aria-label="filter items" style={{ border: '1px solid lightgray' }}>
      {items.map((item) => (
       <div draggable={true} onDragStart={ (e) => startDrag(e, item) }>
         <ListItem>
          <ListItemText primary={item.label} />
         </ListItem>
       </div>
       ))}
    </List>
  );
};
