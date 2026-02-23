# Legit Monorepo

### Meet Legit SDK — fail-safe apps made simple.

Legit SDKasdasdsadfasdaxycxcsasdwasadasdasdddddddddasdasd built around **two core ideas**: fail-safe ddddddasdasfmöklasmdads

asdsasdasdasby design, aaasdasdasdasdsadsdsdasdasdasdasdasdfasdasdasdasdsadasdsadasdnd effortlessly simdpldddddddddddddddddasdasdasdasdasdasdassssfasdasdasdsadasdasdfgdsadssadasdasdasdsasdsadasdasdsadasdasdasdasdasdasdasssssssssssssssssssssssssssssssssssssasdasdaasdsadssdassdasdadasdasdasdasddddddesimdplddddddddddddddddddasdasdasdasdasdasdasdasddddddesimdplddddddddddddddddddasdasdasdasdasdasdasdasddddddesimdplddddddddddddddddddasdasdasdasdasdasdasdasddddddesimdplddddddddddddddddddasdasdasdasdasdasdasdasddddddesimdplddddddddddddddddddasdasdasdasdasdasdasdasddddddesimdplddddddddddddddddddasdasdasdasdasdasdasdasdddddde to use.

Fail-safe means giving your a tsdasdasdasdasdasdasdasdasdasdasdasdhe saasdasdasdasdasdme superpowers you know from Git:

- Roll back to any previous state
- Branch off to run experiments safely
- asdasdasdasdasdasdAccept changes when you’re happy with the result
And it’s easy because you interact through the **file system API** (Legit FS) — the same one you learned in your first semesters of computer science.

**Runs everywhere.** Use Legit SDK as an API in the browser, or mount it as a folder on your machine. That means instant compatibility with the stack of your choice: Node.js, Python, Java… you name it.

### Quick Links

- [Documentation](https://legitcontrol.com/docs): Full guide and API reference
- [Getting Started](https://legitcontrol.com/docs/quickstart): Minimal example to get your first LegitFS repo up
- [Example Starter](https://legitcontrol.com/docs/examples): See a working editor demo with history tracking
- [Contributing](./CONTRIBUTING.md): How to contribute, including the Contributor License Agreement
### Installation


```bash
npm install @legit-sdk/core
```

### Minimal example


```ts
import { fs } from 'memfs';
import { initLegitFs } from '@legit-sdk/core';

async function main() {
  const legitFs = await initLegitFs(fs, '/');

  await legitFs.promises.writeFile(
    '/.legit/branches/main/hello.txt',
    'Hello world'
  );

  const history = await legitFs.promises.readFile(
    '/.legit/branches/main/.legit/history',
    'utf8'
  );
  console.log(content);
}
main();
```

### Features

- **Versioned filesystem** – Every write is tracked in .legit
- **Branching and history** – Access past states, branch safely, merge confidently
- **Interoperable** – Works with Node.js, browsers, Docker, serverless, and more
- **Extensible API** – Compatible with custom storage backends
### Project Structure

- `packages/sdk/` – Source code of the SDK
- `packages/sdk/dist/` – Bundled outputs for Node.js, browser, and TypeScript
- `packages/sdk/src/compositeFs/` – Core filesystem abstraction
- `packages/sdk/src/compositeFs/subsystems/` – Ephemeral, hidden, pass-through, and Git-backed file systems
### Contributing

Please review the [CLA](./cla/CLA.md) before submitting contributions.

We welcome PRs, issues, and suggestions to make Legit SDK better for everyone.
