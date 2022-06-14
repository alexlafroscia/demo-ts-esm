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

### `bin` Executable

The `bin` file can be executed through `yarn node` like so:

```sh
yarn node ./dist/src/bin.js 1 2
```

### Module Imports

The exposed modules can be imported by first launching the Node repl using `yarn node`, and then importing it as follows:

```js
const { add } = await import("demo-ts-esm");

const result = await add(1, 2);
```

Or, to demonstrate importing a sub-module directly:

```js
const { add } = await import("demo-ts-esm/helpers");

const result = await add(1, 2);
```

## Gotchas

There are some things you might want to be aware of when working with native ESM and TypeScript:

### Missing `.js` Extension in Imports

It can be pretty easy to accidentally leave off the `.js` extension from the imports within your package, especially if you are migrating an existing project that does not include the extension in your import specifier. TypeScript itself will not complain about the missing file extension, nor will common test runners like Vitest, which work fine with no file extension being provided.

It's not until you actually try to execute your package's code by consuming the TypeScript output as ESM that Node will complain that your imports are missing the requisite `.js` file extension.

To demonstrate this problem within this repo, modify the `src/index.ts` file like so:

```diff
- export { add } from "./helpers.js";
+ export { add } from "./helpers";
```

Compiling the code (`yarn build`) and running the tests (`yarn test`) will both complete without complaint! However, actually trying to import the package as ESM will fail. Try the following in the Node repl (`yarn node`) after performing a build (`yarn build`):

```js
import("demo-ts-esm");
```

Results in an error:

> Error [ERR_MODULE_NOT_FOUND]: Cannot find module '$PATH_TO_PARENT_DIR/demo-ts-esm/dist/src/helpers' imported from $PATH_TO_PARENT_DIR/demo-ts-esm/dist/src/index.js
