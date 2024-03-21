'use script'

const TOUCH_EVENTS = ['touchstart', 'touchmove', 'touchend']

let gElCanvas
let gCtx
let gStartPos

function onInit() {
  gElCanvas = document.querySelector('.editor-container canvas')
  gCtx = gElCanvas.getContext('2d')
  gMeme = getMeme(CURR_MEME_KEY)

  // resizeCanvas()

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
  //openModal()
  img.onload = () => {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
    drawText()
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
  console.log(gMeme);
  setLineTxt(txt)
  // removeBorderFromText()
  // addBorderToEditText()
  renderMeme()
  drawText()
  saveMeme(CURR_MEME_KEY, gMeme)
}

function drawText() {
  gMeme.lines.forEach((line, idx) => {
    gCtx.beginPath()

    if (idx === gMeme.selectedLineIdx) addBorderToEditText()
    else removeBorderFromText()

    // gCtx.fontFamily = 'Arial'
    gCtx.font = `${line.txtSize}px ${line.fontFamily}`
    gCtx.lineWidth = line.lineWidth

    gCtx.fillStyle = line.fillStyle
    gCtx.strokeStyle = line.strokeStyle
    line.isDrag = false

    gCtx.strokeText(line.txt, line.x, line.y)
    gCtx.fillText(line.txt, line.x, line.y)
    gCtx.closePath()
  })
}

function onAddLine() {
  console.log(gMeme)

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
  const { x, y, txt, fontSize } = gMeme.lines[gMeme.selectedLineIdx]
  const { width } = gCtx.measureText(txt)
  gCtx.strokeStyle = 'black'

  gCtx.strokeRect(x, y + 0.3 * fontSize, width, -(fontSize + 0.3 * fontSize))
}

function removeBorderFromText() {
  const { x, y, txt, fontSize } = gMeme.lines[gMeme.selectedLineIdx]
  const { width } = gCtx.measureText(txt)
  gCtx.strokeStyle = ''

  gCtx.strokeRect(x, y + 0.3 * fontSize, width, -(fontSize + 0.3 * fontSize))
}

function onSave() {
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
  // if (!gMeme.lines) {
  //   // there is a line {initial} without txt!!!
  //   ev.preventDefault()
  //   return
  // }
  const line = txtClicked()
  if (!line) return

  // gMeme.selectedLineIdx = gMeme.findIndex((l, idx) => {
  //   return()
  // })
  document.querySelector('.meme-text').value = line.txt
  document.querySelector('.meme-text').focus()
  document.querySelector('.stroke-color').value = gMeme.lines[gMeme.selectedLineIdx].strokeStyle
  document.querySelector('.fill-color').value = gMeme.lines[gMeme.selectedLineIdx].fillStyle
  document.querySelector('.editor-container canvas').style.cursor = 'grabbing'
  // setTextDrag(line)
}

function onMove(ev) {
  // if (!gMeme) {
  //   ev.preventDefault()
  //   return
  // }
  const line = gMeme.lines.find((line) => {
    var { isDrag } = line
    return isDrag
  })
  if (!line) return
  console.log('Hi');
  const pos = getEvPos(ev)

  const dx = pos.x - gStartPos.x
  const dy = pos.y - gStartPos.y
  // console.log('dx', dx, 'dy', dy, 'pos.x', pos.x, 'pos.y', pos.y, 'gMousePos.x', gMousePos.x, 'gMousePos.y', gMousePos.y);

  moveLine(line, dx, dy)

  gStartPos = pos
  renderMeme()
  drawText()
}
// function onMove(ev) {
//   const { isDrag } = getCircle()
//   if (!isDrag) return

//   const pos = getEvPos(ev)

//   // Calc the delta, the diff we moved
//   const dx = pos.x - gStartPos.x
//   const dy = pos.y - gStartPos.y

//   moveCircle(dx, dy)

//   // Save the last pos, we remember where we`ve been and move accordingly
//   gStartPos = pos

//   // The canvas is rendered again after every move
//   renderCanvas()
// }

function onUp() {
  // const line = txtClicked()
  // if(!line) return
  // setTextDrag(line)
  gMeme.lines.forEach((line) => (line.isDrag = false))
  document.querySelector('.editor-container canvas').style.cursor = 'grab'
  // renderMeme()
  // drawText()
}

// function resizeCanvas() {
//   const elContainer = document.querySelector('.canvas-container')

//   gElCanvas.width = elContainer.offsetWidth
//   gElCanvas.height = elContainer.offsetHeight
// }

function getEvPos(ev) {
  console.log(
    ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
    ev.pageY - ev.target.offsetTop - ev.target.clientTop
  )
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

function txtClicked() {
  // if (!gMeme.lines) return

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

  if (!line) return null

  gMeme.selectedLineIdx = idx
  setTextDrag(line, true)
  return line
}

function setTextDrag(line, isDrag) {
  line.isDrag = isDrag
}

function moveLine(line, dx, dy) {
  console.log(line, dx, dy)
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
  )return
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

function onChangeSelectedLine(){
  changeSelectedLine()
  renderMeme()
  drawText()
  document.querySelector('.meme-text').value = gMeme.lines[gMeme.selectedLineIdx].txt
  document.querySelector('.meme-text').focus()
  document.querySelector('.stroke-color').value = gMeme.lines[gMeme.selectedLineIdx].strokeStyle
  document.querySelector('.fill-color').value = gMeme.lines[gMeme.selectedLineIdx].fillStyle
}

function changeSelectedLine(){
  gMeme.selectedLineIdx++
  if(gMeme.selectedLineIdx === gMeme.lines.length) gMeme.selectedLineIdx = 0
}