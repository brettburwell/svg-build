#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import SVGSpriter from 'svg-sprite';
import { optimize } from 'svgo';

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------

const readSVGs = (dir) => {
  return fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.svg'));
};

const renameSvg = (name) => {
  return name.replace('.svg', '');
};

// ---------------------------------------------------------------
// Config
// ---------------------------------------------------------------

// Base SVGO config
const baseSVGO = [
  {
    name: 'preset-default',
    params: {
      cleanupIds: false,
      collapseGroups: false,
      mergePaths: false,
      moveElemsAttrsToGroup: false,
      moveGroupAttrsToElems: false,
      removeUselessStrokeAndFill: false,
    },
  },
];

// Sprite config generator
const spriteConfig = (spriteFile, extraPlugins = []) => ({
  dest: './templates/_svg', // overridden later if needed
  mode: {
    symbol: {
      sprite: spriteFile,
    },
    inline: true,
  },
  shape: {
    id: {
      generator: renameSvg,
    },
    transform: [
      {
        svgo: { plugins: [...baseSVGO, ...extraPlugins] },
      },
    ],
  },
});

// Configurations for different SVG types
const configs = [
  {
    type: 'icon',
    srcDir: './src/svg/icon/',
    outDir: './templates/_svg/',
    sprite: spriteConfig('icon.symbol.svg', [
      { name: 'convertColors', params: { currentColor: true } },
      { name: 'removeAttrs', params: { attrs: '(opacity|style)' } },
    ]),
  },
  {
    type: 'inline',
    srcDir: './src/svg/inline/',
    outDir: './templates/_svg/inline/',
  },
  {
    type: 'full',
    srcDir: './src/svg/full/',
    outDir: './templates/_svg/',
    sprite: spriteConfig('full.symbol.svg'),
  },
  {
    type: 'copyInline',
    srcDir: './src/svg/inline/',
    outDir: './src/static/svg/inline/',
  },
  {
    type: 'copyFull',
    srcDir: './src/svg/full/',
    outDir: './src/static/svg/full/',
  },
  {
    type: 'copyIcon',
    srcDir: './src/svg/icon/',
    outDir: './src/static/svg/icon/',
  },
];

// ---------------------------------------------------------------
// Main Process
// ---------------------------------------------------------------

for (const config of configs) {
  //
  // If Inline SVG
  //

  if (['inline', 'copyInline', 'copyFull', 'copyIcon'].includes(config.type)) {
    // Make directory if it doesn't exist and grab SVG files
    fs.mkdirSync(config.outDir, { recursive: true });
    const files = readSVGs(config.srcDir);

    // Loop through each inline svg file
    for (const file of files) {
      const src = path.join(config.srcDir, file);
      const dest = path.join(config.outDir, file);

      // Optimize and write to destination
      const raw = fs.readFileSync(src, 'utf8');
      const { data } = optimize(raw, { plugins: baseSVGO });
      fs.writeFileSync(dest, data);
    }

    //
    // Else (Icon or Full)
    //
  } else {
    // Initialize spriter and grab SVG files
    const spriter = new SVGSpriter({ ...config.sprite, dest: config.outDir });
    const files = readSVGs(config.srcDir);

    // Loop through each svg file and add to spriter
    for (const file of files) {
      const abs = path.resolve(config.srcDir, file);
      spriter.add(abs, file, fs.readFileSync(abs, 'utf8'));
    }

    // Compile the sprite
    spriter.compile((err, result) => {
      if (err) throw err;

      for (const mode of Object.values(result)) {
        for (const res of Object.values(mode)) {
          fs.mkdirSync(path.dirname(res.path), { recursive: true });
          fs.writeFileSync(res.path, res.contents);
        }
      }
    });
  }
}
