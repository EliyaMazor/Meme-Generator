'use script'

let gElCanvas
let gCtx

function onInit() {
  gElCanvas = document.querySelector('canvas')
  gCtx = gElCanvas.getContext('2d')
  renderMeme()
}

function renderMeme() {
    const img = new Image()
    const meme = getMeme(gMeme.selectedImgId)

    img.src = meme.url
    renderImg(img)
}

function renderImg(img) {
    gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

function onDrawText(txt){
    setLineTxt(txt) 
    renderMeme()
    drawText()
}

function drawText() {
    
    // gCtx.beginPath()
	gCtx.lineWidth = 5
	gCtx.strokeStyle = 'orange'
	gCtx.fillStyle = 'white'

	gCtx.font = '45px Arial'
	gCtx.fillText(gMeme.lines[0].txt, gMeme.lines[0].x, gMeme.lines[0].y)
    // gCtx.closePath()

}
