# @legit-sdk/core

## 0.1.11

### Patch Changes

- chore: small fix of branch path that caused failure in operationsBranch workflow

## 0.1.10

### Patch Changes

- Enable rollback
  - new end points in per branch `.legit` folder
    - operationHead -> read + write (rollback)
    - head -> write (rollback)
  - Operation type (return from operationHistory)
    - added originBranchOid (always points to last change on working branch)

## 0.1.9

### Patch Changes

- Fix readme

## 0.1.8

### Patch Changes

- Add require export path

## 0.1.7

### Patch Changes

- remove readme

## 0.1.6

### Patch Changes

- Update Readme

## 0.1.5

### Patch Changes

- Update license in package.json

## 0.1.4

### Patch Changes

- Improve bundling with rollup for types

## 0.1.3

### Patch Changes

- Update build dist/

## 0.1.2

### Patch Changes

- improve esbuild config and package.json

## 0.1.1

### Patch Changes

- Add files property in package.json, add readme
