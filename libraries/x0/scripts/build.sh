#!/usr/bin/env bash

mkdir -p _build && rm -rf _build/*
cp src/index.html _build/index.html
esbuild main.js \
  --bundle \
  --minify \
  --sourcemap \
  --target=es2018 \
  --outfile=_build/index.js
