import { DiagramModel } from '@projectstorm/react-diagrams';

export interface Project {
  key: string;
  label: string;
}

export interface ProjectModel {
  key: string;
  project: Project;
  parentModel: ProjectModel | null;
  label: string;
  diagramModel: DiagramModel;
}
