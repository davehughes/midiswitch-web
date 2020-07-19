import { LinkModel, NodeModel } from './diagrams/NodeModel';

export interface NodeModelFactory {
  key: string;
  label: string;
  makeNode(any): NodeModel;
}


export class JunctionBlockFactory {
  key = 'junction';
  label = 'Junction';
  makeNode(canvas): NodeModel {
    const node = new NodeModel({
      name: 'Junction',
      color: 'rgb(0,192,255)',
    });
    const coords = canvas.bumpLayoutCoords();
    node.setPosition(coords.x, coords.y);
    node.addInPort('in');
    node.addOutPort('out');
    return node;
  }
}

export class FilterBlockFactory {
  key = 'filter';
  label = 'Filter';
  makeNode(canvas): NodeModel {
    const node = new NodeModel({
      name: 'Filter Block',
      color: 'rgb(0,192,255)',
    });
    const coords = canvas.bumpLayoutCoords();
    node.setPosition(coords.x, coords.y);
    node.addInPort('in');
    node.addOutPort('out');
    return node;
  }
}

export class ChannelBreakoutBlockFactory {
  key = 'channel-breakout';
  label = 'Channel Breakout';
  makeNode(canvas): NodeModel {
    const node = new NodeModel({
      name: 'Channel Breakout',
      color: 'rgb(0,192,255)',
    });
    const coords = canvas.bumpLayoutCoords();
    node.setPosition(coords.x, coords.y);
    node.addInPort('in');
    const channelOutputs = [...Array(16).keys()].map(i => {
      node.addOutPort(`channel ${i + 1}`);
    });
    return node;
  }
}

export class InterchangeBlockFactory {
  key = 'interchange';
  label = 'Interchange';
  makeNode(canvas): NodeModel {
    const node = new NodeModel({
      name: 'Interchange',
      color: 'rgb(0,192,255)',
    });
    const coords = canvas.bumpLayoutCoords();
    node.setPosition(coords.x, coords.y);
    node.addInPort('A');
    node.addInPort('B');
    node.addInPort('C');
    node.addOutPort('A');
    node.addOutPort('B');
    node.addOutPort('C');
    return node;
  }
}
