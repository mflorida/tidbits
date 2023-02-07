#!/usr/bin/env bash

mkdir -p _dev && rm -rf _dev/*
cp src/index.html _dev/index.html
esbuild main.js \
  --bundle \
  --outfile=_dev/index.js \
  --watch
