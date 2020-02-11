# gcode-context

A simple wrapper for canvas context to export a g-code file starting from your web sketch!
Very useful to print your drawings with a penplot.

### Installation

You can grab it as an `npm` package
```bash
npm i --save @gcode-context
```

### Example
You can use gcode-context with [canvas-sketch](https://github.com/mattdesl/canvas-sketch) by Matt DesLauriers (@mattdesl)

```javascript
const canvasSketch = require('canvas-sketch');
const GCodeContext = require('gcode-context');

const gcodeSettings = {
  feedRate: 4000,
  seekRate: 4000,
  flipX: true,
  paperSize: [210, 297],
  margin: 5,
  fileName: name + '.gcode',
}

const settings = {
  dimensions: [
    gcodeSettings.paperSize[0] - (gcodeSettings.margin*2),
    gcodeSettings.paperSize[1] - (gcodeSettings.margin*2)
  ],
  units: 'mm',
}

const sketch = ({context}) => {
  const ctx = new GCodeContext({context, gcodeSettings})
  return ({ width, height, data }) => {
    ctx.gCode.updateCoordsArea(width, height)
    ctx.clear()
    
    ctx.beginPath()
    ctx.rect(0, 0, width, height)
    ctx.stroke()

    // with CMD+S you can download your gcode file 
    // or
    ctx.saveFile()
  }
}

canvasSketch(sketch, settings);
```

or in plain javascript: 

```javascript
const GCodeContext = require('gcode-context');

// for more information on gcode file settings see https://github.com/lavolpecheprogramma/gcode-file
const gcodeSettings = {
  feedRate: 4000,
  seekRate: 4000,
  paperSize: [ 210, 297],
  margin: 10,
  fileName: 'sketch.gcode'
}

const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");
const ctx = new GCodeContext({context, gcodeSettings})
// ... your canvas setup ...
ctx.gCode.updateCoordsArea(canvas.width, canvas.height);

ctx.beginPath();
ctx.rect(20, 20, 150, 100);
ctx.stroke();

// with CMD+S you can download your gcode file 
// or
ctx.saveFile()

```

You can pass some options to costructor:

- `context`, the canvas context
- `autoBind`, if you want bind automatically CMD+S command to save the file (default is `true`)
- `gcodeSettings`, the options passed to gcode file class (see [https://github.com/lavolpecheprogramma/gcode-file](https://github.com/lavolpecheprogramma/gcode-file) )

```javascript
const ctx = new GCodeContext({
  context,
  autoBind: true,
  gcodeSettings
})
```

*GCodeContext* has the following drawing functions that match those in Canvas2D contexts.
Under the hood, it use the original canvas context to render and [createPath](https://github.com/mattdesl/canvas-sketch-util/blob/master/docs/penplot.md#createPath) to store the paths for gcode file.

- `beginPath()`
- `closePath()`
- `moveTo(x, y)`
- `lineTo(x, y)`
- `quadraticCurveTo(cpx, cpy, x, y)`
- `bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x, y)`
- `arcTo(x1, y1, x2, y2, radius)`
- `arc(x, y, radius, startAngle, endAngle[, anticlockwise])`
- `rect(x, y, width, height)`
- `stroke()`

### Other methods are available:

#### `clear()`
Clear the canvas and remove all the saved paths

#### `saveFile()`
Download the gcode file
