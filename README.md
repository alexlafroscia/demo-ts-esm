# TypeScript + Native ESM Demo

This repository contains a simple demonstration of using TypeScript with the native ESM support that was introduced in TypeScript 4.7.

## Project Setup

This project is set up to use [Volta](https://volta.sh) and [Yarn 3](https://yarnpkg.com), but those are not strictly necessary; you need

- Node v16.15+
- Any version of Yarn

To install the dependencies and build the output, run the following:

```sh
yarn
yarn build
```

## Points of Interest

### Source Code

- Despite all of the source code being in `.ts` files, neighoring files _must_ be imported using the `.js` extension that the TypeScript compiler will give the files through the compilation process
- The `exports` field in the `package.json` is configured to expose...
  - The `src/index.ts` file output as the main export from the package
  - The `src/helper.ts` file as a relative module from the root of the package
  - The type definitions using the `"types"` condition
- [Vitest](https://vitest.dev) is smart enough to understand that the import of `./index.js` actually means the `./index.ts` file it is adjacent to

### Output

- `dist/src/bin.js` is a Node script that makes use of Native ESM features, including ESM imports and top-level `await`
- `dist/src/bin.js` can specify an import is from the Node standard library with the `node:` prefix

## Running the Code

The `bin` file can be executed through `yarn node` like so:

```sh
yarn node ./dist/src/bin.js 1 2
```

The exposed module can be played with using by first launching the Node repl using `yarn node`, and then importing the module as follows:

```js
const { add } = await import("demo-ts-esm");

const result = await add(1, 2);
```

Or, to demonstrate importing a sub-module directly:

```js
const { add } = await import("demo-ts-esm/helpers");

const result = await add(1, 2);
```
