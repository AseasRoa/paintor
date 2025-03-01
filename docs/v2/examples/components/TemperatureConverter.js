import { template } from 'paintor'
import { TemperatureInput } from './TemperatureInput.js'

export function TemperatureConverter({ scales }) {
  const temperatureInputs = []

  for (const scale of scales) {
    temperatureInputs.push(TemperatureInput(scale))
  }

  return template(temperatureInputs)
}
