const path = require('path')
const easynodelog = require(path.resolve('./easynodelog'))

const text = 'sample text will log to your terminal'

easynodelog.log(text)
easynodelog.error(text)
easynodelog.info(text)