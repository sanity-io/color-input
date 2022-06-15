import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {set, setIfMissing, unset} from 'sanity/form'
import {debounce} from 'lodash'
import {Button} from '@sanity/ui'
import {AddIcon} from '@sanity/icons'
import {ColorPicker} from './ColorPicker'
import {ObjectInputProps} from 'sanity'
import {HSLColor, HSVColor, RGBColor} from 'react-color'
import {ObjectSchemaType} from 'sanity'

const DEFAULT_COLOR: ColorValue & {source: string} = {
  hex: '#24a3e3',
  hsl: {h: 200, s: 0.7732, l: 0.5156, a: 1},
  hsv: {h: 200, s: 0.8414, v: 0.8901, a: 1},
  rgb: {r: 46, g: 163, b: 227, a: 1},
  source: 'hex',
}

export interface ColorValue {
  hex: string
  hsl: HSLColor
  hsv: HSVColor
  rgb: RGBColor
}

export interface ColorOptions {
  disableAlpha?: boolean
}

export type ColorSchemaType = ObjectSchemaType & {
  options?: ColorOptions
}
export type ColorInputProps = ObjectInputProps<ColorValue, ColorSchemaType>

export function ColorInput(props: ColorInputProps) {
  const {onChange, schemaType: type, readOnly, value} = props
  const focusRef = useRef<HTMLButtonElement>(null)

  // use local state so we can have instant ui updates while debouncing patch emits
  const [color, setColor] = useState(value)
  useEffect(() => setColor(value), [value])

  const emitSetColor = useCallback(
    (nextColor: ColorValue) => {
      const fieldPatches = type.fields
        .filter((field) => field.name in nextColor)
        .map((field) => {
          const nextFieldValue = nextColor[field.name as keyof ColorValue]
          const isObject = field.type.jsonType === 'object'
          return set(
            isObject ? Object.assign({_type: field.type.name}, nextFieldValue) : nextFieldValue,
            [field.name]
          )
        })

      onChange([
        setIfMissing({_type: type.name}),
        set(type.name, ['_type']),
        set(nextColor.rgb?.a, ['alpha']),
        ...fieldPatches,
      ])
    },
    [onChange, type]
  )

  // The color picker emits onChange events continuously while the user is sliding the
  // hue/saturation/alpha selectors. This debounces the event to avoid excessive patches
  const debouncedColorChange = useMemo(() => debounce(emitSetColor, 100), [emitSetColor])
  const handleColorChange = useCallback(
    (nextColor: ColorValue) => {
      setColor(nextColor)
      debouncedColorChange(nextColor)
    },
    [debouncedColorChange, setColor]
  )

  const handleCreateColor = useCallback(() => {
    setColor(DEFAULT_COLOR)
    emitSetColor(DEFAULT_COLOR)
  }, [emitSetColor])

  const handleUnset = useCallback(() => {
    setColor(undefined)
    onChange(unset())
  }, [onChange])

  return (
    <>
      {value ? (
        <ColorPicker
          /*            ref={this.focusRef}*/
          color={color}
          onChange={handleColorChange}
          readOnly={readOnly || (typeof type.readOnly === 'boolean' && type.readOnly)}
          disableAlpha={type.options?.disableAlpha}
          onUnset={handleUnset}
        />
      ) : (
        <Button
          icon={AddIcon}
          mode="ghost"
          text="Create color"
          ref={focusRef}
          disabled={Boolean(readOnly)}
          onClick={handleCreateColor}
        />
      )}
    </>
  )
}
