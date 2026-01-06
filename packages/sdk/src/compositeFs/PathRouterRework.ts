/**
 * Routes filesystem paths to appropriate SubFS handlers using a pattern-based system.
 *
 * The PathRouter supports a flexible pattern syntax for defining dynamic routes:
 *
 * | Pattern        | Description           | Example           | Matches                                              |
 * |----------------|-----------------------|-------------------|------------------------------------------------------|
 * | `static`       | Static segment        | `branches`        | `branches` only                                      |
 * | `[param]`      | Dynamic segment       | `[branchName]`    | `main`, `dev`, etc. (single segment)                 |
 * | `[[...param]]` | Optional catch-all    | `[[...filePath]]` | matches zero or more segments                        |
 * | `.`            | Folder index handler  | `{ '.': handler }`| handles the folder itself                            |
 *
 * Priority is given to more specific routes (static > dynamic > catch-all).
 *
 * ## Static Sibling Union
 *
 * When multiple route patterns match at the same parent path level, their static siblings
 * are merged (union operation). For example, if both `.legit` and `[[...filePath]]/.legit`
 * match at root, the static siblings from both routes are combined.
 *
 * @example
 * ```typescript
 * const router = new PathRouter({
 *   '[[...filePath]]': {
 *     '.': catchAllHandler,
 *     '.legit': { changes: changesHandler }
 *   },
 *   '.legit': {
 *     '.': legitHandler,
 *     head: headHandler,
 *     branches: { ... }
 *   }
 * }, '/root');
 *
 * // Match with highest priority handler and union of all static siblings
 * const result = router.match('/root/.legit');
 * // result.handler === legitHandler (higher priority)
 * // result.staticSiblings === [
 * //   { segment: 'head', type: 'file' },      // from .legit route
 * //   { segment: 'branches', type: 'folder' }, // from .legit route
 * //   { segment: 'changes', type: 'file' }     // from [[...filePath]]/.legit
 * // ]
 * ```
 */
import { CompositeSubFs } from './CompositeSubFs.js';

export type MatchResult = {
  handler: CompositeSubFs;
  matchingPattern: string;
  staticSiblings: { segment: string; type: 'folder' | 'file' }[];
  params: Record<string, string>;
};

export interface LegitRouteFolder {
  [key: string]: PathRouteDescription;
}

type PathRouteDescription = CompositeSubFs | LegitRouteFolder;

/**
 * Compiles route pattern into a regex string with named capture groups.
 *
 * @param pattern - The route pattern (e.g., '.legit/branches/[branchName]')
 * @returns The compiled regex string and extracted parameter names
 */
function compilePattern(pattern: string): {
  regexStr: string;
  paramNames: string[];
  folderRoute: boolean;
  pathParameter?: string;
} {
  const segments = pattern.split('/').filter(Boolean);
  const paramNames: string[] = [];
  const regexSegments: string[] = [];

  let folderRoute = false;
  let pathParameter: string | undefined;

  for (const segment of segments) {
    if (segment.startsWith('[[') && segment.endsWith(']]')) {
      // Optional parameter: [[param]] or [[...param]]
      const name = segment.slice(2, -2).replace(/^\.\.\./, '');
      paramNames.push(name);

      if (segment.startsWith('[[...')) {
        folderRoute = true;
        // [[...param]] - zero or more segments
        regexSegments.push('(\/.*)*');
        pathParameter = name;
      } else {
        throw new Error(
          'Optional single-segment parameters [[param]] are not supported. Use [[...param]] for catch-all or [param] for required single segment.'
        );
      }
    } else if (segment.startsWith('[') && segment.endsWith(']')) {
      // Required parameter: [param] or [...param]
      if (segment.startsWith('[...')) {
        throw new Error(
          'Required catch-all parameters [...param] are not supported. Use [[...param]] instead.'
        );
      } else {
        // [param] - exactly one segment
        const name = segment.slice(1, -1);
        paramNames.push(name);
        regexSegments.push('\/([^\\/]+)');
      }
    } else {
      if (segment === '.') {
        // Folder root handler - does not add to regex
        folderRoute = true;
      } else {
        // Static segment - escape regex special characters
        regexSegments.push(
          '\/' + segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ''
        );
      }
    }
  }

  return {
    regexStr: regexSegments.join('') + '$', // '(?:$|/.*)',
    paramNames,
    folderRoute,
    pathParameter,
  };
}

/**
 * Calculates the priority score of a route pattern.
 *
 * Higher priority means:
 * - More segments (depth)
 * - Static segments over required dynamic over catch-all
 * - More specific static names (longer = more specific)
 *
 * Priority scoring per segment:
 * - Static: 1000 + length (longer names = higher priority)
 * - Required dynamic [param]: 100
 * - Catch-all [[...param]]: 10
 * - Root .: 1 (lowest priority fallback)
 *
 * @param pattern - The route pattern to score
 * @returns Numerical priority score (higher = more specific)
 */
function calculatePriority(pattern: string): number {
  // Handle root specially - should be lowest priority (fallback only)
  if (pattern === '.') {
    return 1;
  }

  const segments = pattern.split('/').filter(Boolean);

  // Base score: more segments = higher priority (exponential to favor depth)
  let score = Math.pow(2, segments.length);

  // Score each segment
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]!;
    let segmentScore: number;

    if (segment.startsWith('[[...')) {
      // Catch-all - lowest segment priority
      segmentScore = 10;
    } else if (segment.startsWith('[[')) {
      // Optional single segment (not supported but for completeness)
      segmentScore = 50;
    } else if (segment.startsWith('[')) {
      // Required dynamic segment
      segmentScore = 100;
    } else {
      // Static segment - base score + length bonus
      // Longer static names = more specific = higher priority
      segmentScore = 1000 + segment.length;
    }

    // Earlier segments have slightly more weight (positional multiplier)
    // Position 0 = 1.0, Position 1 = 0.9, Position 2 = 0.81, etc.
    const positionMultiplier = Math.pow(0.9, i);
    score += segmentScore * positionMultiplier;
  }

  return score;
}

/**
 * Determines if a route node is a folder or file.
 *
 * @param node - The route node to check
 * @returns 'folder' if the node has children (is a folder), 'file' otherwise
 */
function getNodeType(node: PathRouteDescription): 'folder' | 'file' {
  // If it has children, it's a folder
  if (typeof (node as CompositeSubFs).name !== 'string') {
    return 'folder';
  }

  // It's a handler - check the explicit fsType if provided
  const handler = node as CompositeSubFs;

  if (handler.fsType === 'folder') {
    return 'folder';
  }

  if (handler.fsType === 'file') {
    return 'file';
  }

  // Default: check if it has readdir method
  return 'readdir' in handler && typeof handler.readdir === 'function'
    ? 'folder'
    : 'file';
}

/**
 * Flattens the route tree into a list of route definitions with their metadata.
 *
 * @param routes - The route tree to flatten
 * @returns Array of compiled route definitions
 */
function flattenRoutes(routes: LegitRouteFolder): Array<{
  pattern: string;
  handler?: CompositeSubFs;
  priority: number;
  staticBaseChildren: { segment: string; type: 'folder' | 'file' }[];
}> {
  const flatRoutes: Array<{
    pattern: string;
    handler?: CompositeSubFs;
    priority: number;
    staticBaseChildren: { segment: string; type: 'folder' | 'file' }[];
  }> = [];

  /**
   * Recursively walks the route tree.
   *
   * @param node - Current node in the route tree
   * @param currentPath - Current accumulated path pattern
   */
  function walk(node: PathRouteDescription, currentPath: string) {
    // Check if node is a handler (has a name property)
    if (typeof (node as CompositeSubFs).name === 'string') {
      flatRoutes.push({
        pattern: currentPath || '.',
        handler: node as CompositeSubFs,
        priority: calculatePriority(currentPath || '.'),
        // no children for handlers
        staticBaseChildren: [],
      });
      return;
    }

    // Node is a folder - process its children
    const folder = node as LegitRouteFolder;
    const staticChildren: { segment: string; type: 'folder' | 'file' }[] = [];

    // Validate: . and [[...param]] can coexist, but no other combinations

    const folderHandlers = Object.keys(folder).filter(
      k => k.startsWith('[[') || k === '.'
    );

    if (folderHandlers.length > 1) {
      throw new Error(
        `Expected exactly one folder handler for ${currentPath || '/'} expected but multuple found: ${folderHandlers.join(', ')}`
      );
    }

    if (folderHandlers.length === 0) {
      throw new Error(`No folder handler for ${currentPath || '/'} founds`);
    }

    for (const [segment, child] of Object.entries(folder)) {
      const newPath = currentPath ? `${currentPath}/${segment}` : segment;

      if (segment === '.') {
        // Folder root handler - must be a handler, not a folder
        if (typeof (child as CompositeSubFs).name !== 'string') {
          throw new Error(
            `Folder root '.' at path '${currentPath}' must be a handler, not a folder`
          );
        }

        if (child.fsType !== 'folder' && child.fsType !== 'fs') {
          throw new Error(
            `Folder root handler '.' at path '${currentPath}' must be of type 'folder' or 'fs'`
          );
        }

        flatRoutes.push({
          pattern: currentPath + '/.',
          handler: child as CompositeSubFs,
          priority: calculatePriority(currentPath),
          staticBaseChildren: staticChildren,
        });
      } else if (segment.startsWith('[[')) {
        // Optional parameter
        if (segment.startsWith('[[...')) {
          // Catch-all optional can have children
          // If it's a handler, add it directly
          if (typeof (child as CompositeSubFs).name === 'string') {
            flatRoutes.push({
              pattern: newPath,
              handler: child as CompositeSubFs,
              priority: calculatePriority(newPath),
              staticBaseChildren: staticChildren,
            });
            if (child.fsType !== 'folder' && child.fsType !== 'fs') {
              throw new Error(
                `Folder root handler '.' at path '${currentPath}' must be of type 'folder' or 'fs'`
              );
            }
          } else {
            // It's a folder - walk into children
            walk(child, newPath);
          }
        } else {
          // Optional single segment - walk into children
          walk(child, newPath);
        }
      } else if (segment.startsWith('[')) {
        // Required parameter
        if (segment.startsWith('[...')) {
          throw new Error(
            `Required catch-all '${segment}' is not supported. Use '[[...${segment.slice(5, -1)}]]' instead`
          );
        }
        // Single required parameter - walk into children
        walk(child, newPath);
      } else {
        staticChildren.push({
          segment,
          type: getNodeType(child),
        });

        // Static segment - walk into children
        walk(child, newPath);
      }
    }
  }

  walk(routes, '');
  return flatRoutes;
}

/**
 * PathRouter matches filesystem paths to SubFS handlers using pattern-based routing.
 *
 * The router evaluates all compiled patterns twice:
 * 1. To find the highest-priority matching handler for the requested path
 * 2. To find all patterns that match the parent path, merging their static siblings (union)
 *
 * This allows dynamic routes like `[[...filePath]]/.legit` to contribute siblings
 * that are visible when matching the static `.legit` route.
 *
 * @example
 * ```typescript
 * const router = new PathRouter({
 *   '[[...filePath]]': {
 *     '.': catchAllHandler,
 *     '.legit': { changes: changesHandler }
 *   },
 *   '.legit': {
 *     '.': legitHandler,
 *     head: headHandler,
 *   }
 * }, '/root');
 *
 * const result = router.match('/root/.legit');
 * // Returns:
 * // {
 * //   handler: legitHandler,  // highest priority match
 * //   params: {},
 * //   staticSiblings: [
 * //     { segment: 'head', type: 'file' },
 * //     { segment: 'changes', type: 'file' }  // merged from catchall route!
 * //   ]
 * // }
 * ```
 */
export class PathRouter {
  private compiledRoutes: Array<{
    regex: RegExp;
    paramNames: string[];
    handler?: CompositeSubFs;
    staticBaseChildren: { segment: string; type: 'folder' | 'file' }[];
    folderRoute: boolean;
    priority: number;
    pattern: string;
    pathParameter?: string;
  }>;

  /**
   * Creates a new PathRouter with the given route configuration.
   *
   * @param routes - The route tree defining all possible paths
   * @param rootPath - The root path to strip from incoming paths (e.g., '/root')
   */
  constructor(
    public routes: LegitRouteFolder,
    private rootPath: string
  ) {
    // Flatten routes into compiled patterns
    const flatRoutes = flattenRoutes(routes);

    // Compile each route pattern to regex
    this.compiledRoutes = flatRoutes.map(route => {
      const { regexStr, paramNames, folderRoute, pathParameter } =
        compilePattern(route.pattern);
      return {
        regex: new RegExp(regexStr),
        paramNames,
        staticBaseChildren: route.staticBaseChildren,
        handler: route.handler,
        priority: route.priority,
        pattern: route.pattern,
        folderRoute,
        pathParameter,
      };
    });
  }

  /**
   * Matches a path against all route patterns and returns the best match.
   *
   * The matching algorithm:
   * 1. Normalizes the path by removing the root prefix
   * 2. Finds all route patterns that match the path (by priority order)
   * 3. Returns the highest-priority match
   * 4. For static siblings, evaluates ALL patterns against the parent path
   *    and merges their siblings (union operation)
   *
   * @param path - The full filesystem path to match
   * @returns Match result with handler, params, and union of static siblings, or undefined if no match
   */
  match(path: string): MatchResult | undefined {
    // Normalize path: remove root prefix and ensure leading slash
    let relative = path;

    if (relative.startsWith(this.rootPath + '/')) {
      relative = relative.slice(this.rootPath.length + 1);
    } else if (relative.startsWith(this.rootPath)) {
      relative = relative.slice(this.rootPath.length);
    }

    // Add leading slash if not present
    if (!relative.startsWith('/')) {
      relative = '/' + relative;
    }

    // Remove trailing slash for matching (except for root)
    if (relative.length > 1 && relative.endsWith('/')) {
      relative = relative.slice(0, -1);
    }

    let bestRoute: (typeof this.compiledRoutes)[0] | undefined;
    let params: Record<string, string> = {};

    let priorityMatched = -1;
    const compiledRoutes = this.compiledRoutes;

    const matchingRoutes: typeof compiledRoutes = [];

    for (const currentCompiledRoute of compiledRoutes) {
      const match = relative.match(currentCompiledRoute.regex);

      if (match) {
        matchingRoutes.push(currentCompiledRoute);
      } else {
        // Not a match
        continue;
      }

      if (!match || currentCompiledRoute.priority <= priorityMatched) {
        continue;
      }

      // Extract parameters
      params = {};
      for (let i = 0; i < currentCompiledRoute.paramNames.length; i++) {
        let value = match[i + 1] || '';

        // Remove leading slash from optional parameters
        if (value.startsWith('/')) {
          value = value.slice(1);
        }

        params[currentCompiledRoute.paramNames[i]!] = decodeURIComponent(value);
      }

      priorityMatched = currentCompiledRoute.priority;
      bestRoute = currentCompiledRoute;
    }

    // CONTINUE HERE!
    if (!bestRoute || bestRoute.handler === undefined) {
      return undefined;
    }

    let siblings: typeof bestRoute.staticBaseChildren = [];

    if (bestRoute.folderRoute) {
      if (bestRoute.pathParameter) {
        if (params[bestRoute.pathParameter] === '') {
          siblings = bestRoute.staticBaseChildren.map(sibling => ({
            segment: sibling.segment,
            type: sibling.type,
          }));
        }
      } else {
        siblings = bestRoute.staticBaseChildren.map(sibling => ({
          segment: sibling.segment,
          type: sibling.type,
        }));
      }
    }

    return {
      handler: bestRoute.handler,
      matchingPattern: bestRoute.pattern,
      params: params,
      staticSiblings: siblings,
    };
  }
}
