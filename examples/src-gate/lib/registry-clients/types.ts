/**
 * Registry client types
 */

export enum Registry {
  Npm = 'npm',
  PyPI = 'pypi',
  Crates = 'crates',
}

export interface RepositoryInfo {
  repoUrl: string;
  gitRef: string;
  repoDirectory?: string;
}

export interface NpmPackageMetadata {
  name: string;
  version?: string;
  repository?: {
    type?: string;
    url?: string;
  };
  versions?: Record<string, {
    repository?: {
      type?: string;
      url?: string;
    };
  }>;
}

export interface PyPIPackageMetadata {
  info: {
    name: string;
    version?: string;
    project_urls?: {
      repository?: string;
      source?: string;
      homepage?: string;
      [key: string]: string | undefined;
    };
  };
  urls?: Array<{
    packagetype: string;
  }>;
}

export interface CratesPackageMetadata {
  crate: {
    name: string;
    repository?: string;
    homepage?: string;
    documentation?: string;
  };
  versions?: Array<{
    num: string;
  }>;
}
