'use script'

function _createImgs() {
  const imgs = []
  for (let i = 0; i < 18; i++) {
    imgs.push(_createImg(`img/${i + 1}.jpg`))
  }
  saveToStorage(CURR_MEME_KEY, imgs)
  return imgs
}

function _createImg(url, keywords) {
  return {
    id: makeId(),
    url,
    keywords: keywords || ['funny', 'politic'],
  }
}
