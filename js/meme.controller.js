'use script'

let gElCanvas
let gCtx

function onInit() {
  gElCanvas = document.querySelector('canvas')
  gCtx = gElCanvas.getContext('2d')
  gMeme = getMeme(CURR_MEME_KEY)

  renderGallery()

  if (gMeme) renderFromStorage()
}

function renderFromStorage() {
  document.querySelector('.meme-text').value = gMeme.lines[gMeme.selectedLineIdx].txt
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
  gCtx.lineWidth = 5
  gCtx.strokeStyle = 'orange'
  gCtx.fillStyle = 'white'

  gCtx.font = '45px Arial'
  gCtx.fillText(gMeme.lines.forEach(line => {
    
  })
    gMeme.lines[gMeme.selectedLineIdx].txt,
    gMeme.lines[gMeme.selectedLineIdx].x,
    gMeme.lines[gMeme.selectedLineIdx].y
  )
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
