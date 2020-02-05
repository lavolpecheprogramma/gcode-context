# gcode-context

Wrap the canvas context to replicate it in a gcode file and easily print your drawings with a penplot.

### Installation

You can grab it as an `npm` package
```bash
npm i --save @gcode-context
```

### Example

```javascript
const { createPath, pathsToPolylines } = require('canvas-sketch-util/penplot');
const GCodeContext = require('gcode-context');

// for more information on gcode file settings see https://github.com/lavolpecheprogramma/gcode-file
const gcodeSettings = {
  feedRate: 4000,
  seekRate: 4000,
  paperSize: [ 210, 297],
  margin: 10,
  fileName: 'line.gcode'
}

const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");
const ctx = new GCodeContext({context, gcodeSettings})
// ... your canvas setup ...
gCode.updateCoordsArea(canvas.width, canvas.height);

ctx.beginPath();
ctx.rect(20, 20, 150, 100);
ctx.stroke();

// with CMD+S you can download your gcode file

```

The *GCodeContext* interface has the following drawing functions. The drawing functions match those in Canvas2D contexts.

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
