'use script'

let gElCanvas
let gCtx

function onInit() {
  gElCanvas = document.querySelector('canvas')
  gCtx = gElCanvas.getContext('2d')
  renderMeme()
}

function renderMeme() {
    const elImg = document.querySelector('img')
    gElCanvas.height = (elImg.naturalHeight / elImg.naturalWidth) * gElCanvas.width
    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
}

function renderImg(img) {
    // Adjust the canvas to the new image size

}

function onDrawText(txt){
    drawText(txt)
}

function drawText(txt, x, y) {//needs a coordinate 
	gCtx.lineWidth = 2
	gCtx.strokeStyle = 'orange'

	gCtx.fillStyle = 'white'

	gCtx.font = '45px Arial'
	gCtx.textAlign = 'center'
	gCtx.textBaseline = 'middle'

	gCtx.fillText(txt, x, y)
	gCtx.strokeText(txt, x, y)
}