# fcurve

[![Build Status](https://img.shields.io/travis/chromakode/fcurve/master.svg?style=flat-square)](https://travis-ci.org/chromakode/fcurve)
[![Coverage Status](https://img.shields.io/codecov/c/github/chromakode/fcurve/master.svg?style=flat-square)](https://codecov.io/github/chromakode/fcurve?branch=master)
[![npm](https://img.shields.io/npm/v/fcurve.svg?style=flat-square)](https://www.npmjs.com/package/fcurve)
[![npm](https://img.shields.io/npm/l/fcurve.svg?style=flat-square)](https://github.com/chromakode/fcurve/blob/master/LICENSE)

<img src="./fcurve.png" width="400">

[Blender](https://www.blender.org) uses bezier curves to control animations
called FCurves. This library is a port of the evaluator. Given the same control
point information, it should produce the same output (within a few points of
numeric precision). This is verified by running Blender with the same curves
and comparing the values. (:warning: though we're not getting 100% code
coverage yet)

Currently, only the bezier interpolation mode is fully supported.

In JS, FCurves should be represented like this:
```js
{
  points: [
    {
      // point interpolation mode (only 'BEZIER' supported)
      interpolation: 'BEZIER',
      // (x, y) coordinate of point
      co: [10, 0],
      // (x, y) coordinate of left handle
      left: [-50, 0],
      // (x, y) coordinate of right handle
      right: [50, 0],
    },
    {
      interpolation: 'BEZIER',
      co: [120, -3],
      left: [70, -3],
      right: [170, -3],
    },
  ]
}
```
