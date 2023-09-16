const axios = require('axios').default;
const sharp = require('sharp');
const path = require('path')

async function fetchImage(url) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    })
    console.log(`
      Image downloaded successfully: ${url}
      filesize: ${getKBFromBytes(response.headers['content-length'])} kb
    `);
    return response
  } catch (error) {
    console.error('Image Fetch Error: ', error, url);
  }
}

async function compressImage(arraybuffer, filename) {
  try {
    await sharp(arraybuffer)
      .webp({
        quality: 50,
      })
      .toFile(filename)
    console.log('Image compressed successfully: ', filename);
  } catch (error) {
    console.error('Image compress errror: ', error)
  }
}

async function fetchAndCompressImg(imgUrl) {
  try {
    const response = await fetchImage(imgUrl)
    const outputFilename = `${removeExtFromUrl(imgUrl)}.webp`
    await compressImage(response.data, outputFilename)
  } catch (error) {
    console.error('Image Fetch Error ', error);
  }
}

function removeExtFromUrl(url) {
  return `output/${path.basename(url, path.extname(url))}`
}

function getKBFromBytes(bytes) {
  return (bytes/1024).toFixed(2)
}

const imgurls = [
  'https://bbttranscend.azureedge.net/book/1684326743-Beyond-Birth-&-Death_513x738.png',
  'https://bbttranscend.azureedge.net/book/1620109163-Raja-Vidya,-The-King-of-Knowledge_513x738.jpg',
  'https://bbttranscend.azureedge.net/book/1691380121-Beginners%20Guide%20to%20Krsna%20Consciousness_513x738.jpg'
]

for (let i = 0; i < imgurls.length; i++) {
  fetchAndCompressImg(imgurls[i], 'output/image.webp')
}