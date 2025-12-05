import { CompositeFs } from '../CompositeFs.js';
import CompositFsFileHandle from '../CompositeFsFileHandle.js';

export type FsOperationLogger = (args: {
  fsName: string;
  fd?: CompositFsFileHandle | undefined;
  path: string;
  operation: string;
  operationArgs: any;
}) => Promise<void>;

export const createFsOperationFileLogger = (fs: {
  writeFile: (path: string, data: string) => Promise<void>;
}) => {
  return async (args: {
    fsName: string;
    fd?: CompositFsFileHandle | undefined;
    path: string;
    operation: string;
    operationArgs: any;
  }) => {
    if (
      !args.path.includes('.legit/branches/') ||
      (args.path.match(/\.legit/g) || []).length > 1
    ) {
      return;
    }

    // if write occurs on *.legit/branches/*/^.legit we want to write an operation:
    // .legit/branches/branchname/operation
    let [rootPath, branchPrefixedPath] = args.path.split('.legit/branches/');
    let [branchName, ...restPathParts] = branchPrefixedPath!.split('/');
    const filePath = restPathParts.join('/');
    const operationPath =
      rootPath + '.legit/branches/' + branchName + '/.legit/operation';

    const jsonArgs = JSON.stringify(args.operationArgs, (key, value) => {
      if (Buffer.isBuffer(value)) {
        return { __buffer__: value.toString('base64') };
      }
      return value;
    });

    await fs.writeFile(
      operationPath,
      `[${args.fsName}].${args.operation}(${args.fd ? args.fd.fd + ' - ' : ''}${args.path})\n\n${jsonArgs}\n\n`
    );
  };
};
