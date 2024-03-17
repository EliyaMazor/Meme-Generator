'use strict'
renderGallery()
function renderGallery() {
  const strHTMLs = gImgs.map((img) => {
    return `  <article class="img-card">
        <img src="${img.url}" id="${img.id}
        "onclick="onSelectImg(${img.id})"/></article>
        `
  })
  document.querySelector('.gallery-container').innerHTML = strHTMLs.join('')
}
