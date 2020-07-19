import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine, PortWidget } from '@projectstorm/react-diagrams-core';
import { DefaultNodeModel, DefaultLinkModel, DefaultPortLabel, DiagramModel } from '@projectstorm/react-diagrams';
import * as _ from 'lodash';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { Dashboard, Menu as MenuIcon, Stop as StopIcon, AccountTreeOutlined } from '@material-ui/icons';

export class NodeModel extends DefaultNodeModel {
  constructor(options) {
    super({
        ...options,
        type: 'test-custom-node'
      });
  }
}

export class CustomNodeFactory extends AbstractReactFactory<NodeModel, DiagramEngine> {
	constructor() {
		super('test-custom-node');
	}

	generateModel(initialConfig) {
		return new NodeModel({});
	}

	generateReactWidget(event): JSX.Element {
		return <NodeWidget engine={this.engine as DiagramEngine} node={event.model} />;
	}
}

namespace S {
	export const Node = styled.div<{ background: string; selected: boolean }>`
		// background-color: ${p => p.background};
		background-color: 'red';
		border-radius: 5px;
		font-family: sans-serif;
		color: white;
		border: solid 2px black;
		overflow: visible;
		font-size: 11px;
		border: solid 2px ${p => (p.selected ? 'rgb(0,192,255)' : 'black')};
	`;

	export const Title = styled.div`
		background: rgba(0, 0, 0, 0.3);
		display: flex;
		white-space: nowrap;
		justify-items: center;
	`;

	export const TitleName = styled.div`
		flex-grow: 1;
		padding: 5px 5px;
	`;

	export const Ports = styled.div`
		display: flex;
		background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2));
	`;

	export const PortsContainer = styled.div`
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		&:first-child {
			margin-right: 10px;
		}
		&:only-child {
			margin-right: 0px;
		}
	`;
}

export interface NodeWidgetProps {
	node: NodeModel;
	engine: DiagramEngine;
}

export interface NodeWidgetState {}

export class NodeWidget extends React.Component<NodeWidgetProps> {
  componentWillMount() {
    this.setState({
      mouseX: null,
      mouseY: null,
      contextOptions: [],
    });
  }

	generatePort = port => {
		return <DefaultPortLabel engine={this.props.engine} port={port} key={port.id} />;
	};

  handleContextMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    console.log('context menu click');
    event.preventDefault();

    // Dynamically set up context menu options
    const opts = [];
    opts.push('Always On');
    if (Math.random() > 0.5) {
      opts.push('Sometimes On');
    }

    this.setState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      contextOptions: opts,
    });
  }

  handleContextMenuClose = () => {
    console.log('context menu close');
    this.setState({
      mouseX: null,
      mouseY: null,
    });
  }

	render() {
    const options = [
      'Edit Contained Blocks',
      'Foo',
      'Bar',
    ];
		return (
			<S.Node
				selected={this.props.node.isSelected()}
				background={this.props.node.getOptions().color}
        onContextMenu={this.handleContextMenuClick}
      >
        <Menu
          keepMounted
          open={this.state.mouseY !== null}
          onClose={this.handleContextMenuClose}
          anchorReference="anchorPosition"
          anchorPosition={
            this.state.mouseY !== null && this.state.mouseX !== null
              ? { top: this.state.mouseY, left: this.state.mouseX }
              : undefined
          }>
          {this.state.contextOptions.map((option) => (
            <MenuItem onClick={this.handleContextMenuClose}>{option}</MenuItem>
           ))}
        </Menu>
				<S.Title>
          {/*<Dashboard />*/}
          <StopIcon style={{ color: 'gold' }}/>
					<S.TitleName>{this.props.node.getOptions().name}</S.TitleName>
				</S.Title>
				<S.Ports>
					<S.PortsContainer>{_.map(this.props.node.getInPorts(), this.generatePort)}</S.PortsContainer>
					<S.PortsContainer>{_.map(this.props.node.getOutPorts(), this.generatePort)}</S.PortsContainer>
				</S.Ports>
			</S.Node>
		);
	}
}

export class LinkModel extends DefaultLinkModel {
}
