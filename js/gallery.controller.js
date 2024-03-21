'use strict'

function renderGallery() {
  const imgs = getImgs()
  const strHTMLs = gImgs.map((img) => {
    return `  <article class="img-card">
        <img src="${img.url}" id="${img.id}
        "onclick="onSelectImg(${img.id})"/></article>
        `
  })
  document.querySelector('.gallery-container').innerHTML = strHTMLs.join('')
}

function getImgs() {
  if (gImgs === undefined) gImgs = _createImgs()
  return gImgs
}
