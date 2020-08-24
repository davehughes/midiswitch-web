import React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { DefaultNodeModel, DefaultLinkModel, DefaultPortLabel } from '@projectstorm/react-diagrams';
import * as _ from 'lodash';
import styled from '@emotion/styled';
import { Menu, MenuItem } from '@material-ui/core';
import { Stop as StopIcon } from '@material-ui/icons';

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

	generateModel(initialConfig): NodeModel {
    console.log('generateModel called with config:', initialConfig);
		return new NodeModel({});
	}

	generateReactWidget(event): JSX.Element {
		return (<NodeWidget engine={this.engine} node={event.model} />);
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

export interface NodeWidgetState {
  mouseX: number | null;
  mouseY: number | null;
  contextOptions: string[];
}

export function NodeWidget(props: NodeWidgetProps, state: NodeWidgetState) {
  const [menuState, setMenuState] = React.useState(MenuState.Closed);
  const menuActions = MenuState.Actions(setMenuState);

	const generatePort = port => {
    return <DefaultPortLabel engine={props.engine} port={port} key={port.id} />;
  }
  // const launchMenu = (event: React.MouseEvent<HTMLElement>) => {
  //   event.preventDefault();
  //   setMenuState(MenuState.AtPosition(event.clientX - 2, event.clientY - 4));
  // };
  // const closeMenu = () => { setMenuState(MenuState.Closed) };
  return (
    <S.Node
      selected={props.node.isSelected()}
      background={props.node.getOptions().color}
      onContextMenu={menuActions.launch}
    >
      <NodeContextMenu menuState={menuState} onClose={menuActions.close} />
      <S.Title>
        <StopIcon style={{ color: 'gold' }}/>
        <S.TitleName>{props.node.getOptions().name}</S.TitleName>
      </S.Title>
      <S.Ports>
        <S.PortsContainer>{_.map(props.node.getInPorts(), generatePort)}</S.PortsContainer>
        <S.PortsContainer>{_.map(props.node.getOutPorts(), generatePort)}</S.PortsContainer>
      </S.Ports>
    </S.Node>
  );
}

export namespace MenuState {

  export function AtPosition(x: number, y: number): MenuState.Interface {
    return { x, y, isOpen: true, anchorPosition: { top: y, left: x } };
  }

  export function Closed(): MenuState.Interface {
    return { x: null, y: null, isOpen: false, anchorPosition: { top: -999, left: -999 } };
  }

  export function Actions(setState: (state: MenuState.Interface) => any) {
    return {
      launch: (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        setState(MenuState.AtPosition(event.clientX - 2, event.clientY - 4));
      },
      close: () => setState(MenuState.Closed())
    }
  }

  export interface Interface {
    x: number | null;
    y: number | null;
    isOpen: boolean;
    anchorPosition: { top: number, left: number };
  }
}

interface NodeContextMenuProps {
  menuState: MenuState.Interface;
  onClose: () => any;
}

export function NodeContextMenu({ menuState, onClose }: NodeContextMenuProps) {
  // Dynamically set up context menu options
  const menuOptions = [];
  menuOptions.push('Rename');
  menuOptions.push('Edit Internals');
  if (Math.random() > 0.5) {
    menuOptions.push('Sometimes On');
  }

  const handleOption = () => {
    console.log('selected option');
    onClose();
  };

  return (
    <Menu
      keepMounted
      open={ menuState.isOpen }
      onClose={ onClose }
      anchorReference="anchorPosition"
      anchorPosition={ menuState.anchorPosition }
      >
      {menuOptions.map((option) => (
        <MenuItem onClick={handleOption}>{option}</MenuItem>
       ))}
    </Menu>
  );
}

export class LinkModel extends DefaultLinkModel {
}
