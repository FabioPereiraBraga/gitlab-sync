import {
  InsomniaWorkspaceActionModel,
  InsomniaContext,
} from './insomnia.types';

export interface InsomniaWorkspaceAction {
  plugin?: Plugin;
  action: (
    context: InsomniaContext,
    models: InsomniaWorkspaceActionModel,
  ) => void | Promise<void>;
  label: string;
  icon?: string;
}
