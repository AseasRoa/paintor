import { component, state, template } from 'paintor'

const temperatures = state({
  celsius: '',
  fahrenheit: '',
  kelvin: ''
})

const scaleNames = {
  celsius: 'Celsius',
  fahrenheit: 'Fahrenheit',
  kelvin: 'Kelvin'
}

const converters = {
  celsius: {
    fahrenheit(celsius) {
      return (celsius * 9 / 5) + 32
    },
    kelvin(celsius) {
      return celsius + 273.15
    }
  },
  fahrenheit: {
    celsius(fahrenheit) {
      return (fahrenheit - 32) * 5 / 9
    },
    kelvin(fahrenheit) {
      return ((fahrenheit - 32) * 5 / 9) + 273.15
    }
  },
  kelvin: {
    celsius(kelvin) {
      return kelvin - 273.15
    },
    fahrenheit(kelvin) {
      return ((kelvin - 273.15) * 9 / 5) + 32
    },
  }
}

function getConverterFunction(fromScale, toScale) {
  const converterFn = converters[fromScale][toScale]

  if (!converterFn) {
    throw new Error(`There is no converter function to convert ${fromScale} to ${toScale}`)
  }

  return converterFn
}

function convert(fromScale, toScale, temperature) {
  const input = parseFloat(temperature)

  if (Number.isNaN(input)) {
    return ''
  }

  const output = getConverterFunction(fromScale, toScale)(input)
  const rounded = Math.round(output * 1000) / 1000

  return rounded.toString()
}

const temperatureInput = (fromScale) => template(($) => {
  const handleChange = ({ target }) => {
    temperatures[fromScale] = target.value

    const toScales = Object.keys(converters[fromScale])

    for (const toScale of toScales) {
      temperatures[toScale] = convert(fromScale, toScale, target.value)
    }
  }

  $.div(
    $.input({
      onKeyUp: handleChange,
      value: () => temperatures[fromScale],
    }),
    $.label(scaleNames[fromScale])
  )
})

const temperatureInputs = []

for (const converterName in converters) {
  temperatureInputs.push(temperatureInput(converterName))
}

const toDoComponent = component(temperatureInputs)

toDoComponent.paint('#temperature-converter')
