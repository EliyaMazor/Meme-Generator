'use script'

const TOUCH_EVENTS = ['touchstart', 'touchmove', 'touchend']

let gElCanvas
let gCtx
let gStartPos

function onInit() {
  gElCanvas = document.querySelector('.editor-container canvas')
  gCtx = gElCanvas.getContext('2d')
  gMeme = getMeme(CURR_MEME_KEY)

  renderGallery()

  if (gMeme) renderFromStorage()
}

function renderFromStorage() {
  document.querySelector('.meme-text').value =
    gMeme.lines[gMeme.selectedLineIdx].txt
  const img = new Image()
  const meme = findImgById(gMeme.selectedImgId)

  img.src = meme.url

  renderMeme()
  img.onload = () => {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
    drawText()
    document.querySelector('dialog').showModal()
  }
}

function onSelectImg(id) {
  document.querySelector('.meme-text').value = ''
  gMeme = {}
  gMeme.selectedImgId = id
  gMeme.selectedLineIdx = 0
  gMeme.lines = []
  addLine()
  renderMeme()
  addListeners()
  document.querySelector('dialog').showModal()
}

function renderMeme() {
  renderImg()
}

function renderImg() {
  const img = new Image()
  const meme = findImgById(gMeme.selectedImgId)

  img.src = meme.url

  gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width
  gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

function onDrawText(txt) {
  setLineTxt(txt)
  // removeBorderFromText()
  // addBorderToEditText()
  renderMeme()
  drawText()
  saveMeme(CURR_MEME_KEY, gMeme)
}

function drawText() {
  gMeme.lines.forEach((line) => {
    gCtx.beginPath()

    gCtx.font = `${line.txtSize}px ${line.fontFamily}`
    gCtx.lineWidth = line.lineWidth

    gCtx.fillStyle = line.fillStyle
    gCtx.strokeStyle = line.strokeStyle
    line.isDrag = false

    gCtx.strokeText(line.txt, line.x, line.y)
    gCtx.fillText(line.txt, line.x, line.y)
    gCtx.closePath()
  })
  addBorderToEditText()
}

function onAddLine() {
  let { lines } = gMeme
  if (!lines[lines.length - 1].txt) return

  addLine()
  drawText()

  document.querySelector('.meme-text').value = 'Add text here'
  document.querySelector('.meme-text').focus()
  document.querySelector('.meme-text').select()
}

function addLine() {
  gMeme.lines.push({
    fontFamily: 'Arial',
    txtSize: '42',
    lineWidth: 5,
    txt: '',

    x: (gMeme.lines.length + 1) * 20,
    y: (gMeme.lines.length + 1) * 20,

    fillStyle: '#ffffff',
    strokeStyle: '#000000',
  })
  if (!(gMeme.lines.length === 1 && gMeme.lines[0].txt === ''))
    gMeme.selectedLineIdx++
}

function addBorderToEditText() {
  const { x, y, txt, txtSize } = gMeme.lines[gMeme.selectedLineIdx]
  const { width } = gCtx.measureText(txt)
  const size = +txtSize
  gCtx.strokeStyle = 'black'

  gCtx.strokeRect(x, y + 0.3 * size, width, -(size + 0.3 * size))
}

function removeBorderFromText() {
  const { x, y, txt, txtSize } = gMeme.lines[gMeme.selectedLineIdx]
  const { width } = gCtx.measureText(txt)
  const size = +txtSize
  gCtx.strokeStyle = ''

  gCtx.strokeRect(x, y + 0.3 * size, width, -(size + 0.3 * size))
}

function onSave() {
  removeBorderFromText()
  renderMeme()
  drawText()
  saveMeme(SAVED_MEME_KEY, gMeme)
}

function onClearMeme() {
  onSelectImg(gMeme.selectedImgId)
}

function addListeners() {
  addMouseListeners()
  addTouchListeners()

  window.addEventListener('resize', () => {
    resizeCanvas()

    renderCanvas()
  })
}

function addMouseListeners() {
  gElCanvas.addEventListener('mousedown', onDown)
  gElCanvas.addEventListener('mousemove', onMove)
  gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
  gElCanvas.addEventListener('touchstart', onDown)
  gElCanvas.addEventListener('touchmove', onMove)
  gElCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
  gStartPos = getEvPos(ev)

  if (!isTxtClicked()) return
  const line = gMeme.lines[gMeme.selectedLineIdx]
  setTextDrag(line, true)

  document.querySelector('.meme-text').value = line.txt
  document.querySelector('.meme-text').focus()
  document.querySelector('.stroke-color').value =
    gMeme.lines[gMeme.selectedLineIdx].strokeStyle
  document.querySelector('.fill-color').value =
    gMeme.lines[gMeme.selectedLineIdx].fillStyle
  document.querySelector('.editor-container canvas').style.cursor = 'grabbing'
}

function onMove(ev) {
  const line = gMeme.lines.find((line) => line.isDrag === true)
  if (!line) return

  const pos = getEvPos(ev)

  const dx = pos.x - gStartPos.x
  const dy = pos.y - gStartPos.y

  moveLine(dx, dy)

  gStartPos = pos
  renderMeme()
  drawText()
}

function onUp() {
  const line = gMeme.lines[gMeme.selectedLineIdx]
  setTextDrag(line, false)
  document.querySelector('.editor-container canvas').style.cursor = 'grab'
}

// function resizeCanvas() {
//   const elContainer = document.querySelector('.canvas-container')

//   gElCanvas.width = elContainer.offsetWidth
//   gElCanvas.height = elContainer.offsetHeight
// }

function getEvPos(ev) {
  if (TOUCH_EVENTS.includes(ev.type)) {
    ev.preventDefault() // Prevent triggering the mouse events
    ev = ev.changedTouches[0] // Gets the first touch point
    // Calculate the touch position inside the canvas

    // ev.pageX = distance of touch position from the documents left edge
    // target.offsetLeft = offset of the elemnt's left side from the it's parent
    // target.clientLeft = width of the elemnt's left border

    return {
      x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
      y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
    }
  } else {
    return {
      x: ev.offsetX,
      y: ev.offsetY,
    }
  }
}

function isTxtClicked() {
  var idx
  const line = gMeme.lines.find((line, i) => {
    var { x, y, txt } = line
    var { width, actualBoundingBoxAscent } = gCtx.measureText(txt)

    idx = i
    return (
      gStartPos.x >= x &&
      gStartPos.x <= width &&
      gStartPos.y <= y &&
      gStartPos.y >= y - actualBoundingBoxAscent
    )
  })

  if (!line) return false

  gMeme.selectedLineIdx = idx
  return true
}

function setTextDrag(line, isDrag) {
  line.isDrag = isDrag
}

function moveLine(dx, dy) {
  const line = gMeme.lines[gMeme.selectedLineIdx]
  line.x += dx
  line.y += dy
  saveMeme(CURR_MEME_KEY, gMeme)
}

function onCloseModal() {
  document.querySelector('dialog').close()
}

function onChangeTextSize(dir) {
  changeTextSize(dir)
  renderMeme()
  drawText()
}

function changeTextSize(dir) {
  const idx = gMeme.selectedLineIdx
  if (
    (+gMeme.lines[idx].txtSize >= 200 && dir === 4) ||
    (+gMeme.lines[idx].txtSize <= 22 && dir === -4)
  )
    return
  let size = +gMeme.lines[idx].txtSize
  size += dir
  gMeme.lines[idx].txtSize = size.toString()
  console.log(size)
}

function onChangeColor(prop, clr) {
  changeColor(prop, clr)
  renderMeme()
  drawText()
}

function changeColor(prop, clr) {
  const idx = gMeme.selectedLineIdx
  gMeme.lines[idx][prop] = clr
}

function onChangeSelectedLine() {
  changeSelectedLine()
  renderMeme()
  drawText()

  document.querySelector('.meme-text').value =
    gMeme.lines[gMeme.selectedLineIdx].txt
  document.querySelector('.meme-text').focus()
  document.querySelector('.stroke-color').value =
    gMeme.lines[gMeme.selectedLineIdx].strokeStyle
  document.querySelector('.fill-color').value =
    gMeme.lines[gMeme.selectedLineIdx].fillStyle
}

function changeSelectedLine() {
  gMeme.selectedLineIdx++
  if (gMeme.selectedLineIdx === gMeme.lines.length) gMeme.selectedLineIdx = 0
}
