'use script'

const TOUCH_EVENTS = ['touchstart', 'touchmove', 'touchend']

let gElCanvas
let gCtx
let gMousePos

function onInit() {
  gElCanvas = document.querySelector('canvas')
  gCtx = gElCanvas.getContext('2d')
  gMeme = getMeme(CURR_MEME_KEY)

  addListeners()
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
  gMeme = {}
  gMeme.selectedImgId = id
  gMeme.selectedLineIdx = 0
  renderMeme()
  //openModal()
}

function renderMeme() {
  if (!gMeme.lines) {
    gMeme.lines = []
    gMeme.selectedLineIdx = 0
    gMeme.lines[0] = {
      x: 50,
      y: 50,
    }
  }
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
  renderMeme()
  drawText()
  saveMeme(CURR_MEME_KEY, gMeme)
}

function drawText() {
  // gCtx.beginPath()
  gMeme.lines.forEach((line) => {
    gCtx.lineWidth = 5
    gCtx.fillStyle = 'white'

    gCtx.font = '45px Arial'
    gCtx.strokeStyle = 'orange'
    line.fontSize = 45
    line.isDrag = false

    gCtx.fillText(line.txt, line.x, line.y)
  })
  // gCtx.closePath()
}

function onAddLine() {
  gMeme.lines.push({ x: 50, y: 70 })
  gMeme.selectedLineIdx++
}

function onSave() {
  saveMeme(SAVED_MEME_KEY, gMeme)
}

function onClearCanvas() {
  gMeme = {}
  gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
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
  gMousePos = getEvPos(ev)

  const line = txtClicked()
  if(!line) return

  setTextDrag(line)
  document.body.style.cursor = 'grabbing'
}

function onMove(ev) {
  const line = gMeme.lines.find((line) => {
    var { isDrag } = line
    return isDrag
  })
  if (!line) return

  const pos = getEvPos(ev)

  const dx = pos.x - gMousePos.x
  const dy = pos.y - gMousePos.y

  moveLine(line, dx, dy)

  gMousePos = pos

  renderMeme()
  drawText()
}

function onUp() {
  const line = txtClicked()
  if(!line) return
  setTextDrag(line)
  document.body.style.cursor = 'grab'
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

function txtClicked() {
  const line = gMeme.lines.find((line) => {
    var { x, y, fontSize, length = line.txt.length * line.fontSize } = line

    return (
      gMousePos.x >= x &&
      gMousePos.x <= length &&
      gMousePos.y <= y &&
      gMousePos.y >= y - fontSize
    )
  })

  if (!line) return null
  else return line
}

function setTextDrag(line) {
  line.isDrag = !line.isDrag
}

function moveLine(line, dx, dy) {
  line.x += dx
  line.y += dy
  saveMeme(CURR_MEME_KEY, gMeme)
}
