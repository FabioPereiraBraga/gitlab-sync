import { InsomniaBaseModel } from './basemodel.type';

type BaseWorkspaceMeta = {
  activeActivity: string | null;
  activeEnvironmentId: string | null;
  activeRequestId: string | null;
  activeUnitTestSuiteId: string | null;
  cachedGitLastAuthor: string | null;
  cachedGitLastCommitTime: number | null;
  cachedGitRepositoryBranch: string | null;
  gitRepositoryId: string | null;
  hasSeen: boolean;
  paneHeight: number;
  paneWidth: number;
  previewHidden: boolean;
  sidebarFilter: string;
  sidebarHidden: boolean;
  sidebarWidth: number;
};

export type WorkspaceMeta = BaseWorkspaceMeta & InsomniaBaseModel;
