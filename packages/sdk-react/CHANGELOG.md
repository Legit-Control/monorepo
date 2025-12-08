# @legit-sdk/react

## 0.2.8

### Patch Changes

- conditional alias ssr build to use core/server import

## 0.2.7

### Patch Changes

- Depend on core/server as unopinionated

## 0.2.6

### Patch Changes

- Add react and react-dom to external buidl config for server config

## 0.2.5

### Patch Changes

- Add exports

## 0.2.4

### Patch Changes

- Add react and react-dom to external in esbuild config

## 0.2.3

### Patch Changes

- Update server build configuration for ssr use case
- Updated dependencies
  - @legit-sdk/core@0.2.3

## 0.2.2

### Patch Changes

- Updated dependencies
  - @legit-sdk/core@0.2.2

## 0.2.1

### Patch Changes

- Updated dependencies
  - @legit-sdk/core@0.2.1

## 0.2.0

### Minor Changes

- 0815bbd: `Refactored @legit-sdk/react based on @legit-sdk/core changes
  - Remove `initLegitFs` and replace it with a general `openLegitFs` initializer
  - Add a `rollback` function to the `useLegitContext` hook return
  - Add a config parameter to the `LegitProvider` let's you configure sync functionality
  - Rename `content` and `setContent` to `data` and `setData` in `useLegitFile` return

### Patch Changes

- Updated dependencies [c63f02e]
  - @legit-sdk/core@0.2.0

## 0.1.11

### Patch Changes

- Updated dependencies
  - @legit-sdk/core@0.1.11

## 0.1.10

### Patch Changes

- Updated dependencies
  - @legit-sdk/core@0.1.10

## 0.1.9

### Patch Changes

- Updated dependencies
  - @legit-sdk/core@0.1.9

## 0.1.8

### Patch Changes

- Improve wrapper to make usage simpler

## 0.1.7

### Patch Changes

- Prevent race condition by debouncing head updates

## 0.1.6

### Patch Changes

- Fix id placement in commit path @legit-sdk/react

## 0.1.5

### Patch Changes

- Add latest types in legit-sdk/react

## 0.1.4

### Patch Changes

- 2834497: Add legitFs as return of hook in legit-sdk/react

## 0.1.3

### Patch Changes

- @legit-sdk/react return null when file not available in hook

## 0.1.2

### Patch Changes

- Handle files that are not present in @legit-sdk/react hook

## 0.1.1

### Patch Changes

- Fix fresh repo behavior

## 0.1.0

### Minor Changes

- Initial react wrapper for @legit-sdk
