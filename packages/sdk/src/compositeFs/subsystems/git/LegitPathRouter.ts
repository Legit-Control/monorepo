import { VirtualFileDefinition } from './virtualFiles/gitVirtualFiles.js';

export type LegitRouteNode = {
  handler?: VirtualFileDefinition;
  children?: Record<string, LegitRouteNode>;
};

export type MatchResult = {
  handler: VirtualFileDefinition;
  staticSiblings: { segment: string; type: 'folder' | 'file' }[];
  params: Record<string, string>;
};

interface LegitRouteFolder {
  [key: string]: LegitRouteDescriptor;
}

type LegitRouteDescriptor = VirtualFileDefinition | LegitRouteFolder;

export class LegitPathRouter {
  public compiledRoutes: {
    regex: RegExp;
    paramNames: string[];
    staticSiblings: { segment: string; type: 'folder' | 'file' }[];
    handler: VirtualFileDefinition;
  }[];

  constructor(public routes: LegitRouteFolder) {
    // Flatten tree into route patterns
    const flatRoutes: Record<
      string,
      {
        handler: VirtualFileDefinition;
        siblings: { segment: string; type: 'folder' | 'file' }[];
      }
    > = {};
    const walk = (node: LegitRouteDescriptor, path: string) => {
      if (typeof node.type === 'string') {
        flatRoutes[path] = {
          handler: node as VirtualFileDefinition,
          siblings: [],
        };
        // its a VirtualFileDefinition
        const vFile = node as VirtualFileDefinition;
      } else {
        const siblings: { segment: string; type: 'folder' | 'file' }[] = [];

        // its a folder
        for (const [segment, child] of Object.entries(node)) {
          if (segment === '.') {
            // folder root definition
            if (flatRoutes[path]) {
              throw new Error(
                `Conflict: multiple handlers for path '${path}', '.' and optional '[[parameter_name]]' defined?`
              );
            }

            flatRoutes[path] = {
              handler: child as VirtualFileDefinition,
              siblings: siblings,
            };
          } else if (segment.startsWith('[[') && segment.endsWith(']]')) {
            // catch all dynamic - must not conflict with . static route
            if (flatRoutes[path]) {
              throw new Error(
                `Conflict: multiple handlers for path '${path}', '.' and optional '[[parameter_name]]' defined?`
              );
            }

            flatRoutes[path] = {
              handler: child as VirtualFileDefinition,
              siblings: siblings,
            };

            if (segment.startsWith('[[...')) {
              flatRoutes[path ? `${path}/${segment}` : segment] = {
                handler: child as VirtualFileDefinition,
                siblings: [],
              };
            } else {
              walk(child, path ? `${path}/${segment}` : segment);
            }
          } else if (segment.startsWith('[') && segment.endsWith(']')) {
            if (segment.startsWith('[...')) {
              // no need to further walk
              flatRoutes[path ? `${path}/${segment}` : segment] = {
                handler: child as VirtualFileDefinition,
                siblings: [],
              };
            } else {
              walk(child, path ? `${path}/${segment}` : segment);
            }
          } else {
            // only non dynamic segments are added as siblings
            siblings.push({ segment, type: child['.'] ? 'folder' : 'file' });
            walk(child, path ? `${path}/${segment}` : segment);
          }
        }
      }
    };

    walk(routes, '');
    // for (const s

    // Compile route patterns to regex and param extractors
    this.compiledRoutes = Object.entries(flatRoutes).map(([pattern, entry]) => {
      const paramNames: string[] = [];
      const regexStr = pattern
        .split('/')
        .map(segment => {
          if (segment.startsWith('[[') && segment.endsWith(']]')) {
            const name = segment.slice(2, -2).replace(/^\.\.\./, '');
            paramNames.push(name);
            return '(.*)';
          }
          if (segment.startsWith('[') && segment.endsWith(']')) {
            const name = segment.slice(1, -1);
            paramNames.push(name);
            return '([^/]+)';
          }
          return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        })
        .join('/');
      const regex = new RegExp(`^${regexStr}$`);
      return {
        regex,
        paramNames,
        staticSiblings: entry.siblings,
        handler: entry.handler,
      };
    });
  }

  match(path: string): MatchResult | undefined {
    // Normalize path: remove trailing slash except for root
    if (path.length > 1 && path.endsWith('/')) {
      path = path.replace(/\/+$/, '');
    }
    for (const { regex, paramNames, handler, staticSiblings } of this
      .compiledRoutes) {
      const match = path.match(regex);
      if (!match) continue;
      const params: Record<string, string> = {};
      for (let i = 0; i < paramNames.length; i++) {
        params[paramNames[i]!] = decodeURIComponent(match[i + 1] || '');
      }
      return { handler, params, staticSiblings };
    }
    return;
  }
}
