const { createPath, pathsToPolylines } = require('canvas-sketch-util/penplot')
const simplify = require('simplify-js')
const GCodeFile = require('gcode-file')

class GCodeContext {
  constructor({context, autoBind = true, gcodeSettings = {}}) {
    this.ctx = context
    this.gCode = new GCodeFile(gcodeSettings)

    if (autoBind) {
      this.addListeners()
    }

    this.clear()
  }

  get paths() {
    return this.layers[this.layers.length - 1].paths
  }

  set paths(val) {
    return this.layers[this.layers.length - 1].paths = val
  }

  get path() {
    return this.paths[this.paths.length - 1]
  }

  addListeners() {
    window.addEventListener('keydown', event => {
      if ((event.ctrlKey || event.metaKey) && event.which == 83) {
        event.preventDefault()
        this.saveFile()
        return false
      }
    })
  }

  addLayer(name = ''){
    this.layers.push({
      name,
      paths: []
    })
  }

  saveFile() {
    this.gCode.clear()
    this.layers.forEach( ({name, paths}, i) => {
      if(i > 0){
        this.gCode.addLayer(name)
      }
      console.log(`[File ${i}] Converting path to polylines...`)
      const lines = pathsToPolylines(paths)
      lines.forEach(l => simplify(l, 1, true))
      console.log(`[File ${i}] Add data to gcode file...`)
      this.gCode.addPolylines(lines)
    })
    console.log(`Download files...`)
    this.gCode.downloadFile()
  }

  clear() {
    this.layers = []
    this.addLayer()
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
  }

  beginPath() {
    this.ctx.beginPath()
    this.paths.push(createPath())
  }

  closePath() {
    this.ctx.closePath()
    this.paths[this.paths.length - 1].closePath()
  }

  moveTo(x, y) {
    this.ctx.moveTo(x, y)
    this.path.moveTo(x, y)
  }

  lineTo(x, y) {
    this.ctx.lineTo(x, y)
    this.path.lineTo(x, y)
  }

  arc(x, y, r, sAngle, eAngle, counterclockwise) {
    this.ctx.arc(x, y, r, sAngle, eAngle, counterclockwise)
    this.path.arc(x, y, r, sAngle, eAngle, counterclockwise)
  }

  arcTo(x1, y1, x2, y2, radius) {
    this.ctx.arcTo(x1, y1, x2, y2, radius)
    this.path.arcTo(x1, y1, x2, y2, radius)
  }

  rect(x, y, width, height) {
    this.ctx.rect(x, y, width, height)
    this.path.rect(x, y, width, height)
  }

  quadraticCurveTo(cpx, cpy, x, y) {
    this.ctx.quadraticCurveTo(cpx, cpy, x, y)
    this.path.quadraticCurveTo(cpx, cpy, x, y)
  }

  bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
    this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
    this.path.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
  }

  stroke() {
    this.ctx.stroke()
  }

  setLineDash() {
    console.warn('[GCodeContext] setLineDash is not available in this implementation and it will be skipped')
  }

  lineDashOffset() {
    console.warn('[GCodeContext] lineDashOffset is not available in this implementation and it will be skipped')
  }

  fill() {
    console.warn('[GCodeContext] fill is not available in this implementation and it will be skipped')
  }
}

module.exports = GCodeContext
