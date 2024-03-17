'use script'

const gImgs = [
  { id: 1, url: 'img/1.jpg', keywords: ['funny', 'politic'] },
  { id: 2, url: 'img/2.jpg', keywords: ['cute', 'dog'] },
  { id: 3, url: 'img/3.jpg', keywords: ['cute', 'dog', 'baby'] },
  { id: 4, url: 'img/4.jpg', keywords: ['cute', 'cat'] },
  { id: 5, url: 'img/5.jpg', keywords: ['funny', 'baby'] },
  { id: 6, url: 'img/6.jpg', keywords: ['funny'] },
  { id: 7, url: 'img/7.jpg', keywords: ['cute', 'funny', 'baby'] },
  { id: 8, url: 'img/8.jpg', keywords: ['movie', 'funny'] },
  { id: 9, url: 'img/9.jpg', keywords: ['cute', 'funny', 'baby'] },
  { id: 10, url: 'img/10.jpg', keywords: ['funny', 'politic'] },
  { id: 11, url: 'img/11.jpg', keywords: ['funny', 'sport'] },
  { id: 12, url: 'img/12.jpg', keywords: ['funny'] },
  { id: 13, url: 'img/13.jpg', keywords: ['movie', 'funny'] },
  { id: 14, url: 'img/14.jpg', keywords: ['movie', 'matrix'] },
  { id: 15, url: 'img/15.jpg', keywords: ['movie', 'rings'] },
  { id: 16, url: 'img/16.jpg', keywords: ['movie', 'funny'] },
  { id: 17, url: 'img/17.jpg', keywords: ['funny', 'politic'] },
  { id: 18, url: 'img/18.jpg', keywords: ['movie', 'funny', 'toy story'] },
]
const gMeme = {
  selectedImgId: 1,
  selectedLineIdx: 0,
  lines: [
    {
      x: 50,
      y: 50,
      txt: '',
      size: 20,
      color: 'red',
    },
  ],
}
const gKeywordSearchCountMap = { funny: 12, cat: 16, baby: 2 }

function getMeme(id) {
  return gImgs.find((img) => id === img.id)
}

function setLineTxt(txt) {
  gMeme.lines[0].txt = txt
}
