'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { openLegitFs } from "@legit-sdk/core";
import fs from "memfs";

export default function Home() {
  const [initialized, setInitialized] = useState(false);
  const [legitFs, setLegitFs] = useState<Awaited<ReturnType<typeof openLegitFs>> | null>(null);
  useEffect(() => {
    const init = async () => {
      console.log('Hello world');

      const legitFs = await openLegitFs({
        storageFs: fs as unknown as typeof import('node:fs'),
        gitRoot: '/',
        serverUrl: 'http://localhost:9999',
        publicKey: process.env.NEXT_PUBLIC_LEGIT_PUBLIC_KEY,
      });

      // assign legitFs to window object
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).legitFs = legitFs;
      
      //clean root
      const cleanRoot = await legitFs.promises.readdir('/');
      console.log('cleanRoot', cleanRoot);

      //branches
      const branches = await legitFs.promises.readdir('/.legit/branches');
      console.log('branches', branches);

      // current branch
      const currentBranch = await legitFs.getCurrentBranch();
      console.log('currentBranch', currentBranch);

      // user auth to access user
      const auth = await legitFs.auth;
      console.log('user', await auth.getUser());

      // get head 
      const head = await legitFs.promises.readFile('/.legit/branches/anonymous/.legit/head', 'utf8');
      console.log('head', head);

      // make changes
      await legitFs.promises.writeFile('/.legit/branches/anonymous/hello.txt', 'Hello world', 'utf8');
      console.log('written in hello.txt ', await legitFs.promises.readFile('/.legit/branches/anonymous/hello.txt', 'utf8'));

      // get head again
      const headAgain = await legitFs.promises.readFile('/.legit/branches/anonymous/.legit/head', 'utf8');
      console.log('headAgain', headAgain);

      // show history
      const history = await legitFs.promises.readFile('/.legit/branches/anonymous/.legit/history', 'utf8');
      console.log('history', JSON.stringify(JSON.parse(history), null, 2));

      // TODO: get permissions
      const permissions = await legitFs.auth.getMaxAccessTokenForBranch('anonymous');
      console.log('permissions', permissions);

      setLegitFs(legitFs);
      setInitialized(true);
    };

    if(initialized) return;
    init();
  }, []);

  const handleShare = async () => {
    console.log('handleShare');
    if(!legitFs) return;

    await legitFs.auth.signInAnonymously();
    const branch = await legitFs.shareCurrentBranch();

    console.log('shared branch', branch);
    console.log('shared branch', branch);
    console.log('shared branch', branch);
    console.log('shared branch', branch);
    console.log('shared branch', branch);
    console.log('shared branch', branch);

    // check user again
    const user = await legitFs.auth.getUser();
    console.log('user', user);
  };

  const setCurrentBranch = async () => {
    console.log('setCurrentBranch');
    if(!legitFs) return;

    await legitFs.setCurrentBranch('anonymous');
    console.log('current branch', await legitFs.getCurrentBranch());
  };

  const handleEdit = async () => {
    console.log('handleEdit');
    if(!legitFs) return;

    await legitFs.promises.writeFile(`/.legit/branches/${await legitFs.getCurrentBranch()}/hello.txt`, `New content ${Date.now()}`, 'utf8');
    console.log('written in hello.txt ', await legitFs.promises.readFile(`/.legit/branches/${await legitFs.getCurrentBranch()}/hello.txt`, 'utf8'));
  };

  const openBranch = async () => {
    console.log('openBranch');
    if(!legitFs) return;

    const branchName = window.prompt('Enter branch name:');
    if (!branchName) return;

    try {
          
          const branch = await legitFs.setCurrentBranch(branchName);
        } catch (err) {
          console.error(err);
          return;
        }
    console.log('branch', branchName);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <button
            onClick={handleShare}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
          >
            Share Legit
          </button>
          <button
            onClick={handleEdit}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full px-5 transition-colors bg-transparent border border-gray-300 text-foreground md:w-[158px]"
          >
            Write to Legit
          </button>

          <button
            onClick={openBranch}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full px-5 transition-colors bg-transparent border border-gray-300 text-foreground md:w-[158px]"
          >
            open branch
          </button>
        </div>
      </main>
    </div>
  );
}
