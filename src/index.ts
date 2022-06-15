import {createPlugin} from 'sanity'
import {hslaColor} from './schemas/hslaColor'
import {rgbaColor} from './schemas/rgbaColor'
import {color} from './schemas/color'
import {hsvaColor} from './schemas/hsvaColor'

export const colorInput = createPlugin({
  name: '@sanity/color-input',
  schema: {
    types: [hslaColor, hsvaColor, rgbaColor, color],
  },
})

export {hslaColor, rgbaColor, color, hsvaColor}
export {ColorInput} from './ColorInput'
export type {ColorValue, ColorInputProps, ColorOptions, ColorSchemaType} from './ColorInput'
