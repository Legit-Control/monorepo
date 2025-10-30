export type LegitPathType =
  | 'status'
  | 'commit-file'
  | 'branches-list'
  | 'branch-file'
  | 'branch-head'
  | 'branch-tip'
  | 'legit-folder'
  | 'unknown';

export interface ParsedLegitPath {
  type: LegitPathType;
  originalPath: string;
  commitSha?: string;
  branchName?: string;
  filePath?: string;
  isLegitPath: boolean;
}

export class LegitPathParserOld {
  private static readonly LEGIT_DIR = '.legit';
  private static readonly SHA_PATTERN = /^[0-9a-f]{40}$/i;

  static parse(path: string): ParsedLegitPath {
    const segments = path.split('/').filter(s => s.length > 0);

    // NOTE those files should have been cleaned by the EphemeralSubFs already - double check!
    const ignoredNames = [
      '._*',
      '.DS_Store',
      '.AppleDouble/',
      '.AppleDB',
      '.AppleDesktop',
      '.Spotlight-V100',
      '.TemporaryItems',
      '.Trashes',
      '.fseventsd',
      '.VolumeIcon.icns',
    ];

    const lastSeg = segments[segments.length - 1];
    if (
      lastSeg &&
      ignoredNames.some(name =>
        name.endsWith('*')
          ? lastSeg.startsWith(name.slice(0, -1))
          : lastSeg === name.replace(/\/$/, '')
      )
    ) {
      return {
        type: 'unknown',
        originalPath: path,
        isLegitPath: false,
      };
    }
    if (!segments.includes(this.LEGIT_DIR)) {
      return {
        type: 'unknown',
        originalPath: path,
        isLegitPath: false,
      };
    }

    const legitIndex = segments.lastIndexOf(this.LEGIT_DIR);
    const afterLegit = segments.slice(legitIndex + 1);

    if (afterLegit.length === 0) {
      return {
        type: 'legit-folder',
        originalPath: path,
        isLegitPath: true,
      };
    }

    const firstSegment = afterLegit[0];

    switch (firstSegment) {
      case 'status':
        return {
          type: 'status',
          originalPath: path,
          isLegitPath: true,
        };

      case 'commits':
        return this.parseCommitPath(path, afterLegit);

      case 'branches':
        return this.parseBranchPath(path, afterLegit);

      default:
        return {
          type: 'unknown',
          originalPath: path,
          isLegitPath: true,
        };
    }
  }

  private static parseCommitPath(
    originalPath: string,
    afterLegit: string[]
  ): ParsedLegitPath {
    if (afterLegit.length < 3) {
      return {
        type: 'unknown',
        originalPath,
        isLegitPath: true,
      };
    }

    const shaPrefix = afterLegit[1]!;
    const shaRest = afterLegit[2]!;

    if (shaPrefix.length !== 2 || !shaPrefix.match(/^[0-9a-f]{2}$/i)) {
      return {
        type: 'unknown',
        originalPath,
        isLegitPath: true,
      };
    }

    const fullSha = shaPrefix + shaRest;
    if (!fullSha.match(this.SHA_PATTERN)) {
      return {
        type: 'unknown',
        originalPath,
        isLegitPath: true,
      };
    }

    const filePath = afterLegit.slice(3).join('/');

    return {
      type: 'commit-file',
      originalPath,
      commitSha: fullSha,
      filePath: filePath || undefined,
      isLegitPath: true,
    };
  }

  private static parseBranchPath(
    originalPath: string,
    afterLegit: string[]
  ): ParsedLegitPath {
    if (afterLegit.length === 1) {
      return {
        type: 'branches-list',
        originalPath,
        isLegitPath: true,
      };
    }

    const branchName = afterLegit[1];

    if (afterLegit.length === 2) {
      return {
        type: 'branch-file',
        originalPath,
        branchName,
        filePath: '',
        isLegitPath: true,
      };
    }

    const nextSegment = afterLegit[2];

    if (nextSegment === this.LEGIT_DIR && afterLegit.length >= 4) {
      const directive = afterLegit[3];
      if (directive === 'head') {
        return {
          type: 'branch-head',
          originalPath,
          branchName,
          isLegitPath: true,
        };
      } else if (directive === 'tip') {
        return {
          type: 'branch-tip',
          originalPath,
          branchName,
          isLegitPath: true,
        };
      }
    }

    const filePath = afterLegit.slice(2).join('/');

    return {
      type: 'branch-file',
      originalPath,
      branchName,
      filePath,
      isLegitPath: true,
    };
  }

  static isLegitPath(path: string): boolean {
    return (
      path.includes(`/${this.LEGIT_DIR}/`) ||
      path.includes(`/${this.LEGIT_DIR}`)
    );
  }

  static extractCommitSha(shaPrefix: string, shaRest: string): string | null {
    if (shaPrefix.length !== 2 || !shaPrefix.match(/^[0-9a-f]{2}$/i)) {
      return null;
    }

    const fullSha = shaPrefix + shaRest;
    if (!fullSha.match(this.SHA_PATTERN)) {
      return null;
    }

    return fullSha;
  }
}
