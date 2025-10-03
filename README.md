# SVG Build

> Standard SVG build process to handle icon, full, and inline SVGs.

## Install

```shell
npm install @static-interactive/svg-build
```

## Setup

This package expects the following directory structure:

- `src/svg/icon`
  - Single-color icons that will have their color set to `currentColor` and are added to sprite sheet
- `src/svg/full`
    - Multi-color icons that will not have their colors updated and are added to sprite sheet
- `src/svg/inline`
    - Single or multi-color SVG that are intended to be included inline in your HTML


## Use

````shell
npm run svg-build
````

This will optimize all SVG files in `src/svg` and copy them to the following locations:

- `templates/_svg/inline`
  - Optimized files intended for inline use in your HTML.
- `templates/_svg/symbol`
  - Optimized sprite sheet files intended for use with `<use>` in your HTML.
- `src/static/svg/`
  - All files optimized. This will be copied to your final destination by Vite and are intended for use in CSS.

## Release

- Bump `version` in `package.json` appropriately, following [Semantic Versioning](https://semver.org).
- [Create a new Github release](https://github.com/brettburwell/svg-build/releases/new) identifying changes.
- A Github Action will automatically run tests and publish the update.
