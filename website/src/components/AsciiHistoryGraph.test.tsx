/**
 * Visual test component for AsciiHistoryGraph
 *
 * This component helps test and debug the fork symbol rendering.
 *
 * Usage: Import and use in a test page to verify fork symbols are rendered correctly.
 */

import AsciiHistoryGraph, { Branch } from './AsciiHistoryGraph';
import {
  createForkTestCase,
  createUserTestCase,
} from './AsciiHistoryGraph.test-utils';

export function ForkSymbolTest() {
  const testCases: Array<{ name: string; branches: Branch[] }> = [
    {
      name: 'User Test Case (2 main, 3 feature)',
      branches: createUserTestCase(),
    },
    {
      name: 'Simple Test (2 main, 1 feature)',
      branches: createForkTestCase(2, 1, 1),
    },
    {
      name: 'Simple Test (2 main, 2 feature)',
      branches: createForkTestCase(2, 2, 1),
    },
    {
      name: 'Simple Test (2 main, 3 feature)',
      branches: createForkTestCase(2, 3, 1),
    },
    {
      name: 'Fork from first commit (3 main, 2 feature)',
      branches: createForkTestCase(3, 2, 0),
    },
  ];

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-2xl font-bold">
        AsciiHistoryGraph Fork Symbol Tests
      </h1>

      {testCases.map((testCase, idx) => (
        <div key={idx} className="border border-gray-300 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">{testCase.name}</h2>
          <div className="bg-white border border-gray-200 rounded p-4">
            <AsciiHistoryGraph branches={testCase.branches} />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <div>
              Main branch: {testCase.branches[0].entries.length} commits
            </div>
            <div>
              Feature branch: {testCase.branches[1]?.entries.length || 0}{' '}
              commits
            </div>
            {testCase.branches[1]?.entries[0] && (
              <div>
                Forks from:{' '}
                {testCase.branches[1].entries[0].parent[0]?.slice(0, 7)}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
