const Jimp = require( 'jimp' )

const SAME_THRESHOLD = 0.9

module.exports = async function getFramePerceptualProgress( target, options = {} ) {
  const { source, destination } = options
  const images = {
    target: await normalizeImage( target ),
    source: await normalizeImage( source ),
    destination: await normalizeImage( destination ),
  }

  const minHeight = Math.min(
    images.target.bitmap.height,
    images.source.bitmap.height,
    images.destination.bitmap.height
  )

  let averageSimilarity = 0
  let count = 0

  images.target
    .scan( 0, 0, images.target.bitmap.width, minHeight, ( x, y, index ) => {
      const targetPixel = getPixel( images.target, index )
      const sourcePixel = getPixel( images.source, index )
      const destinationPixel = getPixel( images.destination, index )

      if (
        ( getColorSimilarity( sourcePixel, targetPixel ) > SAME_THRESHOLD ) &&
        ( getColorSimilarity( targetPixel, destinationPixel ) > SAME_THRESHOLD )
      ) {
        return
      }

      if (
        ( getColorSimilarity( targetPixel, sourcePixel ) > SAME_THRESHOLD ) &&
        !( getColorSimilarity( targetPixel, destinationPixel ) > 0.9 )
      ) {
        averageSimilarity = averageSimilarity + 0
        count = count + 1
        return
      }

      const similarity = getColorSimilarity( targetPixel, destinationPixel )
      averageSimilarity = averageSimilarity + similarity
      count = count + 1
    } )

  if ( count === 0 ) {
    return 0
  }

  return averageSimilarity / count
}

function getPixel( image, startIndex ) {
  return [
    image.bitmap.data[ startIndex ],
    image.bitmap.data[ startIndex + 1 ],
    image.bitmap.data[ startIndex + 2 ],
  ]
}

function euclideanDistanceSquare( a, b ) {
  let sum = 0

  for ( let i = 0; i < a.length; i++ ) {
    const offset = a[ i ] - b[ i ]
    sum = sum + offset * offset
  }

  return sum
}

const RGB_MAX_DISTANCE_SQUARE = euclideanDistanceSquare(
  [ 255, 255, 255 ],
  [ 0, 0, 0 ]
)

function getColorSimilarity( rgb1, rgb2 ) {
  return 1 - Math.sqrt( euclideanDistanceSquare( rgb1, rgb2 ) / RGB_MAX_DISTANCE_SQUARE )
}

async function normalizeImage( buffer ) {
  const image = await Jimp.read( buffer )
  await image.resize( 100, Jimp.AUTO )
  return image
}
