'use script'

const gImgs = [{ id: 1, url: 'img/1.jpg', keywords: ['funny', 'politic'] }]
const gMeme = {
  selectedImgId: 1,
  selectedLineIdx: 0,
  lines: [
    {
      txt: '',
      size: 20,
      color: 'red',
    },
  ],
}
const gKeywordSearchCountMap = { funny: 12, cat: 16, baby: 2 }
