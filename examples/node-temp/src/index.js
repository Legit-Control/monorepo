import { openLegitFs } from '@legit-sdk/core/server';
import { createFsFromVolume, Volume } from 'memfs';

const main = async () => {
  const memfsVolume = new Volume();
  const memfsFs = createFsFromVolume(memfsVolume);

  const legitFs = await openLegitFs({
    storageFs: memfsFs,
    gitRoot: '/',
    anonymousBranch: 'main',
    showKeepFiles: false,
  });
  console.log(await legitFs.promises.readdir('/', 'utf8'));
};

main();
