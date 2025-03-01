import { compose } from 'paintor'
import { TemperatureConverter } from './components/TemperatureConverter.js'

compose(
  TemperatureConverter({ scales: ['celsius', 'fahrenheit', 'kelvin'] })
).paint('#temperature-converter')
