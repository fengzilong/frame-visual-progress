# frame-perceptual-progress

Get more accurate perceptual progress for certain frame

# Installation

```bash
yarn add frame-perceptual-progress
```

# Usage

```js
const getFramePerceptualProgress = require( 'frame-perceptual-progress' )

getFramePerceptualProgress( targetBuffer, {
  source: sourceBuffer,
  destination: destinationBuffer,
} ) // return 0-1 value represent perceptual-progress
```
