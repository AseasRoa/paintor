import { compose } from 'paintor'
import { ManyElements } from './components/ManyElements.js'

compose(
  ManyElements({ elementCounts: [0, 10, 100, 1000, 10000] })
).paint('#many-elements')
