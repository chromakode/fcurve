const fs = require('fs')
const path = require('path')
const execSync = require('child_process').execSync

const {evaluateFCurve} = require('../fcurve')

function getBlenderData(fcurve, startFrame, endFrame) {
  const scriptPath = path.join(__dirname, 'fcurve.py')
  const scriptInput = JSON.stringify({fcurve, start: startFrame, end: endFrame})
  const output = execSync(`blender -b -P ${scriptPath} -- '${scriptInput}'`, {
    stdio: ['ignore', 'pipe', 'ignore'],
  }).toString('utf8')

  const prefix = 'FCURVE:'
  let outputLine
  try {
    outputLine = output.split('\n')
      .find(l => l.startsWith(prefix))
      .substr(prefix.length)
  } catch (err) {
    console.error('Unable to find output line:', err)
    console.log(output)
  }

  let sampledPoints
  try {
    sampledPoints = JSON.parse(outputLine)
  } catch (err) {
    console.error('Unable to parse JSON:', err)
    console.log(firstLine)
  }
  return sampledPoints
}

function evaluateFrames(fcurve, startFrame, endFrame) {
  const frames = []
  for (let i = startFrame; i < endFrame; i++) {
    frames.push([i, evaluateFCurve(fcurve, i)])
  }
  return frames
}

function checkEvaluator(fcurve) {
  const startFrame = fcurve.points[0].co[0] - 10
  const endFrame = fcurve.points[fcurve.points.length - 1].co[0] + 10

  const expectedFrames = getBlenderData(fcurve, startFrame, endFrame)
  const frames = evaluateFrames(fcurve, startFrame, endFrame)
  expect(expectedFrames.length).toBe(frames.length)
  for (let i = 0; i < expectedFrames.length; i++) {
    expect(expectedFrames[i][0]).toBe(frames[i][0])
    expect(expectedFrames[i][1]).toBeCloseTo(frames[i][1], 4)
  }
}

describe('fcurve evaluator', () => {
  it('evaluates bezier curves correctly', () => {
    checkEvaluator({
      points: [
        {
          interpolation: 'BEZIER',
          co: [10, 0],
          left: [-50, 0],
          right: [50, 0],
        },
        {
          interpolation: 'BEZIER',
          co: [120, -3],
          left: [70, -3],
          right: [170, -3],
        },
      ]
    })

    checkEvaluator({
      points: [
        {
          interpolation: 'BEZIER',
          co: [10, 0],
          left: [-50, -5],
          right: [50, -2],
        },
        {
          interpolation: 'BEZIER',
          co: [30, 4],
          left: [30, -10],
          right: [30, 10],
        },
        {
          interpolation: 'BEZIER',
          co: [60, 4],
          left: [50, -10],
          right: [80, 10],
        },
        {
          interpolation: 'BEZIER',
          co: [120, -3],
          left: [70, 4],
          right: [170, -3],
        },
      ]
    })
  })

  it('evaluates constant curves correctly', () => {
    checkEvaluator({
      points: [
        {
          interpolation: 'CONSTANT',
          co: [10, 0],
          left: [-50, 0],
          right: [50, 0],
        },
        {
          interpolation: 'CONSTANT',
          co: [120, -3],
          left: [70, -3],
          right: [170, -3],
        },
      ]
    })
  })
})
