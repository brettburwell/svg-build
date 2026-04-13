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

- `templates/_svg/inline/`
  - Optimized files intended for inline use in your HTML.
- `templates/_svg/`
  - Optimized sprite sheet files (`icon.symbol.svg`, `full.symbol.svg`) intended for use with `<use>` in your HTML.
- `src/static/svg/`
  - All files optimized. This will be copied to your final destination by Vite and are intended for use in CSS.

## Configuration

If your project uses a different directory structure, you can override the default paths by adding an `svg-build.config.json` file to your project root. All keys are optional — omit any you don't need to change.

```json
{
  "srcBase": "./src/svg",
  "spriteOut": "./templates/_svg",
  "inlineOut": "./templates/_svg/inline",
  "staticBase": "./src/static/svg"
}
```

| Key | Default | Description |
|-----|---------|-------------|
| `srcBase` | `./src/svg` | Root of source SVG directories |
| `spriteOut` | `./templates/_svg` | Where sprite sheets are written |
| `inlineOut` | `./templates/_svg/inline` | Where inline SVGs are copied for template use |
| `staticBase` | `./src/static/svg` | Root for static/CSS copies |

**Example:** A project where templates live inside an `app/` subdirectory:

```json
{
  "spriteOut": "./app/templates/_svg",
  "inlineOut": "./app/templates/_svg/inline"
}
```

## Release

- Bump `version` in `package.json` appropriately, following [Semantic Versioning](https://semver.org).
- [Create a new Github release](https://github.com/brettburwell/svg-build/releases/new) identifying changes.
- A Github Action will automatically run tests and publish the update.
