const { createPath, pathsToPolylines } = require('canvas-sketch-util/penplot')
const simplify = require('simplify-js')
const GCodeFile = require('gcode-file')

class GCodeContext {
  constructor({context, gcodeSettings = {}}) {
    this.ctx = context
    this.paths = []
    this.gCode = new GCodeFile(gcodeSettings)
    this.addListeners()
  }

  get path() { return this.paths[this.paths.length - 1] }

  addListeners() {
    window.addEventListener('keydown', event => {
      if ((event.ctrlKey || event.metaKey) && event.which == 83) {
        event.preventDefault()
        this.saveFile()
        return false
      }
    })
  }

  saveFile() {
    console.log('Converting path to polylines...')
    const lines = pathsToPolylines(this.paths)
    lines.forEach(l => simplify(l, 1, true))
    console.log('Add data to gcode file...')
    this.gCode.addPolylines(lines)
    console.log('Download file...')
    this.gCode.downloadFile()
  }

  clear() {
    this.paths = []
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

module.exports =  GCodeContext
