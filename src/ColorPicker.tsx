import React from 'react'
import {Alpha, Checkboard, Hue, Saturation} from 'react-color/lib/components/common'
import {CustomPicker, HEXColor, HSLColor, HSVColor, RGBColor} from 'react-color'
import {Box, Button, Card, Flex, Inline, Stack, Text} from '@sanity/ui'
import {TrashIcon} from '@sanity/icons'
import styled from 'styled-components'
import {ColorPickerFields} from './ColorPickerFields'
import {CustomPickerInjectedProps} from 'react-color/lib/components/common/ColorWrap'
import {ColorValue} from './ColorInput'

const ColorBox = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const ReadOnlyContainer = styled(Flex)`
  margin-top: 6rem;
  background-color: var(--card-bg-color);
  position: relative;
  width: 100%;
`

export interface ColorPickerProps
  extends CustomPickerInjectedProps<HSLColor | HSVColor | RGBColor | HEXColor> {
  width?: string
  disableAlpha: boolean
  readOnly?: boolean
  onUnset: () => void
  color: ColorValue
}

const ColorPickerInner = (props: ColorPickerProps) => {
  const {
    width,
    color: {rgb, hex, hsv, hsl},
    onChange,
    onUnset,
    disableAlpha,
    readOnly,
  } = props
  return (
    <div style={{width}}>
      <Card padding={1} border radius={1}>
        <Stack space={2}>
          {!readOnly && (
            <>
              <Card overflow="hidden" style={{position: 'relative', height: '5em'}}>
                <Saturation onChange={onChange} hsl={hsl} hsv={hsv} />
              </Card>

              <Card
                shadow={1}
                radius={3}
                overflow="hidden"
                style={{position: 'relative', height: '10px'}}
              >
                <Hue hsl={hsl} onChange={!readOnly && onChange} />
              </Card>

              {!disableAlpha && (
                <Card
                  shadow={1}
                  radius={3}
                  overflow="hidden"
                  style={{position: 'relative', height: '10px'}}
                >
                  <Alpha rgb={rgb} hsl={hsl} onChange={onChange} />
                </Card>
              )}
            </>
          )}
          <Flex>
            <Card
              flex={1}
              radius={2}
              overflow="hidden"
              style={{position: 'relative', minWidth: '4em'}}
            >
              <Checkboard />
              <ColorBox
                style={{
                  backgroundColor: `rgba(${rgb?.r},${rgb?.g},${rgb?.b},${rgb?.a})`,
                }}
              />

              {readOnly && (
                <ReadOnlyContainer
                  padding={2}
                  paddingBottom={1}
                  sizing="border"
                  justify="space-between"
                >
                  <Stack space={3} marginTop={1}>
                    <Text size={3} weight="bold">
                      {hex}
                    </Text>

                    <Inline space={3}>
                      <Text size={1}>
                        <strong>RGB: </strong>
                        {rgb?.r} {rgb?.g} {rgb?.b}
                      </Text>
                      <Text size={1}>
                        <strong>HSL: </strong> {Math.round(hsl?.h ?? 0)} {Math.round(hsl?.s ?? 0)}%{' '}
                        {Math.round(hsl?.l ?? 0)}
                      </Text>
                    </Inline>
                  </Stack>
                </ReadOnlyContainer>
              )}
            </Card>

            {!readOnly && (
              <Flex align="flex-start" marginLeft={2}>
                <Box style={{width: 200}}>
                  <ColorPickerFields
                    rgb={rgb}
                    hsl={hsl}
                    hex={hex}
                    onChange={onChange}
                    disableAlpha={disableAlpha}
                  />
                </Box>
                <Box marginLeft={2}>
                  <Button onClick={onUnset} title="Delete color" icon={TrashIcon} tone="critical" />
                </Box>
              </Flex>
            )}
          </Flex>
        </Stack>
      </Card>
    </div>
  )
}

export const ColorPicker = CustomPicker(ColorPickerInner)
